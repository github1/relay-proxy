const Html5WebSocket = require('html5-websocket');
const ReconnectingWebSocket = require('reconnecting-websocket');

module.exports = (address, handler) => {
    address = address.replace(/^http/, 'ws');
    const rws = new ReconnectingWebSocket(address, undefined, {constructor: Html5WebSocket});
    rws.addEventListener('message', data => {
        handler(JSON.parse(data.data));
    });
    return {
        send(data) {
            rws.send(JSON.stringify(data));
        }
    }
};