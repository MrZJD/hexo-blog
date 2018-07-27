var http = require('http');
var crypto = require('crypto');
var { room, MyClient } = require('./room');

const config = {
    port : '4000',
    host : 'localhost'
};

var socketServer = http.createServer((req, res) => {
    const body = http.STATUS_CODES[426];

    res.writeHead(426, {
        'Content-Length': body.length,
        'Content-Type': 'text/plain'
    });
    res.send(body);
});

socketServer.listen(config.port, config.host, () => {
    console.log('You Websocket Server is listening at 4000');
});

socketServer.on('error', (err) => {
    console.log('Server Error: -> ', err.message);
});

socketServer.on('upgrade', (req, socket, head) => {
    const version = +req.headers['sec-websocket-version']; //->ws version

    if (req.method !== 'GET' || req.headers.upgrade.toLowerCase() !== 'websocket' || !req.headers['sec-websocket-key'] || (version !== 8 && version !== 13)) {
        // -> 如果upgrade信息错误则返回
        return abortReqeust(socket, 400);
    }

    // upgrade
    const key = crypto.createHash('sha1')
        .update(req.headers['sec-websocket-key'] + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'binary')
        .digest('base64');
    
    const headers = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${key}`
    ]

    var protocol = (req.headers['sec-websocket-protocol'] || '').split(/, */);
    if (protocol[0]) {
        headers.push(`Sec-WebSocket-Protocol: ${protocol[0]}`);
    }

    // if (req.headers['sec-websocket-extensions']) {
    //     headers.push(`Sec-WebSocket-Extensions: ${req.headers['sec-websocket-extensions']}`);
    // }
    
    socket.write(headers.concat('', '').join('\r\n'));

    const client = new MyClient([socket, head])

    // 创建完成
});