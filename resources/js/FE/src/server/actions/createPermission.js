'use server'
import { apiCreatePermission } from '@/services/PermissionsService'
import { auth } from '@/auth'

const createPermission = async (data) => {
    try {
        const session = await auth()
        const accessToken = session?.accessToken
        await apiCreatePermission(data, accessToken)
        return {
            success: true,
            message: 'Permission created successfully',
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create permission',
        }
    }
}

export default createPermission
