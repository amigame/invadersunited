var config = require('../config/app.js'), 
	clients = [], // List of all connected users
	players = [], // List of all players in arena
	io, 
	chat, lobby, arena, 
	timeout = config.timeout, 
	time = {wave:0};

/*
// decouple user model and try to merge with the client object
var User = {
	email: null,
	state: null,
	position: {x: 0, y: 0},
	create: function(){},
	remove: function(){},
	goto: function(room){}
}
*/

function init( socket ){

	io = socket;
	
	// create the rooms
	
	chat = makeChat();
	lobby = makeLobby();
	arena = makeArena();
	
	// set the timer
	setInterval( countdown, 1000 );
	
	start();
	
}


function start(){
	
	// When user gets connected
	io.sockets.on('connection', function(user){ 
		
		// set these important variables on the server side
		user.state = false;
		user.name = false;
		
		// new user is here! 
		clients.push(user);
		
		user
		.set('arena', 'arena', function() { 
			console.log('room arena saved'); 
		})
		.set('lobby', 'lobby', function() { 
			console.log('room lobby saved'); 
		})
		.set('chat', 'chat', function() { 
			console.log('room chat saved'); 
		})
		.on('login', function(email){ 

			// save username
			user.name = email;
			
			enterLobby( user );
			
		})
		.on('disconnect', function(){ 
			// broadcast the message only if the user had the chance to login
			if( user.state ) user.broadcast.emit("left-game", user.name);
			var index = clients.indexOf(user); // Find the index
			clients.splice(index,1); // remove user from array
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
		  user.emit("in-lobby", user.name);
		  //lobby.emit("entered-lobby", user.name);
	  })
	  .on('disconnect', function (user) {
		  lobby.emit("left-lobby", user.name);
	  });
}

function makeArena(){
		
	return io
	  .of('/arena')
	  .on('connection', function (user) {
		
		// setup variables
		user.score = 0;
		user.state = "invader";
		user.coords = { x: 0, y:0 };
		
		console.log("PLAYER: " + user);
		
		user.on('move', function (data) {
			console.log( data );
			user.broadcast.emit('update', data);
	    })
		.on('kill', function ( data ) {
			if(user.id == data.id && user.name == data.name ){
				user.wave = 0;
				// calculate the score based on position
				//user.score = data.score;
				user.broadcast.emit("dead-invader", user.name);
			}
		 });
		 
	  })
	  .on('disconnect', function (user) {
		lobby.emit("left-arena", user.name);
	  });
}

function enterArena(user) {
	user.join('arena');
	user.state = 'invader';
	//user.broadcast.to(room).emit("new invader", user.id);
	user.wave = 1;
	// notify the user 
	user.emit("in-arena");
	// notify all other users
	user.broadcast.emit("new-invader", user.name);
}

function enterLobby(user) {
	// join the lobby by default
	user.join('lobby');
	user.state = 'waiting';
	// notify the user 
	user.emit("in-lobby", {id: user.id, name: user.name});
	// notify all other users
	user.broadcast.emit("entered-lobby", user.name);

}

function updateWave(){

	// emit the new wave to everyone
	io.sockets.emit("wave", true);
	
	for(var i=0;i<players.length;i++) {
		try {
			if(players[i].wave < 10){ 
				players[i].wave +=1; // send to all connected clients
			} else{
				//newDefender();
				// exclude the defender for the wave countdown
				if(!players[i].defender){ 
					// notify the clients of the new defender
					io.sockets.emit("new-defender", players[i].id);
					players[i].defender = true;
				}
			}
		} catch(e) {
			//console.log("doesn`t exist");
			continue; //if a client doesn`t exist, jus continue;
		}
	}
	// get new players from the waiting list
	// - new positions
	
	var draft = 5;
	
	for(i in clients) {
		var user = clients[i];
		// get users from the waiting list
		if( draft && user.state == "waiting" ){
			enterArena(user);
			draft--;
		}
	}
}

// A basic countdown function set to 1sec updates
function countdown(){
	
	// next wave...
	if( time["wave"] > 0){
		time["wave"]--;
	} else {
		time["wave"] = timeout.wave;
		updateWave();
	}
	
}


exports.init = init;