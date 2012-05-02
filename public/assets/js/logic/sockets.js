
socket.on('connect', function(){ 
	SOCKETS = true;
});

socket.on('disconnect', function(){ 
	SOCKETS = false;
});


socket.on('id', function( user ) {
	console.log("got ID!");
	// save the data for later
	PLAYER.id = user.id;
	PLAYER.name = user.name;
});

// user updates
socket.on('in-lobby', function(user) {
	// add user in lobby
	enterLobby( user.name );
	// show lobby
	showLobby();
	//PLAYER.me(user);
});

socket.on('in-arena', function() {
	exitLobby( PLAYER.name );
	player.enterArena();
	hideLobby();
});


// opponents updates
socket.on('entered-lobby', function( user ) {
	// add user in lobby
	enterLobby( user );
});

	
socket.on('new-invader', function( name ) {
		exitLobby( name );
	// exclude the player invader
	//if( invader.name != PLAYER.name){
		createInvader( name );
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
			var invader = new USER();
			invader.state = player.state;
			invader.name = player.name;
			INVADERS.push(invader);
		}
	}
});

socket.on('wave', function(flag) {
	if(flag){ 
		Game.waveTimer.reset();
		if( PLAYER.active ){ 
			PLAYER.pos.y++;
		}
	}
});
