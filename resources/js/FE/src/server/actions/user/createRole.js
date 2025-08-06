// resources/js/FE/src/server/actions/createRole.js
'use server'

import { apiCreateRole } from '@/services/user/RolesService'
import { withAuthCheck } from '@/utils/withAuthCheck'

/**
 * Server Action to create a role.
 * The core logic is wrapped with `withAuthCheck` to handle authentication errors centrally.
 */
export default async function createRole(data) {
    return withAuthCheck(async () => {
        try {
            const response = await apiCreateRole(data)
            return {
                success: true,
                message: 'Role created successfully',
                data: response.data,
            }
        } catch (error) {
            console.error("Error creating role:", error)
            return {
                success: false,
                message: "An unexpected error occurred while creating role.",
            }
        }
    })
}
