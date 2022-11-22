module.exports = (app) => {
    const file = require("../controllers/file.controller.js");

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
    router.post("/uploadTicketFile",auth, multipleUpload, file.uploadTicketMultipartFile);
    router.post("/getTicketFiles",auth, file.getTicketFiles);
    router.post("/downloadTicketFile", file.downloadTicketFile);
    router.get("/downloadTicketFile", file.downloadTicketFile);//Used when dynamic fields are stored as a comment.
    router.post("/deleteTicketFile",auth, file.deleteTicketFile);
    router.post("/uploadTempTicketFile",auth, upload, file.uploadTempTicketFile);
    router.post("/createFileKeyEntry",auth, file.createFileKeyEntry);


    app.use("/api/file", router);
};
