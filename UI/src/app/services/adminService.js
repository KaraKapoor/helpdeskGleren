import { appRequest, RequestMethod } from '../../app/httpClient/request'
import config from '../../config/apiConfig.json'
const BASE_URL = config.general.baseUrl;

export const reportBug=(formData)=>{
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.reportBug.reportBug,
        data: formData,
    })
}
export const createStatus=(formData)=>{
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.status.create,
        data: formData,
    })
}
export const getById=(formData)=>{
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.status.getById,
        data: formData,
    })
}
export const getAllStatus=(page,size)=>{
    return appRequest({
        method: RequestMethod.GET,
        url: BASE_URL + config.status.getAllStatus +`?page=${page}&size=${size}`
    })
}
export const createDepartment=(formData)=>{
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.department.create,
        data: formData,
    })
}
export const getDepartmentById=(formData)=>{
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.department.getById,
        data: formData,
    })
}
export const getAllDepartment=(page,size)=>{
    return appRequest({
        method: RequestMethod.GET,
        url: BASE_URL + config.department.getAllDepartments +`?page=${page}&size=${size}`
    })
}