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
                const user = await validateCredential(credentials)
                if (user) {
                    return user
                }
                return null
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // Initial sign-in
                token.id = user.id
                token.name = user.full_name // Use full_name from API
                token.email = user.email
                token.avatar = user.avatar
                token.accessToken = user.token
                token.first_name = user.first_name
                token.last_name = user.last_name
                // Set the token's expiration time
                const expiresIn = user.expires_in || 60 // Default to 60 minutes if not provided
                token.accessTokenExpires = Date.now() + expiresIn * 60 * 1000 // Convert minutes to milliseconds
            }

            // Return previous token if the access token has not expired yet
            if (Date.now() < token.accessTokenExpires) {
                return token
            }

            // Access token has expired, try to update it
            // For now, we will just sign the user out by returning null
            // In the future, you might want to implement a token refresh mechanism here
            return null
        },
        async session({ session, token }) {
            session.user.id = token.id
            session.user.name = token.name
            session.user.email = token.email
            session.user.avatar = token.avatar
            session.accessToken = token.accessToken
            session.user.first_name = token.first_name
            session.user.last_name = token.last_name
            session.user.authority = ['admin', 'user'] // Mock authority
            return session
        },
    },
}
