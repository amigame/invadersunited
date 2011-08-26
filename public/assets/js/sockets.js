
var socket = io.connect(window.location.hostname); 

socket.on('connect', function(){ 
	SOCKETS = true;
	
	// put conditions for entering the arena
	socket.emit('join arena', 'arena' );
	
	//console.log( io.sockets.clients() );
	$("#chat-form").submit(function(e) {
	  e.preventDefault();
	  e.stopPropagation();
	  socket.emit('chat-update', $("#chat-text").val() );
	  //socket.send(JSON.stringify({text:$("#chat-text").val()}));
	  $("#chat-text").val("");
	  return false;
	});
});

socket.on('chat-message', function(data) {
	$("#chat-stream").append("<li>" + data + "</li>");
});

socket.on('id', function(id) {
	//console.log("my id is " + data);	
	PLAYER.id = id;
});

socket.on('entered arena', function(data) {
	console.log("New: " + data);	
});

socket.on('left arena', function(data) {
	console.log("Died: " + data);	
});

socket.on('left game', function(id) {
	console.log("Left: " + id);
	ARENA.opponents.remove(id);	
});

socket.on('arena', function (invader) {
	// exclude the player invader
	if( invader.id != PLAYER.id){ 
		INVADERS[invader.id] = invader;
	} else {
		PLAYER.wave = invader.wave;
	}
});

socket.on('disconnect', function(){ 
	SOCKETS = false;
	
});