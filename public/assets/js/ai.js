AI = {

	x : 0,
	y : 0,
	canShoot: false, 
	compAI : true, 
	
	initialize : function() {
		if(this.canShoot){
			this.bullet = Bullet;
		}
		return this;
	},
	
	update : function() {
	},
	
	enableAI : function() {
		this.compAI = true;
	},
	
	updateAI : function() {
		this.x = PLAYER.x;
	},
	
	disableAI : function() {
	}
}
