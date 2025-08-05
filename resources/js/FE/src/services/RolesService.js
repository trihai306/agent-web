import ApiService from './ApiService'

export async function apiGetRoles(params, token) {
    return ApiService.fetchData({
        url: '/roles',
        method: 'get',
        params,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function apiCreateRole(data, token) {
    return ApiService.fetchData({
        url: '/roles',
        method: 'post',
        data,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function apiUpdateRole(id, data, token) {
    return ApiService.fetchData({
        url: `/roles/${id}`,
        method: 'put',
        data,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function apiDeleteRoles(ids, token) {
    return ApiService.fetchData({
        url: '/roles/bulk-delete',
        method: 'post',
        data: { ids },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}
