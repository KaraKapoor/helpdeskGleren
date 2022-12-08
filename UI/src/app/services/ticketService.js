import { appRequest, RequestMethod } from '../../app/httpClient/request'
import config from '../../config/apiConfig.json'
const BASE_URL = config.general.baseUrl;

export const createTicket = (formData) => {
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.ticket.create,
        data: formData,
    })
}
export const fileUpload = (formData) => {
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.file.upload,
        data: formData,
    })
}
export const deleteFile = (formData) => {
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.file.delete,
        data: formData,
    })
}
export const myTickets = (queryParams) => {
    return appRequest({
        method: RequestMethod.GET,
        url: BASE_URL + config.ticket.myTickets + queryParams,
    })
}