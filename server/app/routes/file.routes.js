module.exports = (app) => {
    const file = require("../controllers/fileAPIController.js");

    var router = require("express").Router();
    const auth = require("../middleware/auth");
    const multer = require('multer');
    var storage = multer.memoryStorage({
        destination: function (req, file, callback) {
            callback(null, '');
        }
    });
    var multipleUpload = multer({ storage: storage }).array('file');
    var upload = multer({ storage: storage }).single('file');
    router.post("/uploadFile",auth, upload, file.uploadFile);
    app.use("/api/file", router);
};
