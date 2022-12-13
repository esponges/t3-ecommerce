import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // check if the route is any of the admin dashboard routes
    const nextUrl = req.nextUrl.pathname;
    if (nextUrl.startsWith("/d") && !nextUrl.startsWith('/d/login') && !nextUrl.startsWith('/checkout')) {

      // check for the admin user token
      if (!req.cookies.get('store-admin-token')) {
        return NextResponse.redirect(`${req.nextUrl.origin}/d/login`);
      }
    }
    
    // let user proceed since they are authenticated
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token: _token }) => {
        // token always returning null
        // temporary workaround is to use req.cookies
        console.log('checking if authorized', req.cookies.get('next-auth.session-token'));

        // if truthy, user is authenticated - can proceed
        return !!req.cookies.get('next-auth.session-token');
      }
    },
  }
)

export const config = { matcher: ["/checkout/:path*", "/d/:path*"] }
