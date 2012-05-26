// Sidebar functions
Login = function() {
	return {
		init: function(){
			var self = this;
			
			$("form#login").submit(function(e) {
				e.preventDefault();
				e.stopPropagation();
				var input = $(this).find("input[type='text']");
				if( input.val() != "" ){
				//if( validateEmail(input.val() ) ){
					player.name = noSpecialChars( input.val() );
					console.log( noSpecialChars( input.val() ) );
					socket.emit('login', player.name );
					self.remove();
					// move this to a socket response 
					lobby.init();
				} else {
					//alert("A valid email is needed to Paypal the top score");
					alert("Enter your username - any text string will do...");
				}
			});
		}, 
		getID: function(){
			
		},
		hide: function(){
			
		}, 
		remove: function(){
			$("#load").fadeOut(1000, function(){ $(this).remove() });
			// add tracking
			_gaq.push(['_trackEvent', 'Game', 'Login', 'Success']);
		}, 
		
	}
	
}
