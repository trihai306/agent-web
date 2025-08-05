'use server'
import { apiGetPermissions } from '@/services/PermissionsService'
import { auth } from '@/auth'

const getPermissions = async (params) => {
    try {
        const session = await auth()
        const accessToken = session?.accessToken
        const resp = await apiGetPermissions(params, accessToken)
        if (resp) {
            return {
                success: true,
                list: resp.data,
                total: resp.total,
            }
        }
    } catch (errors) {
        return {
            success: false,
            message: errors?.response?.data?.message || errors.toString(),
            list: [],
            total: 0,
        }
    }
}

export default getPermissions
