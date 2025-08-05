import ApiService from './ApiService'

export async function apiGetPermissions(params, token) {
    return ApiService.fetchData({
        url: '/permissions',
        method: 'get',
        params,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function apiCreatePermission(data, token) {
    return ApiService.fetchData({
        url: '/permissions',
        method: 'post',
        data,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function apiUpdatePermission(id, data, token) {
    return ApiService.fetchData({
        url: `/permissions/${id}`,
        method: 'put',
        data,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function apiDeletePermissions(ids, token) {
    return ApiService.fetchData({
        url: '/permissions/bulk-delete',
        method: 'post',
        data: { ids },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}
