import ApiService from '@/services/ApiService'

export async function apiGetInteractionScenarios(params) {
    return ApiService.fetchDataWithAxios({
        url: '/interaction-scenarios',
        method: 'get',
        params,
    })
}

export async function apiGetInteractionScenario(id) {
    return ApiService.fetchDataWithAxios({
        url: `/interaction-scenarios/${id}`,
        method: 'get',
    })
}

export async function apiCreateInteractionScenario(data) {
    return ApiService.fetchDataWithAxios({
        url: '/interaction-scenarios',
        method: 'post',
        data,
    })
}

export async function apiUpdateInteractionScenario(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/interaction-scenarios/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteInteractionScenario(id) {
    return ApiService.fetchDataWithAxios({
        url: `/interaction-scenarios/${id}`,
        method: 'delete',
    })
} 