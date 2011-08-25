Opponents = function(root) {
	
	this.invader = {};
	
    this.initialize = function(root) {
		
		for(i in INVADERS){
			var coords = JSON.parse( INVADERS[i] );
			this.invader[i] = new Invader(root, coords.x, coords.y, INVADERS_COLOR);
		}
		//this.invader = new Invader(root,WINDOW_HEIGHT/2,WINDOW_WIDTH/2);
		
	};

	this.animate = function(t, dt){
		// for each of the entries in the Opponents Array
		for(i in INVADERS){
			var coords = JSON.parse( INVADERS[i] );
			if(typeof this.invader[i]==='undefined'){ 
				// If it doesn't exist create the invader
				this.invader[i] = new Invader(root, coords.x, coords.y, INVADERS_COLOR);
			} else { 
				// If it exists just move it
				this.invader[i].animate(coords.x, coords.y);
			}
		}
	};
	
	this.remove = function(id){
		console.log(id);
		delete INVADERS[id];
		this.invader[id].removeSelf;
		//this.invader[id].destroy();
		//delete this.invader[id];
	}
	
    this.root = root;
    this.initialize(root);
	
}