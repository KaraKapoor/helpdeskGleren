const errorConstants = require("../constants/errorConstants");
const userAPIService = require("../Services/userAPIService");
const generalMethodService = require("../Services/generalMethodAPIService");


exports.getLoggedInUserDetails = async (req, res) => {
    const input = req.body;
    const userDetails = await userAPIService.getUserById(req.user.user_id);

    try {
        return res.status(200).send({
            status: true,
            data: userDetails
        })
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }

};
exports.updateUser = async (req, res) => {
    const input = req.body;
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    try {
        let updateObj = {
            updatedAt: new Date()
        }
        if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.designation) !== null) {
            updateObj.designation = input.designation;
        }
        if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.firstName) !== null) {
            updateObj.first_name = input.firstName;
        }
        if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.lastName) !== null) {
            updateObj.last_name = input.lastName;
        }
        if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.mobile) !== null) {
            updateObj.mobile = input.mobile;
        }

        const response = await userAPIService.updateUser(input.id, updateObj, userDetails.tenant_id)
        return res.status(200).send({
            status: true,
            data: response
        })
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}