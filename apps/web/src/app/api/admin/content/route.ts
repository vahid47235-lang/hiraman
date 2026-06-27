import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { invalidateContent } from '@/data/content'

const OVERRIDE_PATH = path.join(process.cwd(), 'src', 'data', 'content.override.json')
const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? 'hiraban-admin-dev'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

function getToken(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? ''
  if (auth.startsWith('Bearer ')) return auth.slice(7)
  return req.cookies.get('admin_token')?.value ?? ''
}

export async function GET(req: NextRequest) {
  if (getToken(req) !== ADMIN_TOKEN) return unauthorized()
  try {
    const raw = await fs.readFile(OVERRIDE_PATH, 'utf-8')
    return NextResponse.json(JSON.parse(raw))
  } catch {
    // Fall back to default content
    const { default: defaultContent } = await import('@/data/content')
    return NextResponse.json(defaultContent)
  }
}

export async function PUT(req: NextRequest) {
  if (getToken(req) !== ADMIN_TOKEN) return unauthorized()
  const body = await req.json()
  await fs.writeFile(OVERRIDE_PATH, JSON.stringify(body, null, 2), 'utf-8')
  invalidateContent()
  return NextResponse.json({ ok: true })
}
