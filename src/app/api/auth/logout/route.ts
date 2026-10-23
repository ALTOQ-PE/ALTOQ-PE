import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Sesión cerrada exitosamente.' });
  
  response.cookies.set('altoq-session-token', '', { path: '/', maxAge: 0 });
  response.cookies.set('altoq-user-role', '', { path: '/', maxAge: 0 });
  response.cookies.set('altoq-consumer-plan', '', { path: '/', maxAge: 0 });
  
  return response;
}
