import ApiService from './ApiService'

export async function apiGetPermissions(params) {
    return ApiService.fetchData({
        url: '/permissions',
        method: 'get',
        params,
    })
}

export async function apiCreatePermission(data) {
    return ApiService.fetchData({
        url: '/permissions',
        method: 'post',
        data,
    })
}

export async function apiUpdatePermission(id, data) {
    return ApiService.fetchData({
        url: `/permissions/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeletePermissions(ids) {
    return ApiService.fetchData({
        url: '/permissions/bulk-delete',
        method: 'post',
        data: { ids },
    })
}
