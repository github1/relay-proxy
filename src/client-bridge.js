const express = require('express');
const clientCreator = require('./client');
const websocketFactory = require('./websocket-factory');
const reqHandler = require('./req-handler');

module.exports = (port, address) => {
    return new Promise(resolve => {
        const client = clientCreator.createClient({
            address: address,
            socketFactory: websocketFactory
        });
        const app = express();
        app.disable('x-powered-by');
        app.use((req, res, next) => {
            req.rawBody = '';
            req.on('data', chunk => {
                req.rawBody += chunk;
            });
            req.on('end', () => {
                next();
            });
        });
        app.all('/*', reqHandler(client));
        app.listen(port, () => {
            resolve();
        });
    });
};
