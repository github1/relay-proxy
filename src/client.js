const uuid = require('uuid/v4');

const assertRequiredOption = (payload, name) => {
    if (!payload[name]) {
        throw new Error(`Missing required option "${name}"`);
    }
};

const createRequest = opts => {
    assertRequiredOption(opts, 'path');
    assertRequiredOption(opts, 'headers');
    return Object.assign({}, opts, {
        headers: opts.headers,
        path: opts.path
    });
};

module.exports = {
    createRequest: createRequest,
    createClient(opts) {
        assertRequiredOption(opts, 'outboundSender');
        assertRequiredOption(opts, 'inboundHandler');
        const clientId = uuid();
        const outboundSender = opts.outboundSender;
        const inboundHandler = opts.inboundHandler;
        const sender = typeof outboundSender === 'function' ? outboundSender : outboundSender.sender;
        if(typeof outboundSender.onMessage === 'function') {
            outboundSender.onMessage(data => {
                inboundHandler(data, (resp) => {
                    resp.mode = 'inbound-response';
                    resp.rid = data.rid;
                    sender(resp, res => {
                        console.log(res);
                    })
                });
            });
        }
        return {
            send(opts, handler) {
                const request = createRequest(opts);
                request.clientId = clientId;
                sender(request, (res) => {
                    handler(res);
                });
            }
        }
    }
};