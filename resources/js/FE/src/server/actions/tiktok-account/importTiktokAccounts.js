'use server'

import { apiImportTiktokAccounts } from '@/services/tiktok-account/TiktokAccountService'
import { revalidatePath } from 'next/cache'
import { withAuthCheck } from '@/utils/withAuthCheck'

const importTiktokAccounts = async (data) => {
    return withAuthCheck(async () => {
        try {
            console.log('Import data received:', data)
            
            // Kiểm tra accountList có dữ liệu không
            if (!data.accountList || !data.accountList.trim()) {
                return {
                    success: false,
                    message: 'Danh sách tài khoản không được để trống'
                }
            }

            // Chuẩn bị data để gửi API
            const importData = {
                accountList: data.accountList,
                enableRunningStatus: data.enableRunningStatus,
                autoAssign: data.autoAssign,
            }

            // Chỉ thêm deviceId và scenarioId nếu có giá trị
            if (data.deviceId && data.deviceId.trim()) {
                importData.deviceId = String(data.deviceId)
            }
            if (data.scenarioId && data.scenarioId.trim()) {
                importData.scenarioId = String(data.scenarioId)
            }

            console.log('Import data to send:', importData)
            const response = await apiImportTiktokAccounts(importData)
            console.log('API response:', response)
            
            revalidatePath('/concepts/tiktok-account-management')
            
            return {
                success: true,
                message: response.message || `Đã nhập thành công`,
                data: response
            }
        } catch (error) {
            console.error('Error importing TikTok accounts:', error)
            return {
                success: false,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi nhập tài khoản'
            }
        }
    })
}

export default importTiktokAccounts 