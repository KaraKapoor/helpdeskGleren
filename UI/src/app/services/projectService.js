import { appRequest, RequestMethod } from '../../app/httpClient/request'
import config from '../../config/apiConfig.json'
const BASE_URL = config.general.baseUrl;

export const createProject=(formData)=>{
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.project.create,
        data: formData,
    })
}
export const getById=(formData)=>{
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.project.getById,
        data: formData,
    })
}
export const getAllProjects=(page,size)=>{
    return appRequest({
        method: RequestMethod.GET,
        url: BASE_URL + config.project.getAllProjects +`?page=${page}&size=${size}`
    })
}