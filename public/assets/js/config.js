WINDOW_WIDTH 		= window.innerWidth;
WINDOW_HEIGHT 		= window.innerHeight;
BG_COLOR = "#FFF";
SPRITE_SCALE = 4;
SPRITE_DEFAULT_WIDTH = 12;
SPRITE_DEFAULT_HEIGHT = 8;
SPRITE_WIDTH = SPRITE_SCALE*SPRITE_DEFAULT_WIDTH;
SPRITE_HEIGHT = SPRITE_SCALE*SPRITE_DEFAULT_HEIGHT;
SPRITE_SIZE = [SPRITE_SCALE * 0, SPRITE_SCALE * 0, SPRITE_SCALE * SPRITE_WIDTH, SPRITE_SCALE * SPRITE_HEIGHT]


PRELOAD = [ "/assets/svg/Defender.svg",
			"/assets/svg/Dorky1.svg",
			"/assets/svg/Dorky2.svg",
			"/assets/svg/Evily1.svg",
			"/assets/svg/Evily2.svg",
			"/assets/svg/Scully1.svg",
			"/assets/svg/Scully2.svg" ]


SCREEN = { 
	framerate 	: 12, 
	width 		: window.innerWidth, 
	height 		: window.innerHeight, 
	background 	: "#FFF"
}

SPRITE = { 
	scale 		: 1,
	width 		: 48, 
	height  	: 32
}

SPRITES = {};

ANIMATION_SPEED = 0.8;

PLAYER = {
	x: 0,
	y: 0,
	active : false,
	color : "#0C0",
	speed : (SPRITE_WIDTH*SPRITE_SCALE)/2, 
	die : false,
};

SOCKETS = false;

OPPONENTS  = {
	color : "#CCC",	
};


DEFENDER  = {
	color : "#000",	
};

INVADERS = {};


var INPUT;

var ARENA = {}; 


