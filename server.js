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
	//var index = clients.length - 1; // get array index of new client
	// set these important variables on the server side
	client.wave = 0;
	client.score = 0;
	client.defender = 0;
	
    // join to room and save the room name
	client.on('join arena', function (room) {
		client.wave = 1;
		client.set('arena', room, function() { console.log('room ' + room + ' saved'); } );
		client.join(room);
		//client.broadcast.to(room).emit("new invader", client.id);
		client.broadcast.emit("new invader", client.id);
	})
	
	client.on('kill', function () {
		client.wave = 0;
		client.broadcast.emit("dead invader", client.id);
	});
	
	client.on('chat-update', function (data) {
		io.sockets.emit("chat-message", data);
	});
	
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
			  response.wave = client.wave;
			  response.coords = JSON.parse(data);
			  //io.sockets.in(room).emit("arena", response);
			  io.sockets.emit("arena", response);
		})
		
		
		//client.broadcast.to(room).emit("entered arena", index);
		//io.sockets.emit( client.sessionId );
		//console.log('got message ==> ' + data);
		
		//data = JSON.parse(data); // parse string data to json
		/*
		for(var i=0;i<clients.length;i++) {
			try {
				//if(clients[i] != undefined)
					//clients[i].send(data.msg); // send to all connected clients
			} catch(e) {
				console.log("doesn`t exist");
				continue; //if a client doesn`t exist, jus continue;
			}
		}
		*/
	});
  client.on('disconnect', function(){  
  		client.broadcast.emit("left game", client.id);
		var index = clients.indexOf(client); // Find the index
		clients.splice(index,1); // remove client from array
		console.log("after length ===> " +clients.length);
	});
});

// set the wave timer
setInterval(function(){
        //console.log("WAVE");
		for(var i=0;i<clients.length;i++) {
			try {
				if(clients[i].wave < 10){ 
					clients[i].wave +=1; // send to all connected clients
				} else{
					// exclude the defender for the wave countdown
					if(!clients[i].defender){ 
						// notify the clients of the new defender
						client.broadcast.emit("new defender", client.id);
					}
				}
			} catch(e) {
				console.log("doesn`t exist");
				continue; //if a client doesn`t exist, jus continue;
			}
		}
    },10000);
	