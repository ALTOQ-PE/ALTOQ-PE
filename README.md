# ALTOQ PE - Marketplace E-commerce FoodTech

Plataforma marketplace e-commerce desarrollada para **ALTOQ PE**, startup peruana de Food Technology nacida en la UPC (Lima), para conectar directamente a productores y cooperativas agroindustriales de alimentos liofilizados con consumidores minoristas (B2C) y comercios mayoristas (B2B / HORECA).

---

## 1. Reglas de Negocio y Garantía Sanitaria

1. **Política Estricta de Salud (Máximo 2 Octógonos):**
   - Cumplimiento estricto de la Ley N° 30021. Bloqueo automático de cualquier producto que exceda dos (2) octógonos nutricionales. Declaración jurada obligatoria para proveedores.
2. **Transparencia Sanitaria y Cultural:**
   - Código de Registro Sanitario DIGESA vigente verificado por producto.
   - Constancias de calidad (BPM DIGESA, HACCP Codex Alimentarius, Certificación Orgánica).
   - Equivalencia de peso seco (ej. 45g) vs. rendimiento rehidratado (380g).
   - Contexto cultural de cada plato típico y su región de origen (Cusco, Junín, Puno, San Martín).
3. **Logística Centralizada en Lima contra la Humedad (>80% HR):**
   - Centro de acopio seco en Lima mantenido a menos del 50% HR.
   - Empaque tricapa hermético con barrera de vapor (< 0.1 g/m²/d) y empaque alveolar rígido anti-impacto.
4. **Trazabilidad en Vivo de 4 Fases:**
   - `1. Pago Validado` -> `2. Alistado en Acopio Seco Lima` -> `3. En Ruta Courier Lima Metropolitana` -> `4. Entregado con Garantía`.

---

## 2. Roles del Sistema y Adaptación Dinámica

La plataforma cuenta con una experiencia de marketplace unificada (estilo Saga Falabella) que adapta dinámicamente sus precios, insignias, catálogos y herramientas según el usuario autenticado:

- **Consumidor Minorista (B2C):**
  - Catálogo de pouches individuales para consumo personal o familiar.
  - Métodos de pago: Yape / Plin, Tarjeta Débito/Crédito Culqi, Transferencia BCP / Interbank.
  - Planes de suscripción:
    - **Plan Gratuito (S/ 0):** Catálogo completo, comparación de precios y proveedores, solicitud de cotizaciones, alertas de promociones.
    - **Plan Oro (S/ 14.90 / mes):** 10% de descuento en catálogo, recetas express en video (3 min), acumulación de Filipuntos para canjes, garantía de devolución mediante Altoq Créditos.
- **Consumidor Mayorista (B2B / HORECA):**
  - Precios por caja máster y volumen.
  - Módulo de Cotizaciones Formales B2B con RUC y razón social.
  - Fichas técnicas bromatológicas descargables y certificados sanitarios.
- **Proveedor Agroindustrial:**
  - Registro de empresa o cooperativa con RUC de 11 dígitos.
  - Código de Registro Sanitario DIGESA y certificados de calidad (BPM, HACCP).
  - Declaración jurada obligatoria de cumplimiento de máximo 2 octógonos.
  - Control de stock consignado en Centro de Acopio Lima y reporte de liquidaciones.
- **SuperAdmin / Gobernanza:**
  - Panel de curaduría y aprobación sanitaria DIGESA.
  - Telemetría en tiempo real de humedad relativa en almacén de acopio seco (42% HR vs 86% HR exterior).
  - Gestión de pedidos y cálculo de Unit Economics ($MC_u$).

---

## 3. Pila Tecnológica

- **Framework:** Next.js 14+ (App Router) con TypeScript
- **Estilos:** Tailwind CSS con tokens de marca ALTOQ PE (Paleta Verde Andino `#0F3D2E`, Naranja Liofilizado `#D85A2F`, Crema Suave `#F6F3EB`)
- **Iconografía:** Lucide React (cumplimiento estricto: cero emojis en código y UI)
- **Persistencia:** Almacenamiento local persistente con compatibilidad directa para PostgreSQL / Supabase vía Prisma ORM.

---

## 4. Puesta en Marcha Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.
