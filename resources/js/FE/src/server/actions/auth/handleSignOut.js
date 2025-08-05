'use server'

import { signOut, auth } from '@/auth'
import appConfig from '@/configs/app.config'
import { apiLogout } from '@/services/AuthService'

const handleSignOut = async () => {
    const session = await auth()
    const token = session?.accessToken

    if (token) {
        try {
            await apiLogout(token)
        } catch (error) {
            console.error('Failed to log out from server:', error)
        }
    }
    await signOut({ redirectTo: appConfig.unAuthenticatedEntryPath })
}

export default handleSignOut
