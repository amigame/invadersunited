// decouple user model
var extend = require('node.extend'), 
	User = require('./user.js'); 
	
var AI = function( io ){
	
	return extend( (new User()) , {
		name: "AI",
		io: io,  
		defend: function(players, dummies){
			// find the invader closest - logically the first in the array
			var invader = ( !players.length )? dummies[0] : players[0];
			// go one square towards the leader
			if( typeof(invader) != "undefined"){ 
				this.pos.x = ( invader.pos.x - this.pos.x >= 0) ? this.pos.x+1 : this.pos.x-1;
			}
			this.broadcast();
		},
		invade: function(){
			// just randomising movement left/right
			var direction = Math.round(Math.random() * 2) -1;
			this.pos.x += direction;
			this.broadcast();
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
		broadcast: function(){
			//update y based on the wave
			this.pos.y = this.wave;
			// broadcast new coordinates
			this.io.sockets.emit('move', {name: this.name, pos: this.pos});
		}
	});
	
}

module.exports = AI;