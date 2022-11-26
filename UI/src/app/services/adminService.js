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