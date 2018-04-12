const request = require('request');
const express = require('express');
const getPort = require('get-port');
const app = express();
require('express-ws')(app);
app.ws('/echo', ws => {
    ws.on('message', msg => {
        ws.send(msg);
    });
});
const clientBridge = require('./client-bridge');

describe('when using websockets', () => {
    it('sends messages over websockets', () => {
        return new Promise(resolve => {
            getPort().then(port => {
                app.listen(port, () => {
                    getPort().then(clientBridgePort => {
                        clientBridge(clientBridgePort, `ws://localhost:${port}/echo`)
                            .then(() => {
                                setTimeout(() => {
                                    request
                                        .get(`http://localhost:${clientBridgePort}/`)
                                        .on('response', response => {
                                            expect(response.statusCode).toBe(200);
                                            resolve();
                                        })
                                        .on('error', err => {
                                            console.log(err);
                                            resolve();
                                        });
                                }, 1);
                            });
                    });
                });
            });
        });
    });
});