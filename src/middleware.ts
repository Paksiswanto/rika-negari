import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token  = req.cookies.get('admin_token')?.value
  const secret = process.env.ADMIN_SECRET

  const isAdminPage  = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPage  = req.nextUrl.pathname === '/admin/login'

  if (isLoginPage && token === secret) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  if (isAdminPage && !isLoginPage && token !== secret) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}