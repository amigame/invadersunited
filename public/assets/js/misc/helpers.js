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
				/* If in portrait mode, sets the body's class attribute to portrait. Consequently, all style definitions matching the body[class="portrait"] declaration
				   in the iPhoneOrientation.css file will be selected and used to style "Handling iPhone or iPod touch Orientation Events". */
				//document.body.setAttribute("class","portrait");
				
				/* Add a descriptive message on "Handling iPhone or iPod touch Orientation Events"  */
				//document.getElementById("currentOrientation").innerHTML="Now in portrait orientation (Home button on the bottom).";
				break;	
				
		case 90:
				game.orientation = "landscapeLeft";
				/* If in landscape mode with the screen turned to the left, sets the body's class attribute to landscapeLeft. In this case, all style definitions matching the
				   body[class="landscapeLeft"] declaration in the iPhoneOrientation.css file will be selected and used to style "Handling iPhone or iPod touch Orientation Events". */
				//document.body.setAttribute("class","landscapeLeft");
				
				//document.getElementById("currentOrientation").innerHTML="Now in landscape orientation and turned to the left (Home button to the right).";
				break;
		
		case -90:	
				game.orientation = "landscapeRight";
				/* If in landscape mode with the screen turned to the right, sets the body's class attribute to landscapeRight. Here, all style definitions matching the 
				   body[class="landscapeRight"] declaration in the iPhoneOrientation.css file will be selected and used to style "Handling iPhone or iPod touch Orientation Events". */
				//document.body.setAttribute("class","landscapeRight");
				
				//document.getElementById("currentOrientation").innerHTML="Now in landscape orientation and turned to the right (Home button to the left).";
				break;
	}

}
