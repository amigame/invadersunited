// decouple user model
module.exports = User = function(){
	
	return {
		id: 0,
		name: false,
		state: false,
		wave: 0, 
		pos: {x: 0, y: 0 },
		create: function(){},
		shoot: function(){}, 
		destroy: function(){}
	}
}
