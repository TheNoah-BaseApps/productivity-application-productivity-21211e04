import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-min-32-characters-long'
);

export async function signToken(payload) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(SECRET_KEY);

    return token;
  } catch (error) {
    console.error('Token signing error:', error);
    throw new Error('Failed to sign token');
  }
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return { valid: true, payload };
  } catch (error) {
    console.error('Token verification error:', error);
    return { valid: false, payload: null };
  }
}