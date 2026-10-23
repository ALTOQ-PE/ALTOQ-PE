import { NextResponse } from 'next/server';
import { StorageService } from '@/lib/storage';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Ingresa tu correo electrónico y contraseña.' },
        { status: 400 }
      );
    }

    const user = StorageService.findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas. Verifica tu correo y contraseña.' },
        { status: 401 }
      );
    }

    // Respuesta con cookies de sesión
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        consumerPlan: user.consumerPlan,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName,
      },
    });

    response.cookies.set('altoq-session-token', `sess-${user.id}`, { path: '/', maxAge: 86400 });
    response.cookies.set('altoq-user-role', user.role, { path: '/', maxAge: 86400 });
    if (user.consumerPlan) {
      response.cookies.set('altoq-consumer-plan', user.consumerPlan, { path: '/', maxAge: 86400 });
    }

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error interno al procesar el inicio de sesión.' },
      { status: 500 }
    );
  }
}
