// Variables
require({ 
    baseUrl: "/assets/js/" 
	}[	"order!libs/jquery-1.6.4.min", 
		"order!libs/processing-1.3.0.min", 
		"order!libs/cake", 
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
		"order!logic/init", 
		"order!rooms/lobby", 
		"order!rooms/arena", 
		"order!config"
	], function () {
		
		$(document).ready(function(){
			var canvas = document.getElementById("arena");
			var iu = new Processing(canvas, init);
			// vector preloads
			iu.externals.sketch.options.preload = PRELOAD.join(",");

	});
});


// Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-16164477-4']);
_gaq.push(['_trackPageview']);
(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
