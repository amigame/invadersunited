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
			var self = this;
			setTimeout(function(){
				// delete object
				delete self;
			}, 2000);
		}
	}, 
	
	update : function(){
		if( this.active ){ 
			this.render();
			//calculate the 
			if( neo == player.name && this.type == "ai" && this.isColliding( player.control.bullet ) ){
				console.log( player.control.bullet );
				socket.emit("kill-ai", { name: this.name });
			}
		}
	}, 

	
});

}