import ApiService from '@/services/ApiService'

export async function apiGetUserTransactions(params, token) {
    return ApiService.fetchData({
        url: '/my-transactions',
        method: 'get',
        params,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}
