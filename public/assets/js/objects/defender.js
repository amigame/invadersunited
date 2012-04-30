Defender = {

	x : 0,
	y : WINDOW_HEIGHT-2*SPRITE_HEIGHT,
	canShoot: true, 
	compAI : false, 
	bullet : null, 
	sprite : null,
	
	init : function(root) {
		//this.root = Processing.getInstanceById('arena');
		this.root = root;
		this.sprite = SPRITES['defender'];
		//this.enableAI();
		if(this.canShoot){
			this.bullet = Bullet.init();
		}
		return this;
	},
	
	update : function() {
		//this.root.fill(55);  
		//this.root.rect(this.x, this.y, SPRITE_WIDTH, SPRITE_HEIGHT); 
		frame = Math.round((this.root.frameCount%12)/12);  // Use % to cycle through frames  
		this.root.shape(this.sprite[frame], this.x, this.y, SPRITE_WIDTH, SPRITE_HEIGHT);
		//if(this.compAI){
		//	this.updateAI();
		//}
		if(this.canShoot){ 
			//if( typeof this.bullet === "undefined"){
			if( this.bullet.fire == true ) {
				this.bullet.shoot( this.x+(SPRITE_WIDTH/2) );
			} else {
				this.bullet.update();
			}
		}
	}
	
}