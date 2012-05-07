Player = function(){ 

return $.extend({}, (new User()), {
	
	root : null,
	isAlive : true,
	style: SPRITE["styles"].player, 
    score : 0,
	control: null, 
	input: new Input(),
	
    init : function(root) {
		var self = this;
		
		this.root = root;
		// initialize input
		this.input.init();
		
		// events
		socket.on('id', function( user ) {
			self.set( user );
		});
		
			
		socket.on('died', function( score ) {
			if( score ){ 
				noty({text: 'You lost but you got a score of '+ score, layout: 'topCenter', type: 'error', force : true });
			} else {
				noty({text: 'You died with no score', layout: 'topCenter', type: 'error', force : true });
			}
		});
		
		return this;
	},
	
	set: function( user ){
		// save the data for later
		this.id = user.id;
		this.name = user.name;
	},
	
	update : function(){
		
		if( this.active ){ 
			// update position based on user input
			this.updateInput();
			// update player coordinates
			this.coords();
			// pass position to the controlled object
			if( typeof(this.control) != null ){ 
				this.control.pos = this.pos;
				// update sprite
				this.control.update();
			}
		}
		
	},
	
	destroy : function(){
		if( this.active ) {
			// reset the active flag
			this.active = false;
			socket.emit("kill", { id: player.id, name: player.name});
			// show an explosion
			//console.log("Destroy");
			this.control.destroy();
			/*
			var self = this;
			setTimeout(function(){
				// reset pos
				self.pos = { x: -1, y: -1 };
				// delete object
				delete self.control;
			}, 2000);
			*/
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
		//console.log("In ARENA as "+ state);
		this.control.style = SPRITE["styles"].player;
		this.control.name = this.name;
		this.control.init( this.root );
		// register the initial position with the server
		this.sendPosition();
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
	
	updateInput : function(){
		// get the input from the local vars
		var input = this.input;
		
		if ( input.trigger["Left"] ){
        	this.moveLeft();
        } else if ( input.trigger["Right"] ){
        	this.moveRight();
        } 
		// send position only if moving
		if ( input.trigger["Left"] || input.trigger["Right"] ){
			this.sendPosition();
		}
		// shoot if available
		if ( input.trigger["Fire"] && this.control.canShoot ){
			this.control.shoot();
			socket.emit('shoot');
		}
		
		
	}, 
	
	sendPosition : function() {
		if(SOCKETS){
			socket.emit('move', this.pos);
		}
	}
	
});

}