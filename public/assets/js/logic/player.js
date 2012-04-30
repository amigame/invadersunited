Player = {

	id : null,
	root : null,
	isAlive : true,
    speed : PLAYER.speed,
    score : 0,
	x: 0, 
	y: 0,
	pos : { x: 0, y: 0 },
    explosion : Explosion,
	sprite : null,
	
    initialize : function(root) {
		//this.root = Processing.getInstanceById('arena');
		this.root = root;
		this.sprite = SPRITES['scully'];
		//this.explosion = Explosion.initialize(root);
		//this.x = x;
		//this.y = y;
		//this.invader = new Invader(root, x, y, PLAYER.color, 99);
		//this.input = new Input();
		return this;
	},
	
	update : function(){
		
		if( PLAYER.die ){ 
			this.destroy();
		} 
		if( PLAYER.active ){ 
			this.updatePosition();
		}
	},
	
	destroy : function(){
		// reset the active flag
		PLAYER.active = false;
		// show an explosion
		this.explosion.update();
		// reset pos
		this.pos = { x: 0, y: 0 };
	}, 
	
	enterArena : function() {
		// setup player
		PLAYER.active = true;
	},
	
	moveLeft : function() {
		if (this.x>0){
			this.pos.x--;
			//this.invader.animate(this.x, this.y);
			// expose player's position as a global var
			PLAYER.pos.x = this.pos.x;
		}
	},
	
	moveRight : function() {
		if (this.x<WINDOW_WIDTH-SPRITE_WIDTH){
			this.pos.x++;
			// expose player's position as a global var
			PLAYER.pos.x = this.pos.x;
			//this.invader.animate(this.x, this.y);
		}
	},
	
	updatePosition : function(){
		// get the position from the global vars
		this.pos = PLAYER.pos;
		
		if ( INPUT.keys["Left"] ){
        	this.moveLeft();
        } else if ( INPUT.keys["Right"] ){
        	this.moveRight();
        } 
		// send position only if moving
		if ( INPUT.keys["Left"] || INPUT.keys["Right"] ){
			this.sendPosition();
		}
		this.x = Math.floor( this.pos.x * SPRITE_WIDTH);
		this.y = Math.floor( this.pos.y * SPRITE_HEIGHT);
		// render the sprite
		frame = Math.round((this.root.frameCount% SCREEN.framerate )/ SCREEN.framerate );  // Use % to cycle through frames  
		this.root.shape(this.sprite[frame], this.x, this.y, SPRITE_WIDTH, SPRITE_HEIGHT);
		// geekovision...
		//console.log( frame+", "+this.x+", "+this.y+", "+SPRITE_WIDTH+", "+SPRITE_HEIGHT );
	}, 
	
	sendPosition : function() {
		if(SOCKETS){
			arena.emit('move', this.pos);
		}
	}, 
	
	set: function( data ){
		//
	}
	
}