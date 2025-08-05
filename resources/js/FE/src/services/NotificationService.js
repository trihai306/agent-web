import ApiService from './ApiService'

export async function apiGetNotifications(params, token) {
    return ApiService.fetchDataWithAxios({
        url: '/notifications',
        method: 'get',
        params,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function apiMarkNotificationAsRead(id, token) {
    return ApiService.fetchDataWithAxios({
        url: `/notifications/${id}/read`,
        method: 'patch',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function apiMarkAllNotificationsAsRead(token) {
    return ApiService.fetchDataWithAxios({
        url: '/notifications/mark-all-as-read',
        method: 'post',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}
