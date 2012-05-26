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
		}, 
		setName: function( name, players )
		{
		  // save the name only if it is unique for the current player list
		  var valid = true;
		  // check against the players array
		  for(i in players){
			  if( players[i].name == name ){
				  valid = false;
				 break;
			  }
		  }
		  // if it exists add three random characters at the end
		  if( !valid ) { 
		  	  name += "_";
			  var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
			  for(x=0;x<3;x++)
			  {
				i = Math.floor(Math.random() * 62);
				name += chars.charAt(i);
			  }
		  } 
		  // save new name
		  this.name = name;
		}
		
	});
	
}

module.exports = Player;