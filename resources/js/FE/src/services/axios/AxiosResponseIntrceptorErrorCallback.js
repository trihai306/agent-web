import { signOut } from 'next-auth/react'

const AxiosResponseIntrceptorErrorCallback = (error) => {
    console.log(error)
    // Check if the code is running on the client side before calling signOut
    if (typeof window !== 'undefined' && error.response?.status === 401) {
        // next-auth's signOut will handle session state updates.
        // We just need to trigger it.
        signOut()
    }
    console.error('API Error:', error)
}

export default AxiosResponseIntrceptorErrorCallback
