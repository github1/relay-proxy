const reqHandler = require('./req-handler');
const clientCreator = require('./client');

describe('request handler', () => {
    const fakeClient = response => clientCreator.createClient({
        address: 'ws://',
        socketFactory: (address, handler) => ({
            send: request => {
                response.id = request.id;
                handler(response);
            }
        })
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