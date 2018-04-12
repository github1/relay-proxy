const express = require('express');
const ews = require('express-ws');
const rawBodyParser = require('./raw-body-parser');
const uuid = require('uuid/v4');

module.exports = (port, outboundConnector) => {
    const subscribers = [];
    const handlers = {};
    return new Promise(resolve => {
        const app = express();
        ews(app);
        app.disable('x-powered-by');
        app.use(rawBodyParser());
        app.ws('/', ws => {
            subscribers.push(ws);
            ws.on('message', msg => {
                const req = JSON.parse(msg);
                if(req.mode === 'inbound-response') {
                    if(handlers[req.rid]) {
                        handlers[req.rid](req);
                    }
                }
                else if(req.control === 'init') {
                    console.log(req);
                } else {
                    try {
                        outboundConnector(req, resp => {
                            ws.send(JSON.stringify(resp));
                        });
                    } catch (err) {
                        ws.send(JSON.stringify(Object.assign({}, {}, {
                            id: req.id,
                            clientId: req.clientId,
                            status: 500,
                            body: err.message
                        })));
                    }
                }
            });
        });
        app.all('/*', (req, res) => {
            const inboundReq = {
                dir: 'inbound',
                rid: uuid(),
                path: req.path,
                headers: req.headers,
                method: req.method,
                body: req.rawBody
            };
            subscribers
                .filter(ws => ws.readyState == 1)
                .forEach(ws => {
                    try {
                        handlers[inboundReq.rid] = data => {
                            Object.keys(data.headers || {}).forEach(key => {
                                res.header(key, data.headers[key]);
                            });
                            if (data.err) {
                                res.status(503);
                            } else {
                                res.status(data.status || 200);
                            }
                            res.send(data.body);
                        };
                        ws.send(JSON.stringify(inboundReq));
                    } catch (err) {
                        res.status(500);
                        res.send({});
                    }
                });
        });
        app.listen(port, () => {
            resolve();
        });
    });
};
