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
				self.update( user );
			});
			
			socket.on('remove', function( name ) {
				invaders.remove( name );
			});
			
			// this calls is used to normalize the local data with the server data
			socket.on('reset-invaders', function( users ){
				// delete old data
				invaders.reset( users );
			});
			
			socket.on('dead-invader', function( name ) {
				if(CONFIG['geek-o-vision']) console.log("Killed: " + name);
				// can't delete the player with a socket call
				if( name != player.name) invaders.destroy( name );
			});
			
			// create hud
			this.hud.init();

		}, 
		add: function( user ){
			
		}, 
		remove: function( user ){
			
		}, 
		update: function( user ){
			// don't update if there is no defender set
			if (typeof(neo) == "undefined") return;
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
				$("#hud #current-score").html( scores.user );
				$("#hud #top-score").html( scores.top );
			}
		}
	}
	
}

