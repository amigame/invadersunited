Bullet = {
	root : null,
	x : 0,
	y : WINDOW_HEIGHT-2*SPRITE_HEIGHT,
	compAI : false, 
	fire : false, 
	
	initialize : function() {
		this.root = Processing.getInstanceById('arena');
		return this;
	},
	
	update : function() {
		if( this.y < 50 ) {
			this.destroy();
		} else {
			this.y -= SPRITE_HEIGHT;
			this.root.ellipse(this.x, this.y, SPRITE_WIDTH/10, SPRITE_HEIGHT);	
		}
		this.checkCollision();
	}, 
	
	destroy : function() {
		//$(this).remove();
		this.fire = true;
	}, 
	
	shoot : function( x ) {
		//$(this).remove();
		this.x = x;
		this.y = WINDOW_HEIGHT-2*SPRITE_HEIGHT;
		this.fire = false;
	}, 
	
	checkCollision : function( ) {
		if( this.x >= PLAYER.x && this.x <= PLAYER.x+SPRITE_WIDTH && this.y <= PLAYER.y+SPRITE_HEIGHT && this.y >= PLAYER.y){
			this.destroy();		
			PLAYER.die = true;	
		}
	}
	
}