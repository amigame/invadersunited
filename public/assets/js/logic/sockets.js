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



socket.on('in-arena', function() {
	lobby.remove( player.name );
	player.enterArena();
	lobby.hide();
});

socket.on('died', function( score ) {
	if( score ){ 
		noty({text: 'You lost but you got a score of '+ score, layout: 'topCenter', type: 'error'});
	} else {
		noty({text: 'You died with no score', layout: 'topCenter', type: 'error'});
	}
});

	
socket.on('new-invader', function( name ) {
		noty({text: 'New Invader: '+ name, layout: 'topCenter', type: 'information'});
		lobby.remove( name );
	// exclude the player invader
	//if( invader.name != PLAYER.name){
		createInvader( name );
	//} else {
	//	PLAYER.wave = invader.wave;
	//}
});

socket.on('dead-invader', function(data) {
	console.log("Died: " + data);	
});

socket.on('left-game', function(name) {
	console.log("Left: " + name);
	for(i in INVADERS){
		var user = INVADERS[i];
		if( user.name == name ) delete INVADERS[i];
	}
	//var index = INVADERS.indexOf(user); // Find the index
	//INVADERS.splice(index,1);
	//delete INVADERS[index];	
});

// this calls is used to nomralize the local data with the server data
socket.on('reset-players', function(players){
	// delete old data
	INVADERS = [];
	// save the invaders and defenders
	for( i in  players ){ 
		var player = players[i];
		if( player.state == "invader" ){ 
			createInvader( name );
		}
	}
});

socket.on('wave', function(flag) {
	
	if(flag){ 
		game.waveTimer.reset();
		if( player.active ){ 
			player.pos.y++;
		}
	}
});
