import ApiService from '@/services/ApiService'

export async function apiGetDevices(params) {
    return ApiService.fetchDataWithAxios({
        url: '/devices',
        method: 'get',
        params,
    })
}

export async function apiGetDevice(id) {
    return ApiService.fetchDataWithAxios({
        url: `/devices/${id}`,
        method: 'get',
    })
}

export async function apiCreateDevice(data) {
    return ApiService.fetchDataWithAxios({
        url: '/devices',
        method: 'post',
        data,
    })
}

export async function apiUpdateDevice(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/devices/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteDevice(id) {
    return ApiService.fetchDataWithAxios({
        url: `/devices/${id}`,
        method: 'delete',
    })
} 