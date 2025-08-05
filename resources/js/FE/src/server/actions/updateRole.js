'use server'
import { auth } from '@/auth'
import { apiUpdateRole } from '@/services/RolesService'

const updateRole = async (id, data) => {
    try {
        const session = await auth()
        const accessToken = session?.accessToken
        const response = await apiUpdateRole(id, data, accessToken)
        return {
            success: true,
            message: 'Role updated successfully',
            data: response.data,
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update role',
        }
    }
}

export default updateRole
