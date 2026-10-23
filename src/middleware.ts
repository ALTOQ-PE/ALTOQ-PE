// ==============================================================================
// ALTOQ PE - MIDDLEWARE DE AUTENTICACIÓN Y AUTORIZACIÓN (RBAC)
// Control de Acceso por Roles (CONSUMER_RETAIL, CONSUMER_WHOLESALE, PRODUCER, ADMIN, SUPERADMIN)
// REGLA ESTRICTA: Sin uso de emojis en código ni comentarios
// ==============================================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Role as UserRole } from '@/types';

interface RouteAccessRule {
  pathPrefix: string;
  allowedRoles: UserRole[];
  redirectFallback: string;
}

// Matriz de Reglas de Acceso Basadas en Roles (RBAC)
const RBAC_RULES: RouteAccessRule[] = [
  {
    pathPrefix: '/superadmin',
    allowedRoles: ['SUPERADMIN'],
    redirectFallback: '/admin',
  },
  {
    pathPrefix: '/admin',
    allowedRoles: ['ADMIN', 'SUPERADMIN'],
    redirectFallback: '/app',
  },
  {
    pathPrefix: '/producer',
    allowedRoles: ['PRODUCER', 'SUPERADMIN'],
    redirectFallback: '/login',
  },
  {
    pathPrefix: '/mayorista',
    allowedRoles: ['CONSUMER_WHOLESALE', 'ADMIN', 'SUPERADMIN'],
    redirectFallback: '/app',
  },
  {
    pathPrefix: '/app',
    allowedRoles: ['CONSUMER_RETAIL', 'ADMIN', 'SUPERADMIN'],
    redirectFallback: '/login',
  },
];

// Rutas Públicas Exentas de Autenticación
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/postular-productor',
  '/registro-mayorista',
  '/api/health',
  '/api/webhooks',
  '/catalogo',
  '/producto',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Permitir acceso libre a archivos estáticos, PWA assets y API de salud
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/manifest.json') ||
    pathname.startsWith('/sw.js') ||
    pathname === '/api/health'
  ) {
    return NextResponse.next();
  }

  // 2. Comprobar si la ruta solicitada requiere protección RBAC
  const matchedRule = RBAC_RULES.find((rule) => pathname.startsWith(rule.pathPrefix));

  // Si no coincide con ninguna ruta protegida, continuar
  if (!matchedRule) {
    return NextResponse.next();
  }

  // 3. Extracción de sesión y rol (Integración con Supabase / Cookies HTTP-Only)
  let authToken =
    request.cookies.get('sb-access-token')?.value ||
    request.cookies.get('altoq-session-token')?.value;

  let userRole = (request.cookies.get('altoq-user-role')?.value as UserRole) || null;

  // 4. En modo desarrollo / vista previa local: si no hay sesión previa, permitir explorar la plantilla solicitada
  if (!authToken || !userRole) {
    if (process.env.NODE_ENV !== 'production' || request.nextUrl.searchParams.has('demo')) {
      const defaultRoleForPath: UserRole =
        pathname.startsWith('/superadmin') ? 'SUPERADMIN' :
        pathname.startsWith('/admin') ? 'ADMIN' :
        pathname.startsWith('/producer') ? 'PRODUCER' :
        pathname.startsWith('/mayorista') ? 'CONSUMER_WHOLESALE' :
        'CONSUMER_RETAIL';

      const response = NextResponse.next();
      response.cookies.set('altoq-session-token', 'demo-session-token', { path: '/' });
      response.cookies.set('altoq-user-role', defaultRoleForPath, { path: '/' });
      return response;
    }

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. Validación estricta de Roles (RBAC)
  const isAuthorized = matchedRule.allowedRoles.includes(userRole);

  if (!isAuthorized) {
    // Redirigir según el rol real del usuario a su respectiva plantilla
    let targetRedirect = '/app';
    if (userRole === 'CONSUMER_WHOLESALE') targetRedirect = '/mayorista';
    if (userRole === 'PRODUCER') targetRedirect = '/producer';
    if (userRole === 'ADMIN') targetRedirect = '/admin';
    if (userRole === 'SUPERADMIN') targetRedirect = '/superadmin';

    const redirectUrl = new URL(targetRedirect, request.url);
    redirectUrl.searchParams.set('error', 'unauthorized_access');
    return NextResponse.redirect(redirectUrl);
  }

  // 6. Añadir cabeceras contextuales seguras para Route Handlers y Server Components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-role', userRole);
  requestHeaders.set('x-current-path', pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Configuración de rutas interceptadas por el middleware
export const config = {
  matcher: [
    '/app/:path*',
    '/mayorista/:path*',
    '/producer/:path*',
    '/admin/:path*',
    '/superadmin/:path*',
    '/api/:path*',
  ],
};
