import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import crypto from 'crypto'

const COOKIE_NAME = 'webcam_auth'
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 // 30 days

function hashPassword(password: string): string {
  return crypto.createHmac('sha256', 'houndaround-webcam').update(password).digest('hex')
}

function parseTime(timeStr: string): {hour: number; minute: number} {
  const [h, m] = timeStr.split(':').map(Number)
  return {hour: h, minute: m ?? 0}
}

function isWithinOperatingHours(): boolean {
  const openStr = process.env.WEBCAM_OPEN_HOUR || '8:30'
  const closeStr = process.env.WEBCAM_CLOSE_HOUR || '16:30'
  const open = parseTime(openStr)
  const close = parseTime(closeStr)

  const now = new Date(
    new Date().toLocaleString('en-US', {timeZone: 'America/Chicago'}),
  )
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const openMinutes = open.hour * 60 + open.minute
  const closeMinutes = close.hour * 60 + close.minute

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes
}

export async function GET() {
  if (!isWithinOperatingHours()) {
    return NextResponse.json({authenticated: false, outsideHours: true})
  }

  const password = process.env.WEBCAM_PASSWORD
  if (!password) {
    return NextResponse.json({authenticated: true})
  }

  const cookieStore = await cookies()
  const cookie = cookieStore.get(COOKIE_NAME)
  const expectedHash = hashPassword(password)
  const authenticated = cookie?.value === expectedHash

  return NextResponse.json({authenticated})
}

export async function POST(request: Request) {
  if (!isWithinOperatingHours()) {
    return NextResponse.json({success: false, outsideHours: true}, {status: 403})
  }

  const password = process.env.WEBCAM_PASSWORD
  if (!password) {
    return NextResponse.json({success: true, authenticated: true})
  }

  const body = await request.json()
  const submitted = body.password as string

  if (!submitted || submitted !== password) {
    return NextResponse.json({success: false, error: 'Invalid password'}, {status: 401})
  }

  const hash = hashPassword(password)
  const response = NextResponse.json({success: true, authenticated: true})
  response.cookies.set(COOKIE_NAME, hash, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })

  return response
}
