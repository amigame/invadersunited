
User = function() {
	
	return { 
		id : 0,
		name: false,
		pos: { x: -1, y: -1},
		active : false,
		color : "#0C0",
		speed : (SPRITE_WIDTH*SPRITE_SCALE)/2, 
		die : false,
		x: 0, 
		y: 0,
		icon : encodeURIComponent("http://invadersunited.com/apple-touch-icon-114x114-precomposed.png"), 
		sprite : null, 
		
		render: function(){
			
			this.x = Math.floor( this.pos.x * SPRITE_WIDTH );
			this.y = Math.floor( this.pos.y * SPRITE_HEIGHT );
			// set sprite based on frame rate (so it's the same for all invaders)
			frame = Math.round((this.root.frameCount% SCREEN.framerate )/ SCREEN.framerate );  // Use % to cycle through frames  
			// properties
			this.sprite[frame].disableStyle();  // Ignore the colors in the SVG
			this.root.fill( this.style.color );
  			this.root.stroke( this.style.stroke );   
			// render the sprite
			this.root.shape(this.sprite[frame], this.x, this.y, SPRITE_WIDTH, SPRITE_HEIGHT);
			
			// geekovision...
			//console.log( frame+", "+this.x+", "+this.y+", "+SPRITE_WIDTH+", "+SPRITE_HEIGHT );
		}
	};
}

