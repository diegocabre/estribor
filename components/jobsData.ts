export interface Job {
  id: string;
  title: string;
  area: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  functions: string;
  confidential: boolean;
  active: boolean;
  createdAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  rut: string;
  email: string;
  phone: string;
  city: string;
  salaryExpectation: string;
  availability: string;
  cvFileName: string;
  linkedinProfile?: string;
  appliedAt: string;
}

export const initialJobs: Job[] = [
  {
    id: "job-1",
    title: "Consultor Senior de Seguridad y Salud en el Trabajo",
    area: "Seguridad y Salud en el Trabajo",
    location: "Puerto Montt",
    type: "Full-time",
    description: "Buscamos un Ingeniero en Prevención de Riesgos o profesional afín con registro SNS vigente y al menos 10 años de experiencia liderando programas de seguridad ocupacional en el sector acuícola y productivo de la zona sur del país.",
    requirements: "Registro SNS vigente, residencia en la X Región (o disponibilidad de traslado), experiencia demostrable de 8+ años en centros de cultivo e industrias de procesos, y conocimiento avanzado de normas ISO 45001 y protocolos Minsal.",
    functions: "Diseñar e implementar programas preventivos, realizar auditorías de sistemas de gestión de SST, atender requerimientos normativos de fiscalizaciones y capacitar a comités paritarios y personal técnico.",
    confidential: false,
    active: true,
    createdAt: "2026-07-01T10:00:00Z"
  },
  {
    id: "job-2",
    title: "Jefe de Desarrollo Organizacional y Personas",
    area: "Gestión de Personas",
    location: "Región Metropolitana (Híbrido)",
    type: "Full-time",
    description: "Para importante cliente de la industria alimentaria, buscamos profesional para liderar el área de Gestión de Personas, con foco en clima laboral, planes de desarrollo de carrera, evaluación de desempeño y la implementación de protocolos internos asociados a la Ley Karin.",
    requirements: "Psicólogo(a), Ingeniero(a) Comercial o carrera afín, con especialización en DO y al menos 5 años de experiencia liderando áreas de personas en empresas productivas. Conocimiento de la Ley Karin y herramientas de evaluación.",
    functions: "Liderar procesos de DO, capacitaciones y evaluación del desempeño. Coordinar y desplegar el protocolo de prevención de acoso y canal de denuncias. Brindar asesoría estratégica a gerencias en clima laboral.",
    confidential: true,
    active: true,
    createdAt: "2026-06-28T09:00:00Z"
  },
  {
    id: "job-3",
    title: "Consultor de Sostenibilidad y ESG",
    area: "Sostenibilidad Organizacional",
    location: "Santiago (Remoto)",
    type: "Part-time",
    description: "Buscamos consultor con experiencia en proyectos socioambientales para apoyar en la medición de huellas hídricas y de carbono, diseño de reportes anuales bajo estándares GRI y diseño de indicadores ESG para clientes de la construcción y energía.",
    requirements: "Ingeniero(a) Ambiental, Civil, en Recursos Naturales o similar, con certificaciones en reporte GRI u otros estándares ESG. Experiencia mínima de 3 años en consultoría ambiental o corporativa.",
    functions: "Levantamiento de información y datos de emisiones energéticas e hídricas. Redacción y estructuración de reportes de sostenibilidad corporativa. Asesoría en matrices de materialidad.",
    confidential: false,
    active: true,
    createdAt: "2026-06-25T11:30:00Z"
  }
];
