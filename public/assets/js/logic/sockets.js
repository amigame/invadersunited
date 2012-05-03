// Setup sockets
var socket = io.connect(window.location.hostname); 
//var arena.socket = ;
//var lobby.socket = ;
var chat = io.connect(window.location.hostname+"/chat");


// main sockets switch
socket.on('connect', function(){ 
	SOCKETS = true;
});

socket.on('disconnect', function(){ 
	SOCKETS = false;
});
