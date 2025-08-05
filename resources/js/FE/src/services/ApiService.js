import AxiosBase from './axios/AxiosBase'
import appConfig from '@/configs/app.config'

const ApiService = {
    fetchData(param) {
        const { url, method, data, params, headers } = param
        let finalUrl = `${appConfig.API_BASE_URL}${url}`

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        }

        if (params) {
            const query = new URLSearchParams(params).toString()
            finalUrl = `${finalUrl}?${query}`
        }

        if (method?.toLowerCase() !== 'get' && data) {
            options.body = JSON.stringify(data)
        }
        
        return fetch(finalUrl, options).then(async (response) => {
            if (response.headers.get('Content-Type')?.includes('application/json')) {
                const res = await response.json()
                if (response.ok) {
                    return res
                }
                return Promise.reject(res)
            }
            // Handle non-JSON responses
            if (response.ok) {
                return response.text(); // or handle as needed
            }
            const errorText = await response.text();
            return Promise.reject(new Error(errorText));
        })
    },

    fetchDataWithAxios(param) {
        return new Promise((resolve, reject) => {
            AxiosBase(param)
                .then((response) => {
                    resolve(response.data)
                })
                .catch((errors) => {
                    reject(errors)
                })
        })
    },
}

export default ApiService
