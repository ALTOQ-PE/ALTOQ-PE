// ==============================================================================
// ALTOQ PE - ENDPOINT DE KEEP-ALIVE Y SALUD DEL SISTEMA (0% COLD START)
// Ruta: GET /api/health
// Mantiene despierta la base de datos PostgreSQL mediante ejecución de SELECT 1
// REGLA ESTRICTA: Sin uso de emojis en código ni comentarios
// ==============================================================================

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const startTime = Date.now();

  try {
    // 1. Ejecutar consulta ligera directa a PostgreSQL para mantener activa la conexión
    await prisma.$queryRaw`SELECT 1 as keep_alive_ping`;
    
    const dbLatencyMs = Date.now() - startTime;

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'ALTOQ PE E-commerce Platform',
        environment: process.env.NODE_ENV || 'production',
        database: {
          status: 'connected',
          latencyMs: dbLatencyMs,
        },
        zeroSleepKeepAlive: {
          active: true,
          nextExpectedCronInHours: 12,
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    const errorLatencyMs = Date.now() - startTime;
    console.error('Error en Health Check / Keep-Alive:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'ALTOQ PE E-commerce Platform',
        error: error.message || 'Error de conexion con la base de datos',
        latencyMs: errorLatencyMs,
      },
      {
        status: 503,
      }
    );
  }
}
