Opponents = function(root) {
	
	this.invaders = {};
	
    this.initialize = function(root) {
		
		//this.invader = new Invader(root,WINDOW_HEIGHT/2,WINDOW_WIDTH/2);
		
	};

	this.animate = function(t, dt){
		// for each of the entries in the Opponents Array
		for(i in INVADERS){
			var coords = JSON.parse( INVADERS[i] );
			if(typeof this.invaders[i]==='undefined'){ 
				// If it doesn't exist create the invader
				this.invaders[i] = new Invader(root, coords.x, coords.y);
			} else { 
				// If it exists just move it
				this.invaders[i].animate(coords.x, coords.y);
			}
		}
	}
	
    this.root = root;
    this.initialize(root);
	
}