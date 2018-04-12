const Html5WebSocket = require('html5-websocket');
const ReconnectingWebSocket = require('reconnecting-websocket');
const HttpsProxyAgent = require('https-proxy-agent');
const protocols = process.env.HTTP_PROXY ? {agent: new HttpsProxyAgent(process.env.HTTP_PROXY)} : undefined;

module.exports = (address, handler) => {
    address = address.replace(/^http/, 'ws');
    const rws = new ReconnectingWebSocket(address, protocols, {constructor: Html5WebSocket});
    rws.addEventListener('message', data => {
        handler(JSON.parse(data.data));
    });
    rws.onerror = err => {
        handler({err: err.message});
    };
    return {
        send(data) {
            rws.send(JSON.stringify(data));
        }
    }
};