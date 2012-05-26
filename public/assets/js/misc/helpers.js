// PHP.js functions
function empty (mixed_var) {
    var key;

    if (mixed_var === "" || mixed_var === 0 || mixed_var === "0" || mixed_var === null || mixed_var === false || typeof mixed_var === 'undefined') {
        return true;
    }

    if (typeof mixed_var == 'object') {
        for (key in mixed_var) {
            return false;
        }
        return true;
    }

    return false;
}

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 

function getGravatar(email, size){
	if( typeof(size) == "undefined") size=32;
	return "http://www.gravatar.com/avatar/" + MD5( email ) + "?s="+ size +"&d="+ (new User).icon;
}

function noSpecialChars(string) { 
    return string.replace(/\<|\>|\"|\'|\%|\;|\(|\)|\&|\#|\?|\$|\^|\&|\*|\`|\+|\-/g,"");
} 

/* updateOrientation checks the current orientation, sets the body's class attribute to portrait, landscapeLeft, or landscapeRight, 
   and displays a descriptive message on "Handling iPhone or iPod touch Orientation Events".  */
function updateOrientation()
{
	/*window.orientation returns a value that indicates whether iPhone is in portrait mode, landscape mode with the screen turned to the
	  left, or landscape mode with the screen turned to the right. */
	var orientation=window.orientation;
	switch(orientation)
	{
	
		case 0:
				game.orientation = "portrait";
				break;
		case 90:
				game.orientation = "landscapeLeft";
				break;
		case -90:	
				game.orientation = "landscapeRight";
				break;
		case 180:	
				game.orientation = "portraitDown";
				break;
	}

}

// makeClass - By John Resig (MIT Licensed)
function makeClass(){
  return function(args){
    if ( this instanceof arguments.callee ) {
      if ( typeof this.init == "function" )
        this.init.apply( this, args.callee ? args : arguments );
    } else
      return new arguments.callee( arguments );
  };
}
