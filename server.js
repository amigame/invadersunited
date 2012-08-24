var app = require("./index").app,
	config = require( __dirname +'/config/app.js'); 

// Listen on this port
app.listen(config.port); 
