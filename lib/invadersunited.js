var config = require('../config/app.js'), 
	clients = [], // List of all connected Clients
	io, chat, lobby, arena;


function init( socket ){

	io = socket;
	
	// create the namespaces
	chat = makeChat();
	lobby = makeLobby();
	arena = makeArena();

	// When user gets connected
	io.sockets.on('connection', function(client){ 
		// new client is here! 
		clients.push(client);
		//var index = clients.length - 1; // get array index of new client
		// set these important variables on the server side
		client.score = 0;
		client.defender = 0;
		
		client.on('login', function(data){ 
			var sid = client.id;
			console.log(data);
			 //io.sockets.sockets[sid].set({ a: 'b' });
		});
		
		client.on('disconnect', function(){  
			client.broadcast.emit("left-game", client.id);
			var index = clients.indexOf(client); // Find the index
			clients.splice(index,1); // remove client from array
			//console.log("after length ===> " +clients.length);			
		});
	});

	// set the wave timer
	setInterval( countdownWave ,1000);
	setInterval( updateWave ,10000);
	
}

function makeChat(){
	return io
	  .of('/chat')
	  .on('connection', function (socket) {
		
		chat.emit('update', socket.id+" joined the game");
		
		socket.on('message', function (data) {
			chat.emit('update', data);
	    });
		
	  });

}


function makeLobby(){
	return io
	  .of('/lobby')
	  .on('connection', function (socket) {
			socket.emit("in-lobby");
			lobby.emit("enter-lobby", socket.id);
	  })
	 // .on('disconnect', function (socket) {
	//	lobby.emit("left-lobby", socket.id);
	//  });
}

function makeArena(){
	return io
	  .of('/arena')
	  .on('connection', function (player) {
		
		console.log("PLAYER ID: " + player.id);
			
		  player.on('kill', function () {
			client.wave = 0;
			client.broadcast.emit("dead invader", client.id);
		 });
		 
	  })
	  //.on('disconnect', function (socket) {
	//	lobby.emit("left-arena", lobby.id);
	//  });
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

	//console.log("WAVE");
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

function countdownWave(){
	
}


exports.init = init;