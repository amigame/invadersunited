Player = function(){ 

return $.extend({}, (new User()), {
	
	root : null,
	isAlive : true,
	style: SPRITE["styles"].player, 
    score : 0,
	explosion : Explosion,
		
    init : function(root) {
		var self = this;
		
		this.root = root;
		this.sprite = SPRITES['scully']; 
	
		// events
		socket.on('id', function( user ) {
			self.set( user );
		});
		
		socket.on('new-defender', function( name ) {
			if( name == self.name ){ 
				noty({text: 'YOU are the next defender!', layout: 'topCenter', type: 'success'});
			} else {
				noty({text: name +' is the next defender', layout: 'topCenter', type: 'information'});
			}
			//console.log("Defender: " + data);	
			neo.name = name;
		});
			
		socket.on('died', function( score ) {
			if( score ){ 
				noty({text: 'You lost but you got a score of '+ score, layout: 'topCenter', type: 'error'});
			} else {
				noty({text: 'You died with no score', layout: 'topCenter', type: 'error'});
			}
		});
		

		//this.explosion = Explosion.initialize(root);
		//this.x = x;
		//this.y = y;
		//this.invader = new Invader(root, x, y, PLAYER.color, 99);
		//this.input = new Input();
		return this;
	},
	
	set: function( user ){
		// save the data for later
		this.id = user.id;
		this.name = user.name;
	},
	
	update : function(){
		/*
		if( PLAYER.die ){ 
			this.destroy();
		}*/ 
		if( this.active ){ 
			this.updatePosition();
		}
		
		this.render();
		
	},
	
	destroy : function(){
		if( this.active ) {
			// reset the active flag
			this.active = false;
			socket.emit("kill", { id: player.id, name: player.name});
			// show an explosion
			//this.explosion.update();
			// reset pos
			this.pos = { x: -1, y: -1 };
		}
	}, 
	// Player Updates
	enterArena : function() {
		// setup player
		this.active = true;
		// start one row down
		this.pos = { x: 0, y: 1 }
		// set sprite based on the wave
		var sprite = Math.floor( game.wave.current % invaders.sprites.length );
		this.sprite = invaders.sprites[sprite]; 
	},
	
	moveLeft : function() {
		if (this.x>0){
			this.pos.x--;
		}
	},
	
	moveRight : function() {
		if (this.x<WINDOW_WIDTH-SPRITE_WIDTH){
			this.pos.x++;
		}
	},
	
	updatePosition : function(){
		// get the position from the global vars
		//this.pos = PLAYER.pos;
		
		if ( INPUT.keys["Left"] ){
        	this.moveLeft();
        } else if ( INPUT.keys["Right"] ){
        	this.moveRight();
        } 
		// send position only if moving
		if ( INPUT.keys["Left"] || INPUT.keys["Right"] ){
			this.sendPosition();
		}
		
	}, 
	
	sendPosition : function() {
		if(SOCKETS){
			socket.emit('move', this.pos);
		}
	}
	
});

}