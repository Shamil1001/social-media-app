import NextAuth from "next-auth" 
import GoogleProvider from "next-auth/providers/google" 

const clientId = process.env.GOOGLE_CLIENT_ID ?? "" 
const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? "" 
const nextAuthSecret = process.env.NEXTAUTH_SECRET ?? "" 

interface CallbackProps{
  session: any,
  token: any
}
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: clientId,
      clientSecret: clientSecret,
    }),
  ],

  callbacks: {
    async session({ session, token }: CallbackProps) {
      session.user.tag = session.user.name
        .split(" ")
        .join("")
        .toLocaleLowerCase();

      session.user.uid = token.sub;
      return session;
    },
  },

  secret: nextAuthSecret,
} 

export default NextAuth(authOptions) 
