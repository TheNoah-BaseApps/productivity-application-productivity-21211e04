import { verifyToken } from './jwt';

export async function verifyAuth(request) {
  try {
    // Get token from cookie or Authorization header
    const cookieToken = request.cookies.get('auth-token')?.value;
    const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
    
    const token = cookieToken || headerToken;

    if (!token) {
      return { authenticated: false, user: null };
    }

    const { valid, payload } = await verifyToken(token);

    if (!valid || !payload) {
      return { authenticated: false, user: null };
    }

    return {
      authenticated: true,
      user: {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      },
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { authenticated: false, user: null };
  }
}

export function requireAuth(handler) {
  return async (request, context) => {
    const authResult = await verifyAuth(request);

    if (!authResult.authenticated) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    request.user = authResult.user;
    return handler(request, context);
  };
}