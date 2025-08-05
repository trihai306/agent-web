'use server'

import { auth } from '@/auth'
import { apiGetAnalyticDashboard } from '@/services/AnalyticService'

const getAnalyticDashboard = async () => {
    try {
        const session = await auth()
        const accessToken = session?.accessToken
        const resp = await apiGetAnalyticDashboard(accessToken)
        console.log(resp)
        if (resp) {
            return {
                success: true,
                data: resp,
            }
        }
         return {
            success: false,
            message: 'Failed to fetch analytics data',
        }
    } catch (errors) {
        return {
            success: false,
            message: errors?.response?.data?.message || errors.toString(),
        }
    }
}

export default getAnalyticDashboard
