'use server'

import { apiGetUsers } from '@/services/UsersService'
import { auth } from '@/auth'

const getUsers = async (params) => {
    try {
        const session = await auth()
        const accessToken = session?.accessToken
        const resp = await apiGetUsers(params, accessToken)
        if (resp) {
            return {
                success: true,
                list: resp.data,
                total: resp.total,
            }
        }
    } catch (errors) {
        return {
            success: false,
            message: errors?.response?.data?.message || errors.toString(),
        }
    }
}

export default getUsers
