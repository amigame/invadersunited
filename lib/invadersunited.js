var config = require('../config/app.js'), 
	clients = [], // List of all connected clients
	players = [], // List of all players in arena
	io, 
	chat, lobby, arena, 
	countdown = 10;


var User = {
	id: 0,
	email: null,
	status: null,
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
	setInterval( update, 1000 );
	
	// When user gets connected
	io.sockets.on('connection', function(client){ 
		
		// new client is here! 
		clients.push(client);
		//var index = clients.length - 1; // get array index of new client
		// set these important variables on the server side
		client.score = 0;
		client.defender = 0;
		
		client.on('login', function(email){ 
			client.email = email;
			console.log( email );
		
			// join the lobby by default
			client.join('lobby');
			// notify the user 
			client.emit("in-lobby");
			// notify all other users
			client.broadcast.emit("enter-lobby", client.id);
		
			//var sid = client.id;
			//io.sockets.sockets[sid].set({ a: 'b' });
		});
		
		client.on('disconnect', function(){  
			client.broadcast.emit("left-game", client.id);
			var index = clients.indexOf(client); // Find the index
			clients.splice(index,1); // remove client from array
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

function makeArena( client ){
		
	return io
	  .of('/arena')
	  .on('connection', function (player) {
		
		console.log("PLAYER ID: " + player.id);
			
		  player.on('kill', function () {
			client.wave = 0;
			client.broadcast.emit("dead invader", client.id);
		 });
		 
	  })
	  .on('disconnect', function (socket) {
		lobby.emit("left-arena", lobby.id);
	  });
}

function enterArena(client) {
	client.join('arena');
	//client.broadcast.to(room).emit("new invader", client.id);
	client.wave = 1;
	// notify the user 
	client.emit("in-arena");
	// notify all other users
	client.broadcast.emit("enter-arena", client.id);
}

function enterLobby(client) {
	
}

function updateWave(){

	// emit the new wave to everyone
	io.sockets.emit("wave", true);
	//io.of('/chat').emit("countdown", countdown);
	
	for(var i=0;i<clients.length;i++) {
		try {
			if(clients[i].wave < 10){ 
				clients[i].wave +=1; // send to all connected clients
			} else{
				//newDefender();
				// exclude the defender for the wave countdown
				if(!clients[i].defender){ 
					// notify the clients of the new defender
					client.broadcast.emit("new-defender", client.id);
					clients[i].defender = true;
				}
			}
		} catch(e) {
			//console.log("doesn`t exist");
			continue; //if a client doesn`t exist, jus continue;
		}
	}

}

function update(){
	
	countdown -= 1; 
	
	if( countdown <= 0){
		updateWave();
		countdown = 10;
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