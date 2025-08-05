'use server'

import { apiDeleteUsers } from '@/services/UsersService'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'

const deleteUsers = async (userIds) => {
    try {
        const session = await auth()
        const accessToken = session?.accessToken
        const resp = await apiDeleteUsers({ ids: userIds }, accessToken)
        if (resp) {
            revalidatePath('/concepts/user-management')
            return {
                success: true,
                message: 'Users deleted successfully!',
            }
        }
    } catch (errors) {
        return {
            success: false,
            message: errors?.response?.data?.message || errors.toString(),
        }
    }
}

export default deleteUsers
