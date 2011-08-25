init = function() {
	
	var c = E.canvas(WINDOW_WIDTH, WINDOW_HEIGHT);
	var s = document.getElementById("stage");
	s.appendChild(c);
    
	//IU = new InvadersUnited(c);
    ARENA = new Arena(c);
	
	// get data
	//require(['/data/animations/invaders.json'], function(data) {
	//$.getJSON('/data/animations/invaders.json', function(data) {
	//ARENA.display();
		//interactions();
	//});

}