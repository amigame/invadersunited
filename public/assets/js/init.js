init = function( processing ) {

	INPUT = Input.initialize();
	
	processing.setup = function() {
		processing.frameRate(12);
		processing.background(255);
		
		dorky = new Array(); 
		dorky[0] = processing.loadShape("/assets/svg/dorky_1.svg");
  		dorky[1] = processing.loadShape("/assets/svg/dorky_2.svg");
  		//dorky.disableStyle();
		
		player = Player.initialize();
		opponents = Opponents.initialize();
		defender = Defender.initialize();
		 
	};  
	
	// Override draw function, by default it will be called 60 times per second
	processing.draw = function() {
		//update window size
		processing.size(WINDOW_WIDTH, WINDOW_HEIGHT);  
		// erase background
		processing.background(255, 15);
		// draw main actors
		player.update(dorky);
		opponents.update();
		defender.update();
		
	};
	
}


