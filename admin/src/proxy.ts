import { NextResponse } from "next/server";

// Auth is handled client-side by AdminAuthProvider.
// The refreshToken cookie is set by api.jesupwireless.com (different domain)
// and is not visible here, so server-side cookie checks always fail.
export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
