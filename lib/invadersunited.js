var config = require('../config/app.js'), 
	io, 
	User = require('./user'), 
	AI = require('./ai'), 
	Player = require('./player'), 
	chat, lobby, arena, 
	players = [], 
	timeout = config.timeout, 
	count = {ticks:false, wave:0, seconds:0}, 
	defender = false, 
	score = 0
	canShoot = false;


function init( socket ){

	io = socket;
	
	// create the rooms
	
	chat = makeChat();
	lobby = makeLobby();
	arena = makeArena();
	
	// start with an AI defender
	
	defender = newDefender(false);
	
	// set the timer
	setInterval( time, 500 );
	
	start();
	
}


function start(){
	
	// When user gets connected
	io.sockets.on('connection', function(user){ 
		
		// set these important variables on the server side
		var player = new Player(io);
		player.id = user.id;
		players[player.id] = player;
		
		// send active players
		user.emit("reset-invaders", getInvaders() );
		user.emit("new-defender", defender.name);
	
		user
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
		// by default user is in no room
		.leave('arena')
		.leave('lobby')
		// login action
		.on('login', function(email){ 
			
			// get username
			//var user = io.sockets.sockets[sid];
			var sid = user.id;
			var player = players[sid];
			// save username
			player.name = email;
			players[sid] = player;
			
			// emit the id back to the user 
			user.emit("id", {id: player.id, name: player.name});
	
			enterLobby( player, user );
			
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
			//io.sockets.sockets[sid].broadcast.emit('move', {name: name, pos: pos});
	    })
		
		.on('shoot', function () {
			if( defender.id == user.id && canShoot ) canShoot = defender.shoot();
		
		})
		
		.on('kill', function ( data ) {
			var sid = user.id;
			var player = players[sid];
			// validate the user 
			if(player.id == data.id && player.name == data.name ){
				player.wave = 0;
				enterLobby(player, user);
				// add to the score of the defender
				if( defender && defender.type != "ai" ) addScore(10);
				
				// calculate the score based on position
				//user.score = data.score;
				user.emit("died", player.score);
				user.broadcast.emit("dead-invader", user.name);
			}
		 })
		 
		.on('disconnect', function(){ 
			// broadcast the message only if the user had the chance to login
			if( user.state ) user.broadcast.emit("left-game", user.name);
			delete players[user.id];
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

function enterLobby(player, socket) {
	// exit lobby
	socket.leave('arena');
	// join the lobby by default
	socket.join('lobby');
	// variables
	// setup variables
	players[player.id].state = 'wait';
	// notify the user 
	socket.emit("in-lobby", {id: player.id, name: player.name});
	// notify all other users
	socket.broadcast.emit("entered-lobby", player.name);
}

function updateWave(){

	// emit the new wave to everyone
	io.sockets.emit("wave", true);
	
	//arena = io.of('/arena').clients();
	
	// loop through players (in arena)
	for( i in players ) {
		
		// update wave
		players[i].newWave();
		
		var player = players[i];
		if( player.type == "ai" ) continue;
		
		// find new defender 
		if( player.state == "defender" && defender.name != player.name  ){ 
			defender = newDefender( player );
			resetGame();
			io.sockets.emit("reset-invaders", getInvaders() );
			// exit without completing the rest logic
			return;
		}
		
	}
	
	// get new players from the waiting list
	var draft = 5;
	var lobby = io.of('/lobby').clients();
	for(i in lobby) {
		var sid = lobby[i].id;
		var player = players[sid];
		var socket = io.sockets.sockets[sid];
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
	var arena = io.of('/arena').clients();
	for( i in arena ){
		var sid = arena[i].id;
		var name = players[sid].name;
		var state = players[sid].state;
		// FIX: in case players are not filtered properly
		if( name && state )
			list.push({ name: name, state: state });
	}
	
	return list;
	
}


function resetGame( player ) {
	// remove users from the arena
	// loop through all users in the arena
	var arena = io.of('/arena').clients();
	for( i in players ){
		var player = players[i];
		// the defender never leaves
		if( defender.name == player.name ) continue;
		//console.log( defender.name +" == "+ player.name );
		if(player.type=="player"){
			var sid = arena[i].id;
			var user = io.sockets.sockets[sid];
			user.leave('arena');
			// join the lobby by default
			socket.join('lobby');
			// variables
			players[player.id].state = 'wait';
			
		}
		// in all other cases (including dummies) delete
		delete players[i];
		
		//enterLobby( io.sockets.sockets[sid] );
		// FIX: in case players are not filtered properly
		//if( name && state )
		//	players.push({ name: name, state: state });
	}
	
}


function newDefender( user ) {
	//console.log("New Defender");
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
	
	//score += 10;
	//io.sockets.emit("update-score", {current: score, top: score});
	
	defender.score += 10;
	io.sockets.emit("update-score", {user: defender.score, top: score});
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

// A basic time tracking function set to 0.5sec updates
function time(){
	// tick is one loop
	count["ticks"] = (count["ticks"]) ? false : true;
	
	// 1st tier - exectures every 0.5 sec
	// - update invaders
	for( i in players ) {
		var invader = players[i];
		// clear dead invaders
		if ( invader.state == "dead" ) delete players[i];
		// don't modify the real players further
		if(invader.type !="ai") continue;
		if ( invader.state == "invader" ) { 
			invader.invade( defender );
			// kill dummy invaders just if the defender passes their way
			if( invader.pos.x == defender.pos.x ) {
				invader.kill();
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


function objLength( obj ){
	var length=0;
	for( el in obj ) length++;
	return length;
}


exports.init = init;