Player = function(root, x, y) {

	this.isAlive = true;
    this.speed = PLAYER_SPEED;
    this.initial_points = 0;
    this.points = 0;
	this.id = null;
	
    this.initialize = function(root, x, y) {
		
		this.invader = new Invader(root,WINDOW_HEIGHT/2,WINDOW_WIDTH/2);
		this.input = new Input();
		
	};

	this.animate = function(t, dt){
		if (ARENA.keys["Left"]==1){
        	this.moveLeft();
        } else if (ARENA.keys["Right"]==1){
        	this.moveRight();
        }
	}
	
	this.moveLeft = function() {
		//this.invader.moveLeft();
		this.sendPosition();
		if (x!=0){
			x -= this.invader.sprite.w*this.speed;
			this.invader.animate(x, y);
		}
	};
	
	this.moveRight = function() {
		this.sendPosition();
		if (x!=WINDOW_WIDTH){
			x += this.invader.sprite.w*this.speed;
			this.invader.animate(x, y);
		}
	};
	
	this.sendPosition = function() {
		if(SOCKETS){
			socket.send(JSON.stringify({x: x, y: y}));
		}
	}		

    this.root = root;
    this.initialize(root, x, y);
	
}