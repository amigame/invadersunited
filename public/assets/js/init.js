init = function( processing ) {

	INPUT = Input.initialize();
	
	processing.setup = function() {
		processing.frameRate(12);
		
		sprites = Sprites.initialize(processing);
		
		player = Player.initialize(processing);
		opponents = Opponents.initialize(processing);
		defender = Defender.initialize(processing);
		 
	};  
	
	// Override draw function, by default it will be called 60 times per second
	processing.draw = function() {
		//update window size
		processing.size(WINDOW_WIDTH, WINDOW_HEIGHT);  
		// erase background
		processing.background(255, 15);
		// draw main actors
		player.update();
		opponents.update();
		defender.update();
		
	};
	
}


