// resources/js/FE/src/server/actions/account/getSettingsBilling.js
'use server'

import { apiGetSettingsBilling } from '@/services/account/AccountService'
import { withAuthCheck } from '@/utils/withAuthCheck'

/**
 * Server Action to fetch billing settings.
 */
export default async function getSettingsBilling() {
    return withAuthCheck(async () => {
        try {
            const resp = await apiGetSettingsBilling()
            return { success: true, data: resp }
        } catch (error) {
            console.error("Error fetching billing settings:", error)
            return { success: false, message: "An unexpected error occurred." }
        }
    })
}
