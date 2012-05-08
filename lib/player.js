// decouple user model
var extend = require('node.extend'), 
	User = require('./user.js'); 
	
var Player = function(io){
	
	return extend( (new User(io)) , {
		name: false,
		type: "player", 
		socket: null, 
		finish: function(){
			this.state = "defender";
			this.wave = 0;
		}, 
		
		kill: function(){ 
			// remove on the next loop (with this state) from list 
			this.state = "dead"; 
			// broadcast message
			this.socket.emit("died", this.score);
			this.socket.broadcast.emit("dead-invader", this.name);
		}
		
	});
	
}

module.exports = Player;