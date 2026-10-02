// Informe de accesibilidad: `node tests/e2e/axe-report.mjs [baseUrl]`.
// Recorre las páginas públicas con axe-core (WCAG 2.1 AA) y agrupa las violaciones por regla.
import AxeBuilder from "@axe-core/playwright";
import { chromium, devices } from "@playwright/test";

const BASE = process.argv[2] ?? "http://localhost:3000";
const PAGES = ["/", "/servicios", "/mision-vision", "/equipo", "/blog", "/blog/guia-ley-karin-aplicacion-empresa", "/vacantes", "/contacto", "/privacidad", "/terminos", "/vacantes/admin"];

const browser = await chromium.launch();
const byRule = new Map();

for (const device of ["Desktop Chrome", "Pixel 7"]) {
  const context = await browser.newContext({ ...devices[device], reducedMotion: "reduce", locale: "es-CL" });
  await context.addInitScript(() => localStorage.setItem("estribor_cookie_consent", "essential"));
  const page = await context.newPage();

  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    for (const v of violations) {
      const entry = byRule.get(v.id) ?? { impact: v.impact, help: v.help, pages: new Set(), targets: new Map() };
      entry.pages.add(path);
      for (const node of v.nodes) {
        const key = node.target.join(" ");
        entry.targets.set(key, node.any[0]?.message ?? node.failureSummary?.split("\n")[1] ?? "");
      }
      byRule.set(v.id, entry);
    }
  }
  await context.close();
}
await browser.close();

if (byRule.size === 0) {
  console.log("Sin violaciones WCAG 2.1 AA.");
} else {
  for (const [id, e] of byRule) {
    console.log(`\n[${e.impact}] ${id}: ${e.help}\n  páginas: ${[...e.pages].join(", ")}`);
    for (const [target, msg] of [...e.targets].slice(0, 12)) console.log(`  - ${target}\n      ${msg}`);
    if (e.targets.size > 12) console.log(`  ... y ${e.targets.size - 12} elementos más`);
  }
}
