import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { acceptEssentialCookies, mockApi } from "./helpers";

const PAGES = [
  "/",
  "/servicios",
  "/mision-vision",
  "/equipo",
  "/blog",
  "/blog/guia-ley-karin-aplicacion-empresa",
  "/vacantes",
  "/contacto",
  "/privacidad",
  "/vacantes/admin",
];

test.beforeEach(async ({ page }) => {
  await acceptEssentialCookies(page);
  await mockApi(page, "/api/agenda", { json: { success: true, bookings: [] } }, "GET");
  await page.emulateMedia({ reducedMotion: "reduce" });
});

for (const path of PAGES) {
  test(`sin violaciones WCAG 2.1 AA en ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const summary = results.violations.map(
      (v) => `${v.impact} · ${v.id}: ${v.help} (${v.nodes.length}) → ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`
    );
    expect(summary, summary.join("\n")).toEqual([]);
  });
}

test("el enlace 'Saltar al contenido' es el primer elemento enfocable", async ({ page, isMobile }) => {
  test.skip(isMobile, "La navegación con Tab aplica a escritorio");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Saltar al contenido" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#contenido")).toBeFocused();
});

test("el calendario se usa solo con teclado", async ({ page, isMobile }) => {
  test.skip(isMobile, "La navegación con Tab aplica a escritorio");
  await page.goto("/contacto");
  const firstDate = page.getByRole("group", { name: "2. Selecciona Fecha" }).getByRole("button").first();
  await firstDate.focus();
  await page.keyboard.press("Enter");
  await expect(firstDate).toHaveAttribute("aria-pressed", "true");
});

test("el menú móvil informa su estado y se cierra con Escape", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Solo existe en móvil");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Abrir menú" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(page.getByRole("button", { name: "Cerrar menú" })).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#mobile-menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-menu")).toBeHidden();
});
