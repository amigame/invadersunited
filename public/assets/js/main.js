
require({ 
    baseUrl: "/assets/js/" 
	}, [	
		"order!libs/jquery-1.6.4.min", 
		"order!libs/processing-1.3.0.min", 
		"order!libs/md5", 
		"order!misc/helpers", 
		"order!misc/tracking", 
		"order!config", 
		"order!objects/sprite", 
		"order!objects/bullet", 
		"order!objects/invader", 
		"order!objects/defender", 
		"order!objects/explosion", 
		"order!logic/sockets", 
		"order!logic/ai", 
		"order!logic/input", 
		"order!logic/player", 
		"order!logic/opponents", 
		"order!logic/game", 
		"order!rooms/lobby", 
		"order!rooms/arena"
	], function () {
		
		$(document).ready(function(){
			
			player = new Player();
			invaders = new Invaders();
			neo = new Defender();

			var canvas = document.getElementById("arena");
			var iu = new Processing(canvas, Game.render);
			
			// vector preloads
			iu.externals.sketch.options.preload = PRELOAD.join(",");
	
		});
});
