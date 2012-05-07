Invader = function(){ 

return $.extend({}, (new User()), {

	root : null,
	style: SPRITE["styles"].invader, 
    
	init : function(root){
		
		this.root = root;
		this.active = true;
		this.type = (this.isAI()) ? "ai" : "player";
		// set the sprite based on the wave
		var sprite = Math.floor( game.wave.current % SPRITES['invaders'].length );
		this.sprite = SPRITES['invaders'][sprite];
		
		
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
		//calculate the 
		if( neo == player.name && this.type == "ai" && this.isColliding( player.control.bullet ) ){
			console.log( player.control.bullet );
			socket.emit("kill-ai", { name: this.name });
		}
	}, 

	
});

}