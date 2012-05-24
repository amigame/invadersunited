WINDOW_WIDTH 		= window.innerWidth;
WINDOW_HEIGHT 		= window.innerHeight;
BG_COLOR = "#FFF";
//SPRITE_SCALE = 4;
//SPRITE_DEFAULT_WIDTH = 12;
//SPRITE_DEFAULT_HEIGHT = 8;
//SPRITE_WIDTH = SPRITE_SCALE*SPRITE_DEFAULT_WIDTH;
//SPRITE_HEIGHT = SPRITE_SCALE*SPRITE_DEFAULT_HEIGHT;
//SPRITE_SIZE = [SPRITE_SCALE * 0, SPRITE_SCALE * 0, SPRITE_SCALE * SPRITE_WIDTH, SPRITE_SCALE * SPRITE_HEIGHT]
DRAFT = 5;


PRELOAD = [ "/assets/svg/Defender.svg",
			"/assets/svg/Dorky1.svg",
			"/assets/svg/Dorky2.svg",
			"/assets/svg/Evily1.svg",
			"/assets/svg/Evily2.svg",
			"/assets/svg/Scully1.svg",
			"/assets/svg/Scully2.svg" ]


SCREEN = { 
	framerate 	: 24, 
	width 		: window.innerWidth, 
	height 		: window.innerHeight, 
	grid 		: { x: 16, y: 12 }, 
	background 	: "#FFFFFF", 
	update		: function(){ 
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		
		SPRITE.update();
	}
}

SPRITE = { 
	ratio 		: SCREEN["grid"].x / SCREEN["grid"].y,
	scale 		: 1,
	width 		: 48, 
	height  	: 32,
	padding  	: { x: 0, y: 0 },
	styles		: {
		player: {
			color:  0xFF00CC00, 
			stroke: 255
		}, 
		opponent: {
			color:  0x00FFFFFF, 
			stroke: 100
		}, 
		defender: {
			color:  0xFF0000CC, 
			stroke: 0
		}, 
		invader: {
			color:  0xFFCC0000, 
			stroke: 255
		}, 
		
	}, 
	update: function(){
		// game has a definite 16x12 grid (4/3 aspect ratio)
		var cell_width  = window.innerWidth / SCREEN["grid"].x;
		var cell_height = window.innerHeight / SCREEN["grid"].y;
		
		// calculate sprite size based on 
		// (replace with SCREEN.width...)
		var ratio = cell_width / cell_height;
		
		if( ratio > this.ratio ){
			// widescreen...
			// - x padding  required
			this.height = cell_height;
			this.width =  this.height * this.ratio;
			this.padding.x = (cell_width - this.width) / 2;
			this.padding.y = 0;
		} else {
			// - y padding  required
			this.width = cell_width;
			this.height =  this.width * (1/this.ratio);
			this.padding.x = 0;
			this.padding.y = (cell_height - this.height) / 2;
		}
		
	}
}

SPRITES = {};

ANIMATION_SPEED = 0.8;

SOCKETS = false;

CONFIG = {
	"geek-o-vision": false
}

//
SCREEN.update();
window.addEventListener("resize", SCREEN.update, false);
