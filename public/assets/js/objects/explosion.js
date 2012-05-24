Explosion= function() {
	
return $.extend({}, (new User()), {
	root : null, 
	x : 0, 
	y : 0, 
	radius : 0, 
	
	endRadius : 15,
	colorStops : [
	  [ 0.0, "rgba(190,105,90,1)" ],
	  [ 0.25, "rgba(5,30,80,0.4)" ],
	  [ 1, "rgba(10,0,40,0)" ]
	],
	
	init : function(root) {
		this.root = root;
		
		return this;		
	},
	
	start : function( pos ) {
		
		var self = this;
		
		this.pos = pos;
		this.coords();
		
		if(CONFIG['geek-o-vision']) console.log("!!!EXPLODE!!!");
		
		this.expTime = setInterval(function () {
		  
			self.update();
			
		   if (self.radius > 2*self.endRadius) {
			   window.clearInterval(self.expTime);
		   }
		}, 48);
		
	}, 
	
	update : function( ) {
		
		this.render();
	}, 
	
	render: function(){ 
		
		var radius = this.radius;
		
		this.root.stroke(0,100-radius*2);
		this.root.noFill();
		this.root.ellipse(this.x,this.y,radius,radius);
		
		if(this.radius< this.endRadius){
		  this.radius+=3;
		}else{
		  this.radius++;
		}
	},
	
	coords : function() {
		this.x = Math.floor( (this.pos.x * SPRITE["width"] ) + (SPRITE["width"]/2 ) );
		this.y = Math.floor( (this.pos.y * SPRITE["height"]) + (SPRITE["height"]/2) );
	} 
	
});

}