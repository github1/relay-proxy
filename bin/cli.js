#!/usr/bin/env node

const clientBridge = require('../src/client-bridge');
const proxyServer = require('../src/proxy-server');

const args = process.argv.slice();
const hasArg = name => args.filter(arg => arg === `--${name}`).length > 0;
const getArg = name => hasArg(name) ? args[args.indexOf(`--${name}`) + 1] : undefined;

const PORT = [getArg('port') || process.env.PORT || 3000].map(value => parseInt(value))[0];
const PROXY_ADDRESS = getArg('address') || process.env.PROXY_ADDRESS;

const mode = hasArg('server') ? 'server' : 'client';

(mode === 'server' ? proxyServer(PORT, PROXY_ADDRESS) : clientBridge(PORT, PROXY_ADDRESS))
    .then(() => {
        console.log(`[INFO] Proxying ${PORT} -> ${PROXY_ADDRESS} as ${mode}`)
    })
    .catch(err => {
        console.error(`[ERROR] ${err.message}`);
        process.exit(1);
    });