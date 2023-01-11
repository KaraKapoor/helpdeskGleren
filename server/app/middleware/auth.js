const jwt = require("jsonwebtoken");

const config = process.env.JWT_TOKEN_KEY;

const verifyToken = async (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];

    if (!token) {
        return res.status(401).send({ status: false, error: "A token is required for authentication" });
    }
    try {
        let bearerToken = token.split("Bearer ");
        const decoded = jwt.verify(bearerToken[1], config);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send({ status: false, error: "Session Expired Please Login Again" });
    }
    return next();

};

module.exports = verifyToken;
