
/**
 Copyright (C) 2013 Caixa Mágica Software
	Author:
		Nuno Martins <nuno.martins@caixamagica.pt>

GNU LESSER GENERAL PUBLIC LICENSE
                       Version 3, 29 June 2007

 Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.

 Full text can be view at:
 http://opensource.org/licenses/lgpl-3.0.html
 */

var bport = 3700;
var port = 4000;
var proto_file = "";

/* ToDo: change all this for getopt module */
process.argv.forEach(function (val, index, array) {
	var ind = -1;
	if ((ind = val.indexOf('--')) == 0) {
		var optindex = val.indexOf('=');
		if (optindex > 0) {
			var opt = val.substring(ind + 2, optindex);
			var value = val.substring(optindex + 1, val.length);
			if (opt.indexOf('protofile') == 0) {
				proto_file = value;
			}

			if (opt.indexOf('bport') == 0) {
				bport = value;
			}

			if (opt.indexOf('port') == 0) {
				port = value;
			}
		}
	}
});

if (proto_file.length == 0) {
	console.log("You need to suply a proto file");
	console.log('node message-viewer --protofile="my.proto"');
	process.exit(1);
}

var express = require("express");
var app = express();
var Protobuf = require('protobufjs');
var net = require('net');
var routes = require('./routes');

var http = require('http');
var path = require('path');

/* Routes */
var index = require('./routes/index');
var about = require('./routes/about');
/* end of routes */

app.engine('jade', require('jade').__express);


// all environments
app.set('port', process.env.PORT || bport);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
//app.set('view options', { layout: false });
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', index.page);
app.get('/about', about.page);

console.log("Listening on port " + bport);
var io = require('socket.io').listen(app.listen(bport));

var builder = Protobuf.protoFromFile("./protobuf/" + proto_file);

function print_result(obj) {
	var methods = [];
	for(var m in obj) {
		methods.push(m);
	}
	console.log(methods);
	var message_builder = [];
	for (var m in methods) {
		var MessageBuilder = builder.build(m.toString());
		message_builder.push(MessageBuilder);
	}
	return message_builder;
}

var messages_builder = print_result(builder.result);

function retrieve_methods(obj) {
	var methods = [];
	for(var m in obj) {
		if (m.toString().indexOf('get_') == 0 )
			methods.push(m);
	}
	return methods;
}

/* func_to_display should access to parameters
	(name, value)
*/

function print_values(obj, func_to_display) {
	var methods = retrieve_methods(obj);

	for (var i = 0; i < methods.length ; i++) {
		var fn = obj[methods[i]];
		if (fn != null) {
			if (typeof fn === "function") {
				var value = fn.call(obj);
				if (value != null) {
					console.log(methods[i].substring(4) + " " + fn.call(obj));
					console.log(fn);
					console.log("FUNCTION GOING RECURSIVE");
					print_values(value, func_to_display);
					if (typeof value === 'function') {
					}
				}

				if (func_to_display != null)
					func_to_display(methods[i], fn.call(obj));
			}
			if (typeof fn === "object") {
				console.log("Going recursive");
				print_values(fn, func_to_display);
			}
		}
	}
}

var counter = 0;

net.createServer(function (ssocket) {

	ssocket.addListener("data", function (cdata) {
		counter = counter + 1;
		var txt;
		for (var i = 0; i < messages_builder.length; i++) {
			try {
				var decodedm = messages_builder[i].decode(cdata);
				var message = {
					id: counter,
					ipsrc: ssocket.remoteAddress,
					sender: "sender",
					receiver: "receiver",
					message: decodedm,
				};

				io.sockets.emit('message', message );
			} catch (e) {
				console.log(e);
			}
		}
	});

	ssocket.addListener("end", function () {
		console.log("Ending data\n");
	});

}).listen(port);
