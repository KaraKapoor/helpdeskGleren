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