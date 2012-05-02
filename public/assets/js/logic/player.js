Player = function(){ 

return $.extend({}, (new User()), {

	root : null,
	isAlive : true,
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
			arena.emit("kill", { id: player.id, name: player.name});
			// show an explosion
			//this.explosion.update();
			// reset pos
			this.pos = { x: -1, y: -1 };
		}
	}, 
	
	enterArena : function() {
		// setup player
		this.active = true;
		this.pos = { x: 0, y: 0 }
	},
	
	moveLeft : function() {
		if (this.x>0){
			this.pos.x--;
			//this.invader.animate(this.x, this.y);
			// expose player's position as a global var
			//PLAYER.pos.x = this.pos.x;
		}
	},
	
	moveRight : function() {
		if (this.x<WINDOW_WIDTH-SPRITE_WIDTH){
			this.pos.x++;
			// expose player's position as a global var
			//PLAYER.pos.x = this.pos.x;
			//this.invader.animate(this.x, this.y);
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
		// render the sprite
		frame = Math.round((this.root.frameCount% SCREEN.framerate )/ SCREEN.framerate );  // Use % to cycle through frames 
		this.sprite[frame].disableStyle();  // Ignore the colors in the SVG
  		this.root.fill(0, 102, 153);    // Set the SVG fill to blue
  		this.root.stroke(255);   
		this.root.shape(this.sprite[frame], this.x, this.y, SPRITE_WIDTH, SPRITE_HEIGHT);
		// geekovision...
		//console.log( frame+", "+this.x+", "+this.y+", "+SPRITE_WIDTH+", "+SPRITE_HEIGHT );
	}, 
	
	sendPosition : function() {
		if(SOCKETS){
			arena.emit('move', this.pos);
		}
	}, 
	
	set: function( user ){
		// save the data for later
		this.id = user.id;
		this.name = user.name;
	}
	
});

}