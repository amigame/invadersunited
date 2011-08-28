Invader = {

	frame : 1, 
	animation : null, 
	color : 0, 
	zIndex : 0, 
	
	initialize : function(json){
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
		
		var animation = this.animation = animations['invaders']['dorky'];
		
		this.sprite = new Path(animation[1],{
				fill: this.color,
				fillOpacity:1
			});
        //this.sprite = new Rectangle(SPRITE_WIDTH, SPRITE_HEIGHT);
        this.sprite.w = SPRITE_SCALE*SPRITE_WIDTH;
        this.sprite.h = SPRITE_SCALE*SPRITE_HEIGHT;
        
		this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.zIndex = this.zIndex;

        // Reset the x/y since the position is relative to the wrapper:
        //x = 0;
        //y = SPRITE_HEIGHT;
		
		this.sprite.every(1000*ANIMATION_SPEED, 
			function( ) 
			{
				if( this.frame == 1) { 
					this.compiled = animation[2];
					this.frame = 2;
				} else {
					this.compiled = animation[1];
					this.frame = 1;
				}
			},
			true
		);
		
		root.append(this.sprite);
		
		/*
		invader.addFrameListener(
			function(t, dt) 
			{
				this.scale = Math.sin(t / 1000);
			}
		);
		*/
		
		//this.addFrameListener(this.animate);
		
	},
	
	update : function(x, y){
		//console.log(y);
		this.sprite.x = x;
		this.sprite.y = y;
	}, 
	
	destroy : function(){
		//console.log(y);
		root.remove(this.sprite);
		delete this;
		//this.sprite.y = y;
	}
	
}