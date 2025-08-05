'use server'
import { apiGetPermission } from '@/services/PermissionsService'
import { auth } from '@/auth'

const getPermission = async (id) => {
    try {
        const session = await auth()
        const accessToken = session?.accessToken
        const resp = await apiGetPermission(id, accessToken)
        if (resp) {
            return resp
        }
        return null
    } catch (errors) {
        return null
    }
}

export default getPermission
