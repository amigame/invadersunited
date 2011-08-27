Defender = $.extend(AI, {

	x : 0,
	y : WINDOW_HEIGHT-2*SPRITE_HEIGHT,
	canShoot: true, 
	compAI : false, 
	bullet : null, 
	
	initialize : function() {
		this.root = Processing.getInstanceById('arena');
		this.enableAI();
		if(this.canShoot){
			this.bullet = Bullet.initialize( this.x );
		}
		return this;
	},
	
	update : function() {
		this.root.fill(55);  
		this.root.rect(this.x, this.y, SPRITE_WIDTH, SPRITE_HEIGHT); 
		if(this.compAI){
			this.updateAI();
		}
		if(this.canShoot){ 
			//if( typeof this.bullet === "undefined"){
			if( this.bullet.fire == true ) {
				this.bullet.shoot( this.x );
			} else {
				this.bullet.update();
			}
		}
	}
	
});