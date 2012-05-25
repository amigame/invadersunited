// Include important JS helpers
//require( __dirname +'/helpers.js');

var express = require('express'), // Include express engine
	config = require( __dirname +'/config/app.js'), // create node server
	app = express.createServer(), // create node server
	fs = require('fs'),
	io = require('socket.io').listen(app), 
	iu = require( __dirname +'/lib/game.js');

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
			title: config.name
		}
	});
});

// About page
app.get('/about', function(req, res){ 
	res.render('about', {
		locals: {
			title: config.name
		}
	});
});

// Scores page
app.get('/scores', function(req, res){ 
	// consider replacing this "hard" call to the file with a memory seek
	var file = fs.readFileSync('./data/scores.json');
	var scores = JSON.parse(file);
		
	res.render('scores', {
		locals: {
			title: config.name, 
			scores: scores
		}
	});
});


// Listen on this port
app.listen(config.port); 

// start the game
iu.init( io );