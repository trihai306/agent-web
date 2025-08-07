'use server'

import { apiGetTiktokAccount } from '@/services/tiktok-account/TiktokAccountService'
import { withAuthCheck } from '@/utils/withAuthCheck'

export default async function getTiktokAccount(id) {
    return withAuthCheck(async () => {
        try {
            const response = await apiGetTiktokAccount(id)
            
            return {
                success: true,
                data: response.data,
                message: 'Tiktok account retrieved successfully'
            }
        } catch (error) {
            console.error('Error fetching tiktok account:', error)
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch tiktok account',
                data: null
            }
        }
    })
} 