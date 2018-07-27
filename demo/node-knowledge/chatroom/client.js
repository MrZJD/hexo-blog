var MsgClient = (function () {
    var WEBSOCKET_SERVER_URL = 'ws://localhost:4000/demo';

    var MsgClient = function (box) {
        this.box = document.querySelector(box);
        this.msgbox = this.box.querySelector('.chat-msgbox');
        this.input = this.box.querySelector('.chat-input');
        this.sendbtn = this.box.querySelector('.client-send');
        this.lastOwnMsg = null;
        this.isConnect = false;

        this.sendbtn.onclick = (evt) => {
            if (!this.isConnect) {
                alert('还未建立链接！');
                return ;
            }

            if (this.input.value !== '') {
                this.send(this.input.value);
                this.input.value = '';
            }
        }
    }

    MsgClient.prototype.init = function () {

        if (this.isConnect) {
            return ;
        }

        // 初始化事件;
        // 创建webSocket;
        this.client = createWebSocket.call(this, this.open.bind(this), this.msg.bind(this), this.close.bind(this), this.error.bind(this));

        this.isConnect = true;
    }

    MsgClient.prototype.connect = MsgClient.prototype.init;
    MsgClient.prototype.disconnect = function () {
        this.isConnect = false;
        this.client ? this.client.close() : '';
    }

    MsgClient.prototype.open = function (evt) {
        // console.log(evt);
        this._showOthersMsg('服务器链接成功');
    }

    MsgClient.prototype.error = function (evt) {
        // console.log(evt);
        this._showOthersMsg('服务器链接失败');
    }

    MsgClient.prototype.close = function (evt) {
        // console.log(evt);
        this._showOthersMsg('退出聊天');
    }

    MsgClient.prototype.msg = function (evt) {
        var data = JSON.parse(evt.data);
        if (data.code === 200) {
            this._showOthersMsg(data.msg);
        } else {
            this.lastOwnMsg.setAttribute('class', 'msg-own loaded');
        }
    }

    MsgClient.prototype._showOthersMsg = function (data) {
        var msgTemplate = document.createElement('p');
        msgTemplate.setAttribute('class', 'msg-others');
        msgTemplate.innerHTML = '<span>'+decodeURIComponent(data)+'</span>';

        this.msgbox.appendChild(msgTemplate);
    }

    MsgClient.prototype._showOwnMsg = function (data) {
        var msgTemplate = document.createElement('p');
        msgTemplate.setAttribute('class', 'msg-own loading');
        msgTemplate.innerHTML = '<span>'+decodeURIComponent(data)+'</span>';

        this.msgbox.appendChild(msgTemplate);
        this.lastOwnMsg = msgTemplate;
    }

    MsgClient.prototype.send = function (msg) {
        msg = encodeURIComponent(msg);
        this.client.send(msg);
        this._showOwnMsg(msg);
    }

    function createWebSocket (open, msg, close, err) {
        var websocket = new WebSocket(WEBSOCKET_SERVER_URL);
        
        websocket.onopen = open;
        websocket.onmessage = msg;
        websocket.onclose = close;
        websocket.onerror = err;

        this._showOthersMsg('正在连接服务器...');

        return websocket;
    }



    return MsgClient;
}) ();

var chaterA = new MsgClient('#chat-room1');
var chaterB = new MsgClient('#chat-room2');

document.querySelector('.client-controller.room1 .connect').onclick = () => {
    chaterA.connect();
}
document.querySelector('.client-controller.room1 .disconnect').onclick = () => {
    chaterA.disconnect();
}
document.querySelector('.client-controller.room2 .connect').onclick = () => {
    chaterB.connect();
}
document.querySelector('.client-controller.room2 .disconnect').onclick = () => {
    chaterB.disconnect();
}

