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
export const downloadFile = (formData) => {
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.file.download,
        data: formData,
    })
}
export const myTickets = (queryParams) => {
    return appRequest({
        method: RequestMethod.GET,
        url: BASE_URL + config.ticket.myTickets + queryParams,
    })
}
export const allTickets = (queryParams) => {
    return appRequest({
        method: RequestMethod.GET,
        url: BASE_URL + config.ticket.allTickets + queryParams,
    })
}
export const getDashboardData = (data) => {
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.ticket.dashboardData,
        data: data
    })
}
export const getTicketById = (data) => {
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.ticket.getTicketById,
        data: data
    })
}
export const updateTicket = (data) => {
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.ticket.update,
        data: data
    })
}
export const getTicketHistory = (data) => {
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.ticket.getTicketHistory,
        data: data
    })
}
export const saveTicketComment = (data) => {
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.ticket.saveTicketComment,
        data: data
    })
}
export const getTicketComments = (data) => {
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.ticket.getTicketComments,
        data: data
    })
}
export const getFixVersionByProject = (data) => {
    return appRequest({
        method: RequestMethod.POST,
        url: BASE_URL + config.fixversion.getByProject ,
        data:data
    })
}

export const getTicketLable = ( queryParams) => {
    return appRequest({
        method: RequestMethod.GET,
        url: BASE_URL + config.ticket.getTicketLable+ queryParams,
    })
}