const client = require('./client');

const validRequestOpts = {
    headers: [],
    path: '/foo/bar'
};

describe('client creation', () => {
    const fakeHandler = (resp) => (req, handler) => {
        handler(resp);
    };
    it('sends and receives outbound requests through a socket', () => {
        expect.assertions(1);
        return new Promise((resolve) => {
            const instance = client.createClient({
                inboundHandler: fakeHandler({ path: '/ib' }),
                outboundSender: fakeHandler({ path: '/ob' })
            });
            instance
                .send(validRequestOpts, resp => {
                    expect(resp.path).toBe('/ob');
                    resolve();
                });
        });
    });
});

describe('when creating a request', () => {
    it('requires a path to be set', () => {
        expect.assertions(1);
        try {
            client.createRequest({});
        } catch (e) {
            expect(e.message)
                .toContain('Missing required option "path"');
        }
    });
    it('requires a headers to be set', () => {
        expect.assertions(1);
        try {
            client.createRequest({path: '/'});
        } catch (e) {
            expect(e.message)
                .toContain('Missing required option "headers"');
        }
    });
});