WINDOW_WIDTH 		= window.innerWidth;
WINDOW_HEIGHT 		= window.innerHeight;
BG_COLOR = "#FFF";
SPRITE_SCALE = 4;
SPRITE_DEFAULT_WIDTH = 12;
SPRITE_DEFAULT_HEIGHT = 8;
SPRITE_WIDTH = SPRITE_SCALE*SPRITE_DEFAULT_WIDTH;
SPRITE_HEIGHT = SPRITE_SCALE*SPRITE_DEFAULT_HEIGHT;
SPRITE_SIZE = [SPRITE_SCALE * 0, SPRITE_SCALE * 0, SPRITE_SCALE * SPRITE_WIDTH, SPRITE_SCALE * SPRITE_HEIGHT]
DRAFT = 4;


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
	background 	: "#FFFFFF"
}

SPRITE = { 
	scale 		: 1,
	width 		: 48, 
	height  	: 32,
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
		
	}
}

SPRITES = {};

ANIMATION_SPEED = 0.8;

SOCKETS = false;
