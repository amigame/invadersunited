Invaders = function(){ 

return {
	
	root : null,
	invader : {},
	sprite : null,
	style: SPRITE["styles"].invader, 
    
    init : function(root) {
		
		//this.root = Processing.getInstanceById('arena');
		this.root = root;
		this.sprite = SPRITES['dorky'];
		
		/*
		for(i in INVADERS){
			console.log(INVADERS);
			var coords = INVADERS[i].coords;
			//this.root.rect(coords.x, coords.y, SPRITE_WIDTH, SPRITE_HEIGHT); 
			//this.invader[i] = new Invader(root, coords.x, coords.y, OPPONENTS["color"]);
			this.root.shape(SPRITES['scully'], coords.x, coords.y, SPRITE_WIDTH, SPRITE_HEIGHT);
		}
		*/
		//this.invader = new Invader(root,WINDOW_HEIGHT/2,WINDOW_WIDTH/2);
		return this;
	},
	
	update : function(){
		// FIX: don't update if there are no invaders
		if( !INVADERS.length ) return;
		// for each of the entries in the Opponents Array
		for(i in INVADERS){
			// skip if it's the player
			if ( INVADERS[i].name == PLAYER.name ) continue;
			var pos = INVADERS[i].pos;
			var x = Math.floor( pos.x * SPRITE_WIDTH );
			var y = Math.floor( pos.y * SPRITE_HEIGHT );
			// set sprite based on frame rate (so it's the same for all invaders)
			frame = Math.round((this.root.frameCount% SCREEN.framerate )/ SCREEN.framerate );  // Use % to cycle through frames  
			// properties
			this.sprite[frame].disableStyle();  // Ignore the colors in the SVG
			this.root.fill( this.style.color );
  			this.root.stroke( this.style.stroke );   
			// render the sprite
			this.root.shape(this.sprite[frame], x, y, SPRITE_WIDTH, SPRITE_HEIGHT);
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

}