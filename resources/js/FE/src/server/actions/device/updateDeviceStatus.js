'use server'

import { apiUpdateDeviceStatus } from '@/services/device/DeviceService'
import { withAuthCheck } from '@/utils/withAuthCheck'

export default async function updateDeviceStatus(ids, status) {
    return withAuthCheck(async () => {
        try {
            const response = await apiUpdateDeviceStatus({ ids, status })
            return {
                success: true,
                message: 'Device status updated successfully',
                data: response,
            }
        } catch (error) {
            console.error("Error updating device status:", error)
            
            return {
                success: false,
                message: error.response?.data?.message || "An unexpected error occurred while updating device status.",
            }
        }
    })
}
