Input = function() {

	if (document.addEventListener)
	{
		document.addEventListener("keypress", Ignore,  false)
		document.addEventListener("keydown",  KeyDown, false)
		document.addEventListener("keyup",    KeyUp,   false)
	}
	else if (document.attachEvent)
	{
		document.attachEvent("onkeypress", Ignore)
		document.attachEvent("onkeydown",  KeyDown)
		document.attachEvent("onkeyup",    KeyUp)
	}
	else
	{
		document.onkeypress = Ignore
		document.onkeydown  = KeyDown
		document.onkeyup    = KeyUp;
	}

	function Ignore(e) {
		if (e.preventDefault) e.preventDefault()
		if (e.stopPropagation) e.stopPropagation()
	}
	function KeyUp(e) {
		OnKey(0,e)
	}
	function KeyDown(e) {
		OnKey(1,e)
	}
	
	function OnKey(state, e)
	{
		if (e.preventDefault) e.preventDefault()
		if (e.stopPropagation) e.stopPropagation()
		var KeyID = (window.event) ? event.keyCode : e.keyCode;
		switch(KeyID)
		{
			case 37:
				ARENA.key(state,"Left")
				break;
			case 38:
				ARENA.key(state,"Up")
				break;
			case 39:
				ARENA.key(state,"Right")
				break;
			case 40:
				ARENA.key(state,"Down")
				break;
		}
	}
}