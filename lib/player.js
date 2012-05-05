// decouple user model
var extend = require('node.extend'), 
	User = require('./user.js'); 
	
var Player = function(io){
	
	return extend( (new User(io)) , {
		name: false,
		type: "player", 
		end: function(){
			//new defender;
		}
	});
	
}

module.exports = Player;