'use server'
import appConfig from '@/configs/app.config'
import { secureFetch } from '@/utils/apiUtils'

const validateCredential = async (values) => {
    const { login, password } = values

    try {
        console.log('🔍 validateCredential: Attempting login to:', `${appConfig.API_BASE_URL}${appConfig.apiPrefix}/login`)
        
        // Use secure fetch with proper SSL and CORS handling
        const response = await secureFetch(`${appConfig.API_BASE_URL}${appConfig.apiPrefix}/login`, {
            method: 'POST',
            body: JSON.stringify({ login, password }),
        })

        if (!response.ok) {
            console.error('❌ Login API request failed:', {
                status: response.status,
                statusText: response.statusText,
                url: `${appConfig.API_BASE_URL}${appConfig.apiPrefix}/login`
            })
            return null
        }
        
        console.log('✅ Login API request successful:', response.status)

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

            // Fetch user permissions after successful login
            try {
                const permissionsResponse = await secureFetch(`${appConfig.API_BASE_URL}${appConfig.apiPrefix}/profile/permissions`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${data.token}`,
                    },
                })

                if (permissionsResponse.ok) {
                    const permissionsData = await permissionsResponse.json()
                    userObject.permissions = permissionsData.permissions
                } else {
                    console.warn('Failed to fetch user permissions')
                    userObject.permissions = { roles: [], permissions: [], permission_groups: {} }
                }
            } catch (error) {
                console.error('Failed to fetch permissions:', error)
                userObject.permissions = { roles: [], permissions: [], permission_groups: {} }
            }

            return {
                ...userObject,
                token: data.token,
            }
        }
        return null
    } catch (error) {
        console.error('❌ Authentication request failed:', {
            message: error.message,
            name: error.name,
            stack: error.stack,
            url: `${appConfig.API_BASE_URL}${appConfig.apiPrefix}/login`
        })
        return null
    }
}

export default validateCredential
