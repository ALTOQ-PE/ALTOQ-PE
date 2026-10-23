import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { StorageService } from '@/lib/storage';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('altoq-session-token')?.value;
    const userRole = cookieStore.get('altoq-user-role')?.value;

    if (!sessionToken) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    // Si el token es de la forma "sess-<userId>"
    let user = null;
    if (sessionToken.startsWith('sess-')) {
      const userId = sessionToken.replace('sess-', '');
      user = StorageService.findUserById(userId);
    }

    // Fallback para tokens de rol de demo "demo-auth-<role>" o "demo-token-<role>"
    if (!user && userRole) {
      const users = StorageService.getUsers();
      user = users.find((u) => u.role === userRole);
    }

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 404 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        dni: user.dni,
        phone: user.phone,
        address: user.address,
        preferredPaymentMethod: user.preferredPaymentMethod,
        consumerPlan: user.consumerPlan,
        filipuntosBalance: user.filipuntosBalance || 0,
        altoqCreditsBalance: user.altoqCreditsBalance || 0,
        companyName: user.companyName,
        companyRuc: user.companyRuc,
        digesaRegistryCode: user.digesaRegistryCode,
        qualityCertificates: user.qualityCertificates || [],
        maxOctagonsAffidavit: user.maxOctagonsAffidavit,
        originRegion: user.originRegion,
        producerPlan: user.producerPlan,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al recuperar sesión activa' },
      { status: 500 }
    );
  }
}
