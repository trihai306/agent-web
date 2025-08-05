'use server'

import { apiGetUsers } from '@/services/UsersService'

const getUsers = async (params) => {
    try {
        const resp = await apiGetUsers(params)
        if (resp) {
            return {
                success: true,
                list: resp.data || [], // Ensure list is always an array
                total: resp.total || 0, // Ensure total is always a number
            }
        }
        // Return a default structure if resp is falsy
        return {
            success: false,
            message: 'Failed to fetch users.',
            list: [],
            total: 0,
        }
    } catch (errors) {
        return {
            success: false,
            message: errors?.response?.data?.message || errors.toString(),
            list: [],
            total: 0,
        }
    }
}

export default getUsers
