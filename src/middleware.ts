import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Use the jwtVerify function from the jose library

const secret = new TextEncoder().encode("mangodbzxyc"); // Encode the secret to be used with jose

export async function middleware(request: NextRequest) {
  // Retrieve the token from the cookiesa
  const token = request.cookies.get("token")?.value || null;

  // Debugging log to check if the token was retrieved successfully
  console.log("Token from cookies:", token);

  // Check if the request is to a protected route under /admindb
  if (request.nextUrl.pathname.startsWith("/admindb")) {
    // If no token is found, redirect to login
    if (!token) {
      console.log("Token not found, redirecting to login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      // Attempt to verify the JWT token using the secret
      await jwtVerify(token, secret);
      // If verification succeeds, allow the request to proceed
      return NextResponse.next();
    } catch (error) {
      console.error("JWT verification failed:", error);
      // If verification fails, redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Allow access to non-protected routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/admindb/:path*"], // Protect any route under /admindb
};


// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";
// import { jwtVerify } from "jose"; // Use the jwtVerify function from the jose library

// const secret = new TextEncoder().encode("mangodbzxyc"); // Encode the secret to be used with jose

// export async function middleware(request: NextRequest) {
//   const token = request.cookies.get("token")?.value; // Extract the value from RequestCookie

//   // Log the token for debugging purposes
//   console.log("Token from cookies:", token);

//   if (request.nextUrl.pathname.startsWith("/admindb")) {
//     if (!token) {
//       console.log("Token not found, redirecting to login");
//       return NextResponse.redirect(new URL("/login", request.url)); // Redirect to login if not authenticated
//     }

//     try {
//       // Verify the token using jose
//       await jwtVerify(token, secret); // Verify the token (string or Uint8Array)
//       return NextResponse.next(); // Allow access if token is valid
//     } catch (error) {
//       console.error("JWT verification failed:", error);
//       return NextResponse.redirect(new URL("/login", request.url)); // Redirect if verification fails
//     }
//   }

//   return NextResponse.next(); // Allow access to other routes
// }

// export const config = {
//   matcher: ["/admindb/:path*"], // Protect any route under /admindb
// };
