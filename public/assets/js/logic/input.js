Input = function()  {
	
	return {

	self: null, 
	
	// setup the mapping for available actions
    trigger : { "Up" : 0, "Down" : 0, "Left" : 0, "Right" : 0, "Fire" : 0 },
	
	init : function(){
		self = this;
		
		this.setupKeys();
		this.setupAccelerometer();
		
	}, 
	
	setupKeys: function(){ 
	
		if (document.addEventListener)
		{
			document.addEventListener("keypress", self.ignore, 		false);
			document.addEventListener("keydown",  self.keydown, 	false);
			document.addEventListener("keyup",    self.keyup, 		false);
		}
		else if (document.attachEvent)
		{
			document.attachEvent("onkeypress", self.ignore);
			document.attachEvent("onkeydown",  self.keydown);
			document.attachEvent("onkeyup",    self.keyup);
		}
		else
		{
			document.onkeypress = self.ignore;
			document.onkeydown  = self.keydown;
			document.onkeyup    = self.keyup;
		}
		
		return this;
	},
	
	setupAccelerometer : function(){
		//Detect if the browser supports DeviceMotionEvent
		if (window.DeviceMotionEvent != undefined) {
		//ondevicemotion is fired when iOS device detects motion
		window.ondevicemotion = function(e) {
			//ax is the movement on the x axis.
			ax = event.accelerationIncludingGravity.x * 5;
			ay = event.accelerationIncludingGravity.y * 5;
			 
			if(ax > 14){ //move right on device
				self.set(1,"Right");
			}
			if(ax < -14){ //move left on device
				self.set(1,"Left");
			}
			if(ax > -14 && ax < 14){ //device held steady
				self.set(0,"Right");
				self.set(0,"Left");
			}
		}
		}
	}, 
	ignore : function(e) {
		// stop propagation unless we're typing in an input field
		if(e.target.tagName != "INPUT"){ 
			if (e.preventDefault) e.preventDefault();
			if (e.stopPropagation) e.stopPropagation();
		}
	}, 
	
	keyup : function(e) {
		// nasty! defining the globar var from the object
		self.onKey(0,e);
	}, 
	
	keydown : function(e) {
		// nasty! defining the globar var from the object
		self.onKey(1,e);
	},	
	
    set : function(state, name) {
		this.trigger[name] = state;
    },
	
	onKey : function(state, e) {
		//if (e.preventDefault) e.preventDefault()
		//if (e.stopPropagation) e.stopPropagation()
		var KeyID = (window.event) ? event.keyCode : e.keyCode;
		switch(KeyID)
		{
			case 32:
				this.set(state,"Fire")
				break;
			case 37:
				this.set(state,"Left")
				break;
			case 38:
				this.set(state,"Up")
				break;
			case 39:
				this.set(state,"Right")
				break;
			case 40:
				this.set(state,"Down")
				break;
		}
	}
}

}