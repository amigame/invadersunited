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
		this.list[invader.name] = invader;
		//this.list.push(invader);
		
	}, 
	get : function ( name ){
		return this.list[name];
	}, 
	update : function( user ){
		// FIX: don't update if there are no invaders
		//if( !INVADERS.length ) return;
		// for each of the entries in the Opponents Array
		//
		for(name in this.list){
			var invader = this.list[name];
			// update invader
			invader.update();
			
		}
		
	}, 
	
	move : function( user ) {
		
		// see if its the 
		var exists = (typeof( this.list[user.name]) != undefined);
		
		// this is a new invader
		if(!exists) {
			this.add( user.name );
		} else {
			
			var invader = this.get(user.name);
			/*
			if (user.name == neo.name){
				neo.pos = user.pos;
				return;
			}
			*/
			invader.pos = user.pos;
		}	
			
	}, 
	remove : function( name ){
		
		if( typeof(this.list[name]) != "undefined") delete this.list[name];
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
			
			this.add(  invader.name );
			if( invader.state == "defender")
				this.list[invader.name].state = invader.state;
		}
				
	}
	
}

}