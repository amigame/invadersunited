var config = require('../config/app.js'), 
	io, 
	User = require('./user'), 
	AI = require('./ai'), 
	chat, lobby, arena, 
	players = [], 
	timeout = config.timeout, 
	time = {wave:0}, 
	defender = false, 
	dummies = [], 
	score = 0
	second = false;


function init( socket ){

	io = socket;
	
	// create the rooms
	
	chat = makeChat();
	lobby = makeLobby();
	arena = makeArena();
	
	// start with an AI defender
	defender = newDefender(false);
	
	// set the timer
	setInterval( countdown, 500 );
	
	start();
	
}


function start(){
	
	// When user gets connected
	io.sockets.on('connection', function(user){ 
		
		// set these important variables on the server side
		user.state = false;
		user.name = false;
		
		// send active players
		user.emit("reset-players", getPlayers() );
		
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
			//var sid = user.id;
			//var user = io.sockets.sockets[sid];
			
			// save username
			user.name = email;
			
			// emit the id back to the user 
			user.emit("id", {id: user.id, name: user.name});
	
			enterLobby( user );
			
		})
		
		.on('move', function (pos) {
			
			// get username
			var sid = user.id;
			var name = io.sockets.sockets[sid].name;
			
			user.broadcast.emit('move', {name: name, pos: pos});
			// we are not using user because it is targets only users in the arena 
			//io.sockets.sockets[sid].broadcast.emit('move', {name: name, pos: pos});
	    })
		
		.on('kill', function ( data ) {
			var sid = user.id;
			var died = io.sockets.sockets[sid];
			// validate the user 
			if(died.id == data.id && died.name == data.name ){
				died.wave = 0;
				enterLobby(died);
				// add to the score of the defender
				if( defender && defender.name != "AI" ) addScore(10);
				
				// calculate the score based on position
				//user.score = data.score;
				//user.broadcast.emit("dead-invader", user.name);
			}
		 })
		 
		.on('disconnect', function(){ 
			// broadcast the message only if the user had the chance to login
			//if( user.state ) user.broadcast.emit("left-game", user.name);
			//var index = clients.indexOf(user); // Find the index
			//clients.splice(index,1); // remove user from array
			//console.log("after length ===> " +clients.length);			
		})
		
		
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
			var name = io.sockets.sockets[sid].name;
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

function enterArena(user) {
	// exit lobby
	user.leave('lobby');
	// add to the players room
	user.join('arena');
	
	// setup variables
	user.score = 0;
	user.state = "invader";
	user.coords = { x: 0, y:0 };
	user.wave = 1;
	
	// notify the user 
	user.emit("in-arena");
	// notify all other users
	user.broadcast.emit("new-invader", user.name);	
	//user.broadcast.to(room).emit("new-invader", user.id);
	
}

function enterLobby(user) {
	// exit lobby
	user.leave('arena');
	// join the lobby by default
	user.join('lobby');
	// variables
	user.state = 'wait';
	// notify the user 
	user.emit("in-lobby", {id: user.id, name: user.name});
	// notify all other users
	user.broadcast.emit("entered-lobby", user.name);
}

function updateWave(){

	// emit the new wave to everyone
	io.sockets.emit("wave", true);
	
	players = io.of('/arena').clients();
	
	// AI
	// - update wave in current invaders
	for( i in dummies ) dummies[i].wave++;
	
	// - create dummy invaders if there are too few players
	if( players.length < 5 && dummies.length < 10) createDummies();
	
	/*
	// update wave / find new defender
	for( i in players ) {
		var sid = players[i].id;
		var player = io.sockets.sockets[sid];
		// FIX: if there is no position continue to the next player
		if( typeof(player.pos) == "undefined" ) continue;
		
		console.log(player.name);
		
		try {
			if(player.state == "invade" && player.wave < 10){ 
				player.wave++;
			} else{
				// exclude the defender for the wave countdown
				if(!player.defender){ 
					//newDefender( player );
				}
			}
		} catch(e) {
			//console.log("doesn`t exist");
			continue; //if a client doesn`t exist, jus continue;
		}
	}
	*/
	
	// get new players from the waiting list
	var draft = 5;
	var lobby = io.of('/lobby').clients();
	for(i in lobby) {
		var sid = lobby[i].id;
		var user = io.sockets.sockets[sid];
		// get users from the waiting list
		if( draft && user.state == "wait" ){
			enterArena(user);
			draft--;
		}
	}
}

function getPlayers() {
	var players = [];
	// loop through all users in the arena
	var arena = io.of('/arena').clients();
	for( i in arena ){
		var sid = arena[i].id;
		var name = io.sockets.sockets[sid].name;
		var state = io.sockets.sockets[sid].state;
		// FIX: in case players are not filtered properly
		if( name && state )
			players.push({ name: name, state: state });
	}
	
	return players;
	
}


function destroyAll() {
	// remove users from the arena
	
	// remove all dummies from local memory
	dummies = [];
	/*
	// destroy dummies
	for( i in dummies ){
		//send a kill request
		io.sockets.emit("died", dummies[i].name);
	}
	*/
	var players = [];
	// loop through all users in the arena
	var arena = io.of('/arena').clients();
	for( i in arena ){
		var sid = arena[i].id;
		var user = io.sockets.sockets[sid];
		user.leave('arena');
		//enterLobby( io.sockets.sockets[sid] );
		// FIX: in case players are not filtered properly
		if( name && state )
			players.push({ name: name, state: state });
	}
	if( defender.name != "AI" )
			players.push({ name: defender.name, state: defender.state });
	
	
	// send active players
	io.sockets.emit("reset-players", players );
	
}


function newDefender( user ) {
	console.log("New Defender");
	if( !user ){ 
		// create a dummy defender
		var ai = new AI(io);
		var defender = ai;
		
	} else {
		// save defender id for easy access later
		var defender = user;
	}
	
	defender.state = "defend";
	// notify the clients of the new defender
	io.sockets.emit("new-defender", defender.name);
	
	destroyAll();
	
	return defender; 
}

function addScore( num ){
	var neo = io.sockets.sockets[defender.id];
	
	//score += 10;
	//io.sockets.emit("update-score", {current: score, top: score});
	
	neo.score += 10;
	io.sockets.emit("update-score", {user: neo.score, top: score});
}

// creates 5 AI invaders and puts them in the dummy list
function createDummies(){
	for(i=0; i<5; i++){
		var invader = new AI(io);
		// create a unique name
		invader.randomName();
		// FIX: start somewhere in the middle
		invader.wave = 1;
		invader.pos.x = 5;
		dummies.push( invader );
		
	}
	
}

// A basic countdown function set to 0.5sec updates
function countdown(){
	// set flag
	second = (second) ? false : true;
	
	// 1st tier - exectures every 0.5 sec
	// - update dummy defender
	if( defender && defender.name == "AI" ) defender.defend( players, dummies );
	
	// - update dummy invaders
	for( i in dummies ) dummies[i].invade( defender );
	
	// 2nd tier - executes every second
	if( second ) { 
		
		// next wave...
		if( time["wave"] > 0){
			time["wave"]--;
		} else {
			time["wave"] = timeout.wave;
			updateWave();
		}
	}
}


exports.init = init;