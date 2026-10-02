import { pageMetadata } from "@/lib/seo";
import Contacto from "@/components/Contacto";

export const metadata = pageMetadata({
  title: "Contacto",
  description: "Contáctanos para evaluar las necesidades de gestión, seguridad o cumplimiento de tu organización en Chile.",
  path: "/contacto",
});

export default function ContactoPage() {
  return (
    <div className="pt-24 md:pt-28">
      <Contacto />
    </div>
  );
}
