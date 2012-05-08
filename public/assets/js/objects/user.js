
User = function() {
	
	return { 
		id : 0,
		name: false,
		pos: { x: -1, y: -1},
		active : false,
		x: 0, 
		y: 0,
		icon : encodeURIComponent("http://invadersunited.com/default-player-icon.png"), 
		sprite : null, 
		canShoot: false, 
		type: false, 
		
		render: function(){
			// update coordinates
			this.coords();
			// set sprite based on frame rate (so it's the same for all invaders)
			frame = Math.round((this.root.frameCount% SCREEN["framerate"])/ SCREEN["framerate"] );  // Use % to cycle through frames  
			// properties
			this.sprite[frame].disableStyle();  // Ignore the colors in the SVG
			this.root.fill( this.style.color );
  			this.root.stroke( this.style.stroke );
			// render the sprite
			this.root.shape(this.sprite[frame], this.x, this.y, SPRITE_WIDTH, SPRITE_HEIGHT);
			
			// geekovision...
			//console.log( frame+", "+this.x+", "+this.y+", "+SPRITE_WIDTH+", "+SPRITE_HEIGHT );
		},
		coords : function() {
			this.x = Math.floor( this.pos.x * SPRITE_WIDTH );
			this.y = Math.floor( this.pos.y * SPRITE_HEIGHT );
		}, 
		isAI : function(){
			return (this.name).substring(0,3) == "AI-";
		}, 
		checkCollision : function( obj ) {
			if( obj.x >= this.x && obj.x <= (this.x+SPRITE_WIDTH)  && obj.y >= this.y && obj.y <= (this.y+SPRITE_HEIGHT)){
				return true;
			} else {
				return false;
			}
		}
	};
}

