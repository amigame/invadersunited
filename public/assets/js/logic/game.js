Game = function(){ 

return {

	root: null, 
	
	init : function() {
		
		INPUT = Input.initialize();
		
		// setup wave timer
		this.waveTimer.init();
		
		// initialise login (global var)
		login.init();
			
	}, 
	
	render : function( root ) {
		
		this.root = root;
		
		root.setup = function() {
			root.frameRate( SCREEN.framerate );
			
			sprites = game.preload(root);
			
			player.init(root);
			invaders.init(root);
			neo.init(root);
			 
		};  
		
		// Override draw function abd add updates of the game classes
		root.draw = function() {
			//update window size
			root.size(WINDOW_WIDTH, WINDOW_HEIGHT);  
			// erase background
			root.background( SCREEN.background );
			// draw main actors
			player.update();
			invaders.update();
			neo.update();
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
  		SPRITES['dorky'] = dorky;
  		SPRITES['evily'] = evily;
  		SPRITES['scully'] = scully;
  		//dorky.disableStyle();
		
	},
	
	update : function(){
		
	}, 
	
	destroy : function(){
		
	}, 
	
	waveTimer: {
		
		vars: {
			timeout: 20, 
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
			// reset count to the set timeout
			this.vars.count = this.vars.timeout;
			
		},
		destroy: function(){
			clearInterval( this.timer );
		}
	}
	
}

}