const express = require('express');
const reqHandler = require('./req-handler');
const rawBodyParser = require('./raw-body-parser');
const clientCreator = require('./client');

module.exports = (port, opts) => {
    return new Promise(resolve => {
        const app = express();
        app.disable('x-powered-by');
        app.use(rawBodyParser());
        app.all('/*', reqHandler(clientCreator.createClient(opts)));
        app.listen(port, () => {
            resolve();
        });
    });
};
