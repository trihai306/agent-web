import ApiService from './ApiService'

export async function apiGetAnalyticDashboard(token) {
    return ApiService.fetchData({
        url: '/analytic/transactions',
        method: 'get',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}
