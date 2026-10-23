import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { StorageService } from '@/lib/storage';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('altoq-session-token')?.value;
    const userRole = cookieStore.get('altoq-user-role')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    if (userRole === 'SUPERADMIN') {
      const allQuotes = StorageService.getAllQuotes();
      return NextResponse.json({ success: true, quotes: allQuotes });
    }

    let userId: string | null = null;
    if (sessionToken.startsWith('sess-')) {
      userId = sessionToken.replace('sess-', '');
    } else if (userRole) {
      const u = StorageService.getUsers().find((user) => user.role === userRole);
      if (u) userId = u.id;
    }

    if (!userId) {
      return NextResponse.json({ success: true, quotes: [] });
    }

    const quotes = StorageService.getQuotesByUser(userId);
    return NextResponse.json({ success: true, quotes });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al consultar cotizaciones.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('altoq-session-token')?.value;
    const userRole = cookieStore.get('altoq-user-role')?.value;

    const body = await request.json();
    const {
      companyName,
      companyRuc,
      contactName,
      contactEmail,
      contactPhone,
      items,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Debes incluir al menos un producto para generar la cotización mayorista.' },
        { status: 400 }
      );
    }

    let userId = 'usr-wholesale';
    if (sessionToken?.startsWith('sess-')) {
      userId = sessionToken.replace('sess-', '');
    } else if (userRole) {
      const u = StorageService.getUsers().find((user) => user.role === userRole);
      if (u) userId = u.id;
    }

    // Calcular montos
    let subtotalPen = 0;
    const processedItems = items.map((item: any) => {
      const totalItemPen = (item.pricePerBoxPen || 350) * (item.boxCount || 1);
      subtotalPen += totalItemPen;
      return {
        productId: item.productId,
        productName: item.productName,
        boxCount: Number(item.boxCount) || 1,
        unitsPerBox: Number(item.unitsPerBox) || 24,
        pricePerBoxPen: Number(item.pricePerBoxPen) || 350,
        totalItemPen,
      };
    });

    const igvPen = subtotalPen * 0.18;
    const totalPen = subtotalPen + igvPen;

    const validUntilDate = new Date();
    validUntilDate.setDate(validUntilDate.getDate() + 15); // Validez 15 días

    const newQuote = StorageService.createQuote({
      userId,
      companyName: companyName || 'Cliente Mayorista',
      companyRuc: companyRuc || '20600000001',
      contactName: contactName || 'Contacto Comercial',
      contactEmail: contactEmail || 'contacto@empresa.pe',
      contactPhone: contactPhone || '+51 900 000 000',
      items: processedItems,
      subtotalPen,
      igvPen,
      totalPen,
      validUntil: validUntilDate.toISOString(),
      status: 'COTIZACION_EMITIDA',
    });

    return NextResponse.json({
      success: true,
      quote: newQuote,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al procesar la cotización.' },
      { status: 500 }
    );
  }
}
