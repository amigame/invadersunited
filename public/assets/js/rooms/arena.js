// Sidebar functions
Arena = function() {
	return {
		socket: io.connect(window.location.hostname+"/arena"), 
		
		init: function(){
			var self = this;
			
			//events
			socket.on('update-score', function( scores ) {
				self.hud.update( scores );
			});
			
			socket.on('move', function( user ) {
				//console.log( user );
				self.update( user );
			});
			
			socket.on('left-game', function(name) {
				//console.log("Left: " + name);
				invaders.remove( user );
			});
			
			// this calls is used to normalize the local data with the server data
			socket.on('reset-invaders', function( users ){
				// delete old data
				invaders.reset( users );
			});
			
			socket.on('dead-invader', function( user ) {
				invaders.remove( user );
			});
			
			// create hud
			this.hud.init();

		}, 
		add: function( user ){
			
		}, 
		remove: function( user ){
			
		}, 
		update: function( user ){
			//console.log(user);
			//console.log(neo.name);
			// don't update if it's the player
			if (user.name == player.name) return;
			// lookup invaders
			invaders.move( user );
			
		}, 
		getAll: function(){
			
		}, 
		set: function(){
			
		}, 
		hud: {
			init: function(){
				// create containers
				$('<div/>', { id: 'hud' }).appendTo('body');
				$('<p/>', { id: 'current-score', html: 0 }).appendTo('#hud');
				$('<p/>', { id: 'top-score', html: 0  }).appendTo('#hud');
			}, 
			update: function( scores ){
				$("#hud #current-score").html( scores.current );
				$("#hud #top-score").html( scores.top );
			}
		}
	}
	
}

