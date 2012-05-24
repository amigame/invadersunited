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
			// game has a definite 16x12 grid (4/3 aspect ratio)
			var cell_width  = window.innerWidth / CONFIG["screen"]["grid"].x;
			var cell_height = window.innerHeight / CONFIG["screen"]["grid"].y;
			
			// calculate sprite size based on 
			// (replace with SCREEN.width...)
			var ratio = cell_width / cell_height;
			
			if( ratio > this.ratio ){
				// widescreen...
				// - x padding  required
				this.height = cell_height;
				this.width =  this.height * this.ratio;
				this.padding.x = (cell_width - this.width) / 2;
				this.padding.y = 0;
			} else {
				// - y padding  required
				this.width = cell_width;
				this.height =  this.width * (1/this.ratio);
				this.padding.x = 0;
				this.padding.y = (cell_height - this.height) / 2;
			}
			
		}
		
	});

}