init = function( processing ) {

	INPUT = Input.initialize();
	
	processing.setup = function() {
		processing.frameRate(12);
		 
		player = Player.initialize();
		opponents = Opponents.initialize();
		defender = Defender.initialize();
		 
	};  
	
	// Override draw function, by default it will be called 60 times per second
	processing.draw = function() {
		//update window size
		processing.size(WINDOW_WIDTH, WINDOW_HEIGHT);  
		// erase background
		processing.background(255);
		// draw main actors
		player.update();
		opponents.update();
		defender.update();
		
	};
	
}


