'use server'
import { get } from '@/services/ApiService'

const getTransactionAnalyticDashboard = async () => {
    try {
        const response = await get('/analytic/transactions')
        return response.data
    } catch (error) {
        console.error('Error fetching transaction analytic dashboard data:', error)
        return {}
    }
}

export default getTransactionAnalyticDashboard
