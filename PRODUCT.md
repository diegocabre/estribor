# Product

<!-- impeccable:product-schema 1 -->

> Hechos confirmados por el equipo: qué es Estribor, a quién le vende, el tono, la regla de no afirmar sin respaldo, y (10-oct-2026) teléfono, RUT, año de inicio, zona de trabajo, equipo publicable y ausencia de cifras y clientes citables.
> Lo marcado **(repositorio, por confirmar)** sale del código o del contenido del sitio y aún no está validado.
> Lo marcado **(abierto)** es una decisión pendiente; no se debe rellenar con supuestos.

## Platform

web

## Users

**Comprador principal:** quien decide o influye en contratar asesoría externa en una empresa productiva o de servicios en Chile. Perfiles típicos (repositorio, por confirmar): gerente general o de operaciones, gerente o jefatura de personas/RR.HH., jefe de prevención de riesgos o HSE, encargado de sostenibilidad o compliance.

**Situación en que llega:** tiene un problema concreto y con plazo, no una curiosidad. Ejemplos que el propio sitio menciona: una obligación normativa nueva (Ley Karin, DS 44), una fiscalización con observaciones, accidentabilidad alta, un cargo crítico difícil de llenar, presión de clientes o inversionistas por reportar sostenibilidad.

**Qué necesita resolver en el sitio:** saber en minutos si Estribor conoce su industria y su normativa, quiénes son las personas que lo atenderían, y cómo pedir una reunión o cotización.

**Audiencia secundaria (repositorio):** postulantes que llegan al Portal de Empleo (`/vacantes`), incluidas búsquedas confidenciales que Estribor publica en nombre de clientes.

## Product Purpose

Sitio comercial de Estribor Consultores SpA. Su trabajo es generar reuniones y solicitudes de cotización con empresas que necesitan apoyo en tres ejes:

1. **Gestión de Personas:** reclutamiento y selección, hunting ejecutivo, outsourcing, desarrollo organizacional, assessment, capacitación, cultura y comunicaciones, liderazgo.
2. **Seguridad y Salud en el Trabajo:** diagnósticos y línea base, auditorías de cumplimiento, sistemas de gestión, cumplimiento normativo (DS 44, IRL, RIOHS, Ley Karin), cultura preventiva, capacitación.
3. **Sostenibilidad Organizacional:** análisis de materialidad, riesgos ambientales y sociales, reportabilidad (GRI y otros), estrategia e indicadores ESG, huella hídrica y de carbono.

**Éxito:** una empresa de la industria correcta agenda una reunión (formulario o agenda virtual) o pide cotización. Secundario: postulaciones al portal de empleo y lectura del blog.

## Positioning

Consultora **boutique** chilena: equipo pequeño y senior, trato directo con quien ejecuta el trabajo, no una consultora grande que delega en juniors.

**Etapa (confirmado):** Estribor partió en 2026. La empresa es nueva; la experiencia es de las personas, acumulada antes de Estribor en industrias productivas. El sitio debe decirlo con naturalidad ("empresa nueva, equipo con trayectoria") en vez de simular una historia que no existe.

Diferencia que una consultora vecina no podría copiar tal cual:

- **Arraigo en la Región de Los Lagos (confirmado):** oficina en Puerto Varas y trabajo realizado en la región. Experiencia del equipo en salmonicultura y certificaciones ASC, BAP e ISO (según biografía de Fabián Velásquez).
- **Integra personas, seguridad y sostenibilidad** en una sola relación, en vez de tres proveedores distintos.
- **Trabajo en terreno** (faena, centro de cultivo, planta, obra), no solo informes de escritorio.

## Operating Context

- **Datos de la empresa (confirmado):** Estribor Consultores SpA, RUT 78.406.406-9, Parque Westfalia 1, Puerto Varas, Región de Los Lagos. Teléfono y WhatsApp +56 9 4167 6239. Correo contacto@estriborconsultores.cl. LinkedIn: linkedin.com/company/estribor-consultores. Inicio de actividades: 2026.
- **Zona de trabajo (confirmado):** Región de Los Lagos. No afirmar cobertura nacional; se puede decir que atienden otras zonas solo si Estribor lo confirma como oferta.
- **Sectores que el sitio declara:** acuicultura, industria, energía, construcción, alimentos y servicios. Respaldados por la experiencia previa del equipo: acuicultura/salmonicultura, construcción e industrias productivas en general. Minería e industria pesada **no** están respaldadas (aparecen solo en /equipo y deben salir).
- **Vocabulario del cliente que el sitio debe usar con naturalidad:** DS 44, IRL, RIOHS, Ley Karin, matriz IPER, MINSAL, mutualidad, ISO 45001, ISO 14001, ASC, BAP, GRI, ESG, faena, centro de cultivo, jefaturas, colaboradores.
- **Canales de conversión del sitio:** formulario de contacto, agenda de reunión virtual con duración elegible, WhatsApp, correo, teléfono.
- **Otras superficies:** Servicios, Misión y Visión, Equipo, Blog, Portal de Empleo (con administración interna), páginas legales.

## Capabilities and Constraints

- Sitio en Next.js 16 con Tailwind v4, desplegado en Vercel. Formularios, agenda y postulaciones se guardan en Supabase en el servidor.
- Hay analítica (Vercel) condicionada a consentimiento de cookies. Cualquier cambio debe mantener el banner y el texto legal vigentes.
- Idioma único: español de Chile (`es-CL`).
- Teléfono, correo y RUT viven en `lib/legalConfig.ts`; el resto del sitio debe leerlos desde ahí. (El widget de WhatsApp aún tiene el número escrito en su propio archivo, con el mismo valor.)

## Brand Commitments

- **Nombre:** Estribor Consultores (razón social Estribor Consultores SpA). Estribor es el costado derecho de una embarcación; la marca usa la metáfora náutica y de navegación.
- **Logo existente:** rosa de los vientos sobre el contorno de Chile (`public/logo.webp`, `public/logo-512.png`). No se modifica sin aprobación.
- **Tono (confirmado):** cercano, concreto, en español de Chile.
  - Tutear al lector ("tu operación", "agenda una reunión"), como ya hace el sitio.
  - Frases cortas que nombran el problema real y la norma real: "Implementamos el protocolo de la Ley Karin" en vez de "soluciones estratégicas integrales".
  - Vocabulario chileno de la industria (faena, jefaturas, mutualidad, prevencionista), no traducciones del inglés.
  - Títulos en mayúscula solo al inicio, como se escribe en español.
  - Sin superlativos vacíos ("excelencia", "líder", "de clase mundial", "transformamos") ni metáforas náuticas forzadas en cada frase. La metáfora vive en el nombre y el logo; el texto habla claro.

## Evidence on Hand

**Real y disponible:**

- Equipo con nombre, cargo, biografía y foto (`lib/content/team.ts`, `public/images/team/`):
  - Camila Alvear, Directora Ejecutiva: más de 10 años en industrias productivas; gestión de personas, comunicaciones corporativas, compliance y sostenibilidad.
  - Dayana González, Consultora Atracción de Talento: psicóloga organizacional, diplomada en gestión de RR.HH.
  - Fernanda Núñez, Consultora Senior Comunicaciones Corporativas, Gestión del Cambio y Cultura: periodista corporativa, más de 10 años.
  - Fabián Velásquez, Consultor Senior HSE: prevencionista de riesgos, cerca de 10 años en construcción y salmonicultura; normativa MINSAL, sistemas de gestión, certificaciones ASC, BAP e ISO.
- Catálogo de servicios por eje (`components/Servicios.tsx`).
- Logo en alta resolución.

**Equipo publicable (confirmado):** solo las cuatro personas anteriores, y sus biografías son exactamente lo que se puede afirmar de cada una. Hay colaboradores que trabajan con Estribor pero tienen contrato con otra empresa y **no pueden aparecer** en el sitio, ni por nombre ni en fotos. No insinuar un equipo más grande ("contamos con abogados", "nuestros ingenieros").

**Imágenes (confirmado):** el sitio funciona con los retratos del equipo y el logo. No hay fotos de terreno ni de clientes, y no se usarán fotos de stock que simulen trabajo propio.

**No existe hoy y no se debe inventar:**

- Cifras de resultados: **las cifras de los casos de la portada no son reales** (confirmado). La empresa está comenzando y aún no tiene resultados medibles propios.
- Clientes citables, logos de clientes o testimonios: **no existen todavía** (confirmado).
- Fotografías de terreno, faenas, oficinas o trabajo con clientes.

**Con qué construir confianza mientras no haya casos (decisión de contenido):**

1. Las personas: nombre, cargo, foto y años de experiencia previa real de cada integrante.
2. Especificidad técnica: nombrar la norma y el entregable concreto (protocolo Ley Karin, RIOHS, matriz IPER, DS 44, reporte GRI, certificación ASC/BAP), no categorías vagas.
3. Cómo trabajan: proceso explicado paso a paso y qué recibe el cliente al final de cada servicio.
4. Arraigo verificable: dirección en Puerto Varas, RUT, teléfono directo y LinkedIn visibles.
5. Transparencia: decir que la empresa es nueva y que la experiencia viene del equipo.
6. Contenido propio: artículos del blog sobre normativa vigente.

Cuando haya casos o clientes que autoricen ser citados, se agregan con su respaldo; antes no.

### Afirmaciones que no se pueden hacer sin respaldo

Regla general: **toda cifra, nombre de cliente, certificación, cobertura geográfica o resultado medible necesita respaldo confirmado por Estribor.** Si no lo hay, se reescribe como descripción cualitativa del trabajo o se elimina. Nunca se inventan testimonios, logos ni cifras "de ejemplo" en producción.

Afirmaciones que el sitio hace hoy y que necesitan respaldo:

| Afirmación | Dónde aparece | Qué hacer |
|---|---|---|
| "Selección exitosa en un plazo menor a 40 días" | Casos, portada | **No real.** Eliminar |
| "Más de 250 colaboradores entrenados" | Casos, portada | **No real.** Eliminar |
| "Tasa de accidentabilidad disminuida en un 42 %" | Casos, portada | **No real.** Eliminar |
| Sección "Casos de Experiencia" completa | Portada | Los cuatro tipos de trabajo **son reales, pero los hizo el equipo en otra empresa, antes de Estribor** (confirmado). Se pueden contar como experiencia del equipo, sin cifras, sin nombrar al empleador ni al cliente y sin presentarlos como proyectos de Estribor |
| "Consultores que han liderado operaciones reales" | Por qué Estribor | Válido solo en la medida de las biografías (experiencia previa a Estribor) |
| "Ingenieros especialistas con más de 10 y 15 años… en minería, industria pesada y construcción" | /equipo | Corregido el 10-oct-2026 |
| "Contamos con un equipo legal… defensa técnica corporativa" | /equipo | Corregido el 10-oct-2026 |
| "Psicólogos organizacionales y expertos en administración" (en plural) | /equipo | Corregido el 10-oct-2026 |
| "Amplia experiencia en auditorías ISO 45001 e ISO 14001" | /equipo | Corregido el 10-oct-2026 |
| "Profesionales seniors con postgrados y certificaciones vigentes" | /equipo | Corregido el 10-oct-2026 |
| "Presencia local y cobertura técnica a lo largo de todo Chile" | /equipo | Corregido el 10-oct-2026 en /equipo; aún aparece en el portal de empleo (`app/vacantes/page.tsx`) |
| `areaServed: Chile` | Datos estructurados (`lib/seo.ts`) | Cambiar a Región de Los Lagos |
| "Trayectoria de impacto", "relaciones de confianza duraderas" | Portada | Empresa de 2026: no implicar historia propia |
| "Consultora líder y referente" | Visión | Aceptable solo como aspiración (visión), no como hecho |

## Product Principles

1. **Prueba antes que adjetivo.** Una norma nombrada, una persona real o un caso verificable vale más que "excelencia" o "soluciones integrales". Si no hay prueba, se describe el trabajo, no el resultado.
2. **Las personas son el producto.** En una consultora boutique se contrata a quien atiende. El equipo real, con nombre y experiencia, es el argumento principal.
3. **Hablar el idioma de la faena y de la norma.** El lector reconoce su problema por su nombre técnico y su contexto chileno; el sitio lo usa sin explicarlo de más.
4. **Un solo camino a la conversación.** Pedir una reunión debe ser obvio y nombrarse siempre igual.
5. **Arraigo antes que amplitud.** Mostrar dónde y en qué industrias Estribor trabaja de verdad, en vez de prometer cobertura total.

## Accessibility & Inclusion

Estándar: WCAG 2.2 AA. El proyecto ya incluye pruebas con axe (`@axe-core/playwright`), enlace para saltar al contenido, foco visible y respeto por `prefers-reduced-motion`; estos avances no deben retroceder. Parte del público consulta desde el teléfono en terreno, así que móvil y conexiones lentas cuentan como caso principal.
