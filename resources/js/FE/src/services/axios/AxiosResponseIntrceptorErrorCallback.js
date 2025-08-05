import { signOut } from 'next-auth/react'

const AxiosResponseIntrceptorErrorCallback = (error) => {
    if (error.response?.status === 401) {
        // next-auth's signOut will handle session state updates.
        // We just need to trigger it.
        signOut()
    }
    console.error('API Error:', error)
}

export default AxiosResponseIntrceptorErrorCallback
