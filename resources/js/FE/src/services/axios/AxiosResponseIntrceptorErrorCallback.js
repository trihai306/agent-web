import { signOut } from 'next-auth/react'
import appConfig from '@/configs/app.config'

const AxiosResponseIntrceptorErrorCallback = (error) => {
    const status = error.response?.status

    // Only handle 401 on the client-side
    if (typeof window !== 'undefined' && status === 401) {
        console.log('401 on client, signing out...')
        signOut({ callbackUrl: appConfig.unAuthenticatedEntryPath })
        // We don't reject the promise here because we are handling the error by signing out.
        // This prevents the calling component's error handler from also firing.
        return new Promise(() => {}) // Return a pending promise to halt further execution
    }

    // For all other errors, or for errors on the server, reject the promise
    // so the calling function (.catch() or SWR's onError) can handle it.
    return Promise.reject(error)
}

export default AxiosResponseIntrceptorErrorCallback
