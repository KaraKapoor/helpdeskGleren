import axios from 'axios'
import config from '../src/config/apiConfig.json'

const axiosInstance = axios.create({
    baseURL: config.general.baseUrl,
})

axiosInstance.interceptors.response.use(
    (response) => {
        const { headers } = response
        let accessToken = headers['access-token']

        if (accessToken) return response
        else return response.data
    },
    (error) =>
        Promise.reject(
            (error.response && error.response.data) || 'Something went wrong!'
        )
        
)

export default axiosInstance
