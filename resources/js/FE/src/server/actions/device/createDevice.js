'use server'

import { apiCreateDevice } from '@/services/device/DeviceService'
import { withAuthCheck } from '@/utils/withAuthCheck'

export default async function createDevice(data) {
    return withAuthCheck(async () => {
        try {
            const response = await apiCreateDevice(data)
            return {
                success: true,
                message: 'Device created successfully',
                data: response,
            }
        } catch (error) {
            console.error("Error creating device:", error)
            
            // Handle validation errors
            if (error.response?.status === 422) {
                const validationErrors = error.response.data?.errors || {}
                const errorMessages = Object.values(validationErrors).flat()
                return {
                    success: false,
                    message: errorMessages.length > 0 ? errorMessages.join(', ') : 'Validation failed',
                    errors: validationErrors
                }
            }
            
            return {
                success: false,
                message: error.response?.data?.message || "An unexpected error occurred while creating device.",
            }
        }
    })
}
