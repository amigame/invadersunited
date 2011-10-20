
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

function initChat(){
	chat = io.connect(window.location.hostname+"/chat");
	
	chat.on('connect', function () {
		//chat.emit('hi!');
	  });
	
	chat.on('update', function(data) {
		$("#chat-stream").prepend("<li>" + data + "</li>");
	});

}