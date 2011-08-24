// Include important JS helpers
require( __dirname +'/helpers.js');

var express = require('express'), // Include express engine
		config = require( __dirname +'/config/app.js'), // create node server
		app = express.createServer(), // create node server
		io = require('socket.io').listen(app);

// Default APP Configuration
app.configure(function(){
  app.set('view engine', 'jade'); // uses JADE templating engine
  app.set('views', __dirname + '/views'); // default dir for views
  app.use(express.methodOverride());
  app.use(express.logger());
  app.use(app.router);
});

app.configure('development', function(){
   app.use(express.static(__dirname + '/public'));
   app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  var oneYear = 31557600000;
  app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
  app.use(express.errorHandler());
});
// Index Route
app.get('/', function(req, res){ 
	res.render('index', {
		locals: {
			title: "Invaders United"
		}
	});
});

// Listen on this port
app.listen(config.port); 
  
// Socket Connection
var clients = []; // List of all connected Clients

// When user gets connected
io.sockets.on('connection', function(client){ 
	// new client is here! 
	clients.push(client);
	var index = clients.length - 1; // get array index of new client
	
    // join to room and save the room name
	client.on('join arena', function (room) {
		client.set('arena', room, function() { console.log('room ' + room + ' saved'); } );
		client.join(room);
		client.broadcast.to(room).emit("entered arena", client.id);
	})

	client.emit("id", client.id);
	// On Message, send message to everyone
 	client.on('message', function(data){ 
		
		//console.log( io.sockets.clients('arena') );
		
         // lookup room and broadcast to that room
		client.get('arena', function(err, room) {
			  //room example - https://github.com/learnboost/socket.io
			  // neither method works for me
			  response = {};
			  response.id = client.id;
			  response.data = data;
			  //io.sockets.in(room).emit("arena", response);
			  io.sockets.emit("arena", response);
		})
		
		//io.sockets.emit( client.sessionId );
		//console.log('got message ==> ' + data);
		data = JSON.parse(data); // parse string data to json
		for(var i=0;i<clients.length;i++) {
			try {
				//if(clients[i] != undefined)
					//clients[i].send(data.msg); // send to all connected clients
			} catch(e) {
				console.log("doesn`t exist");
				continue; //if a client doesn`t exist, jus continue;
			}
		}
	});
  client.on('disconnect', function(){  
		clients.splice(index,1); // remove client from array
		console.log("after length ===> " +clients.length);
	});
});