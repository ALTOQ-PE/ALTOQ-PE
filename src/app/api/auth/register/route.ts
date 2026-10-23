import { NextResponse } from 'next/server';
import { StorageService } from '@/lib/storage';
import type { Role as UserRole, ConsumerSubscriptionPlan, ProducerSubscriptionPlan, PaymentMethod } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      role,
      email,
      password,
      // Campos de Consumidor
      firstName,
      lastName,
      dni,
      phone,
      address,
      preferredPaymentMethod,
      consumerPlan,
      // Campos Mayorista
      companyName,
      companyRuc,
      // Campos Proveedor
      digesaRegistryCode,
      qualityCertificates,
      maxOctagonsAffidavit,
      originRegion,
      producerPlan,
    } = body;

    // 1. Validaciones Comunes
    if (!email || !password) {
      return NextResponse.json(
        { error: 'El correo electrónico y la contraseña son obligatorios.' },
        { status: 400 }
      );
    }

    // 2. Validaciones Específicas por Rol (Flexibles sin restricción estricta de longitud)
    if (role === 'CONSUMER_RETAIL' || role === 'CONSUMER_WHOLESALE') {
      if (!firstName || !lastName) {
        return NextResponse.json(
          { error: 'El nombre y los apellidos del comprador son obligatorios.' },
          { status: 400 }
        );
      }
      if (!dni) {
        return NextResponse.json(
          { error: 'El DNI o documento de identidad es obligatorio.' },
          { status: 400 }
        );
      }
      if (!phone) {
        return NextResponse.json(
          { error: 'El número de teléfono es obligatorio para la coordinación del despacho en Lima.' },
          { status: 400 }
        );
      }
      if (!address) {
        return NextResponse.json(
          { error: 'La dirección de entrega es obligatoria.' },
          { status: 400 }
        );
      }
      if (!preferredPaymentMethod) {
        return NextResponse.json(
          { error: 'Debes seleccionar un método de pago preferido (Yape/Plin, Tarjeta, Transferencia).' },
          { status: 400 }
        );
      }

      if (role === 'CONSUMER_WHOLESALE') {
        if (!companyName || !companyRuc) {
          return NextResponse.json(
            { error: 'Para compras mayoristas, la Razón Social y el RUC son obligatorios.' },
            { status: 400 }
          );
        }
      }
    }

    if (role === 'PRODUCER') {
      if (!companyName || !companyRuc) {
        return NextResponse.json(
          { error: 'La Razón Social y el RUC de la empresa productora son obligatorios.' },
          { status: 400 }
        );
      }
      if (!digesaRegistryCode) {
        return NextResponse.json(
          { error: 'El Código de Registro Sanitario DIGESA vigente del producto es obligatorio.' },
          { status: 400 }
        );
      }
      if (!maxOctagonsAffidavit) {
        return NextResponse.json(
          { error: 'Debes aceptar la declaración jurada que certifica que el producto cumple con la política interna de máximo 2 octógonos de ALTOQ PE.' },
          { status: 400 }
        );
      }
    }

    // 3. Crear usuario persistente en almacenamiento real
    const newUser = StorageService.createUser({
      email,
      passwordHash: `hash_${password}`, // En producción se usa bcrypt
      role: (role as UserRole) || 'CONSUMER_RETAIL',
      firstName,
      lastName,
      dni,
      phone,
      address,
      preferredPaymentMethod: (preferredPaymentMethod as PaymentMethod) || 'YAPE_PLIN',
      consumerPlan: (consumerPlan as ConsumerSubscriptionPlan) || 'PLAN_GRATUITO',
      companyName,
      companyRuc,
      digesaRegistryCode,
      qualityCertificates: qualityCertificates || [],
      maxOctagonsAffidavit: Boolean(maxOctagonsAffidavit),
      originRegion: originRegion || 'Cusco',
      producerPlan: (producerPlan as ProducerSubscriptionPlan) || 'PLAN_PLATA',
    });

    // 4. Crear respuesta con cookies de sesión
    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        consumerPlan: newUser.consumerPlan,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
    });

    response.cookies.set('altoq-session-token', `sess-${newUser.id}`, { path: '/', maxAge: 86400 });
    response.cookies.set('altoq-user-role', newUser.role, { path: '/', maxAge: 86400 });
    if (newUser.consumerPlan) {
      response.cookies.set('altoq-consumer-plan', newUser.consumerPlan, { path: '/', maxAge: 86400 });
    }

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error interno al registrar usuario.' },
      { status: 400 }
    );
  }
}
