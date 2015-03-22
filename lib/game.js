var path = require("path"),
	fs = require('fs'),
	config = require( path.join(__dirname, '../config/app.js') ),
	io,
	User = require('./user'),
	AI = require('./ai'),
	Player = require('./player'),
	chat, lobby, arena,
	players = [],
	timeout = config.timeout,
	count = {ticks:false, wave:0, seconds:0},
	defender = false,
	top = { score : 0,  name: false },
	canShoot = false,
	scoreboard = path.join(__dirname, '../data/scores.json');


function init( socket ){

	io = socket;

	// create the rooms

	chat = makeChat();
	lobby = makeLobby();
	arena = makeArena();

	// start with an AI defender
	defender = newDefender(false);

	// load previous top score
	loadTopScore();

	// set the timer
	setInterval( time, 500 );

	start();

}


function start(){

	// When user gets connected
	io.sockets.on('connection', function(user){

		// set these important variables on the server side
		var player = new Player(io);
		var sid = user.id;
		player.id = sid;
		player.socket = io.sockets.connected[sid];
		players[player.id] = player;

		// send active players
		user.emit("reset-invaders", getInvaders() );
		user.emit("new-defender", defender.name);
		user.emit("update-score", {user: defender.score, top: top.score});

		user
		/*
		// set the room names
		.set('arena', 'arena', function() {
			//console.log('room arena saved');
		})
		.set('lobby', 'lobby', function() {
			//console.log('room lobby saved');
		})
		.set('chat', 'chat', function() {
			//console.log('room chat saved');
		})
		*/
		// by default user is in no room
		.leave('arena')
		.leave('lobby')
		// login action
		.on('login', function( name ){

			// get username
			var sid = user.id;
			var player = players[sid];
			// save username
			player.setName( name, players );
			players[sid] = player;

			// emit the id back to the user
			user.emit("id", {id: player.id, name: player.name});

			enterLobby( player, true );

		})

		.on('move', function (pos) {

			// get username
			var sid = user.id;
			var player = players[sid];
			var name = player.name;
			// force y to be the wave
			pos.y = player.wave;
			player.pos = pos;
			// save back to the players array
			players[sid] = player;

			user.broadcast.emit('move', {name: name, pos: pos});
			// we are not using user because it is targets only users in the arena
			//io.sockets.connected[sid].broadcast.emit('move', {name: name, pos: pos});
		})

		.on('shoot', function () {
			if( defender.id == user.id && canShoot ) canShoot = defender.shoot();

		})

		.on('kill', function ( data ) {
			var sid = user.id;
			var player = players[sid];
			// validate the user
			if(player.id == data.id && player.name == data.name ){
				player.kill();
				// add to the score of the defender
				addScore(10);
				// calculate the score based on position
				//user.score = data.score;

			}
		 })

		 .on('kill-ai', function ( name ) {
			var player = players[name];
			// no restrictions here
			if( typeof(player) != "undefined" && player.type == "ai" ) player.remove();
			// kiling ai invaders scores nothing!!
			addScore(10);
		 })

		.on('disconnect', function(){
			var sid = user.id;
			var player = players[sid];
			// braodcast the event:
			//if( typeof(player) != "undefined" ) player.remove();
			// delete form the list of available players immediantely
			deletePlayer( sid );

			// reset the defender to AI if necessary
			if( defender.name == player.name ) {
				defender = newDefender( false );
				resetGame();
			}
			//var index = clients.indexOf(user); // Find the index
			//clients.splice(index,1); // remove user from array
			//console.log("after length ===> " +clients.length);
		});


	});


}

// helper functions

function makeChat(){
	return io
	  .of('/chat')
	  .on('connection', function (user) {

		user.on('message', function (text) {
			// get username
			var sid = user.id;
			var name = players[sid].name;
			// filters
			// - remove html tags
			text.replace(/<(?:.|\n)*?>/gm, '');
			// broadcast message
			chat.emit('update', { name: name, text: text });
		});

	  });

}


function makeLobby(){
	return io
	  .of('/lobby')
	  .on('connection', function (user) {

		//user.emit("in-lobby", user.name);
		//lobby.emit("entered-lobby", user.name);
	  })
	  .on('disconnect', function (user) {
		//lobby.emit("left-lobby", user.name);
	  });
}

function makeArena(){

	return io
	  .of('/arena')
	  .on('connection', function (user) {


	  })
	  .on('disconnect', function (user) {
		//arena.emit("left-arena", user.name);
	  });
}

function enterArena(player, socket) {
	// exit lobby
	socket.leave('lobby');
	// add to the players room
	socket.join('arena');

	// setup variables
	players[player.id].score = 0;
	players[player.id].state = "invader";
	players[player.id].coords = { x: 0, y:0 };
	players[player.id].wave = 1;

	// notify the user
	socket.emit("in-arena");
	// notify all other users
	socket.broadcast.emit("new-invader", player.name);
	//user.broadcast.to(room).emit("new-invader", user.id);

}

function enterLobby(player, broadcast) {
	var sid = player.id;
	var socket = io.sockets.connected[sid];
	// update properties
	players[sid].wave = 0;
	players[sid].state = 'wait';

	// stop there is there is no socket
	if( typeof(socket) == "undefined") return;
	// exit lobby
	socket.leave('arena');
	// join the lobby by default
	socket.join('lobby');
	// notify the user
	socket.emit("in-lobby", {id: player.id, name: player.name});
	if(broadcast){
		// notify all other users
		socket.broadcast.emit("entered-lobby", player.name);
	}
}

function updateWave(){

	// emit the new wave to everyone
	io.sockets.emit("wave", true);

	//arena = findClients(null, '/arena');

	// loop through players (in arena)
	for( i in players ) {

		// update wave
		players[i].newWave();

		var player = players[i];
		//if( player.type == "ai" ) continue;

		// find new defender
		if( player.state == "defender" && defender.name != player.name  ){
			defender = newDefender( player );
			resetGame();
			// exit without completing the rest logic
			return;
		}

	}

	// get new players from the waiting list
	var draft = 5;
	var lobby = findClients(null, '/lobby');
	for(i in lobby) {
		var sid = lobby[i].id;
		var player = players[sid];
		// FIX: don't try to include non-registered players
		if( typeof(player) == "undefined" ) continue;
		var socket = io.sockets.connected[sid];
		// get users from the waiting list
		if( draft && player.state == "wait" ){
			enterArena(player, socket);
			draft--;
		}
	}

	// - create dummy invaders if there are too few players
	if( objLength( players ) < 20) createDummies();


}

function getInvaders() {

	var list = [];
	// loop through all users in the arena
	var arena = findClients(null, '/arena');
	for( i in arena ){
		var sid = arena[i].id;
		// FIX: in case players are not filtered properly
		if( typeof(players[sid]) != "undefined"){
			var name = players[sid].name;
			var state = players[sid].state;
			// FIX: only include players that are not waiting
			if (state && state != "wait")
				list.push({ name: name, state: state });
		}
	}

	return list;

}


function resetGame() {
	// remove users from the arena
	// loop through all users in the arena
	var arena = findClients(null, '/arena');
	for( i in players ){
		var player = players[i];
		// the defender never leaves
		if( defender.name == player.name ) continue;
		//console.log( defender.name +" == "+ player.name );
		if(player.type=="player"){
			enterLobby( player, false);
		}
		// just delete dummy invaders
		if(player.type=="ai") delete players[i];

	}
	// emit a "reset invaders" list
	io.sockets.emit("reset-invaders", getInvaders() );

}


function newDefender( user ) {
	//console.log("New Defender");

	// for the existing defender...
	if( defender ){
		// save score if needed
		if( defender.score >= top.score ) saveTopScore();
		// kill old defender
		defender.kill();
	}

	if( !user ){
		// create a dummy defender
		var ai = new AI(io);
		// create a unique name
		ai.randomName();
		var new_defender = ai;

	} else {
		// save defender id for easy access later
		var new_defender = user;
	}

	new_defender.state = "defender";
	// notify the clients of the new defender
	io.sockets.emit("new-defender", new_defender.name);

	return new_defender;
}

function addScore( num ){

	if( defender && defender.type != "ai" ){

		defender.score += 10;
		// compare with top score
		if( defender.score > top.score) {
			// update the memory
			top.name = defender.name;
			top.score = defender.score;
		}
		// transmit score update to everyone
		io.sockets.emit("update-score", {user: defender.score, top: top.score});
	}
}

// creates 5 AI invaders and puts them in the dummy list
function createDummies(){

	for(dymmy=0; dymmy<5; dymmy++){
		var invader = new AI(io);
		// create a unique name
		invader.randomName();
		invader.state = "invader";
		// FIX: start somewhere in the middle
		invader.wave = 1;
		invader.pos.x = 5;
		players[invader.name] = invader;
	}

}

function deletePlayer( id ){
	var player = players[id];
	var socket = io.sockets.connected[id];
	if( typeof( socket ) != "undefined" ){
		socket.leave('arena');
		socket.leave('lobby');
	}
	if( typeof( player ) != "undefined" ){
		// delete player from list locally
		delete players[id];
		// broadcast to all the users
		io.sockets.emit("left-game", player.name);
	}

}

// A basic time tracking function set to 0.5sec updates
function time(){
	// tick is one loop
	count["ticks"] = (count["ticks"]) ? false : true;

	// 1st tier - exectures every 0.5 sec
	// - update invaders
	for( i in players ) {
		var invader = players[i];
		// clear dead invaders
		if ( invader.state == "dead" && invader.type == "ai") delete players[i];
		if ( invader.state == "dead" && invader.type == "player") enterLobby(invader, true);

		// don't modify the real players further
		if(invader.type !="ai") continue;
		if ( invader.state == "invader" ) {
			invader.invade( defender );
			// kill dummy invaders just if the defender passes their way
			if( defender.type == "ai" && invader.pos.x == defender.pos.x ) {
				invader.remove();
			}
		}
	}
	// - update defender
	if( defender && defender.type == "ai" ) {
		defender.defend( players );
		if( canShoot ) canShoot = defender.shoot();
	}

	// 2nd tier - executes every second
	if( count["ticks"] ) {

		count["seconds"]++;

		// next wave...
		if( count["wave"] > 0){
			count["wave"]--;
		} else {
			count["wave"] = timeout.wave;
			updateWave();
		}

	}

	// 3rd tier - every other second
	// explanation: if "seconds" is an even number and time isn't clicking mid-way  (ex. 2.5)
	if( count["seconds"]%2 && !count["ticks"] ) {
		// reset the shoot flag every second
		canShoot = true;
	}
}

function loadTopScore(){
	var scores,
		file = fs.readFileSync( scoreboard );

	try {
		var scores = JSON.parse(file);
		// top is the first item
		var score = scores.shift();
		// use only if there is a top score
		if( typeof(score) != "undefined" ) top = score;
	}
	catch (err) {
		console.log('There has been an error parsing your JSON.')
		console.log(err);
	}
}

function saveTopScore(){

	var scores,
		score = top;
	// timestamp
	score.date = new Date();

	// get the highscores list
	var file = fs.readFileSync( scoreboard );

	try {
		scores = JSON.parse(file);
		// add the new top score first
		scores.unshift(score);
		// save to the filesystem
		var data = JSON.stringify(scores);
		fs.writeFile( scoreboard, data, function (err) {
			if (err) {
			  console.log('There has been an error saving your score data.');
			  console.log(err.message);
			  return;
			}
			//console.log('Score saved successfully.')
		});
	}
	catch (err) {
		console.log('There has been an error parsing your JSON.')
		console.log(err);
	}

}

// Helpers

function objLength( obj ){
	var length=0;
	for( el in obj ) length++;
	return length;
}

function findClients(roomId, namespace) {
	var res = []
	, ns = io.of(namespace ||"/");    // the default namespace is "/"

	if (ns) {
		for (var id in ns.connected) {
			if(roomId) {
				var index = ns.connected[id].rooms.indexOf(roomId) ;
				if(index !== -1) {
					res.push(ns.connected[id]);
				}
			} else {
				res.push(ns.connected[id]);
			}
		}
	}
	return res;
}
exports.init = init;