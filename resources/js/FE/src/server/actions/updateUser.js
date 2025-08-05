'use server'

import { apiUpdateUser } from '@/services/UsersService'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'

const updateUser = async (id, data) => {
    try {
        const session = await auth()
        const accessToken = session?.accessToken
        const resp = await apiUpdateUser(id, data, accessToken)
        if (resp) {
            revalidatePath('/concepts/user-management')
            return {
                success: true,
                message: 'User updated successfully!',
            }
        }
    } catch (errors) {
        return {
            success: false,
            message: errors?.response?.data?.message || errors.toString(),
        }
    }
}

export default updateUser
