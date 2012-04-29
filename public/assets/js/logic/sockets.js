
var socket = io.connect(window.location.hostname); 
var chat;  

$("form#login").submit(function(e) {
  e.preventDefault();
  e.stopPropagation();
  var input = $(this).find("input[type='text']");
  if( validateEmail(input.val() ) ){
	  socket.emit('login', input.val() );
  	//socket.send(JSON.stringify({text:$("#chat-text").val()}));
  	// move this to a socket response 
 	 initLobby();
  } else {
	 alert("Please enter a valid email");
  }
});

//console.log( io.sockets.clients() );
$("form#chat").submit(function(e) {
  e.preventDefault();
  e.stopPropagation();
  var input = $(this).find("input[type='text']");
  chat.emit('message', input.val() );
  input.val("");
});


socket.on('connect', function(){ 
	SOCKETS = true;
	
	// put conditions for entering the arena
	//socket.emit('join-room', 'arena' );
	
});

socket.on('id', function(id) {
	//console.log("my id is " + data);
	PLAYER.id = id;
});

// user updates
socket.on('in-lobby', function(user) {
	// show lobby
	$("#waiting").append("<li>" + user.name + "</li>");
	showLobby();
	// save the data for later
	PLAYER.id = user.id;
	PLAYER.name = user.name;
	//PLAYER.me(user);
});

socket.on('in-arena', function(data) {
	PLAYER.active = true;	
	hideLobby();
});


// opponents updates
socket.on('entered-lobby', function(user) {
	// add user in lobby
	$("#waiting").append("<li>" + user + "</li>");
	console.log("Entered:"+user);
});

	
socket.on('new-invader', function( name ) {
	// exclude the player invader
	//if( invader.name != PLAYER.name){
		var invader = USER;
		invader.name = name;
		INVADERS.push( invader );
	//} else {
	//	PLAYER.wave = invader.wave;
	//}
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

socket.on('wave', function(flag) {
	if(flag) Game.waveTimer.reset();
});

socket.on('disconnect', function(){ 
	SOCKETS = false;
});