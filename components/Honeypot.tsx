"use client";

import { HONEYPOT_FIELD } from "@/lib/honeypot";

interface HoneypotProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Campo trampa anti-spam: invisible para personas y lectores de pantalla, pero los bots
 * que rellenan todos los inputs lo completan. El servidor descarta esos envíos.
 */
export default function Honeypot({ value, onChange }: HoneypotProps) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor={`hp-${HONEYPOT_FIELD}`}>No completar este campo</label>
      <input
        id={`hp-${HONEYPOT_FIELD}`}
        type="text"
        name={HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
