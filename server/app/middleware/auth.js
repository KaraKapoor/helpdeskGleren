const jwt = require("jsonwebtoken");

const config = process.env.JWT_TOKEN_KEY;
const tenantSettingsController = require("../controllers/tenantSettings.controller.js");

const verifyToken =async (req, res, next) => {
    const resp= await tenantSettingsController.getSettingsByTenantName(process.env.TENANT_NAME);
    if (!resp.isLarkAuthRequired) {
        const token =
            req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];

        if (!token) {
            return res.status(401).send({ status: false, message: "A token is required for authentication" });
        }
        try {
            let bearerToken = token.split("Bearer ");
            const decoded = jwt.verify(bearerToken[1], config);
            req.user = decoded;
        } catch (err) {
            return res.status(401).send({ status: false, message: "Invalid Token" });
        }
        return next();
    }else {
        //No Need to verify token if logged in via lark.
        return next();
    }
    
};

module.exports = verifyToken;
