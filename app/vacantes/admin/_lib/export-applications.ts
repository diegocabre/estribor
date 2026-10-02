import type { JobApplication } from "@/lib/types";
import { formatDateChile } from "./admin-api";

/** Descarga las postulaciones filtradas como .xlsx. La librería se carga solo al exportar. */
export async function exportApplicationsToExcel(applications: JobApplication[]) {
  const rows = applications.map((app) => ({
    "Fecha de Postulación": formatDateChile(app.appliedAt),
    "Nombre Completo": app.fullName || "",
    RUT: app.rut || "",
    Teléfono: app.phone || "",
    "Correo Electrónico": app.email || "",
    Ciudad: app.city || "",
    "Cargo al que Postula": app.jobTitle || "",
    "Pretensión de Renta (CLP)": app.salaryExpectation || "",
    Disponibilidad: app.availability || "No especificada",
    "Perfil de LinkedIn": app.linkedinProfile || "No indicado",
    "CV (PDF)": app.cvFileName ? "Disponible en el panel" : "Sin archivo",
    "Consentimiento Privacidad": "Aceptado",
  }));

  const { default: writeXlsxFile } = await import("write-excel-file/browser");

  const headers = Object.keys(rows[0]) as (keyof (typeof rows)[number])[];
  const sheetData = [
    headers.map((header) => ({ value: header, fontWeight: "bold" as const })),
    ...rows.map((row) => headers.map((header) => ({ value: row[header] }))),
  ];

  // Anchos de columna en caracteres, en el mismo orden que las columnas.
  const columns = [20, 26, 15, 18, 28, 18, 34, 24, 16, 32, 22, 25].map((width) => ({ width }));

  const todayStr = new Date().toISOString().split("T")[0];
  await writeXlsxFile(sheetData, { columns, sheet: "Postulaciones" }).toFile(`postulaciones_estribor_${todayStr}.xlsx`);
}
