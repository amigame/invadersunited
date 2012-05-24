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
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		
		SPRITE.update();
	}
});

}