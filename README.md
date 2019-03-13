# Relay Proxy

Proxies HTTP requests bi-directionally over a WebSocket connection.

## Why?

This was built to enable applications running on machines without public 
inbound internet connectivity to subscribe to and receive [`Webhook`](https://en.wikipedia.org/wiki/Webhook) 
notifications from other APIs/services. 

## Usage

Start a server (on a host with public inbound internet connectivity):
```bash
relay-proxy --server --address https://www.test.com --port 8888
```

Start a client:
```bash
relay-proxy \
    --address ws://${relay-proxy-server}:8888 \
    --port 3000 \
    --inbound http://localhost:5555
```

Send a request through the proxy:
```bash
curl -s http://localhost:3000
```

## Options
*Server mode*
- `--server` starts the proxy in server mode
- `--address` the address of the service to proxy

*Client mode*
- `--address` the address of the relay-proxy server to use
- `--inbound` an HTTP service which receives inbound requests from the proxy
- `--port` the port to listen on which transmits outbound traffic