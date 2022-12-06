const constants = require("../constants/constants");
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const db = require("../models");
const errorConstants = require("../constants/errorConstants");
const userAPIService = require("../Services/userAPIService");
const uploads = db.uploads;
const comment = db.comments;
const ticket = db.ticket

exports.uploadFile = async (req, res) => {
    try {
        const userDetails = await userAPIService.getUserById(req.user.user_id);
        const tenantId = userDetails.tenant_id;
        let fileName = req.file.originalname;
        let folderPath = constants.UPLOAD_PATH + "/" + new Date().getTime() + uuidv4() + "/" + fileName;
        const s3Config = this.get_S3_Config();
        let s3FileResponse = await uploadFile(folderPath, req.file);
        console.log(s3FileResponse);
        const uploadResponse = await this.saveToUploads(constants.UPLOAD_PATH, s3FileResponse.key, req.file.mimetype, req.file.size, s3FileResponse.Location, req.file.originalname, req.user.user_id, tenantId);
        return res.status(200).send({
            status: true,
            data: uploadResponse
        })
        async function uploadFile(folderPath, file) {
            let myPromise = await new Promise(function (myResolve, myReject) {
                const params = {
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: folderPath,
                    Body: file.buffer
                }
                s3Config.upload(params, function (error, data) {

                    if (error) {
                        myReject(error);  // when error
                    } else {
                        console.log("FILE UPLOADED");
                        myResolve(data);
                    }
                })
            });
            return myPromise;

        }
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
};

exports.get_S3_Config = () => {
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_S3_REGION
    })
    return s3;
}

exports.saveToUploads = async (folderName, key, mimeType, size, filePath, fileName, uploadedBy, tenantId) => {
    const reqObj = {
        field_name: folderName,
        key: key,
        mime_type: mimeType,
        size: size,
        path: filePath,
        original_name: fileName,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        uploaded_by: uploadedBy,
        tenant_id: tenantId
    }
    const response = await uploads.create(reqObj);
    return response;
}