'use server'
import { apiUpdatePermission } from '@/services/PermissionsService'
import { auth } from '@/auth'

const updatePermission = async (id, data) => {
    try {
        const session = await auth()
        const accessToken = session?.accessToken
        await apiUpdatePermission(id, data, accessToken)
        return {
            success: true,
            message: 'Permission updated successfully',
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update permission',
        }
    }
}

export default updatePermission
