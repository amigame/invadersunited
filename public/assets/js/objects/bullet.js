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
			
			this.y -= SPRITE["height"];
			this.root.fill(50, 50, 50);
  			this.root.stroke(50);
			this.root.ellipse(this.x, this.y, SPRITE["width"]/10, SPRITE["height"]);
			
			// check collision with invaders
			this.checkCollision();
		}
		
	}, 
	
	destroy : function() {
		this.y = -1;
		this.x = -1;
		this.active = false;
	}, 
	
	create : function( x ) {
		this.x = x;
		this.y = SCREEN["height"]-1.5*SPRITE["height"];
		this.active = true;
	}, 
	
	checkCollision : function( ) {
		var pos = player.pos;
		if( player.state == "invader" && this.x >= player.x && this.x <= (player.x+SPRITE["width"]) && this.y <= player.y+SPRITE["height"] && this.y >= player.y){
			this.destroy();	
			player.destroy();
		}
	}
	
}