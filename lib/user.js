// decouple user model
module.exports = User = function(io){
	
	return {
		id: 0,
		name: false,
		state: false,
		type: false, 
		wave: 0, 
		io: io, 
		pos: {x: 0, y: 0 },
		create: function(){},
		shoot: function(){}, 
		kill: function(){ 
			this.state = "dead"; 
			this.io.sockets.emit("dead-invader", this.name);
		}, 
		finish: function(){}, 
		newWave: function(){
			if( this.wave < 10){
				this.wave++;
			} else {
				this.finish();
			}
		}
	}
}
