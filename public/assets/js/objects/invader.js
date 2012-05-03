Invader = function(){ 

return $.extend({}, (new User()), {

	root : null,
	style: SPRITE["styles"].invader, 
    
	init : function(root){
		
		this.root = root;
		// set the sprite based on the wave
		var sprite = Math.round( (game.wave.current % invaders.sprites.length) / invaders.sprites.length );
		this.sprite = invaders.sprites[sprite];
		
	},
	
	update : function(){
		
		this.render();
		//console.log(y);
		//this.sprite.x = x;
		//this.sprite.y = y;
	}, 
	
	destroy : function(){
		console.log("show explosion");
		//root.remove(this.sprite);
		//delete this;
		//this.sprite.y = y;
	}
	
});

}