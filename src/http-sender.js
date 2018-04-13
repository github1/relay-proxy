const normalizeURL = require('normalize-url');
const url = require('url');
const request = require('request');

const prepareRequest = () => {
    if(process.env.HTTP_PROXY) {
        return request.defaults({'proxy': process.env.HTTP_PROXY});
    }
    return request;
};

module.exports = target => {
    const r = prepareRequest();
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
        r(opts, (err, response, body) => {
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