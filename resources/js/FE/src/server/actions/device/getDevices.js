'use server'

import { apiGetDevices } from '@/services/device/DeviceService'
import { withAuthCheck } from '@/utils/withAuthCheck'

export default async function getDevices(params = {}) {
    return withAuthCheck(async () => {
        try {
            const response = await apiGetDevices(params)
            
            return {
                success: true,
                list: response.data || [],
                total: response.total || 0,
                message: 'Devices retrieved successfully'
            }
        } catch (error) {
            console.error('Error fetching devices:', error)
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch devices',
                list: [],
                total: 0
            }
        }
    })
}