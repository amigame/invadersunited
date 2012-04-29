
// Sidebar functions

function initLobby(){
	
	$("#load").fadeOut(1000);
	$("#wrapper aside").animate({ width: "30%"}, 1000, function(){
		$("#lobby").fadeIn();
	});

	initChat();	
}

function showLobby(){
	$("#wrapper aside").animate({ right: 0}, 800);
}
function hideLobby(){
	$("#wrapper aside").animate({ right: -1*$(this).width()}, 800);
}

function enterLobby( user ){
	var img = '<img src="'+ getGravatar( user, 32 ) +'" width="32" height="32" alt="'+ user +'" />';
	$("#waiting").append("<li>"+ img + user + "</li>");
}

function exitLobby( user ){
	// remove user from the waiting list
}


// Chat functions

function initChat(){
	
	chat
	.on('connect', function () {
		//chat.emit('hi!');
	  })
	.on('update', function(user) {
		var img = '<img src="'+ getGravatar( user.name, 16 ) +'" width="16" height="16" alt="'+ user.name +'" />';
		$("#chat-stream").prepend("<li>"+ img + user.text +"</li>");
	});

}

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
  if( !empty( input.val() ) ) chat.emit('message', input.val() );
  input.val("");
});

