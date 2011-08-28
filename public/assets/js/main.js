// Variables
require(["order!/assets/js/libs/json.js", "order!/assets/js/libs/cake.js", "order!/assets/js/sockets.js", "order!/assets/js/config.js", "order!/assets/js/lobby.js", "order!/assets/js/ai.js", "order!/assets/js/sprites.js", "order!/assets/js/bullet.js", "order!/assets/js/explosion.js", "order!/assets/js/input.js", "order!/assets/js/invader.js", "order!/assets/js/defender.js", "order!/assets/js/player.js", "order!/assets/js/opponents.js", "order!/assets/js/init.js"], function () {
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
