// Sidebar functions
Arena = function() {
	return {
		socket: io.connect(window.location.hostname+"/arena"), 
		//players : [], 
		//invaders : [], 
		//defender : false,
		init: function(){
			var self = this;
			
			//events
			socket.on('update-score', function( scores ) {
				self.hud.update( scores );
			});
			
			socket.on('move', function( user ) {
				//console.log( user );
				self.update( user );
			});
			
			socket.on('left-game', function(name) {
				console.log("Left: " + name);
				for(i in players){
					var player = players[i];
					if( player.name == name ) delete players[i];
				}
				//var index = INVADERS.indexOf(user); // Find the index
				//INVADERS.splice(index,1);
				//delete INVADERS[index];	
			});
			
			// this calls is used to normalize the local data with the server data
			socket.on('reset-players', function(players){
				// delete old data
				invaders.reset( players );
			});
			
			socket.on('dead-invader', function( user ) {
				//console.log( user );
				invaders.remove( user );
			});
			
			// create hud
			this.hud.init();

		}, 
		add: function( user ){
			
		}, 
		remove: function( user ){
			
		}, 
		update: function( user ){
			//console.log(user);
			// don't update if it's the player
			if (user.name == player.name) return;
			// if defender update
			if (user.name == neo.name){
				neo.pos = user.pos;
			}
			invaders.move( user );
			
		}, 
		getAll: function(){
			
		}, 
		set: function(){
			
		}, 
		hud: {
			init: function(){
				// create containers
				$('<div/>', { id: 'hud' }).appendTo('body');
				$('<p/>', { id: 'current-score', html: 0 }).appendTo('#hud');
				$('<p/>', { id: 'top-score', html: 0  }).appendTo('#hud');
			}, 
			update: function( scores ){
				$("#hud #current-score").html( scores.current );
				$("#hud #top-score").html( scores.top );
			}
		}
	}
	
}


/*
Arena = Klass(CanvasNode, {
	paused: false,
	opponents: null,
	
    initialize : function(canvasElem) {
	
        CanvasNode.initialize.call(this);
        this.canvas = new Canvas(canvasElem);
        this.canvas.frameDuration = 30;
        this.canvas.append(this);
        this.canvas.fixedTimestep = true;
        this.canvas.clear = false;

		// setup the background
		this.setupBg();
		//this.setupMessage();
		
		this.user = null; // Put fbUser here
		this.player = null;
		
		this.opponents = new Opponents(this);
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
		this.display();
    },

	display : function(json){
		//var CAKECanvas = new Canvas(document.body, WINDOW_WIDTH, WINDOW_HEIGHT);
		
		// enterLobby();
		// putt vconditions to enter arena
		this.enterArena();
		
		
		invader.addFrameListener(
			function(t, dt) 
			{
				this.scale = Math.sin(t / 1000);
			}
		);
		
		
		this.addFrameListener(this.update);
		
	}, 
	
    key : function(state, name) {
		this.keys[name] = state;
    },
	
    update: function(t, dt){
		if (this.paused){
			return false;
		}
		// animate crowd 
		
		// animate defender
		
		// animate player
		
		
		// clear canvas
		if(this.opponents != null){
			this.opponents.animate(t, dt);
		}
		if(this.player != null){
			this.player.animate(t, dt);
		}
    },
	
    setupBg : function() {
        this.bg = new Rectangle(WINDOW_WIDTH, WINDOW_HEIGHT);
        this.bg.fill = BG_COLOR;
        this.bg.zIndex = -1000;
        this.append(this.bg);
	}, 

      gameOver : function() {
        this.enterLobby()
      },

      enterArena : function() {
        //this.levelIndex++
        //var level = this.levels[this.levelIndex % this.levels.length]
        //this.changeLevel(level)
		// create a new player
		//this.player = PLAYER = new Player(this,WINDOW_WIDTH/2,WINDOW_HEIGHT/2);
		this.player = PLAYER = new Player(this, 0, 0);
		
      },

      enterLobby : function() {

      },


      changeLevel : function(level) {
        Player.waypoints = {}
        Player.targets = {}
        Player.selection = []
        if (this.level) this.level.removeSelf()
        if (level) {
          this.level = new level()
          this.append(this.level)
        }
      },

      fastExplosions : false,
      setFastExplosions : function(fe) {
        this.fastExplosions = fe
        Explosion.fastExplosions = fe
      },

      noExplosions : false,
      setNoExplosions : function(fe) {
        this.noExplosions = fe
        Explosion.prototype.visible = !fe
      },

      fastBeams : false,
      setFastBeams : function(fb) {
        this.fastBeams = fb
        Beam.fastBeams = fb
      },

      speed : 1.0,
      setSpeed : function(s) {
        this.speed = s
        this.canvas.speed = s
        this.level.bg.fillOpacity =
          this.motionBlur ? 1-Math.pow(1-this.level.bgOpacity, this.speed) : 1
      },

      motionBlur : true,
      setMotionBlur : function(s) {
        this.motionBlur = s
        this.level.bg.fillOpacity =
          this.motionBlur ? 1-Math.pow(1-this.level.bgOpacity, this.speed) : 1
      },

      setupEtc : function() {
        this.canvas.updateFps = true
        var debug = E('div')
        var t0 = -1
        var frames = []
        var fc = E.canvas(200, 10)
        var fpsE = T('')
        var elapsedE = T('')
        var realFpsE = T('')
        var elapsedRealE = T('')
        debug.append(fpsE, ' fps (', elapsedE, ' ms to draw scene)', E('br'),
          realFpsE, ' real fps (', elapsedRealE, ' ms between frames)',
          E('br'), fc)
        var fctx = fc.getContext('2d')
        fctx.globalCompositeOperation = 'copy'
        fctx.fillStyle = '#828292'
        this.canvas.addFrameListener(function(t) {
          if (this.updateFps) {
            fctx.drawImage(fc, -1, 0)
            fctx.clearRect(199, 0, 1, 10)
            fctx.fillRect(199, 0, 1, Math.min(100, this.currentRealFps) / 3.3)
            if (Math.floor(t / 500) != t0) {
              t0 = Math.floor(t / 500)
              var fps = (Math.floor(this.fps * 10)/10)
              var elapsed = Math.floor(1000 / this.fps)
              var realFps = (Math.floor(this.realFps * 10)/10)
              var elapsedReal = Math.floor(1000 / this.realFps)
              fpsE.textContent = fps
              elapsedE.textContent = elapsed
              realFpsE.textContent = realFps
              elapsedRealE.textContent = elapsedReal
            }
          }
        })
        this.canvasControlPanel = new GuiConfig({
          object : this.canvas,
          container : $('debug'),
          title : 'Debug',
          controls : [
            'updateFps',
            'playOnlyWhenFocused',
            'drawBoundingBoxes',
            ['useMockContext', 'boolean', {title: "Turn off drawing. Useful for benchmarking the AI."}]
          ]
        })
        this.canvasControlPanel.show()
        this.controlPanel = new GuiConfig({
          object : this,
          container : $('debug'),
          title : 'Graphics',
          controls : [
            ['speed', '0.1..1.0'],
            'motionBlur',
            'fastExplosions',
            'noExplosions',
            'fastBeams'
          ]
        })
        this.controlPanel.show()
        this.playerControlPanel = new GuiConfig({
          object : Player,
          container : $('debug'),
          title : 'Support AI',
          controls : [
            ['useMovementAI', 'boolean', {title:'Use movement AI'}],
            ['useTargettingAI', 'boolean', {title:'Use targetting AI'}]
          ]
        })
        this.playerControlPanel.show()
        $('debug').appendChild(debug)
      }
});
*/