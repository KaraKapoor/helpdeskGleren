const db = require("../models");
const Op = db.Sequelize.Op;
const constants = require("../constants/constants");
const { v4: uuidv4 } = require('uuid');
const files = db.files;
const decode = require('decode-html');
const generalMethods = require("../generalMethods/generalMethods.controller.js");

exports.uploadTicketMultipartFile = async (req, res) => {

    for (let i of req.files) {
        let fileName = i.originalname;
        let folderPath = constants.TICKET_FILE_UPLOAD + "/" + req.body.ticketId + "/" + fileName;
        await uploadFile(folderPath, i);
    }

    async function uploadFile(folderPath, file) {
        const s3Config= generalMethods.get_S3_Config();
        const params = {
            Bucket: generalMethods.getBucketName(),
            Key: folderPath,
            Body: file.buffer
        }
        await s3Config.upload(params, function (error, data) {

            if (error) {
                res.status(200).send(error)
            } else {
                console.log("FILE UPLOADED");
            }
        })
    }

    res.status(200).send({ "success": "true" })
};

exports.uploadTempTicketFile = async (req, res) => {
    let fileName = req.file.originalname;
    let folderPath = constants.TICKET_FILE_UPLOAD + "/" + new Date().getTime() + uuidv4() + "/" + fileName;
    const s3Config= generalMethods.get_S3_Config();
    console.log("FOLDER PATH" + " " + folderPath);
    await uploadFile(folderPath, req.file);
    async function uploadFile(folderPath, file) {
        const params = {
            Bucket: generalMethods.getBucketName(),
            Key: folderPath,
            Body: file.buffer
        }
        await s3Config.upload(params, function (error, data) {

            if (error) {
                res.status(200).send(error)
            } else {
                console.log("FILE UPLOADED");
                res.status(200).send({ "success": "true", "key": folderPath })
            }
        })
    }
};

exports.getTicketFiles = async (req, res) => {

    let folderPath = constants.TICKET_FILE_UPLOAD + "/" + req.body.ticketId + "/";
    const s3Config= generalMethods.get_S3_Config();
    await getFiles(folderPath);
    async function getFiles(folderPath) {
        const params = {
            Bucket: generalMethods.getBucketName(),
            Prefix: folderPath
        }
        await s3Config.listObjectsV2(params, function (error, data) {

            if (error) {
                res.status(200).send(error)
            } else {
                res.send(data);
            }
        })
    }
};

exports.downloadTicketFile = async (req, res) => {
    const s3Config= generalMethods.get_S3_Config();
    let keyName = null;
    let isGetRequest = false;
    if (req.body.keyName) {
        keyName = req.body.keyName;

    }
    if (req.query.keyName) {
        let splitURL=req.originalUrl.split('keyName=');
        let decodedFileName=splitURL[1];
        var filekey=decodedFileName.replace(/%20/g,' ');//Remove space
        filekey=filekey.replace(/%27/g,`'`);//Remove single Quote (') from url.
        let originalFileName=decode(filekey);
        isGetRequest = true;
        keyName=originalFileName;
    }
    if(req.query.isView || req.body.isView){
        const params = {
            Bucket: generalMethods.getBucketName(),
            Key: keyName
        };
        console.log(keyName);
        const readStream= await s3Config.getObject(params).createReadStream();
        readStream.pipe(res);
    }else{
        let urlActiveTime = constants.S3_FILE_URL_ACTIVE_TIME;
        await getObjectPresignedUrl(keyName, urlActiveTime);
    }


    async function getObjectPresignedUrl(keyName, urlActiveTime) {
        const s3Config= generalMethods.get_S3_Config();
        const params = {
            Bucket: generalMethods.getBucketName(),
            Key: keyName,
            Expires: urlActiveTime
        };

        await s3Config.getSignedUrl('getObject', params, function (error, data) {

            if (error) {
                res.status(200).send(error)
            } else {
                if (isGetRequest === true) {
                    res.redirect(data);//This is used for directly downloading the files for the dynamic fields stored as comment.
                    res.end();
                } else {
                    res.send({ "downloadUrl": data });
                }

            }
        })
    }
}

exports.deleteTicketFile = async (req, res) => {
    const s3Config= generalMethods.get_S3_Config();
    let keyName = req.body.keyName;
    await deleteFile(keyName);

    async function deleteFile(keyName) {
        const params = {
            Bucket: generalMethods.getBucketName(),
            Key: keyName,
        };

        await s3Config.deleteObject(params, function (error, data) {

            if (error) {
                res.status(200).send(error)
            } else {
                res.send(data);
            }
        })
    }
}

exports.createFileKeyEntry = async (req, res) => {
    let ticketId = req.body.ticketId;
    let fileKeysArray = req.body.fileKeysArray;

    for (let i of fileKeysArray) {
        const fileObj = {
            ticketId: ticketId,
            fileKey: i
        }

        await files.create(fileObj)
            .then((res) => {
                // console.log(res);
            })
    }
    res.status(200).send({ "message": "true" });

}