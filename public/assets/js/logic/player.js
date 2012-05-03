Player = function(){ 

return $.extend({}, (new User()), {

	root : null,
	isAlive : true,
	style: SPRITE["styles"].player, 
    score : 0,
	explosion : Explosion,
	sprite : null,
	
    init : function(root) {
		var self = this;
		//this.root = Processing.getInstanceById('arena');
		this.root = root;
		this.sprite = SPRITES['scully'];
		
		// events
		socket.on('id', function( user ) {
			self.set( user );
		});
		
		socket.on('new-defender', function( name ) {
			if( name == self.name ){ 
				noty({text: 'YOU are the next defender!', layout: 'topCenter', type: 'information'});
			} else {
				noty({text: name +' is the next defender', layout: 'topCenter', type: 'success'});
			}
			//console.log("Defender: " + data);	
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
		this.pos = { x: 0, y: 0 }
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
		this.x = Math.floor( this.pos.x * SPRITE_WIDTH);
		this.y = Math.floor( this.pos.y * SPRITE_HEIGHT);
		// set sprite based on frame rate (so it's the same for all invaders)
		frame = Math.round((this.root.frameCount% SCREEN.framerate )/ SCREEN.framerate );  // Use % to cycle through frames 
		// properties
		this.sprite[frame].disableStyle();  // Ignore the colors in the SVG
		this.root.fill( this.style.color );
  		this.root.stroke( this.style.stroke );   
		// render the sprite
		this.root.shape(this.sprite[frame], this.x, this.y, SPRITE_WIDTH, SPRITE_HEIGHT);
		// geekovision...
		//console.log( frame+", "+this.x+", "+this.y+", "+SPRITE_WIDTH+", "+SPRITE_HEIGHT );
	}, 
	
	sendPosition : function() {
		if(SOCKETS){
			socket.emit('move', this.pos);
		}
	}
	
});

}