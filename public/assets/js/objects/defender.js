Defender = function(){ 

return $.extend({}, (new User()), {

	y : WINDOW_HEIGHT-2*SPRITE_HEIGHT,
	canShoot: true, 
	compAI : false, 
	bullet : null, 
	style: SPRITE["styles"].defender, 
    	
	init : function(root) {
		
		this.root = root;
		this.sprite = SPRITES['defender']; 
	
		this.enableAI();
		if(this.canShoot){
			this.bullet = Bullet.init();
		}
		//return this;
	},
	
	update : function() {
		// update coordinates
		this.coords();
		// set sprite based on frame rate (so it's the same for all invaders)
		frame = Math.round((this.root.frameCount%12)/12);  // Use % to cycle through frames  
		// properties
		this.sprite[frame].disableStyle();  // Ignore the colors in the SVG
		this.root.fill( this.style.color );
  		this.root.stroke( this.style.stroke );   
		// render the sprite
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
	}, 
	
	enableAI : function() {
		this.compAI = true;
	},
	
	updateAI : function() {
		if( typeof( player.pos.x ) != "undefined" ) this.pos.x = player.pos.x;
	},
	
	disableAI : function() {
	}, 
	
	coords: function() {
		this.x = ( this.pos.x > 0 ) ? Math.floor( this.pos.x * SPRITE_WIDTH): 0;
		//this.y = Math.floor( this.pos.y * SPRITE_HEIGHT);
	}
	
});

}