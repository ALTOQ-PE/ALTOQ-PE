import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { StorageService } from '@/lib/storage';
import type { PaymentMethod } from '@/types';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('altoq-session-token')?.value;
    const userRole = cookieStore.get('altoq-user-role')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    let userId: string | null = null;
    if (sessionToken.startsWith('sess-')) {
      userId = sessionToken.replace('sess-', '');
    } else if (userRole) {
      const u = StorageService.getUsers().find((user) => user.role === userRole);
      if (u) userId = u.id;
    }

    if (userRole === 'SUPERADMIN') {
      const allOrders = StorageService.getAllOrders();
      return NextResponse.json({ success: true, orders: allOrders });
    }

    if (!userId) {
      return NextResponse.json({ success: true, orders: [] });
    }

    const userOrders = StorageService.getOrdersByUser(userId);
    return NextResponse.json({ success: true, orders: userOrders });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al consultar órdenes.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('altoq-session-token')?.value;
    const userRole = cookieStore.get('altoq-user-role')?.value;

    const body = await request.json();
    const {
      items,
      subtotalPen,
      shippingPen,
      creditsDiscountPen,
      totalPen,
      paymentMethod,
      deliveryAddress,
      contactPhone,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'El carrito no contiene productos para procesar la orden.' },
        { status: 400 }
      );
    }

    let userId = 'usr-anonymous';
    let currentUser = null;

    if (sessionToken?.startsWith('sess-')) {
      userId = sessionToken.replace('sess-', '');
      currentUser = StorageService.findUserById(userId);
    } else if (userRole) {
      currentUser = StorageService.getUsers().find((u) => u.role === userRole);
      if (currentUser) userId = currentUser.id;
    }

    // Crear orden real en almacenamiento persistente
    const newOrder = StorageService.createOrder({
      userId,
      items: items.map((item: any) => ({
        productId: item.product.id,
        productName: item.product.commercialName,
        quantity: item.quantity,
        pricePen: item.product.wholesalePricePen && userRole === 'CONSUMER_WHOLESALE'
          ? item.product.wholesalePricePen
          : item.product.publicPricePen,
        isBox: Boolean(item.isWholesaleBox),
      })),
      subtotalPen: Number(subtotalPen) || 0,
      shippingPen: Number(shippingPen) || 0,
      creditsDiscountPen: Number(creditsDiscountPen) || 0,
      totalPen: Number(totalPen) || 0,
      status: 'PAGO_VALIDADO',
      paymentMethod: (paymentMethod as PaymentMethod) || (currentUser?.preferredPaymentMethod || 'YAPE_PLIN'),
      deliveryAddress: deliveryAddress || currentUser?.address || 'Lima Metropolitana',
      contactPhone: contactPhone || currentUser?.phone || '+51 984 123 456',
    });

    // Actualizar balances: descontar créditos aplicados y abonar Filipuntos si es Plan Oro
    if (currentUser) {
      const deltaCredits = creditsDiscountPen > 0 ? -creditsDiscountPen : 0;
      const isGoldPlan = currentUser.consumerPlan === 'PLAN_ORO';
      const deltaFilipuntos = isGoldPlan ? Math.floor(totalPen) : 0; // 1 punto por cada sol gastado

      StorageService.updateUserBalances(currentUser.id, deltaFilipuntos, deltaCredits);
    }

    return NextResponse.json({
      success: true,
      order: newOrder,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al crear la orden de compra.' },
      { status: 500 }
    );
  }
}
