var events = require('events');
var net = require('net');

var room = new events.EventEmitter();
room.client = {};
room.subscriptions = {};

room.on('join', function (id, client) {
    console.log(id);
    this.client[id] = client;
    this.subscriptions[id] = (cid, msg) => {
        if (cid != id) {
            this.client[id].write(msg);
        }
    }
    this.on('broadcast', this.subscriptions[id]);
});

var server = net.createServer((client) => {
    var id = client.remoteAddress + ':' + client.remotePort;

    room.emit('join', id, client);

    client.on('data', function (data) {
        data = data.toString();
        room.emit('broadcast', id, data);
    });

    client.on('close', function () {
        console.log("Close-", id);
    });
});

server.listen(4000, function(err) {
    console.log('you tcp is listening');
});