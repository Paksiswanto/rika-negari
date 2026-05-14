import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME!
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!
const SECRET         = process.env.ADMIN_SECRET!   // random string bebas

export async function POST(req: Request) {
  const { username, password } = await req.json()

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid' }, { status: 401 })
  }

  cookies().set('admin_token', SECRET, {
    httpOnly: true,
    secure  : process.env.NODE_ENV === 'production',
    maxAge  : 60 * 60 * 24 * 7, // 7 hari
    path    : '/',
    sameSite: 'lax',
  })

  return NextResponse.json({ ok: true })
}