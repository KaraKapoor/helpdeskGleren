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