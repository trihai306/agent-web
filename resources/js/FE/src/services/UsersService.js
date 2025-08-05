import ApiService from './ApiService'

const getHeaders = (token) => {
    const headers = {
        'Content-Type': 'application/json',
    }
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }
    return headers
}

export async function apiGetUsers(params, token) {
    return ApiService.fetchDataWithAxios({
        url: '/users',
        method: 'get',
        params,
        headers: getHeaders(token),
    })
}

export async function apiGetUser(id, token) {
    return ApiService.fetchDataWithAxios({
        url: `/users/${id}`,
        method: 'get',
        headers: getHeaders(token),
    })
}

export async function apiCreateUser(data, token) {
    return ApiService.fetchDataWithAxios({
        url: '/users',
        method: 'post',
        data,
        headers: getHeaders(token),
    })
}

export async function apiUpdateUser(id, data, token) {
    return ApiService.fetchDataWithAxios({
        url: `/users/${id}`,
        method: 'put',
        data,
        headers: getHeaders(token),
    })
}

export async function apiDeleteUsers(data, token) {
    return ApiService.fetchDataWithAxios({
        url: '/users/delete-multiple',
        method: 'delete',
        data,
        headers: getHeaders(token),
    })
}

export async function apiUpdateUserStatus(data, token) {
    return ApiService.fetchDataWithAxios({
        url: '/users/bulk-update-status',
        method: 'post',
        data,
        headers: getHeaders(token),
    })
}
