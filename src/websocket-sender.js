const Html5WebSocket = require('html5-websocket');
const ReconnectingWebSocket = require('reconnecting-websocket');
const HttpsProxyAgent = require('https-proxy-agent');
const protocols = process.env.HTTP_PROXY ? {agent: new HttpsProxyAgent(process.env.HTTP_PROXY)} : undefined;
const uuid = require('uuid/v4');

module.exports = address => {
    address = address.replace(/^http/, 'ws');
    let inboundHandler = null;
    const handlers = {};
    const rws = new ReconnectingWebSocket(address, protocols, {constructor: Html5WebSocket});
    const notify = (id, data) => {
        const handler = handlers[id];
        delete handlers[id];
        if (handler) {
            handler(data);
        }
    };
    const notifyDataOrError = data => {
        if(data.dir === 'inbound' && inboundHandler) {
             inboundHandler(data);
        } else {
            if (data.err) {
                const keys = Object.keys(handlers);
                while (keys.length > 0) {
                    notify(keys.pop(), data);
                }
            } else {
                notify(data.id, data);
            }
        }
    };
    rws.addEventListener('message', data => {
        notifyDataOrError(JSON.parse(data.data));
    });
    rws.onerror = err => {
        notifyDataOrError({err: err});
    };
    const sender = (data, handler) => {
        data.id = uuid();
        handlers[data.id] = handler;
        rws.send(JSON.stringify(data));
    };
    return {
        onMessage: handler => {
            inboundHandler = handler;
        },
        sender: sender
    }
};
