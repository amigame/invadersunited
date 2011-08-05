// Variables

var socket = io.connect(window.location.hostname); 

socket.on('connect', function(){ 
	$("#chat").submit(function(e) {
	  e.preventDefault();
	  e.stopPropagation();
	  socket.send(JSON.stringify({msg:$("#msg").val()}));
	  $("#msg").val("");
	  return false;
	});
});

socket.on('message', function(data) {
	$("#response").append("<li>" + data + "</li>");
});

$(document).ready(function(){
	init();
		
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
