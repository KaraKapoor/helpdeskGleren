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
        if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.departmentId) !== null) {
            updateObj.department_id = input.departmentId;
        }
        if(await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.photouploadId) !== null){
            updateObj.photo_id = input.photouploadId;
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
exports.getAllUsers = async (req, res) => {
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    const input = req.query;
    const { page, size } = req.query;
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.page) == null) {

        return res.status(200).send({
            error: errorConstants.PAGE_NO_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.size) == null) {

        return res.status(200).send({
            error: errorConstants.PAGE_SIZE_ERROR,
            status: false
        });
    }
    try {
        const response = await userAPIService.getAllUsersWithPagination(page, size, tenantId);
        return res.status(200).send({ status: true, data: response });
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.getUserById = async (req, res) => {
    const input = req.body;
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.id) == null) {
        return res.status(200).send({
            error: errorConstants.ID_ERROR,
            status: false
        });
    }

    try {
        const response = await userAPIService.getUserByIdWithTenant(input.id, tenantId);
        let result;
        if (response) {
            result = { status: true, data: response }
        } else {
            result = {
            status: false,
            message: "User with this ID does not exist or Invalid ID"
            }
        }
        return res.status(200).send(result);
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.createUpdateUser = async (req, res) => {
    const input = req.body;
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    let isNew = false;
    try {
        if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.email) == null) {

            return res.status(200).send({
                error: errorConstants.EMAIL_MANDATORY_ERROR,
                status: false
            });
        }
        if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.firstName) == null) {

            return res.status(200).send({
                error: errorConstants.FIRST_NAME_MANDATORY_ERROR,
                status: false
            });
        }
        if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.lastName) == null) {

            return res.status(200).send({
                error: errorConstants.LAST_NAME_MANDATORY_ERROR,
                status: false
            });
        }
        if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.designation) == null) {

            return res.status(200).send({
                error: errorConstants.DESIGNATION_MANDATORY_ERROR,
                status: false
            });
        }
        if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.role) == null) {

            return res.status(200).send({
                error: errorConstants.ROLE_MANDATORY_ERROR,
                status: false
            });
        }
        if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.active) == null) {

            return res.status(200).send({
                error: errorConstants.ACTIVE_MANDATORY_ERROR,
                status: false
            });
        }

        const response = await userAPIService.getByEmail(input.email, tenantId);
        if (isNew && response?.email) {
            return res.status(200).send({
                error: errorConstants.USER_ALREADY_EXISTS,
                status: false
            });
        } else if (!isNew && input?.email === response?.email && response.id != input.id) {
            return res.status(200).send({
                error: errorConstants.USER_ALREADY_EXISTS,
                status: false
            });
        } else {
            const resp = await userAPIService.createUpdateUser(input.email, input.firstName, input.lastName, input.mobile, input.designation, input.role, input.active, input.id, tenantId,input.departmentId);
            return res.status(200).send(resp);
        }
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}

exports.getProfileURL = async (req, res) =>{
    const input = req.body;
    const userDetails = await userAPIService.getUserById(req.user.user_id);


   
    try {
        const resp = await userAPIService.getProfileURL(userDetails, userDetails.tenant_id);
        return res.status(200).send({ status: true, data: resp });
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }

    

}