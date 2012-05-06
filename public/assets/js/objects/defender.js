Defender = function(){ 

return $.extend({}, (new User()), {

	y : WINDOW_HEIGHT-2*SPRITE_HEIGHT,
	canShoot: true, 
	compAI : false, 
	bullet : null, 
	style: SPRITE["styles"].defender, 
    	
	init : function(root) {
		var self = this;
		
		this.root = root;
		this.sprite = SPRITES['defender']; 
		this.bullet = Bullet.init();
		
		// events
		
		socket.on('shoot', function(pos) {
			self.shoot();
		});
		
	},
	
	update : function() {
		// update coordinates
		this.coords();
		// set sprite based on frame rate (so it's the same for all invaders)
		frame = Math.round((this.root.frameCount % SCREEN["framerate"])/ SCREEN["framerate"] );  // Use % to cycle through frames  
		// properties
		this.sprite[frame].disableStyle();  // Ignore the colors in the SVG
		this.root.fill( this.style.color );
  		this.root.stroke( this.style.stroke );   
		// render the sprite
		this.root.shape(this.sprite[frame], this.x, this.y, SPRITE_WIDTH, SPRITE_HEIGHT);
		// update the shoot flag
		this.canShoot = this.bullet.update();
	}, 
	shoot : function(){
		this.bullet.create( this.x+(SPRITE_WIDTH/2) );
		this.canShoot = false;
	}, 
	coords : function() {
		this.x = ( this.pos.x > 0 ) ? Math.floor( this.pos.x * SPRITE_WIDTH): 0;
		//this.y = Math.floor( this.pos.y * SPRITE_HEIGHT);
	}
	
});

}