import { expect, test } from "@playwright/test";
import { acceptEssentialCookies, mockApi } from "./helpers";

test.beforeEach(async ({ page }) => {
  await acceptEssentialCookies(page);
  await mockApi(page, "/api/agenda", { json: { success: true, bookings: [] } }, "GET");
});

test("envía el formulario de contacto", async ({ page }) => {
  const requests = await mockApi(page, "/api/contacto", { json: { success: true } });
  await page.goto("/contacto");

  await page.getByLabel("Nombre *").fill("Juan Pérez");
  await page.getByLabel("Correo *").fill("juan@empresa.cl");
  await page.getByLabel("Empresa", { exact: true }).fill("Acuícola Sur");
  await page.getByLabel("Mensaje o Consulta *").fill("Queremos implementar el protocolo de Ley Karin.");
  await page.locator("#privacy-consent").check();
  await page.getByRole("button", { name: "Enviar Mensaje" }).click();

  await expect(page.getByRole("status")).toContainText("¡Mensaje Enviado con Éxito!");
  expect(requests[0]).toMatchObject({
    name: "Juan Pérez",
    email: "juan@empresa.cl",
    company: "Acuícola Sur",
    privacyAccepted: true,
    website: "",
  });
});

test("muestra el error que devuelve el servidor", async ({ page }) => {
  await mockApi(page, "/api/contacto", { status: 400, json: { success: false, error: "Correo electrónico inválido." } });
  await page.goto("/contacto");

  await page.getByLabel("Nombre *").fill("Juan Pérez");
  await page.getByLabel("Correo *").fill("juan@empresa.cl");
  await page.getByLabel("Mensaje o Consulta *").fill("Necesito una cotización de auditoría SST.");
  await page.locator("#privacy-consent").check();
  await page.getByRole("button", { name: "Enviar Mensaje" }).click();

  await expect(page.getByRole("alert").filter({ hasText: "Correo" })).toHaveText("Correo electrónico inválido.");
});

test("no envía sin aceptar la política de privacidad", async ({ page }) => {
  const requests = await mockApi(page, "/api/contacto", { json: { success: true } });
  await page.goto("/contacto");

  await page.getByLabel("Nombre *").fill("Juan Pérez");
  await page.getByLabel("Correo *").fill("juan@empresa.cl");
  await page.getByLabel("Mensaje o Consulta *").fill("Necesito una cotización de auditoría SST.");
  await page.getByRole("button", { name: "Enviar Mensaje" }).click();

  // El checkbox es required: el navegador bloquea el envío.
  expect(requests).toHaveLength(0);
  await expect(page.locator("#privacy-consent")).toHaveJSProperty("validity.valid", false);
});
