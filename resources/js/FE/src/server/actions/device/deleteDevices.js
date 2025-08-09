'use server'

import { apiDeleteDevices } from '@/services/device/DeviceService'
import { withAuthCheck } from '@/utils/withAuthCheck'
import { handleServerActionError } from '@/utils/serverActionErrorHandler'

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
            return handleServerActionError(error, "An unexpected error occurred while deleting devices.")
        }
    })
}
