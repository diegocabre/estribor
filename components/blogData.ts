export interface BlogPost {
  title: string;
  slug: string;
  description: string;
  date: string;
  category: string;
  readTime: string;
  content: string[];
}

export const blogPosts: BlogPost[] = [
  {
    title: "Guía sobre la Ley Karin y su aplicación en la empresa en Chile",
    slug: "guia-ley-karin-aplicacion-empresa",
    description: "Conoce las nuevas exigencias legales de prevención del acoso laboral y cómo adaptar el RIOHS de tu organización en Chile.",
    date: "1 de Julio, 2026",
    category: "Gestión de Personas",
    readTime: "6 min de lectura",
    content: [
      "La entrada en vigencia de la Ley Karin marca un hito fundamental en la regulación de las relaciones laborales en Chile. Esta normativa tiene como objetivo principal erradicar el acoso laboral, sexual y la violencia en los espacios de trabajo, imponiendo a las empresas obligaciones sumamente precisas en prevención, investigación y sanción.",
      "Para asegurar el cumplimiento de la ley y proteger a tus colaboradores, las organizaciones deben implementar un protocolo de prevención de acoso laboral, el cual debe estar contenido en el Reglamento Interno de Orden, Higiene y Seguridad (RIOHS) y ser difundido de forma activa.",
      "### Pasos Clave para Adaptar tu Organización:",
      "1. **Actualización del RIOHS:** Incorporar definiciones claras sobre conductas prohibidas y detallar el procedimiento de denuncias, asegurando confidencialidad y plazos específicos de respuesta.",
      "2. **Matrices de Riesgo Psicosocial:** Evaluar las condiciones internas de trabajo para identificar focos de riesgo y mitigarlos preventivamente.",
      "3. **Capacitación General:** Todo el personal, especialmente jefaturas y mandos medios, debe ser capacitado sobre los alcances de la ley y el respeto mutuo en el ámbito laboral.",
      "Desde Estribor Consultores, apoyamos a nuestros clientes en el diagnóstico legal, la redacción de protocolos a medida y el despliegue de capacitaciones internas para que tu organización navegue con total seguridad jurídica y humana."
    ]
  },
  {
    title: "Cómo medir la huella hídrica y de carbono en la producción industrial",
    slug: "medicion-huella-hidrica-carbono-produccion",
    description: "Paso a paso para iniciar el análisis ambiental de tus operaciones y reportar indicadores ESG de alto impacto.",
    date: "25 de Junio, 2026",
    category: "Sostenibilidad",
    readTime: "8 min de lectura",
    content: [
      "El cambio climático y las regulaciones ambientales exigen que las industrias productivas conozcan con exactitud su impacto ambiental. Hoy en día, la medición de la huella de carbono y la huella hídrica no es solo un factor de responsabilidad social, sino una exigencia de acceso a mercados financieros y licitaciones públicas de peso.",
      "La medición permite a las empresas identificar ineficiencias de recursos energéticos e hídricos, optimizando los costos operacionales y mejorando sustancialmente sus calificaciones ESG (Ambiental, Social y Gobernanza).",
      "### ¿Por dónde comenzar el análisis?",
      "- **Definir el alcance:** Establecer si mediremos la huella del producto (ciclo de vida completo) o de la organización (emisiones directas e indirectas de la operación).",
      "- **Recopilación de datos:** Consolidar consumos eléctricos, combustibles de flotas, insumos de producción y consumos de agua cruda o de red.",
      "- **Factores de emisión:** Aplicar las equivalencias nacionales aprobadas por el Ministerio del Medio Ambiente.",
      "- **Plan de Mitigación y Compensación:** Diseñar estrategias concretas como recambio a luminaria LED, uso de energías renovables o recirculación de agua en circuitos de planta.",
      "El conocimiento preciso de tus indicadores ambientales mitiga riesgos regulatorios y de reputación corporativa. Estribor Consultores diseña estrategias y tableros ESG adaptados a la realidad de tu industria."
    ]
  },
  {
    title: "Claves para un reclutamiento efectivo en la industria acuícola",
    slug: "claves-reclutamiento-efectivo-industria-acuicola",
    description: "Estrategias de selección y hunting ejecutivo en centros de cultivo y plantas de proceso de la zona sur.",
    date: "18 de Junio, 2026",
    category: "Gestión de Personas",
    readTime: "5 min de lectura",
    content: [
      "La industria acuícola en Chile representa uno de los sectores más dinámicos, pero también uno de los más complejos a nivel logístico y geográfico. Reclutar perfiles gerenciales, técnicos o de operarios de centros de cultivo en zonas aisladas requiere un enfoque adaptado y un conocimiento profundo del territorio.",
      "Las técnicas tradicionales de selección a menudo fallan cuando no se considera el fit cultural del candidato con las condiciones de turno (sistemas rotativos 14x14 o 7x7) y la vida en plataformas flotantes o pontones marítimos.",
      "### Recomendaciones para Procesos de Selección Exitosos:",
      "1. **Evaluación de Competencias Técnicas y Psicológicas en Faena:** Es vital medir la capacidad de adaptación al aislamiento geográfico y la resiliencia en climas adversos.",
      "2. **Hunting Ejecutivo Consultivo:** Para roles directivos, no basta con publicar ofertas genéricas. Es necesario realizar acercamientos discretos y directos a profesionales en el sector que ya cuenten con historial probado de operación.",
      "3. **Transparencia en Condiciones y Beneficios:** Indicar claramente la logística de transporte, seguros médicos de cobertura remota y la estructura de bonos por productividad.",
      "Estribor Consultores combina su red de contactos y su experiencia en el interior de la industria acuícola para conectar a las empresas con el talento idóneo y comprometido con la continuidad operacional."
    ]
  }
];
