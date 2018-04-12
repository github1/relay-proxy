module.exports = (client) => (req, res) => {
    client.send({
        path: req.path,
        headers: req.headers,
        method: req.method,
        body: req.rawBody
    }, data => {
        Object.keys(data.headers || {}).forEach(key => {
            res.header(key, data.headers[key]);
        });
        res.send(data.body);
    });
};