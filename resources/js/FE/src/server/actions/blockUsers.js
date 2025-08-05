'use server'

import { apiUpdateUserStatus } from '@/services/UsersService'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'

const blockUsers = async (userIds) => {
    try {
        const session = await auth()
        const accessToken = session?.accessToken
        const resp = await apiUpdateUserStatus({ ids: userIds, status: 'locked' }, accessToken)
        if (resp) {
            revalidatePath('/concepts/user-management')
            return {
                success: true,
                message: 'Users blocked successfully!',
            }
        }
    } catch (errors) {
        return {
            success: false,
            message: errors?.response?.data?.message || errors.toString(),
        }
    }
}

export default blockUsers
