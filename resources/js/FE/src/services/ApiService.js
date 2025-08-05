import AxiosBase from './axios/AxiosBase'
import appConfig from '@/configs/app.config'
import { auth } from '@/auth'

const ApiService = {
    async fetchData(param) {
        const { url, method, data, params, headers } = param
        let finalUrl = `${appConfig.API_BASE_URL}${url}`
        const session = await auth()
        const token = session.accessToken
        const defaultHeaders = {
            'Content-Type': 'application/json',
        }

        if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`
        }

        const options = {
            method,
            headers: {
                ...defaultHeaders,
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
            
            if (response.ok) {
                return response.text(); 
            }
            const errorText = await response.text();
            return Promise.reject(new Error(errorText));
        })
    },

    async fetchDataWithAxios(param) {
        const session = await auth();
        const token = session?.user?.token;

        const headers = param.headers || {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Ensure the base URL is prepended by Axios
        const finalParam = {
            ...param,
            headers,
        }

        return new Promise((resolve, reject) => {
            AxiosBase(finalParam)
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
