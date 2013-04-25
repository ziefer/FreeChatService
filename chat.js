// reference to http://socket.io/#how-to-use

var app = require('http').createServer(handler)
    , io = require('socket.io').listen(app)
    , fs = require('fs')
    , exec = require('child_process').exec;

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
		socket.emit('my_message', data);
		socket.broadcast.emit("message", data);
	});
	
	socket.on('report', function (data) {
		console.log('request report');
		socket.emit('my_report', {users: 10, rooms: 3});
	});
	
	function echo_exec(cmd, callback) {
		exec(cmd, function(err, stdout, stderr) {
			if (err) {
				console.log(stderr + '\nError:' + err.code, err.code);
			} else {
				console.log(stdout);
			}
			socket.emit('system report', arguments);
			
			callback(arguments);
		});
	}
	
	socket.on('git pull', function (data) {
		console.log('git pull');
		echo_exec('git pull', function() {});
	});

	socket.on('restart', function (data) {
		console.log('restart');
		echo_exec('forever restart chat.js', function() {});
	});
});
