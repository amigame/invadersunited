Bullet = {
	root : null,
	x : 0,
	y : WINDOW_HEIGHT-2*SPRITE_HEIGHT,
	compAI : false, 
	fire : false, 
	
	initialize : function(x) {
		this.root = Processing.getInstanceById('arena');
		this.x = x;
		this.y = WINDOW_HEIGHT-2*SPRITE_HEIGHT;
		return this;
	},
	
	update : function() {
		if( this.y < 0 ) {
			this.destroy();
		} else {
			this.y -= SPRITE_HEIGHT;
			this.root.rect(this.x, this.y, SPRITE_WIDTH/10, SPRITE_HEIGHT);	
		}
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
	}
	
}