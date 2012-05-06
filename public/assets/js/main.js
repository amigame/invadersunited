// Globals
// - objects
var game, player, invaders, neo;
// - rooms
var login, lobby, arena;
// - data
var INPUT, PLAYER, INVADERS;

// Dependencies
require({ 
    baseUrl: "/assets/js/" 
	}, [	
		"order!libs/jquery-1.6.4.min", 
		"order!libs/processing-1.3.6.min", 
		"order!libs/md5", 
		"order!libs/jquery.noty", 
		"order!misc/helpers", 
		"order!misc/tracking", 
		"order!config", 
		"order!objects/sprite", 
		"order!objects/bullet", 
		"order!objects/user", 
		"order!objects/invader", 
		"order!objects/defender", 
		"order!objects/explosion", 
		"order!logic/sockets", 
		"order!logic/input", 
		"order!logic/player", 
		"order!logic/invaders", 
		"order!logic/game", 
		"order!rooms/login", 
		"order!rooms/lobby", 
		"order!rooms/arena"
	], function () {
		
		$(document).ready(function(){
			
			// setup globals
			game = new Game();
			player = new Player();
			invaders = new Invaders();
			//neo = new Defender();
			login = new Login();
			lobby = new Lobby();
			arena = new Arena();
			
			INVADERS = [];
			
			// initialise game
			game.init();
			
			// initiate canvas rendering
			var canvas = document.getElementById("arena");
			var iu = new Processing(canvas, game.render);
			
			// vector preloads
			iu.externals.sketch.options.preload = PRELOAD.join(",");
			
	
		});
});
