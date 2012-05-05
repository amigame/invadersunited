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
		shoot: function(){
			io.sockets.emit("shoot", this.pos);
			// return false to change the canShoot flag
			return false;
		}, 
		kill: function(){ 
			this.state = "dead"; 
			this.io.sockets.emit("dead-invader", this.name);
		}, 
		broadcast: function( key, values ){
			this.io.sockets.emit(key, values);
		}, 
		end: function(){}, 
		newWave: function(){
			if(this.state == "invader" && this.wave < 10){
				this.wave++;
			} else {
				this.end();
			}
		}, 
		isUser: function( id ){ 
			return this.id == id;
		}


	}
}
