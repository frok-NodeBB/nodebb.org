"use strict";

var express = require('express'),
	winston = require('winston'),
	async = require('async'),
	nconf = require('nconf'),
	path = require('path'),
	app = express(),
	middleware = require('./lib/middleware')(app),
	filecache = {};

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
	colorize: true
});

nconf.file({
	file: path.join(__dirname, '/config.json')
});

app.engine('tpl', require('templates.js').__express);
app.set('view engine', 'tpl');
app.set('views', 'templates');

app.use(express.static('public', {}));
app.use(middleware.processRender);

app.get('/:page?/:subpage?', middleware.buildPage, function (req, res) {
	var page = path.join(req.params.page || 'index', req.params.subpage || '');
	
	res.render(page, {});
});

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	winston.info('Manifest is ready and listening on http://%s:%s', host, port);
});



process.on('SIGTERM', function() {
	process.exit();
});