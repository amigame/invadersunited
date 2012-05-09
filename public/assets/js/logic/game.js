Game = function(){ 

return {

	root: null, 
	
	init : function() {
		
		// setup wave timer
		this.wave.init();
		
		// initialise login (global var)
		login.init();
		arena.init();
		// events
		
		socket.on('wave', function(flag) {
			if(flag){ 
				game.wave.reset();
				if( player.active ){ 
					player.pos.y++;
				}
			}
		});
		
		socket.on('new-invader', function( name ) {
				lobby.remove( name );
				invaders.add( name, "invader" );
		});
		
		socket.on('new-defender', function( name ) {
			if( name == player.name ){ 
				noty({text: 'YOU are the next defender!', layout: 'topCenter', type: 'success'});
				player.enterArena("defender");
			} else {
				noty({text: name +' is the next defender', layout: 'topCenter', type: 'information'});
				invaders.add(name, "defender");
			}
			//console.log("Defender: " + data);	
			neo = name;
		});
		
		socket.on('in-arena', function() {
			lobby.remove( player.name );
			player.enterArena("invader");
			lobby.hide();
		});

		socket.on('left-game', function( name) {
			console.log("Left: " + name);
			// remove user from lobby
			lobby.remove( name );
			// remove user from arena
			invaders.remove( name );
		});
		
	}, 
	
	render : function( root ) {
		
		this.root = root;
		
		root.setup = function() {
			root.frameRate( SCREEN.framerate );
			
			sprites = game.preload(root);
			
			player.init(root);
			invaders.init(root);
		};  
		
		// Override draw function abd add updates of the game classes
		root.draw = function() {
			//update window size
			root.size(WINDOW_WIDTH, WINDOW_HEIGHT);  
			// erase background
			root.background( SCREEN.background );
			// draw main actors
			invaders.update();
			// render player last so it's over all other objects
			player.update();
		};
		
	},
	
	preload : function(root){
		
		defender = new Array(); 
		defender[0] = root.loadShape("/assets/svg/Defender.svg");
  		defender[1] = defender[0];
  		
		dorky = new Array(); 
		dorky[0] = root.loadShape("/assets/svg/Dorky1.svg");
  		dorky[1] = root.loadShape("/assets/svg/Dorky2.svg");
		
		evily = new Array(); 
		evily[0] = root.loadShape("/assets/svg/Evily1.svg");
  		evily[1] = root.loadShape("/assets/svg/Evily2.svg");
		
		scully = new Array(); 
		scully[0] = root.loadShape("/assets/svg/Scully1.svg");
  		scully[1] = root.loadShape("/assets/svg/Scully2.svg");
		
		// save as global variables for later use
		SPRITES['defender'] = defender;
  		// set the sprites for the invaders
		SPRITES['invaders'] = new Array( dorky, evily, scully );
		
	},
	
	update : function(){
		
	}, 
	
	destroy : function(){
		
	}, 
	
	wave: {
		current: 0, 
		vars: {
			timeout: 10, 
			count: 0
		}, 
		timer: false, 
		init: function(){
			var self = this;
			
			self.reset();
			
			this.timer = window.setInterval(function(){ self.update( self ) }, 1000);
			
		}, 
		update: function( self ){
			var count = self.vars.count;
			if(count > 0) self.vars.count--;
			// display the update
			$("#wave span").html(self.vars.count);
		}, 
		reset: function(){
			// increment the wave num
			this.current++;
			// reset count to the set timeout
			this.vars.count = this.vars.timeout;
			
		},
		destroy: function(){
			clearInterval( this.timer );
		}
	}
	
}

}