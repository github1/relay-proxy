const normalizeURL = require('normalize-url');
const url = require('url');
const request = require('request');

module.exports = target => {
    return (req, receiver) => {
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
                receiver(Object.assign({}, {}, {
                    id: req.id,
                    clientId: req.clientId,
                    status: 500,
                    body: err.message
                }));
            } else {
                receiver(Object.assign({}, {}, {
                    id: req.id,
                    clientId: req.clientId,
                    status: response.status,
                    body: body
                }));
            }
        });
    }
};