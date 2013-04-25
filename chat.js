// reference to http://socket.io/#how-to-use

var app = require('http').createServer(handler)
    , io = require('socket.io').listen(app)
    , fs = require('fs');

app.listen(8003);

function handler (req, res) {
    fs.readFile(__dirname + '/index.html',
    function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
   
        res.writeHead(200);
        res.end(data);
    });
}

io.sockets.on('connection', function (socket) {
	socket.on('my other event', function (data) {
		console.log(data);
		socket.emit("my_message", data);
		socket.broadcast.emit("message", data);
    });
	
	socket.on('report', function (data) {
		console.log('request report');
		socket.emit('my_report', {users: 10, rooms: 3});
	});
 });
