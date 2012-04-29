var config = require('../config/app.js'), 
	clients = [], // List of all connected users
	players = [], // List of all players in arena
	io, 
	chat, lobby, arena, 
	timeout = config.timeout, 
	time = {wave:0};


var User = {
	email: null,
	status: null,
	position: {x: 0, y: 0},
	create: function(){},
	remove: function(){},
	goto: function(room){}
}


function init( socket ){

	io = socket;
	
	// create the rooms
	
	chat = makeChat();
	lobby = makeLobby();
	arena = makeArena();
	
	// set the wave timer
	setInterval( countdown, 1000 );
	
	// When user gets connected
	io.sockets.on('connection', function(user){ 
		
		// new user is here! 
		clients.push(user);
		//var index = clients.length - 1; // get array index of new user
		// set these important variables on the server side
		user.score = 0;
		user.defender = 0;
		user.position = { x: 0, y:0 };
		
		user.on('login', function(email){ 
			user.email = email;
			console.log( user.id );
		
			// join the lobby by default
			user.join('lobby');
			// notify the user 
			user.emit("in-lobby");
			// notify all other users
			user.broadcast.emit("enter-lobby", user.id);
		
			//var sid = user.id;
			//io.sockets.sockets[sid].set({ a: 'b' });
		});
		
		user.on('disconnect', function(){  
			user.broadcast.emit("left-game", user.id);
			var index = clients.indexOf(user); // Find the index
			clients.splice(index,1); // remove user from array
			//console.log("after length ===> " +clients.length);			
		});
	});

	//setInterval( updateWave ,10000);
	
}

function makeChat(){
	return io
	  .of('/chat')
	  .on('connection', function (socket) {
		
		socket.on('message', function (data) {
			//console.log( data );
			chat.emit('update', data);
	    });
		
	  });

}


function makeLobby(){
	return io
	  .of('/lobby')
	  .on('connection', function (socket) {
			socket.emit("in-lobby", socket.email);
			lobby.emit("enter-lobby", socket.id);
	  })
	  .on('disconnect', function (socket) {
		lobby.emit("left-lobby", socket.id);
	  });
}

function makeArena(){
		
	return io
	  .of('/arena')
	  .on('connection', function (user) {
		
		console.log("PLAYER ID: " + user.id);
			
		  user.on('kill', function () {
			user.wave = 0;
			user.broadcast.emit("dead invader", user.id);
		 });
		 
	  })
	  .on('disconnect', function (socket) {
		lobby.emit("left-arena", lobby.id);
	  });
}

function enterArena(user) {
	user.join('arena');
	//user.broadcast.to(room).emit("new invader", user.id);
	user.wave = 1;
	// notify the user 
	user.emit("in-arena");
	// notify all other users
	user.broadcast.emit("enter-arena", user.id);
}

function enterLobby(user) {
	
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

/*

client.set('arena', 'arena', function() { 
		console.log('room arena saved'); 
	});
	
	client.set('lobby', 'lobby', function() { 
			console.log('room lobby saved'); 
	});
*/

exports.init = init;