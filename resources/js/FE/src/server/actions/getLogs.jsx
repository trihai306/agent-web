import { auth } from '@/auth'
import { apiGetLogs } from '@/services/LogService'

const getLogs = async (activityIndex = 1, filter) => {
    const session = await auth()
    const token = session?.accessToken

    if (!token) {
        return { data: [], loadable: false }
    }

    try {
        const response = await apiGetLogs({ activityIndex, filter }, token)
        return response
    } catch (error) {
        console.error('Error fetching logs:', error)
        return { data: [], loadable: false }
    }
}

export default getLogs
