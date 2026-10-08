import type { TeamMember } from "@/lib/types";

// Equipo que se muestra en /equipo. Para sumar a alguien: agregar su foto en
// public/images/team (WebP, ~760 px de ancho) y una entrada aquí.

export const teamMembers: TeamMember[] = [
  {
    name: "Camila Alvear",
    role: "Directora Ejecutiva",
    bio: "Con más de 10 años de experiencia en industrias productivas, Camila ha liderado estrategias y cambios organizacionales impactando directamente en los objetivos del negocio. Desde la Gestión de Personas, Comunicaciones Corporativas, Compliance y Sostenibilidad.",
    photo: "/images/team/camilaalvear.webp",
    group: "direccion",
  },
  {
    name: "Dayana González",
    role: "Consultora Atracción de Talento",
    bio: "Psicóloga Organizacional y Diplomada en Gestión de Recursos Humanos, con experiencia en procesos de Atracción y Selección de talento.",
    photo: "/images/team/dayanagonzalez.webp",
    group: "consultor",
  },
  {
    name: "Fernanda Núñez",
    role: "Consultora Senior Comunicaciones Corporativas, Gestión del Cambio y Cultura",
    bio: "Periodista Corporativa, especialista en cultura, comunicaciones y transformación organizacional, con más de 10 años de experiencia acompañando procesos de cambio e integración así como gestión de crisis, sostenibilidad y procesos de reportabilidad.",
    photo: "/images/team/fernandanunez.webp",
    group: "consultor",
  },
  {
    // TODO: agregar el apellido cuando esté confirmado.
    name: "Fabián",
    role: "Consultor Senior HSE",
    bio: "Prevencionista de riesgos con cerca de 10 años en construcción y salmonicultura. Experiencia en programas preventivos, normativa MINSAL, sistemas de gestión y certificaciones ASC, BAP e ISO.",
    photo: "/images/team/fabian.webp",
    group: "consultor",
  },
];
