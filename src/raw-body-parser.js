module.exports = () => (req, res, next) => {
    if(/http/i.test(req.protocol)) {
        req.rawBody = '';
        req.on('data', chunk => {
            req.rawBody += chunk;
        });
        req.on('end', () => {
            next();
        });
    } else {
        next();
    }
};