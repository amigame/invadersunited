// decouple user model
var extend = require('node.extend'), 
	User = require('./user.js'); 
	
var AI = function( io ){
	
	return extend( (new User(io)) , {
		name: "AI",
		type: "ai", 
		io: io,  
		defend: function(players){
			// variables
			var wave = 0;
			var invader;
			
			// find the invader closest
			for (closest in players) { 
				if( players[closest].state == "invader" && players[closest].wave > wave ) { 
					wave = players[closest].wave; 
					invader = players[closest];
				}
			}
			
			// go one square towards the leader
			if( typeof(invader) != "undefined" && typeof(invader.pos) != "undefined" ){
				this.pos.x = ( invader.pos.x - this.pos.x >= 0) ? this.pos.x+1 : this.pos.x-1;
			}
			//reset the y to the wave num
			this.pos.y = this.wave;
			// broadcast new coordinates
			this.broadcast("move", {name: this.name, pos: this.pos});
		},
		invade: function(){
			// just randomising movement left/right
			var direction = Math.round(Math.random() * 2) -1;
			this.pos.x = Math.max(0, this.pos.x+direction);
			// FIX: sometimes the wave is zero
			if(!this.wave){ this.kill(); }
			//reset the y to the wave num
			this.pos.y = this.wave;
			// broadcast new coordinates
			this.broadcast("move", {name: this.name, pos: this.pos});
		}, 
		randomName: function()
		{
		  chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
		  length = 10;
		  name = this.name +"-";
		  for(x=0;x<length;x++)
		  {
			i = Math.floor(Math.random() * 62);
			name += chars.charAt(i);
		  }
		  // save new name
		  this.name = name;
		}, 
		finish: function(){
			// after a dummy invader reaches the bottom it can only die
			this.kill();
		}
	});
	
}

module.exports = AI;