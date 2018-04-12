const uuid = require('uuid/v4');

const assertRequiredOption = (payload, name) => {
    if(!payload[name]) {
        throw new Error(`Missing required option "${name}"`);
    }
};

const createRequest = opts => {
    assertRequiredOption(opts, 'path');
    assertRequiredOption(opts, 'headers');
    return Object.assign({}, opts, {
        id: uuid(),
        headers: opts.headers,
        path: opts.path
    })
};

module.exports = {
    createRequest: createRequest,
    createClient(opts) {
        assertRequiredOption(opts, 'address');
        assertRequiredOption(opts, 'socketFactory');
        const handlers = {};
        const clientId = uuid();
        const socket = opts.socketFactory(opts.address, data => {
            const handler = handlers[data.id];
            delete handlers[data.id];
            if(handler) {
                handler(data);
            }
        });
        return {
            send(opts, handler) {
                const request = createRequest(opts);
                request.clientId = clientId;
                handlers[request.id] = handler;
                socket.send(request);
            }
        }
    }
};