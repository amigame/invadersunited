
var socket = io.connect(window.location.hostname); 
var chat; 

//console.log( io.sockets.clients() );
$("form#chat").submit(function(e) {
  e.preventDefault();
  e.stopPropagation();
  var input = $(this).find("input[type='text']");
  chat.emit('message', input.val() );
  //socket.send(JSON.stringify({text:$("#chat-text").val()}));
  input.val("");
});

//console.log( io.sockets.clients() );
$("form#login").submit(function(e) {
  e.preventDefault();
  e.stopPropagation();
  var input = $(this).find("input[type='text']");
  socket.emit('login', input.val() );
  //socket.send(JSON.stringify({text:$("#chat-text").val()}));
  // move this to a socket response 
  initLobby();
});

socket.on('connect', function(){ 
	SOCKETS = true;
	
	// put conditions for entering the arena
	//socket.emit('join-room', 'arena' );
	
});

socket.on('chat-message', function(data) {
	$("#chat-stream").prepend("<li>" + data + "</li>");
});

socket.on('id', function(id) {
	//console.log("my id is " + data);
	PLAYER.id = id;
});

// user updates
socket.on('in-lobby', function(data) {
	// show lobby
	console.log("now in lobby");
	showLobby();
});

socket.on('in-arena', function(data) {
	PLAYER.active = true;	
	hideLobby();
});


// opponents updates
socket.on('enter-lobby', function(data) {
	// add user in lobby
	console.log("Entered:"+data);
});

	
socket.on('new-invader', function(data) {
	// exclude the player invader
	if( invader.id != PLAYER.id){ 
		INVADERS[invader.id] = invader;
	} else {
		PLAYER.wave = invader.wave;
	}
});

socket.on('new-defender', function(data) {
	console.log("Defender: " + data);	
});

socket.on('dead-invader', function(data) {
	console.log("Died: " + data);	
});

socket.on('left-game', function(id) {
	console.log("Left: " + id);
	delete INVADERS[id];	
});

socket.on('countdown', function(data) {
	$("#wave span").html(data);
});


socket.on('disconnect', function(){ 
	SOCKETS = false;
});