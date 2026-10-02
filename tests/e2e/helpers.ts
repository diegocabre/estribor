import type { Page } from "@playwright/test";

/** Guarda "Solo esenciales" antes de cargar, para que el aviso de cookies no tape los formularios. */
export async function acceptEssentialCookies(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem("estribor_cookie_consent", "essential");
  });
}

/** Intercepta una ruta /api y devuelve la respuesta indicada. Retorna los cuerpos recibidos. */
export async function mockApi(page: Page, path: string, response: { status?: number; json: unknown }, method = "POST") {
  const bodies: unknown[] = [];
  await page.route(`**${path}`, async (route) => {
    if (route.request().method() !== method) return route.fallback();
    const raw = route.request().postData();
    bodies.push(raw ? JSON.parse(raw) : null);
    await route.fulfill({ status: response.status ?? 200, contentType: "application/json", body: JSON.stringify(response.json) });
  });
  return bodies;
}
