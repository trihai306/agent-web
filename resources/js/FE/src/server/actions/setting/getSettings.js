// resources/js/FE/src/server/actions/setting/getSettings.js
'use server'

import { apiGetSettings } from '@/services/setting/SettingService'
import { withAuthCheck } from '@/utils/withAuthCheck'

/**
 * Server Action to fetch settings.
 */
export default async function getSettings() {
    return withAuthCheck(async () => {
        try {
            const resp = await apiGetSettings()
            return { success: true, data: resp }
        } catch (error) {
            console.error("Error fetching settings:", error)
            return { success: false, message: "An unexpected error occurred." }
        }
    })
}
