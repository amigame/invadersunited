// Sidebar functions
Lobby = function() {
	return {
		socket: io.connect(window.location.hostname+"/lobby"), 
		init: function(){
			
			var self = this;
			// events
			
			// user updates
			socket.on('in-lobby', function(user) {
				// add user in lobby
				self.add( user.name );
				// show lobby
				self.show();
				//PLAYER.me(user);
			});
			// opponents updates
			socket.on('entered-lobby', function( user ) {
				// add user in lobby
				self.add( user );
			});


			$("#load").fadeOut(1000, function(){ $(this).remove() });
			$("#wrapper aside").animate({ width: "30%"}, 1000, function(){
				$("#lobby").fadeIn();
			});
			
			$("#wrapper aside .pull").toggle(this.show, this.hide);

			// initialiaze chat
			this.chat();
		}, 
		show: function(){
			// replace with foobar action
			$("#wrapper aside").animate({ right: 0}, 800);
		},
		hide: function(){
			// replace with foobar action
			$("#wrapper aside").animate({ right: "-29%"}, 800);
		}, 
		add: function( user ){
			var img = '<img src="'+ getGravatar( user, 32 ) +'" width="32" height="32" alt="'+ user +'" />';
			$("#waiting").append("<li>"+ img + user + "</li>");
		}, 
		remove: function( user ){
			// remove user from the waiting list
			$("#waiting").find("li").each(function( ){
				if ( ( $(this).html() ).indexOf( user ) ) $(this).remove();
			});
		}, 
		getPosition: function(){
			
		}, 
		chat: function(){
			
			// events
			chat
			.on('connect', function () {
				//chat.emit('hi!');
			  })
			.on('update', function(user) {
				var img = '<img src="'+ getGravatar( user.name, 16 ) +'" width="16" height="16" alt="'+ user.name +'" />';
				$("#chat-stream").prepend("<li>"+ img + user.text +"</li>");
			});
	
			//console.log( io.sockets.clients() );
			$("form#chat").submit(function(e) {
			  e.preventDefault();
			  e.stopPropagation();
			  var input = $(this).find("input[type='text']");
			  if( !empty( input.val() ) ) chat.emit('message', input.val() );
			  input.val("");
			});
				
		}
	}
	
}
