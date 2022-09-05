import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import { dbUsers } from '../../../database'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // Custom credentials
    Credentials({
      name: 'Custom login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your-email@example.com' },
        password: { label: 'Passowrd', type: 'password', placeholder: ' Password' }
      },
      async authorize (credentials) {
        return await dbUsers.checkUserEmailPassword( credentials!.email, credentials!.password )
      }
    })
  ],
  // Custom pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },

  session: {
    maxAge: 2592000, // 30 days
    strategy: 'jwt',
    updateAge: 86400, // each day
  },

  // Callbacks
  callbacks: {
    async jwt({ token, account, user }) {
      if ( account ) {
        token.accessToken = account.access_token

        switch ( account.type ) {
          case 'oauth':
            token.user = await dbUsers.oAuthToDbUser( user?.email || '', user?.name || '' )
            break

          case 'credentials':
            token.user = user
            break
        }
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.user = token.user as any
      return session
    }
  }
})
