import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'


const isProtectedRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/organisation(.*)",
  "/protect(.*)",
  "/issue(.*)",
])

export default clerkMiddleware(async (auth, request) => {
  if(!(await auth()).userId && isProtectedRoute(request)){
    return (await auth()).redirectToSignIn()
  }

  if(
    (await auth()).userId && !(await auth()).orgId && request.nextUrl.pathname !== "/onboarding" && request.nextUrl.pathname !== "/"
  ) return Response.redirect(new URL("/onboarding", request.url))
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}