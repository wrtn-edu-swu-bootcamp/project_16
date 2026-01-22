import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'your-secret-key-min-32-characters-long'
)

export async function signJWT(payload: any, expiresIn = '30d'): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret)
}

export async function verifyJWT(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    throw new Error('Invalid token')
  }
}
