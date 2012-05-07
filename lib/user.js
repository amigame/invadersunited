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
			// cast an explosion...
			this.io.sockets.emit("dead-invader", this.name);
		},
		remove: function(){  
			this.state = "dead"; 
			// broadcast the message only if the user had the chance to login
			if( this.state ) this.io.sockets.emit("remove", this.name);
		}, 
		broadcast: function( key, values ){
			this.io.sockets.emit(key, values);
		}, 
		finish: function(){}, 
		newWave: function(){
			if(this.state == "invader" && this.wave < 10){
				this.wave++;
			} else if(this.state == "invader") {
				this.finish();
			}
		}, 
		isUser: function( id ){ 
			return this.id == id;
		}

	}
}
