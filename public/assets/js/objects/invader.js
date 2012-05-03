Invader = {

	style: { color: SPRITE["styles"].invader.color, stroke: SPRITE["styles"].invader.stroke }, 
    sprite : null,
	
	init : function(root){
		
		this.root = root;
		
		
	},
	
	update : function(x, y){
		//console.log(y);
		//this.sprite.x = x;
		//this.sprite.y = y;
	}, 
	
	destroy : function(){
		//console.log(y);
		//root.remove(this.sprite);
		//delete this;
		//this.sprite.y = y;
	}
	
}