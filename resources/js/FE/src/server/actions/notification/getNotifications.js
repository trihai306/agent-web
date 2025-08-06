// resources/js/FE/src/server/actions/notification/getNotifications.js
'use server'

import { apiGetNotifications } from '@/services/notification/NotificationService'
import { withAuthCheck } from '@/utils/withAuthCheck'

/**
 * Server Action to fetch notifications.
 */
export default async function getNotifications(params) {
    return withAuthCheck(async () => {
        try {
            const resp = await apiGetNotifications(params)
            return { success: true, data: resp }
        } catch (error) {
            console.error("Error fetching notifications:", error)
            return { success: false, message: "An unexpected error occurred." }
        }
    })
}
