import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // check if the route is any of the admin dashboard routes
    const nextUrl = req.nextUrl.pathname;
    if (nextUrl.startsWith("/d") && !nextUrl.startsWith('/d/login') && !nextUrl.startsWith('/checkout')) {

      // check for the admin user token
      // TODO: some users will have this cookie added
      // this must be checked against the database
      // if (!req.cookies.get('store-admin-token')) {
      //   return NextResponse.redirect(`${req.nextUrl.origin}/d/login`);
      // }
    }
    
    // let user proceed since they are authenticated
    return NextResponse.next();
  },
  {
    callbacks: {
      // this callback will run on every request that matches the `matcher` option
      // if its returns truthy the middleware will let the request proceed
      // TODO: for the dashboard, check if the user is an admin, and not if she is authenticated only
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
