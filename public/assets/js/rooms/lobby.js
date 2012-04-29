
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

// Chat functions

function initChat(){
	
	chat.on('connect', function () {
		//chat.emit('hi!');
	  });
	
	chat.on('update', function(user) {
		console.log(user.name);
		$("#chat-stream").prepend("<li>" + user.text + "</li>");
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
  chat.emit('message', input.val() );
  input.val("");
});

