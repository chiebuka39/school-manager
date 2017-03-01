var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcryptjs');
//var middleware = require('./middleware.js')(db);

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;


app.use(bodyParser.json());


// POST /admin/login
app.post('/admin/login', function (req, res) {
	var body = _.pick(req.body, 'email', 'password');
	var adminInstance;

	db.admin.authenticate(body).then(function (admin) {
		var token = admin.generateToken('authentication');
		adminInstance = admin;
		/*return db.token.create({
			token: token
		});*/
		res.json(adminInstance.toPublicJSON());
	})/*.then(function(tokenInstance){
		res.header('Auth',tokenInstance.get('token')).json(adminInstance.toPublicJSON());
	})*/.catch(function() {
		res.status(401).send();
	});
});

// add an admin to the school system
app.post('/admin', function (req, res) {
	var body = _.pick(req.body, 'email', 'password');

	// this creates the admin entity
	db.admin.create(body).then(function (admin) {
		res.json(admin.toPublicJSON());
	}, function (e) {
		// show a json response of the errors
		res.status(400).json(e.errors);
	});
});



db.sequelize.sync({//force: true
}).then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});
