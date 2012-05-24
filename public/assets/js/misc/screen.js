/*
Screen = makeClass();
Screen.prototype.init = function(){
  //
};
*/

Screen = function(){ 

	return $.extend({}, CONFIG['screen'], { 
	init 		: function(){
		var self = this;
		//
		window.addEventListener("resize", self.update, false);

		return this;
	}, 
	update		: function(){ 
		SCREEN["width"] = window.innerWidth;
		SCREEN["height"] = window.innerHeight;
	}
});

}