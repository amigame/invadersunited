// Variables
require(["order!http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js", "order!/socket.io/socket.io.js", "order!/assets/js/libs/processing-1.3.0.min.js", "order!/assets/js/libs/cake.js", "order!/assets/js/logic/sockets.js", "order!/assets/js/config.js", "order!/assets/js/rooms/lobby.js", "order!/assets/js/logic/ai.js", "order!/assets/js/objects/sprite.js", "order!/assets/js/objects/bullet.js", "order!/assets/js/objects/explosion.js", "order!/assets/js/logic/input.js", "order!/assets/js/objects/invader.js", "order!/assets/js/objects/defender.js", "order!/assets/js/logic/player.js", "order!/assets/js/logic/opponents.js", "order!/assets/js/logic/init.js", "order!/assets/js/sprites.js"], function () {
    //This callback is called after the three scripts finish loading.
	$(document).ready(function(){
		var canvas = document.getElementById("arena");
		var iu = new Processing(canvas, init);
		// preloads
		iu.externals.sketch.options.preload = "/assets/svg/Defender.svg,/assets/svg/Dorky1.svg,/assets/svg/Dorky2.svg/assets/svg/Evily1.svg,/assets/svg/Evily2.svg,/assets/svg/Scully1.svg,/assets/svg/Scully2.svg,";

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
