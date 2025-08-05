'use server'
import { apiGetUser } from '@/services/UsersService'
import { auth } from '@/auth'

const getUser = async (id) => {
    console.log('Fetching user with id:', id)
    try {
        const session = await auth()
        const accessToken = session?.accessToken
        const resp = await apiGetUser(id, accessToken)
        console.log('API response in getUser:', resp)
        if (resp) {
            return resp
        }
        return null
    } catch (errors) {
        console.error('Error in getUser:', errors)
        return null
    }
}

export default getUser
