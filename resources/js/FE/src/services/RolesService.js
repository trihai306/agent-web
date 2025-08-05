import ApiService from './ApiService'

export async function apiGetRoles(params) {
    return ApiService.fetchData({
        url: '/roles',
        method: 'get',
        params,
    })
}

export async function apiCreateRole(data) {
    return ApiService.fetchData({
        url: '/roles',
        method: 'post',
        data,
    })
}

export async function apiUpdateRole(id, data) {
    return ApiService.fetchData({
        url: `/roles/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteRoles(ids) {
    return ApiService.fetchData({
        url: '/roles/bulk-delete',
        method: 'post',
        data: { ids },
    })
}
