// Variables
require(["order!/assets/js/libs/json.js", "order!/assets/js/libs/cake.js", "order!/assets/js/sockets.js", "order!/assets/js/config.js", "order!/assets/js/lobby.js", "order!/assets/js/arena.js", "order!/assets/js/input.js", "order!/assets/js/invader.js", "order!/assets/js/defender.js", "order!/assets/js/player.js", "order!/assets/js/opponents.js", "order!/assets/js/init.js"], function () {
    //This callback is called after the three scripts finish loading.
	$(document).ready(function(){
		init();
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
