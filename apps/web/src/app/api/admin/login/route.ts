import { NextRequest, NextResponse } from 'next/server'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? 'hiraban-admin-dev'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'hiraban2025'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_token', ADMIN_TOKEN, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete('admin_token')
  return res
}
