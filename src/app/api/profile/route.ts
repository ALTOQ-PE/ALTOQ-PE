import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { StorageService } from '@/lib/storage';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('altoq-session-token')?.value;
    const userRole = cookieStore.get('altoq-user-role')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No hay una sesión activa. Inicia sesión para ver tu perfil.' },
        { status: 401 }
      );
    }

    let user = null;
    if (sessionToken.startsWith('sess-')) {
      const userId = sessionToken.replace('sess-', '');
      user = StorageService.findUserById(userId);
    }

    if (!user && userRole) {
      const users = StorageService.getUsers();
      user = users.find((u) => u.role === userRole);
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado en la base de datos.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        dni: user.dni || '',
        phone: user.phone || '',
        address: user.address || '',
        preferredPaymentMethod: user.preferredPaymentMethod || 'YAPE_PLIN',
        consumerPlan: user.consumerPlan || 'PLAN_GRATUITO',
        filipuntosBalance: user.filipuntosBalance || 0,
        altoqCreditsBalance: user.altoqCreditsBalance || 0,
        companyName: user.companyName || '',
        companyRuc: user.companyRuc || '',
        digesaRegistryCode: user.digesaRegistryCode || '',
        qualityCertificates: user.qualityCertificates || [],
        maxOctagonsAffidavit: Boolean(user.maxOctagonsAffidavit),
        originRegion: user.originRegion || 'Cusco',
        producerPlan: user.producerPlan || 'PLAN_PLATA',
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al obtener datos del perfil' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('altoq-session-token')?.value;
    const userRole = cookieStore.get('altoq-user-role')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No autorizado. Debes iniciar sesión para actualizar tu perfil.' },
        { status: 401 }
      );
    }

    let user = null;
    let userId = '';
    if (sessionToken.startsWith('sess-')) {
      userId = sessionToken.replace('sess-', '');
      user = StorageService.findUserById(userId);
    }

    if (!user && userRole) {
      const users = StorageService.getUsers();
      user = users.find((u) => u.role === userRole);
      if (user) userId = user.id;
    }

    if (!user || !userId) {
      return NextResponse.json(
        { error: 'Usuario no encontrado.' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      dni,
      phone,
      address,
      preferredPaymentMethod,
      consumerPlan,
      producerPlan,
      companyName,
      companyRuc,
      digesaRegistryCode,
      qualityCertificates,
      originRegion,
    } = body;

    const updatedUser = StorageService.updateUser(userId, {
      firstName,
      lastName,
      dni,
      phone,
      address,
      preferredPaymentMethod,
      consumerPlan,
      producerPlan,
      companyName,
      companyRuc,
      digesaRegistryCode,
      qualityCertificates,
      originRegion,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Error al actualizar el usuario en la base de datos.' },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Perfil actualizado exitosamente.',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        dni: updatedUser.dni,
        phone: updatedUser.phone,
        address: updatedUser.address,
        preferredPaymentMethod: updatedUser.preferredPaymentMethod,
        consumerPlan: updatedUser.consumerPlan,
        filipuntosBalance: updatedUser.filipuntosBalance,
        altoqCreditsBalance: updatedUser.altoqCreditsBalance,
        companyName: updatedUser.companyName,
        companyRuc: updatedUser.companyRuc,
        digesaRegistryCode: updatedUser.digesaRegistryCode,
        qualityCertificates: updatedUser.qualityCertificates,
        maxOctagonsAffidavit: updatedUser.maxOctagonsAffidavit,
        originRegion: updatedUser.originRegion,
        producerPlan: updatedUser.producerPlan,
      },
    });

    if (updatedUser.consumerPlan) {
      response.cookies.set('altoq-consumer-plan', updatedUser.consumerPlan, { path: '/', maxAge: 86400 });
    }

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al procesar la actualización del perfil' },
      { status: 500 }
    );
  }
}
