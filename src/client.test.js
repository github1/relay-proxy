const client = require('./client');

const validRequestOpts = {
    headers: [],
    path: '/foo/bar'
};

describe('client creation', () => {
    it('sends things with a socket', () => {
        const socket = { send: jest.fn() };
        const socketFactory = () => socket;
        const instance = client.createClient({
            address: 'ws://foo.com',
            socketFactory: socketFactory
        });
        instance
            .send(validRequestOpts);
        expect(socket.send.mock.calls.length).toBe(1);
    });
});

describe('when creating a request', () => {
    it('generates a unique request id', () => {
        expect(client.createRequest(validRequestOpts).id)
            .not.toBe(client.createRequest(validRequestOpts).id);
    });
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
            client.createRequest({ path: '/' });
        } catch (e) {
            expect(e.message)
                .toContain('Missing required option "headers"');
        }
    });
});