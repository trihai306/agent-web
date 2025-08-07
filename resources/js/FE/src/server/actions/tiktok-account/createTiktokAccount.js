'use server'

import { apiCreateTiktokAccount } from '@/services/tiktok-account/TiktokAccountService'
import { revalidatePath } from 'next/cache'
import { withAuthCheck } from '@/utils/withAuthCheck'

export default async function createTiktokAccount(data) {
    return withAuthCheck(async () => {
        try {
            const response = await apiCreateTiktokAccount(data)
            revalidatePath('/concepts/tiktok-account-management')
            
            return {
                success: true,
                data: response.data,
                message: 'Tiktok account created successfully'
            }
        } catch (error) {
            console.error('Error creating tiktok account:', error)
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to create tiktok account'
            }
        }
    })
} 