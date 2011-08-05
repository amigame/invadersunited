WINDOW_WIDTH 		= window.innerWidth;
WINDOW_HEIGHT 		= window.innerHeight;

SPRITE_SCALE = 40;
SPRITE_SIZE = [SPRITE_SCALE * 0, SPRITE_SCALE * 0, SPRITE_SCALE * 12, SPRITE_SCALE * 8]
SPRITE_WIDTH = 12;
SPRITE_HEIGHT = 8;

BG_COLOR = "#FFF";

ANIMATION_SPEED = 0.8;

NEO_COLOR = "#0C0";
NEO_SPEED = 1;

var IU; 

init = function() {
	
	var c = E.canvas(WINDOW_WIDTH, WINDOW_HEIGHT);
    document.body.appendChild(c);
    
    IU = new InvadersUnited(c);

	$.getJSON('./data/animations/invaders.json', function(data) {
		IU.display(data);
		interactions();
	});

}


InvadersUnited = Klass(CanvasNode, {
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
		//this.setupMessage();
		
		this.user = null; // Put fbUser here
		//console.log("init!");
		// Add the scoreboard
		//this.scoreboard = new Scoreboard(this);
		
		// number of frogs + targets at the top for frogs to reach
		//this.numFrogs = NUM_FROG_RECEIVERS;
		
		// setup the mapping for catching key presses
        this.keys = { "Up" : 0, "Down" : 0, "Left" : 0, "Right" : 0, "Ctrl" : 0 };

		// Initialize a new game
        //this.startGame();
		
		// Start the animation
    },

	display : function(json){
		//var CAKECanvas = new Canvas(document.body, WINDOW_WIDTH, WINDOW_HEIGHT);
			
		var animations = new Array();

		animations['invaders'] = new Array();

		$.each(json, function(series, invader) { 
			animations['invaders'][series] = new Array();

			$.each(invader[0], function(num, sprite) { 

				animations['invaders'][series][num] = new Array();
				animations['invaders'][series][num].push(['fillRect', SPRITE_SIZE]);
				
				$.each(sprite, function(set, coords) { 
					var array = [SPRITE_SCALE * coords.x, SPRITE_SCALE * coords.y, SPRITE_SCALE * coords.w, SPRITE_SCALE * coords.h];
					animations['invaders'][series][num].push(['clearRect', array]);
				});
			});
		});
				
		var randInv = Math.max( Math.round( Math.random() * (animations['invaders'].length-1)), 1);
		this.neo = new Neo(this,WINDOW_HEIGHT/2,WINDOW_WIDTH/2, animations['invaders'][randInv]);
		/*
		invader.addFrameListener(
			function(t, dt) 
			{
				this.scale = Math.sin(t / 1000);
			}
		);
		*/
		
		
        this.addFrameListener(this.animate);
		
	}, 
	
    key : function(state, name) {
    	this.keys[name] = state;
    },
	
    animate: function(t, dt){
		if (this.paused){
			return false;
		}
		// clear canvas
		this.neo.animate(t, dt);
    },
	
    setupBg : function() {
        this.bg = new Rectangle(WINDOW_WIDTH, WINDOW_HEIGHT);
        this.bg.fill = BG_COLOR;
        this.bg.zIndex = -1000;
        this.append(this.bg);
	}, 
	
});

Neo = function(root, x, y, animation) {

	this.isAlive = true;
    this.speed = NEO_SPEED;
    this.initial_points = 0;
    this.points = 0;
	this.animatePosition = 1;
	this.animation = animation;
	
    this.initialize = function(root, x, y) {

		var animation = this.animation;
		this.sprite = new Path(animation[1],{
				fill: NEO_COLOR,
				fillOpacity:1
			});
        //this.sprite = new Rectangle(SPRITE_WIDTH, SPRITE_HEIGHT);
        this.sprite.w = SPRITE_WIDTH/2;
        this.sprite.h = SPRITE_HEIGHT/2;
        //this.sprite.x = 0;
        this.sprite.x = x - (SPRITE_WIDTH/2);
        this.sprite.y = 0;
        //this.sprite.y = y - (SPRITE_HEIGHT/2);        
        this.sprite.zIndex = 1;

        // Reset the x/y since the position is relative to the wrapper:
        x = 0;
        y = SPRITE_HEIGHT;
		
		var current = 1;
		this.sprite.every(1000*ANIMATION_SPEED, 
			function( ) 
			{
				if( current == 1) { 
					this.compiled = animation[2];
					current = 2;
				} else {
					this.compiled = animation[1];
					current = 1;
				}
			},
			true
		);
		
		root.append(this.sprite);
		
	};

	this.animate = function(t, dt){
        if (this.root.keys["Left"]==1){
        	this.moveLeft();
        } else if (this.root.keys["Right"]==1){
        	this.moveRight();
        }
	}
	
	this.moveLeft = function() {
		if (this.sprite.x!=0){
			this.sprite.x -= this.sprite.w*this.speed;
		}
	};
	
	this.moveRight = function() {
		if (this.sprite.x!=WINDOW_WIDTH){
			this.sprite.x += this.sprite.w*this.speed;
		}
	};
	
    this.root = root;
    this.initialize(root, x, y);
	
}



    Explosion = Klass(CanvasNode, {
      catchMouse : false,
      cursor : 'default',

      circleGradient : new Gradient({
        type : 'radial',
        endRadius : 15,
        colorStops : [
          [ 0.0, "rgba(190,105,90,1)" ],
          [ 0.25, "rgba(5,30,80,0.4)" ],
          [ 1, "rgba(10,0,40,0)" ]
        ]
      }),

      initialize : function(size) {
        CanvasNode.initialize.call(this)
        var main = new Circle(15)
        main.fill = this.circleGradient
        main.compositeOperation = 'lighter'
        this.zIndex = 10
        this.main = main
        this.append(main)
        this.size = size
        this.addFrameListener(this.blowup)
        this.after(500, this.removeSelf)
      },

      blowup : function(t, dt) {
        if (this.startTime == null)
          this.startTime = t
        var elapsed = Math.min(500, t - this.startTime)
        var fac = 0.48 * 0.004 * Math.PI
        this.main.scale = 1 + this.size *
                          (Explosion.fastExplosions ? 1 :
                                                      Math.tan(elapsed * fac))
        if (isNaN(this.main.scale)) this.main.scale = 60000
      }
    });