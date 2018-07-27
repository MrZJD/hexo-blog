var { EventEmitter } = require('events');
var { generateMsg, handleMsg } = require('./wsutil');

/**
 * 负责一个客户端socket链接
 */
class MyClient extends EventEmitter{
    constructor ([socket, head]) {
        super();

        this.socket = socket;
        this.sid = room.push(this);
        this.msg = '';

        console.log('Client Connect: -> ', this.sid);

        this.initEvents();
        this.initSocket();
    }

    /**
     * 初始化该对象拥有的事件监听
     */
    initEvents () {
        this.on('message', (dataBuf) => {
            var msg = generateMsg(dataBuf);
            this.socket.write(msg);
        });

        this.on('exit', () => {
            console.log('Socket Exit!');
            // socket.removeAllListener();
            this.socket.destroy();
        });
    }

    initSocket () {
        var socket = this.socket;

        socket.write(generateMsg(getMsgBuf({
            code: 200,
            msg: '您的链接ID:' + this.sid
        })));

        socket.on('data', (data) => {
            console.log(data);

            data = handleMsg(data);
            if (!data) {
                // 数据请求断开
                this.socket.end();
                room.delete(this.sid);
                return ;
            }

            var str = data.toString();
            room.broadcast(str, this.sid);
        });

        socket.on('error', (err) => {
            console.log('socket err:\r\n', err);
        });

        socket.on('end', () => {
            // room.broadcast(Buffer.from('服务器链接关闭'));
            room.delete(this.sid);
        });

        socket.on('close', (err) => {
            room.delete(this.sid);
        });
    }
}

const room = {
    _clients: {},
    push: function (client) {
        var sid = client.socket.remoteAddress+':'+client.socket.remotePort;
        this._clients[sid] = client;

        return sid;
    },
    delete: function (sid) {
        if (!this._clients[sid]) {
            return ;
        }
        this._clients[sid].emit('exit');
        this._clients[sid] = null;
    },
    broadcast: function (msg, sourceid) {
        var resBuf = getMsgBuf({
            code: 200,
            msg: msg
        });
        for (var sid in this._clients) {
            if (sid === sourceid && !!this._clients[sid]) {
                this._clients[sid].emit('message', getMsgBuf({
                    code: 201,
                    msg: '发送成功'
                }));
                continue;
            }
            !!this._clients[sid] ? this._clients[sid].emit('message', resBuf) : '';
        }
    }
}

function getMsgBuf(data) {
    if (typeof data === 'string') {
        return Buffer.from(data);
    } else {
        return Buffer.from(JSON.stringify(data));
    }
}

module.exports = {
    room: room,
    MyClient: MyClient
};