import ApiService from './ApiService'

export async function apiSignIn(data) {
    return ApiService.fetchData({
        url: '/login',
        method: 'post',
        data,
    })
}

export async function apiSignUp(data) {
    return ApiService.fetchDataWithAxios({
        url: '/register',
        method: 'post',
        data,
    })
}

export async function apiLogout(token) {
    return ApiService.fetchDataWithAxios({
        url: '/logout',
        method: 'post',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function apiForgotPassword(data) {
    return ApiService.fetchDataWithAxios({
        url: '/forgot-password',
        method: 'post',
        data,
    })
}

export async function apiResetPassword(data) {
    return ApiService.fetchDataWithAxios({
        url: '/reset-password',
        method: 'post',
        data,
    })
}

export async function apiGetProfile(token) {
    return ApiService.fetchDataWithAxios({
        url: '/profile',
        method: 'get',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function apiChangePassword(data, token) {
    return ApiService.fetchData({
        url: '/profile/change-password',
        method: 'post',
        data,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}
