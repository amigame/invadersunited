
WIDTH  				= 900;
HEIGHT 				= 500;

WINDOW_WIDTH 		= window.innerWidth;
WINDOW_HEIGHT 		= window.innerHeight;

FROG_SPEED 			= 0.2;
FROG_FILL           = '#66cc00';//new Gradient({ endX:0, endY:80, colorStops:[[1, "#339900"], [0, "#66cc00"]] }); //'#00cc00';
FROG_LEGS_FILL		= '#66cc00';
FROG_WIDTH			= 30;
FROG_HEIGHT			= 30;
FROG_DEATH_MESSAGES = ["SPLAT!","OUCH, THAT ONE HURT","ROADKILL!","...AND YOU'RE DEAD","BEEEEEEEP! OUTTA THE WAY!","YEP, THAT WAS A CAR"];
FROG_SAFE_MESSAGES = ["BOOM-SHAK-A-LACKA!","GOOOOAAAAALLLLLLLL!","ONE SMALL STEP FOR FROG...","SCORE!","YOU MADE IT!","YOU'RE SAFE"];

CAR_DEFAULT_SPEED 	= 0.1;
CAR_SIZE 			= 15;
CAR_FILL 			= '#a9a9a9';
CAR_EXPLODE			= 'rgba(240,195,96,0.5)';
CAR_FILL_OPACITY 	= 1;
CAR_STROKE 			= '#464646';
CAR_STROKE_OPACITY 	= 0.25;
CAR_STROKE_WIDTH 	= 2;

PLAIN_CAR_WIDTH		= 80;
PLAIN_CAR_HEIGHT	= 40;
PLAIN_CAR_SPEED		= 0.08;
TRUCK_WIDTH 		= 110;
TRUCK_HEIGHT		= 40;
TRUCK_SPEED			= 0.06;
RACECAR_WIDTH		= 80;
RACECAR_HEIGHT		= 40;
RACECAR_SPEED		= .12;

FROG_RECEIVER_HEIGHT= 50;
FROG_RECEIVER_SPACE = 10;
FROG_RECEIVER_TOTAL_HEIGHT = FROG_RECEIVER_SPACE + FROG_RECEIVER_HEIGHT;

NUM_FROG_RECEIVERS	= 5;

POINTS_FOR_SAFE_FROG = 100;
POINTS_FOR_CLEARED_LEVEL = 250;

GAME_BG_COLOR 		= '#111';


NodesCollided = function(obj1, obj2){
		//     ^       ^
		//  <--F--> <--C-->
		//     ^       ^

		if (obj1.x + obj1.w < obj2.x) {
			return false;
		}
		
		
		//     ^
		// <-- C -->
		//     ^
		//     ^
		// <-- F -->
		//     ^
		if (obj1.y + obj1.h < obj2.y) {
			return false;
		}
		
		
		//     ^       ^
		//  <--C--> <--F-->
		//     ^       ^
		if (obj1.x > obj2.x + obj2.w) {
			return false;
		}
		
		//     ^
		// <-- F -->
		//     ^
		//     ^
		// <-- C -->
		//     ^
		if (obj1.y > obj2.y + obj2.h){
			return false;
		}

		return true;
}

Frog = function(root, x, y) {

	this.isAlive = true;
    this.speed = FROG_SPEED;
    this.initial_points = 0;
    this.points = 0;
	this.animatePosition = 1;

    this.initialize = function(root, x, y) {

        this.node = new Rectangle(FROG_WIDTH, FROG_HEIGHT);
        this.node.w = FROG_WIDTH;
        this.node.h = FROG_HEIGHT;
        this.node.x = x - FROG_WIDTH/2;
        this.node.y = y - FROG_HEIGHT/2;        
        this.node.zIndex = 1;

        // Reset the x/y since frog position is relative to the node wrapper:
        x = 0;
        y = FROG_HEIGHT;
        var xPart = FROG_WIDTH/10;
        var yPart = FROG_HEIGHT/10;
                
		this.frog = new Path([
		    ['moveTo',           [x+4*xPart,y-yPart*9]],
			['quadraticCurveTo', [x+5*xPart,y-FROG_HEIGHT, 	x+6*xPart,y-yPart*9]],
			['quadraticCurveTo', [x+9*xPart,y-yPart*4,	x+6*xPart,y-yPart*2]],
			['quadraticCurveTo', [x+5*xPart,y-yPart,		x+4*xPart,y-yPart*2]],
			['quadraticCurveTo', [x+1*xPart,y-yPart*4,	x+4*xPart,y-yPart*9]],
		],{
			fill: FROG_FILL,
			fillOpacity:1
		});
		
		this.frogRightArm = new Path([
			['moveTo', [x+7*xPart,y-yPart*4]],
			['lineTo', [x+9*xPart,y-yPart*6]],
			['lineTo', [x+8*xPart,y-yPart*7]],
			['lineTo', [x+8*xPart,y-yPart*6]],
			['lineTo', [x+6*xPart,y-yPart*4]],
			['lineTo', [x+7*xPart,y-yPart*4]],
		],{
			fill: FROG_FILL,
			fillOpacity:1
		});
		
		this.frogLeftArm = new Path([
			['moveTo', [x+3*xPart,y-yPart*4]],
			['lineTo', [x+xPart,y-yPart*6]],
			['lineTo', [x+2*xPart,y-yPart*7]],
			['lineTo', [x+2*xPart,y-yPart*6]],
			['lineTo', [x+4*xPart,y-yPart*4]],
			['lineTo', [x+3*xPart,y-yPart*4]],
		],{
			fill: FROG_FILL,
			fillOpacity:1
		});
		
		this.frogLegs = new Path([
			['moveTo', [x+6*xPart,y-yPart*3]],
			['lineTo', [x+7*xPart,y-yPart]],
			['lineTo', [x+6*xPart,y]],
			['lineTo', [x+7*xPart,y]],			
			['lineTo', [x+9*xPart,y-yPart*2]],
			['lineTo', [x+8*xPart,y-yPart*3]],
			['lineTo', [x+7*xPart,y-yPart*4]],
            
            ['moveTo', [x+4*xPart,y-yPart*3]],
            ['lineTo', [x+3*xPart,y-yPart]],
            ['lineTo', [x+4*xPart,y]],
            ['lineTo', [x+3*xPart,y]],
            ['lineTo', [x+xPart,y-yPart*2]],
            ['lineTo', [x+2*xPart,y-yPart*3]],
            ['lineTo', [x+3*xPart,y-yPart*4]],
		],{
			fill: FROG_LEGS_FILL,
			fillOpacity:1
		});

		this.frog.fillOpacity = 1;

        this.node.append(this.frog);
		this.node.append(this.frogRightArm);
		this.node.append(this.frogLeftArm);
		this.node.append(this.frogLegs);

        this.root.append(this.node);
    }

	this.up = function() {
		this.node.y -= this.node.h*this.speed;
	}
	
	this.down = function() {
		if (this.node.y!=HEIGHT){
			this.node.y += this.node.h*this.speed;
		}
	}
	
	this.moveLeft = function() {
		if (this.node.x!=0){
			this.node.x -= this.node.w*this.speed;
		}
	}
	
	this.moveRight = function() {	
		if (this.node.x!=WIDTH){
			this.node.x += this.node.w*this.speed;
		}
	}

	this.runOver = function() {
        this.frog.animateTo('fillOpacity', 0, 200, 'sine');
		this.frogRightArm.animateTo('fillOpacity', 0, 200, 'sine');
		this.frogLeftArm.animateTo('fillOpacity', 0, 200, 'sine');
		this.frogLegs.animateTo('fillOpacity', 0, 200, 'sine');
	}
	
	this.destroy = function(){
	    this.node.removeSelf();
	}

	this.handleMove = function(){

		if (this.animatePosition==1){
			this.frogRightArm.y -= 3;
			this.frogLeftArm.y += 3;
			this.frogLegs.y += 4;
			this.animatePosition = 0;
		}else{
			this.frogRightArm.y += 3;
			this.frogLeftArm.y -= 3;
			this.frogLegs.y -= 4;
			this.animatePosition = 1;
		}
		
	}

	this.animate = function(t, dt){
		
        if (this.root.keys["Up"]==1){
			this.handleMove();     	
			this.up();
        } else if (this.root.keys["Down"]==1){
			this.handleMove();
        	this.down();
        } else if (this.root.keys["Left"]==1){
			this.handleMove();
        	this.moveLeft();
        } else if (this.root.keys["Right"]==1){
			this.handleMove();
        	this.moveRight();
        }
	}

    this.root = root;
    this.initialize(root, x, y);
}


CarFactory = {
	
	makeCar: function(type,x,y,direction,color){
		switch(type){
			case "TRUCK":
				return this._makeTruck(x,y,direction,color);
				break;
			case "RACECAR":
				return this._makeRaceCar(x,y,direction,color);
				break;
			case "PLAINCAR":
				return this._makePlainCar(x,y,direction,color);
				break;
		}
	},
	
	_makeCarWrapper: function(x,y,w,h){
		var wrapper = new Rectangle(w, h);
        wrapper.x = x;
        wrapper.y = y;
        wrapper.w = w;
        wrapper.h = h;
        return wrapper;
	},
	
	_makeTruck: function(x, y, direction,color){
		var base_w = TRUCK_WIDTH;
		var base_h = TRUCK_HEIGHT;
		
		var car = this._makeCarWrapper(x,y,base_w,base_h);
		
		// update w and x based on direction
		var w = (direction=="LEFT") ? base_w : -base_w;
		var h = base_h;
		x = (direction=="LEFT") ? 0 : base_w;
        
		var hPart = h/8

		var path1 = new Path([
          ['moveTo', [x+0		,hPart*2]],
	      ['lineTo', [x+2*w/11	,hPart]],
	      ['lineTo', [x+2*w/11	,0]],
	      ['lineTo', [x+4*w/11	,0]],
	      ['lineTo', [x+4*w/11	,hPart]],
	      ['lineTo', [x+5*w/11	,hPart]],
	      ['lineTo', [x+5*w/11	,0]],
	      ['lineTo', [x+w		,0]],
	      ['lineTo', [x+w		,h]],
	      ['lineTo', [x+5*w/11	,h]],
	      ['lineTo', [x+5*w/11	,7*hPart]],
	      ['lineTo', [x+4*w/11	,7*hPart]],
	      ['lineTo', [x+4*w/11	,h]],
	      ['lineTo', [x+2*w/11	,h]],
	      ['lineTo', [x+2*w/11	,7*hPart]],
	      ['lineTo', [x			,6*hPart]],
	      ['lineTo', [x			,2*hPart]]
        ],{
        	fill: color
        })

		path1.w = w;
		path1.h = h;
		car.append(path1)
		return car;
	},
	
	_makeRaceCar: function(x, y, direction,color){
		var base_w = RACECAR_WIDTH;
		var base_h = RACECAR_HEIGHT;
		
		var car = this._makeCarWrapper(x,y,base_w,base_h)
		
		// Reinitialize w / h / x, based on direction
		var w = (direction=="LEFT") ? base_w : -base_w;
		var h = base_h;
		x = (direction=="LEFT") ? 0 : base_w;
				
		//Car body
		var path1 = new Path([
		    ['moveTo', [x+0,h]],
		    ['lineTo', [x+15*w/120,h]],
		    ['lineTo', [x+15*w/120,55*h/70]],
		    ['lineTo', [x+100*w/120,55*h/70]],
		    ['lineTo', [x+100*w/120,h]],
		    ['lineTo', [x+w,h]],
		    ['lineTo', [x+w,0]],
		    ['lineTo', [x+100*w/120,0]],
		    ['lineTo', [x+100*w/120,15*h/70]],
		    ['lineTo', [x+15*w/120,15*h/70]],
		    ['lineTo', [x+15*w/120,0]],
		    ['lineTo', [x+0,0]]
	    ],{
	    	fill:color
	    });
	    car.append(path1);
	    
	    //Bottom Left Tire
	    var path2 = new Path([
		    ['moveTo', [x+w/6,55*h/70]],
		    ['lineTo', [x+w/3,55*h/70]],
		    ['lineTo', [x+w/3,65*h/70]],
		    ['lineTo', [x+w/6,65*h/70]],
	    ],{
	    	fill:"#000"
	    });
		car.append(path2);
	      
	    //Top Left Tire
	    var path3 = new Path([
		    ['moveTo', [x+w/6,5*h/70]],
		    ['lineTo', [x+w/3,5*h/70]],
		    ['lineTo', [x+w/3,15*h/70]],
		    ['lineTo', [x+w/6,15*h/70]]
		],{
			fill:"#000"
		});
	    car.append(path3);
		
	    //Top Right Tire
	    var path4 = new Path([
		    ['moveTo', [x+7*w/12,15*h/70]],
		    ['lineTo', [x+7*w/12,0]],
		    ['lineTo', [x+3*w/4,0]],
		    ['lineTo', [x+3*w/4,15*h/70]]
		],{
			fill:"#000"
		});
	    car.append(path4)
		
	    //Bottom Right Tire
	    var path5 = new Path([
		    ['moveTo', [x+7*w/12,55*h/70]],
		    ['lineTo', [x+3*w/4,55*h/70]],
		    ['lineTo', [x+3*w/4,h]],
		    ['lineTo', [x+7*w/12,h]]
		],{
			fill:"#000"
		});
		car.append(path5)
	    
	    //Racing Strip
	    var path6 = new Path([
		    ['moveTo', [x+0,3*h/7]],
		    ['lineTo', [x+w,3*h/7]],
		    ['lineTo', [x+w,4*h/7]],
		    ['lineTo', [x+0,4*h/7]]
		],{
			fill:"#2E3192"
		});
		car.append(path6)
	    
	    //Windshield
	    var path7 = new Path([
		    ['moveTo', [x+w/2,2*h/7]],
		    ['lineTo', [x+2*w/3,2*h/7]],
		    ['lineTo', [x+2*w/3,5*h/7]],
		    ['lineTo', [x+w/2,5*h/7]]
		],{
			fill:"#000"
		});
	    car.append(path7)
		
		return car
	},
	
	_makePlainCar: function(x, y, direction,color){
		var base_w = PLAIN_CAR_WIDTH;
		var base_h = PLAIN_CAR_HEIGHT;
		
		var car = this._makeCarWrapper(x,y,base_w,base_h)
		
		// Reinitialize w / h / x, based on direction
		var w = (direction=="LEFT") ? base_w : -base_w;
		var h = base_h;
		x = (direction=="LEFT") ? 0 : base_w;
				
		var wPart = w/7;
		var hPart = h/8;
				
		//Car body
		var path1 = new Path([
		    ['moveTo', [x+0,h]],
		    ['moveTo', [x+1*wPart,0]],
			['lineTo', [x+2*wPart,0]],
			['lineTo', [x+2*wPart,hPart]],
			['lineTo', [x+3*wPart,hPart]],
			['lineTo', [x+3*wPart,0]],
			['lineTo', [x+5*wPart,0]],
			['lineTo', [x+5*wPart,hPart]],
			['lineTo', [x+6*wPart,hPart]],
			['lineTo', [x+6*wPart,0]],
			['quadraticCurveTo', [x+w,0, x+w,hPart*2]],
			['lineTo', [x+w,3*h/4]],
			['quadraticCurveTo', [x+w,h, x+6*wPart,h]],
			['lineTo', [x+6*wPart,h]],
			['lineTo', [x+6*wPart,7*hPart]],
			['lineTo', [x+5*wPart,7*hPart]],
			['lineTo', [x+5*wPart,h]],
			['lineTo', [x+3*wPart,h]],
			['lineTo', [x+3*wPart,7*hPart]],
			['lineTo', [x+2*wPart,7*hPart]],
			['lineTo', [x+2*wPart,h]],
			['lineTo', [x+wPart,h]],
			['quadraticCurveTo', [x+0,h/2, x+wPart,0]]
		],{
			fill: color
		});
		
		car.append(path1);
		return car;
	}
}

Car = function(root, x, y, speed, direction, color, type) {

    this.initialize = function(root, x, y, speed, direction, color, type) {
		this.speed = speed;
		this.direction = direction;

        this.node = CarFactory.makeCar(type,x, y, direction,color);
	    this.root.append(this.node);
    }

    this.destroy = function() {
        this.root.unregister(this);
    	this.node.removeSelf();
    }

    this.animate = function(t, dt) {
    	
        if (this.direction=="LEFT"){
    		this.node.x -= this.speed;
    		if((this.node.x + this.node.w)<10){
        		this.destroy();
        	}
    	} else {
    		this.node.x += this.speed;
    		if((this.node.x)>WIDTH){
        		this.destroy();
        	}
    	}
        
    }

    this.root = root;
    this.speed = speed;
    this.initialize(root, x, y, speed, direction, color, type);
}


CarDispatcher = function(root, x, y, speed, direction,type) {
	this.speed = CAR_DEFAULT_SPEED;
	this.space_between_cars = 150;
	this.carColor = [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255),1.0];

    this.initialize = function(root, x, y, speed, direction,type) {
		this.speed = Math.floor(Math.random()*8+1);	
		this.space_between_cars = Math.random()*50+180;
		this.y = y;
		this.x = x;
		this.direction = direction; // LEFT or RIGHT
		this.max_cars = 3;
		this.cars = new Array();
    }

    this.new_car = function() {
	    var car = new Car(this, this.x, this.y, this.speed, this.direction, this.carColor,type);
	    this.cars.push(car);
	    this.num_cars = this.cars.length;
    }

	this.append = function(obj){
		this.root.append(obj);
	}

	this.unregister = function(car){
		this.cars.deleteFirst(car);
	}
	
	this.destroy = function(){
    	for(var i=0;i<this.cars.length;i++){
			this.cars[i].node.removeSelf();
		}
	}
	
    this.animate = function(t, dt) {
    	for(var i=0;i<this.cars.length;i++){
    		this.cars[i].animate(t, dt);
    	}

    	// If there's no cars, add one
    	if (this.cars.length==0){
    		this.new_car();
    	}
    	
		// if the cur number of cars isn't the max, see if we're ready to add one:
    	if(this.cars.length!=this.max_cars){
			
    		// get the last car that was added
    		var last_car = this.cars[this.cars.length-1];
    		
    		// If cars are moving to the left, and the top right corner of the car is more than the required space between cars away from the right side of canvas,
    		// then add another car
			if (this.direction=="LEFT" && last_car.node.x+last_car.node.w < (WIDTH-this.space_between_cars)){
    			this.new_car();
    			
    		// opposite of above condition, for cars moving to the right.  If there is enough spacing add another car
    		} else if (this.direction=="RIGHT" && last_car.node.x > this.space_between_cars){
    			this.new_car();
    		}
        }
        
    }

    this.root = root;
    this.initialize(root, x, y, speed, direction,type);
}

FrogReceiver = function(root,x,y,w,h){
	isEmpty: true;
	
	this.initialize = function(x,y,w,h) {
		this.isEmpty=true;
		
		this.node =  new Path([
	      ['moveTo', [x, y]],
	      ['lineTo', [x, y-h]],
	      ['lineTo', [x+w,y-h]],
	      ['lineTo', [x+w,y]],
	      ['bezierCurveTo', [x+w,y-h, x,y-h, x,y]],
	    ], {
	    	//stroke: '#fff',
      		fill: '#996600'
	    });
	    
	    this.x = x;
	    this.y = y;
	    this.w = w;
	    this.h = h;

		this.root.append(this.node);
    }

    this.holdFrog = function(frog){
    	this.isEmpty=false;
		this.frog = frog;
        
        // remove the frog from the canvas;
        this.frog.destroy();

        var x = this.x;
        var y = this.y;
        var xPart = this.w/10;
        var yPart = this.h/6;
        
        this.star =  new Path([
            ['moveTo', [x+5*xPart, y]],
            ['lineTo', [x+xPart, y]],
            ['lineTo', [x+3*xPart, y-yPart]],
            ['lineTo', [x+2*xPart, y-4*yPart]],
            ['lineTo', [x+4*xPart, y-3*yPart]],
            ['lineTo', [x+5*xPart, y-5*yPart]],
            ['lineTo', [x+6*xPart, y-3*yPart]],
            ['lineTo', [x+8*xPart, y-4*yPart]],
            ['lineTo', [x+7*xPart, y-yPart]],
            ['lineTo', [x+9*xPart, y]],
            ['lineTo', [x+5*xPart, y]]
        ], {
            fill: '#cccc00'
        });
    	
		this.node.fill = "#663300";
        this.root.append(this.star);
    }
	
	this.destroy = function(){
		if(this.frog){
			this.frog.destroy();
		}
		if(this.star){
			this.star.removeSelf();
		}
		this.node.removeSelf();
	}
	
    this.root = root;
    this.initialize(x,y,w,h);
}


Scoreboard = function(root){
	score: 0;
	lives: 5;
	level: 1;
	
	this.initialize = function(root){
		this.score = 0;
		this.lives = 5;
		this.level = 1;
		
		this.scoreDiv = document.getElementById("score");
		this.livesDiv = document.getElementById("lives");
		this.levelDiv = document.getElementById("level");
	}
	
	this.scoreSafeFrog = function(){
		this.score += POINTS_FOR_SAFE_FROG;
		this.updateStats();
	}

	this.scoreKilledFrog = function(){
		this.lives -= 1;
		if (this.lives==0){
			this.updateStats();
			this.root.endGame();
		}
		this.updateStats();
	}

	this.scoreFinishedLevel = function(){
		this.score += POINTS_FOR_SAFE_FROG;
		this.score += POINTS_FOR_CLEARED_LEVEL;
		this.level += 1;
	}

	this.updateStats = function(){
		this.scoreDiv.innerHTML = this.score + "pts";
		this.livesDiv.innerHTML = "x" + this.lives;
		this.levelDiv.innerHTML = "Level: " + this.level;
	}

	this.sendFinalScore = function(){
		if (this.lives!=0 && this.root.user){
			// only save the score if we're out of lives...otherwise game isn't over
			return;
		}
		
		ajaxData = {
			score: this.score,
			user_id :this.root.user.id,
			first_name: this.root.user.first_name,
			last_name: this.root.user.last_name
		}
			
		$.ajax({
			type:'POST',
			url: '/frogger/api/score/',
			data: ajaxData,
			error: function(XMLHttpRequest, textStatus, errorThrown){
						alert(errorThrown);
			}
		})	
	}

	this.root = root;
	this.initialize(root);
}


FroggerGame = Klass(CanvasNode, {
	paused: false,

    initialize : function(canvasElem) {
        CanvasNode.initialize.call(this);
        this.canvas = new Canvas(canvasElem);
        this.canvas.frameDuration = 35;
        this.canvas.append(this);
        this.canvas.fixedTimestep = true;
        this.canvas.clear = false;

		// setup the background
		this.setupBg();
		this.setupMessage();
		
		this.user = null; // Put fbUser here
		
		// Add the scoreboard
		this.scoreboard = new Scoreboard(this);
		
		// number of frogs + targets at the top for frogs to reach
		this.numFrogs = NUM_FROG_RECEIVERS;
		
		// setup the mapping for catching key presses
        this.keys = { "Up" : 0, "Down" : 0, "Left" : 0, "Right" : 0, "Ctrl" : 0 };

		// show the get ready message while we start things...:
		this.showMessage("Get Ready...",1000);
		
		// Initialize a new game
        this.startGame();
    },
    
    setupBg : function() {
        this.bg = new Rectangle(WIDTH, HEIGHT);
        this.bg.fill = GAME_BG_COLOR;
        this.bg.zIndex = -1000;
        this.append(this.bg);

		var middleGrass = new Rectangle(WIDTH,50);
		middleGrass.fill = new Gradient({ endX:0, endY:50, colorStops:[[1, "#003300"], [0.5, "#115500"], [0,"#003300"]] });
		middleGrass.y = FROG_RECEIVER_TOTAL_HEIGHT + 180;
		this.append(middleGrass);

		var bottomGrass = new Rectangle(WIDTH,80);
		bottomGrass.fill = new Gradient({ endX:0, endY:80, colorStops:[[1, "#339900"], [0, "#003300"]]});
		bottomGrass.y = FROG_RECEIVER_TOTAL_HEIGHT + 360;
		this.append(bottomGrass);
    },

	setupMessage : function() {
		// Setup the basic message box we'll use for telling the user stuff
		this.message = document.getElementById("message");
		this.message.style.top = (FROG_RECEIVER_TOTAL_HEIGHT + 225) + "px";
	    this.message.style.left = WINDOW_WIDTH/2-150 + "px";
	},
	
	showMessage : function(message,duration){
		this.message.innerHTML = message;
		this.message.style.display = "block";
		var context = this;
		setTimeout(function(){
			var msg = document.getElementById("message");
			msg.style.display = "none";
		},duration)
	},
    
	startGame: function() {
		this.addNewFrog();
		
		this.carDispatchers = [];
		this.frogReceivers = [];
		this.frogsLeft = this.numFrogs;

		// Add The frog receivers at the top:
		for (var f=0,ff=this.numFrogs;f<ff;f++){
			this.frogReceivers.push(new FrogReceiver(this,
											(WIDTH/this.numFrogs)*f, 
											FROG_RECEIVER_HEIGHT, 
											(WIDTH/this.numFrogs),  
											FROG_RECEIVER_HEIGHT)); 
		}
		
		
		// Instantiate the Car Dispatchers on top (not actually drawn on canvas, just placeholders where the cars come from)
		this.carDispatchers.push(new CarDispatcher(this, WIDTH, FROG_RECEIVER_TOTAL_HEIGHT , RACECAR_SPEED, "LEFT","RACECAR"));
		this.carDispatchers.push(new CarDispatcher(this, WIDTH, FROG_RECEIVER_TOTAL_HEIGHT + 60,TRUCK_SPEED, "LEFT","TRUCK"));
		this.carDispatchers.push(new CarDispatcher(this, WIDTH, FROG_RECEIVER_TOTAL_HEIGHT + 120,PLAIN_CAR_SPEED, "LEFT","PLAINCAR"));
		
		// Instantiate the Car Dispatchers (not actually drawn on canvas, just placeholders where the cars come from)
		this.carDispatchers.push(new CarDispatcher(this, -100, FROG_RECEIVER_TOTAL_HEIGHT + 240,TRUCK_SPEED, "RIGHT","TRUCK"));
		this.carDispatchers.push(new CarDispatcher(this, -100, FROG_RECEIVER_TOTAL_HEIGHT + 300,RACECAR_SPEED, "RIGHT","RACECAR"));
		
		// Start the animation
        this.addFrameListener(this.animate);
	},

	cleanUpCanvas : function() {
    	for(var i=0;i<this.carDispatchers.length;i++){
			this.carDispatchers[i].destroy();
		}
		for(var i=0;i<this.frogReceivers.length;i++){
			this.frogReceivers[i].destroy();
		}
	},

	getUser: function(){
		var context = this;
		FB.api('/me', function(response) {
		 	$("#fbLogin").hide();
		 	context.user = response;
			context.scoreboard.sendFinalScore();
		});
	},
	
    endGame : function() {
		var context = this;
		
		this.showMessage("GAME OVER!",5000);
		
		FB.getLoginStatus(function(response){
			if(response.session){
				context.getUser();
			} else {
				var loginDiv = document.getElementById("fbLogin");
				loginDiv.style.top = (WINDOW_HEIGHT/2-170) + "px";
			 	loginDiv.style.left = WINDOW_WIDTH/2-150 + "px";
				loginDiv.style.display = "block";	
			}
		});
		
		this.removeFrameListener(this.animate);
		this.cleanUpCanvas();
		this.canvas.removeAllChildren();
		
		// Show link to start new game:
		//document.getElementById("startOver").style.display = "block";
    },

	nextLevel : function(){
		// Score the Completed Level
		this.scoreboard.scoreFinishedLevel();

		// stop the animation madness
		this.removeFrameListener(this.animate);
		
		// clear the canvas
		this.cleanUpCanvas();

		// Restart the Game and the animation
		this.startGame();
	},
	
	recordDeadFrog : function(){
		this.frog.runOver();
		this.scoreboard.scoreKilledFrog();
		if (this.scoreboard.lives!=0){
			this.showMessage(FROG_DEATH_MESSAGES[Math.floor(Math.random()*FROG_DEATH_MESSAGES.length)],1000);
			this.addNewFrog();
		}
	},

	recordSafeFrog : function(){
		this.scoreboard.scoreSafeFrog();
		this.frogsLeft -= 1;
		var context = this;
		if (this.frogsLeft==0){
			this.showMessage("Nice Job...Starting Level " + (this.scoreboard.level+1),1000);
			this.nextLevel();
		} else {
			this.showMessage(FROG_SAFE_MESSAGES[Math.floor(Math.random()*FROG_SAFE_MESSAGES.length)],1000);
			this.addNewFrog();
		}
	},

	addNewFrog : function(){
		var context = this;
		this.paused = true;
		setTimeout(function(){
			context.frog = new Frog(context,HEIGHT-10,WIDTH/2);
			context.scoreboard.updateStats();
			context.paused = false;
		},1000)
	},

    key : function(state, name) {
    	this.keys[name] = state;
    },
    
    animate: function(t, dt){
		if (this.paused){
			return false;
		}
		
		this.frog.animate(t, dt);

    	for(var i=0;i<this.carDispatchers.length;i++){
    		this.carDispatchers[i].animate(t, dt);
    		
    		// Check if the frog got hit by any of the cars
    		var cars = this.carDispatchers[i].cars;
    		for(var c=0,cc=cars.length;c<cc;c++){
    			if (NodesCollided(cars[c].node,this.frog.node)){
    				this.recordDeadFrog();
    				break;
    			}
    		}
    	}
    	
    	// The if doesn't event get entered unless the frog breaks the y-axis plane of the receivers at the top
		if (this.frog.node.y<FROG_RECEIVER_HEIGHT){
			for(var r=0,rr=this.frogReceivers.length;r<rr;r++){
				if(NodesCollided(this.frog.node,this.frogReceivers[r])){
					if (this.frogReceivers[r].isEmpty){
						this.frogReceivers[r].holdFrog(this.frog);
						this.recordSafeFrog();
						break;
					} else {
						this.recordDeadFrog();
						break;
					}
				}
			}
		}
		

	}

})

init = function() {
    var c = E.canvas(WIDTH, HEIGHT)
    var d = E('div', { id: 'screen' })
    
	// remove the canvas container from the DOM, so we can insert a new one if they play again
	var screenDiv = document.getElementById("screen");
	if (screenDiv) document.body.removeChild(screenDiv);
	
	//document.getElementById("startOver").style.display = "none";

    d.appendChild(c)
    document.body.appendChild(d) 
    
    FG = new FroggerGame(c)

    if (document.addEventListener)
    {
        document.addEventListener("keypress", Ignore,  false)
        document.addEventListener("keydown",  KeyDown, false)
        document.addEventListener("keyup",    KeyUp,   false)
    }
    else if (document.attachEvent)
    {
        document.attachEvent("onkeypress", Ignore)
        document.attachEvent("onkeydown",  KeyDown)
        document.attachEvent("onkeyup",    KeyUp)
    }
    else
    {
        document.onkeypress = Ignore
        document.onkeydown  = KeyDown
        document.onkeyup    = KeyUp;
    }

    function Ignore(e) {
        if (e.preventDefault) e.preventDefault()
        if (e.stopPropagation) e.stopPropagation()
    }
    function KeyUp(e) {
        OnKey(0,e)
    }
    function KeyDown(e) {
        OnKey(1,e)
    }
    
    function OnKey(state, e)
    {
        if (e.preventDefault) e.preventDefault()
        if (e.stopPropagation) e.stopPropagation()
        var KeyID = (window.event) ? event.keyCode : e.keyCode;
        switch(KeyID)
        {
            case 37:
                FG.key(state,"Left")
                break;
            case 38:
                FG.key(state,"Up")
                break;
            case 39:
                FG.key(state,"Right")
                break;
            case 40:
                FG.key(state,"Down")
                break;
        }
    }
}


