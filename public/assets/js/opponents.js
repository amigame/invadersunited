Opponents = function(root) {
	
	this.invader = {};
	
    this.initialize = function(root) {
		
		for(i in INVADERS){
			var coords = INVADERS[i].coords;
			this.invader[i] = new Invader(root, coords.x, coords.y, INVADERS_COLOR);
		}
		//this.invader = new Invader(root,WINDOW_HEIGHT/2,WINDOW_WIDTH/2);
		
	};

	this.animate = function(t, dt){
		// for each of the entries in the Opponents Array
		for(i in INVADERS){
			var coords = INVADERS[i].coords;
			if(typeof this.invader[i]==='undefined'){ 
				// If it doesn't exist create the invader
				this.invader[i] = new Invader(root, coords.x, coords.y, INVADERS_COLOR, 1);
			} else { 
				// If it exists just move it
				y = SPRITE_SCALE*SPRITE_HEIGHT*(INVADERS[i].wave-1);
				this.invader[i].animate(coords.x, y);
			}
		}
	};
	
	this.remove = function(id){
		if(typeof this.invader[id]==='undefined'){ 
			// do nothing
		} else {
			delete INVADERS[id];
			//this.invader[id].removeSelf;
			this.invader[id].destroy();
			delete this.invader[id];
			//console.log( this.invader );
		}
	}
	
    this.root = root;
    this.initialize(root);
	
}