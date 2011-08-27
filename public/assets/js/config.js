WINDOW_WIDTH 		= window.innerWidth;
WINDOW_HEIGHT 		= window.innerHeight;

SPRITE_SCALE = 4;
SPRITE_DEFAULT_WIDTH = 12;
SPRITE_DEFAULT_HEIGHT = 8;
SPRITE_WIDTH = SPRITE_SCALE*SPRITE_DEFAULT_WIDTH;
SPRITE_HEIGHT = SPRITE_SCALE*SPRITE_DEFAULT_HEIGHT;
SPRITE_SIZE = [SPRITE_SCALE * 0, SPRITE_SCALE * 0, SPRITE_SCALE * SPRITE_WIDTH, SPRITE_SCALE * SPRITE_HEIGHT]

BG_COLOR = "#FFF";

ANIMATION_SPEED = 0.8;

PLAYER = {
	x: 0,
	active : false,
	color : "#0C0",
	speed : (SPRITE_WIDTH*SPRITE_SCALE)/2
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
