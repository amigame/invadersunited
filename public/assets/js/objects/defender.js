Defender = function(){ 

return $.extend({}, (new User()), {

	y : WINDOW_HEIGHT-2*SPRITE_HEIGHT,
	canShoot: true, 
	bullet : null, 
	style: SPRITE["styles"].defender, 
    	
	init : function(root) {
		var self = this;
		
		this.root = root;
		this.active = true;
		
		this.sprite = SPRITES['defender']; 
		this.bullet = Bullet.init();
		
		// events
		
		socket.on('shoot', function(pos) {
			self.shoot();
		});
		
	},
	
	update : function() {
		if( this.active ){ 
			// update coordinates
			this.coords();
			// render the sprite
			this.render();
			// update the shoot flag
			this.bullet.update();
		}
		this.canShoot = !this.bullet.active;
	}, 
	shoot : function(){
		if( this.canShoot ){
			this.bullet.create( this.x+(SPRITE_WIDTH/2) );
			this.canShoot = false;
		}
	}, 
	
	destroy : function(){
		if( this.active ){ 
			// reset the active flag
			this.active = false;
			// no explosion for you...
			//this.explosion.start( this.pos );
		}
	}, 
	
	coords : function() {
		this.x = ( this.pos.x > 0 ) ? Math.floor( this.pos.x * SPRITE_WIDTH): 0;
		//this.y = Math.floor( this.pos.y * SPRITE_HEIGHT);
	}
	
});

}