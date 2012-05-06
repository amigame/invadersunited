Input = {

	// setup the mapping for catching key presses
    keys : { "Up" : 0, "Down" : 0, "Left" : 0, "Right" : 0, "Ctrl" : 0 },
	
	initialize : function(){
		if (document.addEventListener)
		{
			document.addEventListener("keypress", this.ignore,  false)
			document.addEventListener("keydown",  this.keydown, false)
			document.addEventListener("keyup",    this.keyup,   false)
		}
		else if (document.attachEvent)
		{
			document.attachEvent("onkeypress", this.ignore)
			document.attachEvent("onkeydown",  this.keydown)
			document.attachEvent("onkeyup",    this.keyup)
		}
		else
		{
			document.onkeypress = this.ignore
			document.onkeydown  = this.keydown
			document.onkeyup    = this.keyup;
		}
		
		return this;
	},

	ignore : function(e) {
		//if (e.preventDefault) e.preventDefault()
		//if (e.stopPropagation) e.stopPropagation()
	}, 
	
	keyup : function(e) {
		// nasty! defining the globar var from the object
		INPUT.onkey(0,e)
	}, 
	
	keydown : function(e) {
		// nasty! defining the globar var from the object
		INPUT.onkey(1,e)
	},	
	
    key : function(state, name) {
		this.keys[name] = state;
    },
	
	onkey : function(state, e) {
		//if (e.preventDefault) e.preventDefault()
		//if (e.stopPropagation) e.stopPropagation()
		var KeyID = (window.event) ? event.keyCode : e.keyCode;
		switch(KeyID)
		{
			case 32:
				this.key(state,"Space")
				break;
			case 37:
				this.key(state,"Left")
				break;
			case 38:
				this.key(state,"Up")
				break;
			case 39:
				this.key(state,"Right")
				break;
			case 40:
				this.key(state,"Down")
				break;
		}
	}
}