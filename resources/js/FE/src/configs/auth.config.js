import validateCredential from '../server/actions/user/validateCredential'
import Credentials from 'next-auth/providers/credentials'
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    providers: [
        Github({
            clientId: process.env.GITHUB_AUTH_CLIENT_ID,
            clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET,
        }),
        Google({
            clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                console.log('🔍 Credentials authorize called with:', credentials)
                const user = await validateCredential(credentials)
                console.log('👤 validateCredential returned:', user)
                if (user) {
                    console.log('✅ User authenticated successfully:', user.email)
                    return user
                }
                console.log('❌ Authentication failed - user is null')
                return null
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            console.log('🔑 JWT callback called:', { hasUser: !!user, hasToken: !!token })
            if (user) {
                console.log('👤 Processing new user in JWT:', user)
                // Initial sign-in
                token.id = user.id
                token.name = user.full_name // Use full_name from API
                token.email = user.email
                token.avatar = user.avatar
                token.accessToken = user.token
                token.first_name = user.first_name
                token.last_name = user.last_name
                token.roles = user.roles || []
                token.login_token = user.login_token
                token.permissions = user.permissions || { roles: [], permissions: [], permission_groups: {} }
                // Set a long expiration time for simplicity, as we don't have refresh tokens yet
                token.accessTokenExpires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
                console.log('✅ JWT token created:', { id: token.id, email: token.email })
            }

            // Return previous token if it has not expired yet
            if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
                console.log('🔄 Returning existing valid token')
                return token
            }

            // In a real-world app, you'd handle token refresh here.
            // For this project, we'll just let the session expire.
            console.log('⏰ Token expired or invalid')
            return null
        },
        async session({ session, token }) {
            console.log('📋 Session callback called:', { hasToken: !!token })
            if (token) {
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.avatar = token.avatar
                session.accessToken = token.accessToken
                session.user.login_token = token.login_token // Add permanent login_token for device connection
                session.user.first_name = token.first_name
                session.user.last_name = token.last_name
                session.user.roles = token.permissions?.roles || []
                session.user.permissions = token.permissions?.permissions || []
                session.user.permission_groups = token.permissions?.permission_groups || {}
                console.log('✅ Session created for user:', session.user.email)
            } else {
                console.log('❌ No token available for session')
            }
            return session
        },
    },
}
