
socket.on('connect', function(){ 
	SOCKETS = true;
});

socket.on('id', function(id) {
	//console.log("my id is " + data);
	PLAYER.id = id;
});

// user updates
socket.on('in-lobby', function(user) {
	// add user in lobby
	enterLobby( user.name );
	// show lobby
	showLobby();
	// save the data for later
	PLAYER.id = user.id;
	PLAYER.name = user.name;
	//PLAYER.me(user);
});

socket.on('in-arena', function() {
	PLAYER.active = true;	
	hideLobby();
});


// opponents updates
socket.on('entered-lobby', function( user ) {
	// add user in lobby
	enterLobby( user );
});

	
socket.on('new-invader', function( name ) {
	// exclude the player invader
	//if( invader.name != PLAYER.name){
		var invader = USER;
		invader.name = name;
		INVADERS.push(invader);
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

socket.on('wave', function(flag) {
	if(flag){ 
		Game.waveTimer.reset();
		if( PLAYER.active ){ 
			PLAYER.pos.y++;
		}
	}
});

socket.on('disconnect', function(){ 
	SOCKETS = false;
});