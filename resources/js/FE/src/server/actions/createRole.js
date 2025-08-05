'use server'
import { auth } from '@/auth'
import { apiCreateRole } from '@/services/RolesService'

const createRole = async (data) => {
    try {
        const session = await auth()
        const accessToken = session?.accessToken
        const response = await apiCreateRole(data, accessToken)
        return {
            success: true,
            message: 'Role created successfully',
            data: response.data,
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create role',
        }
    }
}

export default createRole
