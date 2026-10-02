# Estribor Consultores · Sitio web

Sitio corporativo de [Estribor Consultores](https://www.estriborconsultores.cl): landing, servicios, equipo, blog, portal de empleo con postulaciones, agenda de reuniones y panel de administración de vacantes.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 4 · Supabase (Postgres, Auth, Storage) · Resend (correo) · Vercel.

## Instalación

Requisitos: Node.js 20.9 o superior y npm.

```bash
npm install
cp .env.example .env.local   # completar los valores (ver tabla abajo)
npm run dev                  # http://localhost:3000
```

## Variables de entorno

Las variables `NEXT_PUBLIC_*` llegan al navegador: **nunca** pongas secretos en ellas. `.env.local` está en `.gitignore`.

| Variable | Dónde se usa | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Cliente y servidor | Sí | URL del proyecto de Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cliente y servidor | Sí | Clave pública. Solo lee vacantes publicadas (RLS) y maneja el login del panel. |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo servidor | Sí | Clave de servicio (ignora RLS). La usan las rutas `/api` para reservas, postulaciones, CVs y el panel. |
| `RESEND_API_KEY` | Solo servidor | Sí | API de Resend para los correos. |
| `RESEND_FROM_EMAIL` | Solo servidor | Sí en producción | Remitente con dominio verificado, p. ej. `Estribor Consultores <contacto@estriborconsultores.cl>`. |
| `NOTIFICATION_RECIPIENT_EMAIL` | Solo servidor | No | Casilla que recibe contactos y reservas. Por defecto `contacto@estriborconsultores.cl`. |
| `ADMIN_EMAILS` | Solo servidor | No* | Correos con rol administrador, separados por coma. |
| `RECRUITER_EMAILS` | Solo servidor | No* | Correos con rol reclutador, separados por coma. |
| `CRON_SECRET` | Solo servidor | Sí en Vercel | Secreto del cron de keepalive. Generar con `openssl rand -hex 32`. |
| `NEXT_PUBLIC_SITE_URL` | Cliente y servidor | Sí | URL canónica, `https://www.estriborconsultores.cl`. |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Cliente | No | Microsoft Clarity. Solo se carga si el usuario acepta las cookies analíticas. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Cliente | No | Verificación de Google Search Console. |

\* El rol del panel se toma primero de `app_metadata.role` en Supabase Auth (ver migración). Las listas de correos son un respaldo: sin ninguna de las dos, nadie puede entrar al panel.

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo. |
| `npm run build` / `npm start` | Build de producción y servidor. |
| `npm run lint` | ESLint. |
| `npm run typecheck` | TypeScript sin emitir archivos. |
| `npm test` | Pruebas unitarias y de rutas `/api` (Vitest, con Supabase y Resend simulados). |
| `npm run test:e2e` | Pruebas E2E y de accesibilidad (Playwright + axe). Levantan `next dev` en el puerto 3100 e interceptan `/api/*`: no envían correos ni escriben en Supabase. La primera vez: `npx playwright install chromium`. |
| `node tests/e2e/axe-report.mjs [url]` | Informe de accesibilidad WCAG 2.1 AA de todas las páginas. |

## Estructura

```
app/
  page.tsx, servicios/, mision-vision/, equipo/, contacto/, privacidad/, terminos/
  blog/                 Listado (filtro en cliente) y artículos estáticos con 404 real
  vacantes/             Portal de empleo: Server Components con ISR (revalidate 300 s)
    [id]/               Detalle de vacante + JSON-LD JobPosting
    admin/              Panel (cliente): _components/, _hooks/, _lib/
  api/
    contacto/           Formulario de contacto → correo (zod, honeypot, rate limit)
    agenda/             Disponibilidad, reservas y descarga .ics
    postulaciones/      Postulaciones con CV (validación de PDF, bucket privado)
    admin/              CRUD del panel: valida JWT de Supabase y rol en el servidor
    cron/keepalive/     Consulta liviana para que Supabase Free no se pause
  sitemap.ts, robots.ts, opengraph-image.tsx, not-found.tsx
components/             Secciones (Server Components) y piezas interactivas pequeñas
  agenda/               BookingCalendar, BookingDetailsForm, BookingWidget
  contacto/             ContactForm, ContactInfo
  vacantes/, blog/, seo/, analytics/, ui/Reveal.tsx
lib/
  types.ts              Tipos de dominio compartidos
  agenda.ts             Reglas de la agenda (horarios, zona horaria de Chile)
  hooks/useAgenda.ts    Estado del flujo de reserva
  validation.ts         Esquemas zod (contacto, reserva, postulación, RUT, PDF)
  security.ts           Escape HTML, rate limit, errores sin filtrar detalles
  email.ts              Envío con Resend y plantillas
  supabase.ts           Cliente público (anon)
  supabase-admin.ts     Cliente de servicio (server-only)
  admin-auth.ts         Verificación de sesión y rol del panel
  jobs.ts               Lectura de vacantes para páginas públicas
  content/blog.ts       Artículos del blog (datos tipados)
  seo.ts                Metadata y JSON-LD
  analytics.ts          Consentimiento de cookies y eventos de conversión
supabase/migrations/    SQL versionado (RLS, políticas, índices, bucket)
tests/unit/             Vitest
tests/e2e/              Playwright + axe
```

## Seguridad y datos

- Toda escritura sensible pasa por rutas `/api` del servidor con `SUPABASE_SERVICE_ROLE_KEY`. El navegador solo usa la clave anon para leer vacantes publicadas y para el login.
- Los CVs se guardan en el bucket privado `cvs` con nombre UUID; el panel los abre con URLs firmadas de 2 minutos.
- Headers de seguridad (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy) en `next.config.ts`.
- La analítica (Clarity, Vercel Analytics, Speed Insights) se carga solo tras aceptar cookies, y se puede retirar desde el footer.

### Migración de Supabase

`supabase/migrations/20261001120000_rls_y_seguridad.sql` activa RLS, deja como única política la lectura pública de vacantes activas, crea el índice único `(date, time)` en `bookings` y vuelve privado el bucket `cvs`. **Revísala antes de aplicarla** y despliega a la vez el código que usa la service role:

1. Ejecutar las consultas de verificación de la sección 0.
2. `supabase db push` o pegar el archivo en el SQL Editor.
3. Asignar roles del panel (sección 7) y desactivar el registro público en Authentication → Providers → Email.

## Despliegue en Vercel

1. Importar el repositorio en Vercel (framework: Next.js; comandos por defecto).
2. En **Settings → Environment Variables** cargar todas las variables de la tabla, en Production y Preview. `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` y `CRON_SECRET` solo como variables de servidor (sin prefijo `NEXT_PUBLIC_`).
3. Desplegar. `vercel.json` registra el cron `/api/cron/keepalive` cada 3 días a las 12:00 UTC; Vercel envía `Authorization: Bearer $CRON_SECRET` automáticamente.
4. Recomendado en Vercel Pro: **Firewall → Rate limiting** para `/api/contacto`, `/api/agenda` y `/api/postulaciones` (p. ej. 10 solicitudes por minuto por IP). El rate limit en memoria del código es una primera barrera por instancia.
5. Verificar en producción: enviar un contacto de prueba, revisar `https://www.estriborconsultores.cl/sitemap.xml` y validar una vacante en la [Prueba de resultados enriquecidos](https://search.google.com/test/rich-results).

Los despliegues de preview responden `Disallow: /` en `robots.txt` para no indexarse.
