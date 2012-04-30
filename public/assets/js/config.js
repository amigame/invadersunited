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
	background 	: "#FFFFFF"
}

SPRITE = { 
	scale 		: 1,
	width 		: 48, 
	height  	: 32
}

SPRITES = {};

ANIMATION_SPEED = 0.8;

USER = function() {
	
	return { 
		name: false,
		pos: { x: -1, y: -1},
		active : false,
		color : "#0C0",
		speed : (SPRITE_WIDTH*SPRITE_SCALE)/2, 
		die : false,
		icon : encodeURIComponent("http://invadersunited.com/apple-touch-icon-114x114-precomposed.png")
	};
}


SOCKETS = false;
/*
OPPONENTS  = {
	color : "#CCC",	
};

*/
DEFENDER  = {
	color : "#000",	
};

/*
var ARENA = {}; 

*/

// GLOBALS
// Namespacing 
// setup data containers
PLAYER = new USER();
INVADERS = [];
var INPUT;

var socket = io.connect(window.location.hostname); 
var arena = io.connect(window.location.hostname+"/arena");
var lobby = io.connect(window.location.hostname+"/lobby");
var chat = io.connect(window.location.hostname+"/chat");

var player, invaders, neo;