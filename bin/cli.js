#!/usr/bin/env node

const clientBridge = require('../src/client-bridge');
const proxyServer = require('../src/proxy-server');
const httpSender = require('../src/http-sender');
const websocketSender = require('../src/websocket-sender');

const args = process.argv.slice();
const hasArg = name => args.filter(arg => arg === `--${name}`).length > 0;
const getArg = name => hasArg(name) ? args[args.indexOf(`--${name}`) + 1] : undefined;

const PORT = [getArg('port') || process.env.PORT || 3000].map(value => parseInt(value))[0];
const PROXY_ADDRESS = getArg('address') || process.env.PROXY_ADDRESS;
const INBOUND_ADDRESS = getArg('inbound') || process.env.INBOUND_ADDRESS;

const mode = hasArg('server') ? 'server' : 'client';

switch (mode) {
    case 'server':
    {
        proxyServer(PORT, httpSender(PROXY_ADDRESS))
            .then(() => {
                console.log(`[INFO] Proxying ${PORT} -> ${PROXY_ADDRESS} as ${mode}`);
            })
            .catch(err => {
                console.error(`[ERROR] ${err.message}`);
                process.exit(1);
            });
        break;
    }
    case 'client':
    {
        clientBridge(PORT, {
            outboundSender: websocketSender(PROXY_ADDRESS),
            inboundHandler: httpSender(INBOUND_ADDRESS)
        }).then(() => {
                console.log(`[INFO] Proxying ${PORT} -> ${PROXY_ADDRESS} -> ${INBOUND_ADDRESS} as ${mode}`)
            })
            .catch(err => {
                console.error(`[ERROR] ${err.message}`);
                process.exit(1);
            });
        break;
    }
}