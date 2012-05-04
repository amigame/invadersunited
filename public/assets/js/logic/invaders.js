Invaders = function(){ 

return {
	
	root : null,
	list : [],
	sprites : null, 
		
    init : function(root) {
		
		//this.root = Processing.getInstanceById('arena');
		this.root = root;
		
		// set the sprites for the invaders
		this.sprites = new Array( SPRITES['dorky'], SPRITES['evily'], SPRITES['scully'] );
		
		//this.invader = new Invader(root,WINDOW_HEIGHT/2,WINDOW_WIDTH/2);
		return this;
	},
	
	add : function( name ) {
		// FIX: skip if it's the player
		if ( name == player.name ) return;
		
		var invader = new Invader();
		// tranfer the root canvas element
		invader.init( this.root );
		invader.name = name;
		if( !player.defender ) { 
			// set the style as the opponent style
			invader.style = SPRITE["styles"].opponent;
		}
		this.list.push(invader);
				
	}, 
	
	update : function(){
		// FIX: don't update if there are no invaders
		//if( !INVADERS.length ) return;
		// for each of the entries in the Opponents Array
		for(i in this.list){
			var invader = this.list[i];
			// update invader
			invader.update();
			
		}
		
	}, 
	
	remove : function( name ){
		if( name ){
			for(i in this.list){
				var invader = this.list[i];
				if( name == invader.name ) { 
					delete this.list[i];
					invader.destroy();
				}
			}
		}
	}, 
	
	reset : function(){
		// remove everyone from the lists
		this.list = [];
	}
	
}

}