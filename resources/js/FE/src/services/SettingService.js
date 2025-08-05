import ApiService from './ApiService'

export async function apiGetSettings(token) {
    return ApiService.fetchData({
        url: '/settings',
        method: 'get',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function apiUpdateSettings(data, token) {
    return ApiService.fetchData({
        url: '/settings',
        method: 'post',
        data,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}
