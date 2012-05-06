Invader = function(){ 

return $.extend((new User()), {

	root : null,
	style: SPRITE["styles"].invader, 
    
	init : function(root){
		
		this.root = root;
		// set the sprite based on the wave
		var sprite = Math.round( (game.wave.current % invaders.sprites.length) / invaders.sprites.length );
		this.sprite = invaders.sprites[sprite];
		
	},
	
	destroy : function(){
		if( this.active ) {
			// reset the active flag
			this.active = false;
			// show an explosion
			//this.explosion.update();
			// reset pos
			this.pos = { x: -1, y: -1 };
		}
	}, 
	
	update : function(){
		
		this.render();
		//console.log(y);
		//this.sprite.x = x;
		//this.sprite.y = y;
	}, 

	
});

}