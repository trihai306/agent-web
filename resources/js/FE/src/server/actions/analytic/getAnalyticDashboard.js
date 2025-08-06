// resources/js/FE/src/server/actions/getAnalyticDashboard.js
'use server'

import { apiGetAnalyticDashboard } from '@/services/analytic/AnalyticService'
import { withAuthCheck } from '@/utils/withAuthCheck'

/**
 * Server Action to fetch the analytic dashboard data.
 * The core logic is wrapped with `withAuthCheck` to handle authentication errors centrally.
 */
export default async function getAnalyticDashboard() {
    return withAuthCheck(async () => {
        try {
            const resp = await apiGetAnalyticDashboard()
            return {
                success: true,
                data: resp,
            }
        } catch (error) {
            // This catch block now only handles non-authentication errors.
            console.error("Error fetching analytics dashboard:", error)
            return {
                success: false,
                message: "An unexpected error occurred while fetching dashboard data."
            }
        }
    })
}
