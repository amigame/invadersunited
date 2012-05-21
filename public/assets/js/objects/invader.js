Invader = function(){ 

return $.extend({}, (new User()), {
	
	root : null,
	style: SPRITE["styles"].invader, 
    explosion : new Explosion(), 
	
	init : function(root){
		
		this.root = root;
		this.active = true;
		this.type = (this.isAI()) ? "ai" : "player";
		// Initialize sprites
		// - set the sprite based on the wave
		var sprite = Math.floor( game.wave.current % SPRITES['invaders'].length );
		this.sprite = SPRITES['invaders'][sprite];
		// - explosion
		this.explosion.init(root);
	},
	
	destroy : function(){
		if( this.active ){ 
			// reset the active flag
			this.active = false;
			// show an explosion
			this.explosion.start( this.pos );
		}
	}, 
	
	update : function(){
		if( this.active ){ 
			this.render();
			//calculate the collision
			if( neo == player.name && this.checkCollision( player.control.bullet )  ){
				// neo can only kill AI invaders
				if( this.type == "ai") socket.emit("kill-ai", this.name);
				// you can see the validated 
				player.control.bullet.destroy();
				this.destroy();
				
			}
			// geek-o-vision...
			if( this.name == player.name && CONFIG['geek-o-vision'] ) console.log("ME: "+this.x+", "+this.y);
		}
	}, 

	
});

}