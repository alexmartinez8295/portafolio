import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Esta función se ejecuta para cada petición que coincida con el "matcher"
export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('session_token')?.value;
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  // 1. Si no hay token, no hay acceso. Redirigir a la página de inicio.
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Verificar si el token es válido
  try {
    // jwtVerify arrojará un error si el token es inválido o ha expirado
    await jwtVerify(sessionToken, secret);

    // 3. Si el token es válido, permitir que la petición continúe
    return NextResponse.next();
  } catch (error) {
    console.error('Error de verificación de JWT:', error);
    // 4. Si el token es inválido, redirigir a la página de inicio
    return NextResponse.redirect(new URL('/', request.url));
  }
}

// El "matcher" especifica en qué rutas se debe ejecutar este middleware
export const config = {
  matcher: '/admin/:path*', // Proteger todas las sub-rutas de /admin
};
