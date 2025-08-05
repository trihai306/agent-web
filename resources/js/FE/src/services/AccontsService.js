import ApiService from './ApiService'

export async function apiGetSettingsNotification(token) {
    return ApiService.fetchDataWithAxios({
        url: '/setting/notification',
        method: 'get',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function apiGetSettingsBilling(token) {
    return ApiService.fetchDataWithAxios({
        url: '/setting/billing',
        method: 'get',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function apiGetSettingsIntergration(token) {
    return ApiService.fetchDataWithAxios({
        url: '/setting/intergration',
        method: 'get',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}
