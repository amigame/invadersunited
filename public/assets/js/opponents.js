Opponents = {
	root : null,
	invader : {},
	
    initialize : function(root) {
		
		//this.root = Processing.getInstanceById('arena');
		this.root = root;
		for(i in INVADERS){
			var coords = INVADERS[i].coords;
			this.root.rect(coords.x, coords.y, SPRITE_WIDTH, SPRITE_HEIGHT); 
			//this.invader[i] = new Invader(root, coords.x, coords.y, INVADERS_COLOR);
		}
		//this.invader = new Invader(root,WINDOW_HEIGHT/2,WINDOW_WIDTH/2);
		return this;
	},
	
	update : function(){
		// for each of the entries in the Opponents Array
		for(i in INVADERS){
			var coords = INVADERS[i].coords;
			var x = Math.floor(coords.x*WINDOW_WIDTH);
			var y = SPRITE_HEIGHT*(INVADERS[i].wave-1);
			this.root.fill(OPPONENTS.color);
			this.root.rect(x, y, SPRITE_WIDTH, SPRITE_HEIGHT); 
			if(typeof this.invader[i]==='undefined'){ 
				// If it doesn't exist create the invader
				//this.invader[i] = new Invader(root, x, y, INVADERS_COLOR, 1);
			} else { 
				// If it exists just move it
				//this.invader[i].animate(x, y);
			}
		}
		
	},
	
	remove : function(id){
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
	
}