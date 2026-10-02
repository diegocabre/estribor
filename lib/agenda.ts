// Reglas de la agenda compartidas por el cliente (calendario) y el servidor (/api/agenda).

export const CHILE_TZ = "America/Santiago";

export const TIME_SLOTS = ["09:00", "10:30", "12:00", "14:30", "16:00", "17:30"] as const;
export const DURATIONS = ["15 min", "30 min", "45 min"] as const;
export const OBJECTIVES = [
  "Consultoría General",
  "Gestión de Personas y RRHH",
  "Seguridad y Salud en el Trabajo (SST)",
  "Cumplimiento Ley Karin y Normativas",
  "Sostenibilidad y ESG",
] as const;

/** Días hábiles que se ofrecen en el calendario. */
export const BOOKABLE_WEEKDAYS = 5;
/** Margen máximo (días corridos) que acepta el servidor para una reserva. */
export const MAX_DAYS_AHEAD = 21;

export type TimeSlot = (typeof TIME_SLOTS)[number];
export type Duration = (typeof DURATIONS)[number];
export type Objective = (typeof OBJECTIVES)[number];

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const FULL_DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export interface AgendaDate {
  dayName: string;
  dayNum: string;
  /** Texto largo que también se guarda en `bookings.date`, p. ej. "Lunes, 6 de Julio de 2026". */
  fullDate: string;
  /** Fecha ISO "YYYY-MM-DD". */
  dateStr: string;
}

function parseDateStr(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return { y, m, d };
}

/** Día de la semana (0 = domingo) de una fecha ISO, sin depender de la zona horaria del proceso. */
export function weekdayOf(dateStr: string): number {
  const { y, m, d } = parseDateStr(dateStr);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function isWeekend(dateStr: string): boolean {
  const day = weekdayOf(dateStr);
  return day === 0 || day === 6;
}

export function formatLongDate(dateStr: string): string {
  const { y, m, d } = parseDateStr(dateStr);
  return `${FULL_DAY_NAMES[weekdayOf(dateStr)]}, ${d} de ${MONTH_NAMES[m - 1]} de ${y}`;
}

export function toAgendaDate(dateStr: string): AgendaDate {
  const { d } = parseDateStr(dateStr);
  return {
    dayName: DAY_NAMES[weekdayOf(dateStr)],
    dayNum: String(d).padStart(2, "0"),
    fullDate: formatLongDate(dateStr),
    dateStr,
  };
}

export function addDays(dateStr: string, days: number): string {
  const { y, m, d } = parseDateStr(dateStr);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** Fecha y hora actuales en Chile como `{ dateStr, minutes }` (minutos desde medianoche). */
export function nowInChile(at: Date = new Date()): { dateStr: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: CHILE_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(at);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return {
    dateStr: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

const LAST_SLOT_MINUTES = timeToMinutes(TIME_SLOTS[TIME_SLOTS.length - 1]);

/**
 * Próximos días hábiles reservables. Si ya pasó el último horario de hoy, parte mañana.
 * `now` permite fijar la fecha en pruebas.
 */
export function getUpcomingDates(now: { dateStr: string; minutes: number } = nowInChile(), count = BOOKABLE_WEEKDAYS): AgendaDate[] {
  const dates: AgendaDate[] = [];
  let current = now.minutes >= LAST_SLOT_MINUTES ? addDays(now.dateStr, 1) : now.dateStr;
  while (dates.length < count) {
    if (!isWeekend(current)) dates.push(toAgendaDate(current));
    current = addDays(current, 1);
  }
  return dates;
}

export function isSlotBooked(booked: { date: string; time: string }[], fullDate: string, time: string): boolean {
  return booked.some((slot) => slot.date === fullDate && slot.time === time);
}

/** Un horario no se puede elegir si ya está reservado o si ya pasó (hora de Chile). */
export function isSlotUnavailable(
  booked: { date: string; time: string }[],
  dateStr: string,
  time: string,
  now: { dateStr: string; minutes: number } = nowInChile()
): boolean {
  if (isSlotBooked(booked, formatLongDate(dateStr), time)) return true;
  if (dateStr < now.dateStr) return true;
  if (dateStr > now.dateStr) return false;
  return timeToMinutes(time) <= now.minutes;
}

export function durationToMinutes(duration: Duration): number {
  return Number(duration.split(" ")[0]);
}

function offsetMinutes(at: Date): number {
  const name =
    new Intl.DateTimeFormat("en-US", { timeZone: CHILE_TZ, timeZoneName: "longOffset" })
      .formatToParts(at)
      .find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  const match = /GMT([+-])(\d{2}):?(\d{2})?/.exec(name);
  if (!match) return 0;
  const sign = match[1] === "-" ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3] ?? 0));
}

/** Convierte una fecha y hora locales de Chile a un instante UTC, respetando el horario de verano. */
export function chileLocalToUtc(dateStr: string, time: string): Date {
  const { y, m, d } = parseDateStr(dateStr);
  const [h, min] = time.split(":").map(Number);
  const naive = Date.UTC(y, m - 1, d, h, min);
  let utc = naive - offsetMinutes(new Date(naive)) * 60_000;
  utc = naive - offsetMinutes(new Date(utc)) * 60_000;
  return new Date(utc);
}

/** Formato UTC básico de iCalendar / Google Calendar: 20260706T130000Z */
export function toCalendarUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function getMeetingRange(dateStr: string, time: string, duration: Duration) {
  const start = chileLocalToUtc(dateStr, time);
  const end = new Date(start.getTime() + durationToMinutes(duration) * 60_000);
  return { start, end };
}
