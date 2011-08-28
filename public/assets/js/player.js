Player = {

	isAlive : true,
    speed : PLAYER.speed,
    wave : 0,
    score : 0,
	id : null,
	root : null,
	x : 0,
	y : 0,
	explosion : Explosion,
	sprite : null,
	
    initialize : function(root) {
		//this.root = Processing.getInstanceById('arena');
		this.root = root;
		this.sprite = SPRITES['scully'];
		this.explosion = Explosion.initialize(root);
		//this.x = x;
		//this.y = y;
		//this.invader = new Invader(root, x, y, PLAYER.color, 99);
		//this.input = new Input();
		return this;
	},
	
	update : function(){
		if( PLAYER.die ){ 
			this.explosion.update();
		} else { 
			this.updatePosition();
			this.sendPosition();
		}
	},

	enterArena : function() {
		// setup player
	},
	
	moveLeft : function() {
		//this.invader.moveLeft();
		if (this.x>0){
			this.x -= this.speed;
			this.y = SPRITE_HEIGHT*(this.wave-1);
			//this.invader.animate(this.x, this.y);
		}
	},
	
	moveRight : function() {
		if (this.x<WINDOW_WIDTH-SPRITE_WIDTH){
			this.x += this.speed;
			this.y = SPRITE_HEIGHT*(this.wave-1);
			//this.invader.animate(this.x, this.y);
		}
	},
	
	updatePosition : function(){
		this.wave = PLAYER.wave;
		PLAYER.x = this.x;
		PLAYER.y = this.y;

		if (INPUT.keys["Left"]==1){
        	this.moveLeft();
        } else if (INPUT.keys["Right"]==1){
        	this.moveRight();
        }
		//animation.display(this.x, this.y);
		//this.root.fill(24);
		frame = Math.round((this.root.frameCount%12)/12);  // Use % to cycle through frames  
		this.root.shape(this.sprite[frame], this.x, this.y, SPRITE_WIDTH, SPRITE_HEIGHT);
		//this.root.fill(PLAYER.color);
		//this.root.rect(this.x, this.y, SPRITE_WIDTH, SPRITE_HEIGHT); 
			
	}, 
	
	sendPosition : function() {
		if(SOCKETS){
			var position = this.x/WINDOW_WIDTH;
			socket.send(JSON.stringify({x: position, y: this.y}));
		}
	}
	
}