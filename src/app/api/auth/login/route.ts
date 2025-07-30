import { SignJWT } from 'jose';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  // 1. Validar credenciales con las variables de entorno
  const adminUser = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (username !== adminUser || password !== adminPassword) {
    return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
  }

  // 2. Crear el token (JWT)
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = 'HS256';

    const token = await new SignJWT({ username, isAdmin: true })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('2h') // El token expira en 2 horas
      .sign(secret);

    // 3. Establecer el token en una cookie segura
    cookies().set('session_token', token, {
      httpOnly: true, // No accesible desde JS en el cliente
      secure: process.env.NODE_ENV === 'production', // Solo en HTTPS en producción
      maxAge: 60 * 60 * 2, // 2 horas en segundos
      path: '/', // Disponible en todo el sitio
    });

    return NextResponse.json({ message: 'Login exitoso' });

  } catch (error) {
    console.error('Error al crear el token:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}