import ApiService from './ApiService'

const getHeaders = (token) => {
    const headers = {
        'Content-Type': 'application/json',
    }
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }
    return headers
}

export async function apiGetTransactions(params, token) {
    return ApiService.fetchDataWithAxios({
        url: '/transactions',
        method: 'get',
        params,
        headers: getHeaders(token),
    })
}

export async function apiDeleteTransactions(data, token) {
    return ApiService.fetchDataWithAxios({
        url: '/transactions/bulk-delete',
        method: 'post',
        data,
        headers: getHeaders(token),
    })
}
