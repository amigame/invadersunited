Player = function(){ 

return $.extend({}, (new User()), {
	
	root : null,
	isAlive : true,
	style: SPRITE["styles"].player, 
    score : 0,
	explosion : Explosion,
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
				noty({text: 'You lost but you got a score of '+ score, layout: 'topCenter', type: 'error'});
			} else {
				noty({text: 'You died with no score', layout: 'topCenter', type: 'error'});
			}
		});
		
		//this.explosion = Explosion.initialize(root);
		
		return this;
	},
	
	set: function( user ){
		// save the data for later
		this.id = user.id;
		this.name = user.name;
	},
	
	update : function(){
		
		if( this.active ){ 
			this.updateInput();
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
	
	updateInput : function(){
		// get the input from the local vars
		var input = this.input;
		
		if ( input.keys["Left"] ){
        	this.moveLeft();
        } else if ( input.keys["Right"] ){
        	this.moveRight();
        } 
		// send position only if moving
		if ( input.keys["Left"] || input.keys["Right"] ){
			this.sendPosition();
		}
		// shoot if available
		//if ( INPUT.keys["Space"] && this.control.canShoot ){
		if ( input.keys["Space"] && typeof(this.control.shoot()) != "undefined" ){
			this.control.shoot();
			socket.emit('player-shoot');
		}
		
		
	}, 
	
	sendPosition : function() {
		if(SOCKETS){
			socket.emit('move', this.pos);
		}
	}
	
});

}