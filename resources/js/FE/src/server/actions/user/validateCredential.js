'use server'
import appConfig from '@/configs/app.config'

const validateCredential = async (values) => {
    const { login, password } = values

    try {
        // Use native fetch to call the login API directly.
        // This avoids using the global Axios instance and breaks the circular dependency.
        const response = await fetch(`${appConfig.API_BASE_URL}${appConfig.apiPrefix}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({ login, password }),
        })

        if (!response.ok) {
            console.error('Login API request failed:', response.statusText)
            return null
        }

        const data = await response.json()

        if (data && data.user && data.token) {
            let userObject = data.user

            // Safely handle user data: parse if it's a string, use directly if it's an object.
            if (typeof userObject === 'string') {
                try {
                    userObject = JSON.parse(userObject)
                } catch (e) {
                    console.error('Failed to parse user data:', e)
                    return null
                }
            }

            return {
                ...userObject,
                token: data.token,
            }
        }
        return null
    } catch (error) {
        console.error('Authentication request failed:', error)
        return null
    }
}

export default validateCredential
