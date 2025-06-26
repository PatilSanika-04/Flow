// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import arcjet, { detectBot, shield } from "@arcjet/next";
// import { NextResponse } from 'next/server';

// const isProtectedRoute = createRouteMatcher([
//   "/dashboard(.*)",
//   "/account(.*)",
//   "/transaction(.*)"
// ]);

// const aj = arcjet({
//   key: process.env.ARCJET_KEY,
//   rules: [
//     shield({ mode: "LIVE" }),
//     detectBot({
//       mode: "LIVE",
//       allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"],
//     })
//   ]
// });

// const baseMiddleware = clerkMiddleware(async (auth, req) => {
//   const { userId } = await auth();
//   if (!userId && isProtectedRoute(req)) {
//     const { redirectToSignIn } = await auth();
//     return redirectToSignIn();
//   }
//   return NextResponse.next();
// });

// // Combine middlewares safely
// export async function middleware(req) {
//   const arcjetRes = await aj(req);
//   if (arcjetRes) return arcjetRes;

//   return baseMiddleware(req);
// }

// export const config = {
//   matcher: [
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     '/(api|trpc)(.*)',
//   ],
// };





import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)"
])

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules:[
    shield({
      mode:'LIVE'
    }),
    detectBot({
      mode:'LIVE',
      allow:["CATEGORY:SEARCH_ENGINE","GO_HTTP"],
    })
  ]
})

const clerk =  clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  if (!userId && isProtectedRoute(req)) {
    const { redirectToSignIn } = await auth();

    return redirectToSignIn();
  }
});

export default createMiddleware(aj,clerk);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};