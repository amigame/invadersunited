// Example site using Express...
// Include important JS helpers
//require( __dirname +'/helpers.js');

var fs = require('fs'), 
	http = require('http'), 
	config = require( __dirname +'/config/app.js'), // get configuration
	express = require('express'), // Include express engine
	hbs = require('hbs'), 
	app = express(), // create node server
	server = http.createServer(app), 
	io = require('socket.io').listen(server), 
	iu = require( __dirname +'/lib/game.js');

// Default APP Configuration
app.configure(function(){
	app
		.set('views', __dirname + '/views')
		.set('view engine', 'html')
		.engine("html",  require('hbs').__express )
		.use(app.router);
		//.use(express.methodOverride());
});

app.configure('development', function(){
	app
		.use(express.static(__dirname + '/public'))
		.use(express.logger())
		.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  var oneYear = 31557600000;
		app
		.use(express.static(__dirname + '/public', { maxAge: oneYear }))
		.use(express.errorHandler());
});

// Index Route
app.get('/', function(req, res){ 
	res.render('index', {
		locals: {
			name: 'index', 
			title: config.name
		}
	});
});

// About page
app.get('/about', function(req, res){ 
	res.render('about', {
		locals: {
			name: 'about', 
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
			name: 'scores', 
			title: config.name, 
			scores: scores
		}
	});
});


// configure handlebars

var blocks = {};

hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }
	
    block.push(context.fn(this));
});

hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    return val;
});

// start the game
iu.init( io );

exports.app = server;


