'use server'

import { apiCreateUser } from '@/services/UsersService'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'

const createUser = async (data) => {
    try {
        const session = await auth()
        const accessToken = session?.accessToken
        const resp = await apiCreateUser(data, accessToken)
        if (resp) {
            revalidatePath('/concepts/user-management')
            return {
                success: true,
                message: 'User created successfully!',
            }
        }
    } catch (errors) {
        return {
            success: false,
            message: errors?.response?.data?.message || errors.toString(),
        }
    }
}

export default createUser
