Player = function(){ 

return $.extend({}, (new User()), {
	
	root : null,
	isAlive : true,
	style: SPRITE["styles"].player, 
    score : 0,
	explosion : Explosion,
	control: null, 
			
    init : function(root) {
		var self = this;
		
		this.root = root;
		
		// events
		socket.on('id', function( user ) {
			self.set( user );
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
		
		if( this.active ){ 
			this.updatePosition();
			this.control.pos = this.pos;
			this.control.update();
		}
		//this.render();
		
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
	enterArena : function( state ) {
		// setup player
		this.active = true;
		this.state = state;
		if( state == "invader"){ 
			this.control = new Invader();
			// start one row down
			this.pos = { x: 0, y: 1 };
			// set sprite based on the wave
		} else if( state == "defender" ) {
			this.control = new Defender();
		}
		this.control.init( this.root );
		this.control.style = SPRITE["styles"].player;
		this.control.active = true;
		this.control.name = this.name;
	},
	
	moveLeft : function() {
		if (this.pos.x>0){
			this.pos.x--;
		}
	},
	
	moveRight : function() {
		if ( (this.pos.x*SPRITE_WIDTH) < (WINDOW_WIDTH-SPRITE_WIDTH) ){
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