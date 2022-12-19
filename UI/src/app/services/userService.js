import { appRequest, RequestMethod } from '../../app/httpClient/request'
import config from '../../config/apiConfig.json'
const BASE_URL = config.general.baseUrl;

export const loginUser=(formData)=>{
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.user.login,
        data: formData,
    })
}
export const registerTenant=(formData)=>{
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.user.register,
        data: formData,
    })
}
export const sendOTPEmail=(formData)=>{
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.user.generateOTPEmail,
        data: formData,
    })
}
export const verifyOTPEmail=(formData)=>{
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.user.verifyOTPEmail,
        data: formData,
    })
}
export const getLoggedInUserDetails=()=>{
    return appRequest({
        method: RequestMethod.GET,
        url: BASE_URL + config.user.getLoggedInUserDetails
    })
}
export const updateUserProfile=(data)=>{
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.user.updateUserProfile,
        data: data
    })
}
export const forgetPasswordEmail=(data)=>{
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.user.forgetPassword,
        data: data
    })
}
export const changePassword=(data)=>{
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.user.changePassword,
        data: data
    })
}
export const getAllUsers=(page,size)=>{
    return appRequest({
        method: RequestMethod.GET,
        url: BASE_URL + config.user.getAllUsers +`?page=${page}&size=${size}`
    })
}
export const getUserById=(data)=>{
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.user.getUserById,
        data:data
    })
}
export const createUpdateUser=(data)=>{
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.user.createUpdateUser,
        data:data
    })
}

export const getProfilePic=()=>{
    return appRequest({
        method: RequestMethod.GET,
        url: BASE_URL + config.user.getProfileURL,
    })
}