// resources/js/FE/src/server/actions/auth/getProfile.js
'use server'

import { apiGetProfile } from '@/services/auth/AuthService'
import { withAuthCheck } from '@/utils/withAuthCheck'

/**
 * Server Action to fetch the current user's profile.
 */
export default async function getProfile() {
    return withAuthCheck(async () => {
        try {
            const resp = await apiGetProfile()
            return { success: true, data: resp }
        } catch (error) {
            console.error("Error fetching profile:", error)
            return { success: false, message: "An unexpected error occurred." }
        }
    })
}
