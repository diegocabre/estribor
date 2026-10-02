/**
 * Los registros antiguos guardan la URL pública completa del CV; los nuevos, solo la ruta
 * dentro del bucket. Devuelve siempre la ruta, o null si no hay archivo.
 */
export function cvPathFromStored(stored: string | null | undefined): string | null {
  if (!stored) return null;
  const marker = "/storage/v1/object/public/cvs/";
  const index = stored.indexOf(marker);
  if (index >= 0) return decodeURIComponent(stored.slice(index + marker.length));
  if (/^https?:\/\//i.test(stored)) return null;
  return stored;
}
