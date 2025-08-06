// resources/js/FE/src/server/actions/updateRole.js
'use server'

import { apiUpdateRole } from '@/services/user/RolesService'
import { withAuthCheck } from '@/utils/withAuthCheck'

/**
 * Server Action to update a role.
 * The core logic is wrapped with `withAuthCheck` to handle authentication errors centrally.
 */
export default async function updateRole(id, data) {
    return withAuthCheck(async () => {
        try {
            const response = await apiUpdateRole(id, data)
            return {
                success: true,
                message: 'Role updated successfully',
                data: response.data,
            }
        } catch (error) {
            console.error("Error updating role:", error)
            return {
                success: false,
                message: "An unexpected error occurred while updating role.",
            }
        }
    })
}
