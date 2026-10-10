import { Mail, Phone } from "lucide-react";
import { legalConfig } from "@/lib/legalConfig";

const EMAIL = legalConfig.contactEmail;
const PHONE_DISPLAY = legalConfig.phone;
const PHONE_HREF = `tel:${legalConfig.phone.replace(/\s/g, "")}`;

/** Franja con correo y teléfono directo. */
export default function ContactInfo() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 p-4 rounded-xl bg-brand-bg/50 border border-brand-gray/10 text-xs">
      <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 text-brand-navy hover:text-brand-electric transition-colors">
        <Mail aria-hidden="true" className="h-4 w-4 text-brand-electric shrink-0" />
        <span className="truncate">{EMAIL}</span>
      </a>
      <a href={PHONE_HREF} className="flex items-center gap-2 text-brand-navy hover:text-brand-electric transition-colors">
        <Phone aria-hidden="true" className="h-4 w-4 text-brand-electric shrink-0" />
        <span>{PHONE_DISPLAY}</span>
      </a>
    </div>
  );
}
