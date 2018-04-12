const reqHandler = require('./req-handler');
const clientCreator = require('./client');

describe('request handler', () => {
    const fakeHandler = (resp) => (req, handler) => {
        resp.id = req.id;
        handler(resp);
    };
    const fakeClient = response => clientCreator.createClient({
        outboundSender: fakeHandler(response),
        inboundHandler: fakeHandler({})
    });
    it('it receives ', () => {
        expect.assertions(2);
        return new Promise(resolve => {
            const req = {
                path: '/',
                headers: {}
            };
            const headersSet = {};
            const res = {
              header: (name, value) => {
                  headersSet[name] = value;
              },
              status: () => {},
              send: body => {
                  expect(headersSet['x-foo']).toBe('bar');
                  expect(body).toBe('someBody');
                  resolve();
              }
            };
            reqHandler(fakeClient({
                headers: {'x-foo': 'bar'},
                body: 'someBody'
            }))(req, res);
        });
    });
});