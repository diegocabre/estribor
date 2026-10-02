import { expect, test } from "@playwright/test";
import { acceptEssentialCookies, mockApi } from "./helpers";

// Lunes 5 de octubre de 2026, 12:00 en Chile: el calendario ofrece desde hoy y bloquea lo ya pasado.
const NOW = new Date("2026-10-05T12:00:00-03:00");

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(NOW);
  await acceptEssentialCookies(page);
  await mockApi(
    page,
    "/api/agenda",
    { json: { success: true, bookings: [{ date: "Martes, 6 de Octubre de 2026", time: "10:30" }] } },
    "GET"
  );
});

test("agenda una reunión de punta a punta", async ({ page }) => {
  const requests = await mockApi(page, "/api/agenda", { json: { success: true } });
  await page.goto("/contacto");

  const calendar = page.getByRole("group", { name: "2. Selecciona Fecha" });
  await expect(calendar.getByRole("button")).toHaveCount(5);
  await page.getByRole("button", { name: "45 min" }).click();
  await calendar.getByRole("button", { name: "Martes, 6 de Octubre de 2026" }).click();

  // El horario reservado por otra persona aparece bloqueado.
  const times = page.getByRole("group", { name: /Horario Disponible/ });
  await expect(times.getByRole("button", { name: "10:30 horas, no disponible" })).toBeDisabled();
  await times.getByRole("button", { name: "12:00 horas" }).click();

  await page.getByRole("button", { name: "Completar Datos de la Reunión" }).click();
  await page.getByLabel("Nombre Completo *").fill("Ana Soto");
  await page.getByLabel("Correo Corporativo *").fill("ana@empresa.cl");
  await page.getByLabel("Objetivo de la Asesoría").selectOption("Sostenibilidad y ESG");
  await page.locator("#booking-privacy").check();
  await page.getByRole("button", { name: "Confirmar Cita" }).click();

  await expect(page.getByText("¡Cita Confirmada!")).toBeVisible();
  await expect(page.getByText("Martes, 6 de Octubre de 2026 a las 12:00 hrs")).toBeVisible();
  expect(requests[0]).toMatchObject({
    dateStr: "2026-10-06",
    time: "12:00",
    duration: "45 min",
    name: "Ana Soto",
    objective: "Sostenibilidad y ESG",
    privacyAccepted: true,
  });
});

test("los horarios de hoy que ya pasaron no se pueden elegir", async ({ page }) => {
  await page.goto("/contacto");

  await page.getByRole("button", { name: "Lunes, 5 de Octubre de 2026" }).click();
  const times = page.getByRole("group", { name: /Horario Disponible/ });
  await expect(times.getByRole("button", { name: "09:00 horas, no disponible" })).toBeDisabled();
  await expect(times.getByRole("button", { name: "12:00 horas, no disponible" })).toBeDisabled();
  await expect(times.getByRole("button", { name: "14:30 horas" })).toBeEnabled();
});

test("si otra persona reservó primero, muestra el error y deja elegir otro horario", async ({ page }) => {
  await mockApi(page, "/api/agenda", {
    status: 409,
    json: { success: false, error: "Este horario ya ha sido reservado por otra persona. Por favor, selecciona una hora diferente." },
  });
  await page.goto("/contacto");

  await page.getByRole("button", { name: "Martes, 6 de Octubre de 2026" }).click();
  await page.getByRole("button", { name: "14:30 horas" }).click();
  await page.getByRole("button", { name: "Completar Datos de la Reunión" }).click();
  await page.getByLabel("Nombre Completo *").fill("Ana Soto");
  await page.getByLabel("Correo Corporativo *").fill("ana@empresa.cl");
  await page.locator("#booking-privacy").check();
  await page.getByRole("button", { name: "Confirmar Cita" }).click();

  await expect(page.getByRole("alert").filter({ hasText: "reservado" })).toContainText("ya ha sido reservado");
  await page.getByRole("button", { name: "Cambiar" }).click();
  await expect(page.getByRole("group", { name: "2. Selecciona Fecha" })).toBeVisible();
});
