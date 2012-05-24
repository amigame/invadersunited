/*
Sprite = makeClass();
Sprite.prototype.init = function(){
  //
};
*/

Sprite = function(){ 

	return $.extend({}, CONFIG['sprite'], { 
		ratio 		: CONFIG["screen"]["grid"].x / CONFIG["screen"]["grid"].y,
		width 		: 48, 
		height  	: 32,
		padding  	: { x: 0, y: 0 },
		init: function(){
			var self = this;
			this.update();
			window.addEventListener("resize", self.update, false);
			return this;
		}, 
		update: function(){
			var self = (SPRITE) ? SPRITE : this;
			// game has a definite 16x12 grid (4/3 aspect ratio)
			var cell_width  = window.innerWidth / CONFIG["screen"]["grid"].x;
			var cell_height = window.innerHeight / CONFIG["screen"]["grid"].y;
			
			// calculate sprite size based on 
			// (replace with SCREEN.width...)
			var ratio = cell_width / cell_height;
			
			if( ratio > self.ratio ){
				// widescreen...
				// - x padding  required
				self.height = cell_height;
				self.width =  self.height * self.ratio;
				self.padding.x = (cell_width - self.width) / 2;
				self.padding.y = 0;
			} else {
				// - y padding  required
				self.width = cell_width;
				self.height =  self.width * (1/self.ratio);
				self.padding.x = 0;
				self.padding.y = (cell_height - self.height) / 2;
			}
			
		}
		
	});

}