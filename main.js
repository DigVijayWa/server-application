var path = require('path'),
	express = require('express'),
	app = express(),
	expressWs = require('express-ws')(app),
	connections = {},
	flag = {},
	request = require('request'),
	WebSocketServer = require('ws').Server,
	http = require('http'),
	JSON = require('circular-json');

	const server = http.createServer(app);

	const wss = new WebSocketServer({server});

app.get('/callback', function(req,res) {
	//res.send(req.query.state);
	console.log('callback ongoing');
	try{
		console.log('callback called');
		console.log(req.query.state);
		flag[req.query.state] = true;
		send_response(connections[req.query.state], 'auth_1', 	req.query.code);

	}catch(err) {
		console.log('error during ajax call');
	}
	res.send('OK');
});

wss.on('connection', function(ws, req) {
	console.log('connection opened');
	console.log(req.url);
	f = getUrlVars(req.url);
	try{
			var state = f['state'];
			console.log('connection opened with ID : '+state);
			connections[state] = ws;
			ws.state = state;
	  }catch(err) {
			console.log('invalid connection URI');
		}

		ws.on('message', function(message) {

		});

		ws.on('close',function(){
				console.log('connection ended : ',ws.ended);
				connections[ws.state].close();
				connections[ws.state] = null;
		}.bind(ws));
});


function getUrlVars(url) {
    var vars = {};
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function send_response(ws,step,code) {
	try {
		console.log('trying to send message');
		var message = {
			type : step,
			key : code
		};

		ws.send(JSON.stringify(message));

	}catch(err) {
		console.log('websocket connection was broken!');
	}
}

server.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});
