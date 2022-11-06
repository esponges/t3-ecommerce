import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(_req) {
    // let user proceed since they are authenticated
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: async ({ req, token: _token }) => {
        // token always returning null
        // temporary workaround is to use req.cookies

        // if truthy, user is authenticated - can proceed
        return !!req.cookies.get('next-auth.session-token');
      }
    },
  }
)

export const config = { matcher: ["/checkout/:path*"] }
