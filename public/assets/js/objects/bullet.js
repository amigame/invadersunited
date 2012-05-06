Bullet = {
	root : null,
	x : 0,
	y : -1,
	active : false, 
	
	init : function() {
		this.root = Processing.getInstanceById('arena');
		return this;
	},
	
	update : function() {
		
		if( this.active && this.y < 0 ) {
			this.destroy();
		} else {
			
			this.y -= SPRITE_HEIGHT;
			this.root.fill(50, 50, 50);
  			this.root.stroke(255);
			this.root.ellipse(this.x, this.y, SPRITE_WIDTH/10, SPRITE_HEIGHT);
			
			// check collision with invaders
			this.checkCollision();	
		}
		
	}, 
	
	destroy : function() {
		this.y = -1;
		this.active = false;
	}, 
	
	create : function( x ) {
		this.x = x;
		this.y = WINDOW_HEIGHT-2*SPRITE_HEIGHT;
		this.active = true;
	}, 
	
	checkCollision : function( ) {
		var pos = player.pos;
		if( this.x >= player.x && this.x <= (player.x+SPRITE_WIDTH) && this.y <= player.y+SPRITE_HEIGHT && this.y >= player.y){
			this.destroy();	
			player.destroy();
		}
	}
	
}