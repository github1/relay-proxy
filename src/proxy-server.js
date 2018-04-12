const request = require('request');
const express = require('express');
const ews = require('express-ws');
const normalizeURL = require('normalize-url');
const url = require('url');

module.exports = (port, target) => {
    return new Promise(resolve => {
        const app = express();
        ews(app);
        app.ws('/', ws => {
            ws.on('message', msg => {
                try {
                    const req = JSON.parse(msg);
                    const opts = {
                        url: normalizeURL([target, req.path].join('/')),
                        headers: req.headers,
                        method: req.method
                    };
                    opts.headers['host'] = url.parse(opts.url).hostname;
                    if (/post/i.test(req.method)) {
                        opts.body = req.body;
                    }
                    request(opts, (err, response, body) => {
                        if(err) {
                            ws.send(JSON.stringify(Object.assign({}, {}, {
                                id: req.id,
                                clientId: req.clientId,
                                body: err.message
                            })));
                        } else {
                            ws.send(JSON.stringify(Object.assign({}, {}, {
                                id: req.id,
                                clientId: req.clientId,
                                body: body
                            })));
                        }
                    });
                } catch (err) {
                    ws.send(JSON.stringify(Object.assign({}, {}, {
                        id: req.id,
                        clientId: req.clientId,
                        body: err.message
                    })));
                }
            });
        });
        app.listen(port, () => {
            resolve();
        });
    });
};
