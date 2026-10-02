import { NextRequest } from "next/server";
import { vi } from "vitest";

type Result = { data?: unknown; error?: { code?: string; message: string } | null; count?: number };

export interface RecordedCall {
  table: string;
  method: string;
  args: unknown[];
}

/**
 * Cliente de Supabase falso y encadenable. Cada operación final (await sobre la consulta)
 * devuelve el siguiente resultado configurado para esa tabla y método.
 */
export function createSupabaseMock() {
  const calls: RecordedCall[] = [];
  const queued = new Map<string, Result[]>();
  const storageCalls: { method: string; args: unknown[] }[] = [];

  const respond = (table: string, op: string): Result => {
    const list = queued.get(`${table}.${op}`);
    return list?.shift() ?? { data: [], error: null };
  };

  const from = (table: string) => {
    let op = "select";
    const builder: Record<string, unknown> = {};
    const chain = (method: string) =>
      (...args: unknown[]) => {
        calls.push({ table, method, args });
        if (["select", "insert", "update", "delete"].includes(method) && op === "select") op = method;
        if (method === "insert" || method === "update" || method === "delete") op = method;
        return builder;
      };
    for (const m of ["select", "insert", "update", "delete", "eq", "in", "order", "limit", "range"]) {
      builder[m] = chain(m);
    }
    builder.single = () => Promise.resolve(respond(table, op));
    builder.maybeSingle = () => Promise.resolve(respond(table, op));
    builder.then = (resolve: (r: Result) => unknown, reject: (e: unknown) => unknown) =>
      Promise.resolve(respond(table, op)).then(resolve, reject);
    return builder;
  };

  const storageBucket = {
    upload: vi.fn(async (...args: unknown[]) => {
      storageCalls.push({ method: "upload", args });
      return { data: { path: args[0] }, error: null };
    }),
    remove: vi.fn(async (...args: unknown[]) => {
      storageCalls.push({ method: "remove", args });
      return { data: null, error: null };
    }),
    createSignedUrl: vi.fn(async () => ({ data: { signedUrl: "https://signed.example/cv.pdf" }, error: null })),
  };

  const client = {
    from: vi.fn(from),
    storage: { from: vi.fn(() => storageBucket) },
    auth: { getUser: vi.fn() },
  };

  return {
    client,
    calls,
    storageCalls,
    storageBucket,
    /** Programa la respuesta de la próxima operación `op` (select, insert...) sobre `table`. */
    queue(table: string, op: string, result: Result) {
      const key = `${table}.${op}`;
      queued.set(key, [...(queued.get(key) ?? []), result]);
    },
    callsFor(table: string, method: string) {
      return calls.filter((c) => c.table === table && c.method === method);
    },
  };
}

/** Mock de fetch para la API de Resend: registra cada correo enviado. */
export function mockResend(options: { failFor?: (to: string) => boolean } = {}) {
  const sent: { to: string; subject: string; html: string; from: string }[] = [];
  const fetchMock = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
    if (String(url) !== "https://api.resend.com/emails") throw new Error(`fetch inesperado: ${String(url)}`);
    const body = JSON.parse(String(init?.body));
    const to = body.to[0] as string;
    if (options.failFor?.(to)) {
      return new Response(JSON.stringify({ message: "sandbox" }), { status: 403 });
    }
    sent.push({ to, subject: body.subject, html: body.html, from: body.from });
    return new Response(JSON.stringify({ id: `email_${sent.length}` }), { status: 200 });
  });
  vi.stubGlobal("fetch", fetchMock);
  return { sent, fetchMock };
}

let ipCounter = 0;
/** IP distinta por solicitud para que el rate limit no interfiera entre pruebas. */
export function uniqueIp() {
  ipCounter += 1;
  return `10.0.${Math.floor(ipCounter / 250)}.${ipCounter % 250}`;
}

export function jsonRequest(url: string, body: unknown, ip = uniqueIp()) {
  return new NextRequest(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

export function getRequest(url: string, ip = uniqueIp(), headers: Record<string, string> = {}) {
  return new NextRequest(url, { headers: { "x-forwarded-for": ip, ...headers } });
}
