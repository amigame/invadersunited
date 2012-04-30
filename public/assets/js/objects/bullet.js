Bullet = {
	root : null,
	x : 0,
	y : WINDOW_HEIGHT-2*SPRITE_HEIGHT,
	compAI : false, 
	fire : false, 
	
	init : function() {
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
		var pos = player.pos;
		if( this.x >= player.x && this.x <= (player.x+SPRITE_WIDTH) && this.y <= player.y+SPRITE_HEIGHT && this.y >= player.y){
			this.destroy();	
			player.destroy();
		}
	}
	
}