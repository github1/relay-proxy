# Relay Proxy

Proxies HTTP requests over a WebSocket connection.

## Usage

Start a server:

```bash
relay-proxy --server --address https://www.test.com --port 8888
```

Start a client:

```bash
relay-proxy --address ws://localhost:8888 --port 3000
```

Send a request:

```bash
curl -s http://localhost:3000
```