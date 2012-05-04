// Sidebar functions
Login = function() {
	return {
		init: function(){
			var self = this;
			
			$("form#login").submit(function(e) {
				e.preventDefault();
				e.stopPropagation();
				var input = $(this).find("input[type='text']");
				if( validateEmail(input.val() ) ){
					player.name = input.val();
					socket.emit('login', player.name );
					self.remove();
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
		remove: function(){
			$("#load").fadeOut(1000, function(){ $(this).remove() });
		}, 
		
	}
	
}