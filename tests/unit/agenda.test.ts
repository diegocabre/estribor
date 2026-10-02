import { describe, expect, it } from "vitest";
import {
  chileLocalToUtc,
  formatLongDate,
  getMeetingRange,
  getUpcomingDates,
  isSlotUnavailable,
  isWeekend,
  nowInChile,
  timeToMinutes,
  toCalendarUtc,
} from "@/lib/agenda";

// Jueves 1 de octubre de 2026.
const THURSDAY = "2026-10-01";

describe("formatLongDate", () => {
  it("usa el mismo formato que se guarda en bookings.date", () => {
    expect(formatLongDate("2026-10-05")).toBe("Lunes, 5 de Octubre de 2026");
    expect(formatLongDate("2026-12-31")).toBe("Jueves, 31 de Diciembre de 2026");
  });
});

describe("isWeekend", () => {
  it("detecta sábado y domingo sin depender de la zona horaria del proceso", () => {
    expect(isWeekend("2026-10-03")).toBe(true);
    expect(isWeekend("2026-10-04")).toBe(true);
    expect(isWeekend("2026-10-05")).toBe(false);
  });
});

describe("getUpcomingDates (horarios disponibles)", () => {
  it("ofrece 5 días hábiles y salta el fin de semana", () => {
    const dates = getUpcomingDates({ dateStr: THURSDAY, minutes: timeToMinutes("08:00") });
    expect(dates.map((d) => d.dateStr)).toEqual(["2026-10-01", "2026-10-02", "2026-10-05", "2026-10-06", "2026-10-07"]);
    expect(dates.every((d) => !isWeekend(d.dateStr))).toBe(true);
  });

  it("parte mañana cuando ya pasó el último horario del día (17:30)", () => {
    const dates = getUpcomingDates({ dateStr: THURSDAY, minutes: timeToMinutes("17:30") });
    expect(dates[0].dateStr).toBe("2026-10-02");
  });

  it("si hoy es sábado, el primer día ofrecido es el lunes", () => {
    const dates = getUpcomingDates({ dateStr: "2026-10-03", minutes: 0 });
    expect(dates[0]).toMatchObject({ dateStr: "2026-10-05", dayName: "Lun", dayNum: "05" });
  });
});

describe("isSlotUnavailable (doble reserva y horarios pasados)", () => {
  const now = { dateStr: THURSDAY, minutes: timeToMinutes("11:00") };
  const booked = [{ date: "Lunes, 5 de Octubre de 2026", time: "10:30" }];

  it("bloquea un horario ya reservado por otra persona", () => {
    expect(isSlotUnavailable(booked, "2026-10-05", "10:30", now)).toBe(true);
    expect(isSlotUnavailable(booked, "2026-10-05", "12:00", now)).toBe(false);
  });

  it("bloquea horarios de hoy que ya pasaron, incluido el exacto", () => {
    expect(isSlotUnavailable([], THURSDAY, "09:00", now)).toBe(true);
    expect(isSlotUnavailable([], THURSDAY, "12:00", now)).toBe(false);
    expect(isSlotUnavailable([], THURSDAY, "12:00", { ...now, minutes: timeToMinutes("12:00") })).toBe(true);
  });

  it("bloquea fechas pasadas y permite futuras", () => {
    expect(isSlotUnavailable([], "2026-09-30", "17:30", now)).toBe(true);
    expect(isSlotUnavailable([], "2026-10-02", "09:00", now)).toBe(false);
  });
});

describe("conversión de hora de Chile a UTC", () => {
  it("usa UTC-4 en invierno", () => {
    expect(chileLocalToUtc("2026-07-06", "09:00").toISOString()).toBe("2026-07-06T13:00:00.000Z");
  });

  it("usa UTC-3 en horario de verano (el código anterior sumaba 4 horas fijas)", () => {
    expect(chileLocalToUtc("2026-12-07", "09:00").toISOString()).toBe("2026-12-07T12:00:00.000Z");
  });

  it("no desborda la hora al cruzar medianoche UTC", () => {
    const { start, end } = getMeetingRange("2026-07-06", "21:00", "45 min");
    expect(toCalendarUtc(start)).toBe("20260707T010000Z");
    expect(toCalendarUtc(end)).toBe("20260707T014500Z");
  });
});

describe("nowInChile", () => {
  it("devuelve la fecha de Chile aunque en UTC ya sea el día siguiente", () => {
    // 2026-10-02 02:30 UTC = 2026-10-01 23:30 en Chile (UTC-3).
    expect(nowInChile(new Date("2026-10-02T02:30:00Z"))).toEqual({ dateStr: "2026-10-01", minutes: 23 * 60 + 30 });
  });
});
