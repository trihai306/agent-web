'use server'
import { auth } from '@/auth'
import { apiDeleteRoles } from '@/services/RolesService'

const deleteRoles = async (ids) => {
    try {
        const session = await auth()
        const accessToken = session?.accessToken
        await apiDeleteRoles(ids, accessToken)
        return {
            success: true,
            message: 'Roles deleted successfully',
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete roles',
        }
    }
}

export default deleteRoles
