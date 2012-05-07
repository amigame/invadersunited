Invaders = function(){ 

return {
	
	root : null,
	list : [],
	sprites : null, 
		
    init : function(root) {
		
		this.root = root;
		
		return this;
	},
	
	add : function( name, state ) {
		
		// FIX: skip if it's the player
		if ( name == player.name ) return;
		
		if(state == "invader"){ 
			var invader = new Invader();
			// FIX: colorize invaders based on user's positino
			if( player.state != "defender" ) { 
				// set the style as the opponent style
				invader.style = SPRITE["styles"].opponent;
			}
		} else if(state == "defender" ) {
			var invader = new Defender();
		}
		// either way...
		// tranfer the root canvas element
		invader.name = name;
		invader.init( this.root );
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
			// if y=0 it must be the defender
			var state = ( user.name == neo ) ? "defender" : "invader";
			this.add( user.name , state );
		} 
		
		// set the given position to the object
		this.list[user.name].pos = user.pos;
			
	}, 
	remove : function( name ){
		
		var invader = this.get( name );
		
		if( !invader ){
			// do nothing
		} else {
			invader.destroy();
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
			this.add(  invader.name, invader.state );
		}
				
	}
	
}

}