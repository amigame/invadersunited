Defender = function(){ 

return $.extend({}, (new User()), {

	y : Math.floor( SCREEN["height"] - (SPRITE["height"]+SPRITE["padding"].y) ),
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
			// geek-o-vision...
			if( CONFIG['geek-o-vision'] ) {
				if( this.name == player.name ){ 
					console.log("ME: "+this.x+", "+this.y );
				}else {
					console.log("DEFENDER: "+this.x+", "+this.y );
				}
			}
		}
		this.canShoot = !this.bullet.active;
	}, 
	shoot : function(){
		if( this.canShoot ){
			this.bullet.create( this.x+(SPRITE["width"]/2) );
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
		this.x = ( this.pos.x > -1 ) ? Math.floor( this.pos.x * ( SPRITE["width"] + 2*SPRITE["padding"].x ) + SPRITE["padding"].x ): 0;
		this.y = Math.floor( SCREEN["height"] - (SPRITE["height"]+SPRITE["padding"].y) );
	}
	
});

}