'use server'
import { apiDeletePermissions } from '@/services/PermissionsService'
import { auth } from '@/auth'

const deletePermissions = async (ids) => {
    try {
        const session = await auth()
        const accessToken = session?.accessToken
        await apiDeletePermissions(ids, accessToken)
        return {
            success: true,
            message: 'Permissions deleted successfully',
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete permissions',
        }
    }
}

export default deletePermissions
