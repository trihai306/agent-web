'use server'
import ApiService from '@/services/ApiService'

const getTransactionAnalyticDashboard = async () => {
    try {
        const response = await ApiService.fetchData({
            url: '/analytic/transactions',
            method: 'get',
        })
        return response.data
    } catch (error) {
        console.error('Error fetching transaction analytic dashboard data:', error)
        return {}
    }
}

export default getTransactionAnalyticDashboard
