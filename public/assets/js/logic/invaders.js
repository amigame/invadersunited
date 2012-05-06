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
		this.list[name] = invader;
		
	}, 
	get : function ( name ){
		return (typeof( this.list[name] ) != undefined) ? this.list[name] : false;
	}, 
	update : function( user ){
		
		for(name in this.list){
			var invader = this.list[name];
			// update invader
			invader.update();
			
		}
		
	}, 
	
	move : function( user ) {
		
		// see if its the 
		var invader = this.get(user.name);
		
		// this is a new invader
		if(!invader) {
			this.add( user.name );
		} else {
			// create set method instead...
			this.list[user.name].pos = user.pos;
		}	
			
	}, 
	remove : function( name ){
		
		var invader = this.get( name );
		
		if( !invader ){
			// do nothing
		} else {
			console.log( invader );
			invader.kill();
			delete this.list[name];
		}
		
		/*
		if( name ){
			for(i in this.list){
				var invader = this.list[i];
				if( name == invader.name ) { 
					delete this.list[i];
					invader.destroy();
				}
			}
		}
		*/
	}, 
	
	reset : function( players ){
		// remove everyone from the current list
		this.list = [];
		
		// save the invaders and defenders
		for( i in  players ){ 
				
			var invader = players[i];
			// FIX: Don't include the defender in the invaders list
			if( invader.state != "defender")
				this.add(  invader.name );
		}
				
	}
	
}

}