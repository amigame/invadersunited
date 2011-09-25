WINDOW_WIDTH 		= window.innerWidth;
WINDOW_HEIGHT 		= window.innerHeight;

SPRITE_SCALE = 4;
SPRITE_DEFAULT_WIDTH = 12;
SPRITE_DEFAULT_HEIGHT = 8;
SPRITE_WIDTH = SPRITE_SCALE*SPRITE_DEFAULT_WIDTH;
SPRITE_HEIGHT = SPRITE_SCALE*SPRITE_DEFAULT_HEIGHT;
SPRITE_SIZE = [SPRITE_SCALE * 0, SPRITE_SCALE * 0, SPRITE_SCALE * SPRITE_WIDTH, SPRITE_SCALE * SPRITE_HEIGHT]

BG_COLOR = "#FFF";

PRELOAD = [ "/assets/svg/Defender.svg",
			"/assets/svg/Dorky1.svg",
			"/assets/svg/Dorky2.svg",
			"/assets/svg/Evily1.svg",
			"/assets/svg/Evily2.svg",
			"/assets/svg/Scully1.svg",
			"/assets/svg/Scully2.svg" ]

SPRITES = {};
ANIMATION_SPEED = 0.8;

PLAYER = {
	x: 0,
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


Sprites = {

	root: null, 
	
	initialize : function(root){
		
		this.root = root; 
		
		defender = new Array(); 
		defender[0] = this.root.loadShape("/assets/svg/Defender.svg");
  		defender[1] = defender[0];
  		
		dorky = new Array(); 
		dorky[0] = this.root.loadShape("/assets/svg/Dorky1.svg");
  		dorky[1] = this.root.loadShape("/assets/svg/Dorky2.svg");
		
		evily = new Array(); 
		evily[0] = this.root.loadShape("/assets/svg/Evily1.svg");
  		evily[1] = this.root.loadShape("/assets/svg/Evily2.svg");
		
		scully = new Array(); 
		scully[0] = this.root.loadShape("/assets/svg/Scully1.svg");
  		scully[1] = this.root.loadShape("/assets/svg/Scully2.svg");
		
		// save as global variables for later use
		SPRITES['defender'] = defender;
  		SPRITES['dorky'] = dorky;
  		SPRITES['evily'] = evily;
  		SPRITES['scully'] = scully;
  		//dorky.disableStyle();
		
	},
	
	update : function(){
		
	}, 
	
	destroy : function(){
		
	}
	
}