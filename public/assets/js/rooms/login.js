// Sidebar functions
Login = function() {
	return {
		init: function(){
			
			$("form#login").submit(function(e) {
				e.preventDefault();
				e.stopPropagation();
				var input = $(this).find("input[type='text']");
				if( validateEmail(input.val() ) ){
					socket.emit('login', input.val() );
					//socket.send(JSON.stringify({text:$("#chat-text").val()}));
					// move this to a socket response 
					lobby.init();
				} else {
					alert("Please enter a valid email");
				}
			});
		}, 
		getID: function(){
			
		},
		hide: function(){
			
		}, 
		add: function( user ){
			
		}, 
		remove: function( user ){
			
		}, 
		
	}
	
}
