'use server'

import { apiDeleteDevices } from '@/services/device/DeviceService'
import { withAuthCheck } from '@/utils/withAuthCheck'

export default async function deleteDevices(ids) {
    return withAuthCheck(async () => {
        try {
            const response = await apiDeleteDevices({ ids })
            return {
                success: true,
                message: 'Devices deleted successfully',
                data: response,
            }
        } catch (error) {
            console.error("Error deleting devices:", error)
            
            return {
                success: false,
                message: error.response?.data?.message || "An unexpected error occurred while deleting devices.",
            }
        }
    })
}
