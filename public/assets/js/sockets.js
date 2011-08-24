
var socket = io.connect(window.location.hostname); 

socket.on('connect', function(){ 
	SOCKETS = true;
	
	
	socket.emit('join arena', 'arena' );
	
//console.log( io.sockets.clients() );
	$("#chat").submit(function(e) {
	  e.preventDefault();
	  e.stopPropagation();
	  socket.send(JSON.stringify({msg:$("#msg").val()}));
	  $("#msg").val("");
	  return false;
	});
});

socket.on('message', function(data) {
	$("#response").append("<li>" + data + "</li>");
	
});

socket.on('id', function(id) {
	//console.log("my id is " + data);	
	PLAYER.id = id;
});

socket.on('entered arena', function(data) {
	console.log("New user: " + data);
	
});

socket.on('arena', function (invader) {
	// exclude the player invader
	if( invader.id != PLAYER.id){ 
		INVADERS[invader.id] = invader.data;
	}
});

socket.on('disconnect', function(){ 
	SOCKETS = false;
	
});