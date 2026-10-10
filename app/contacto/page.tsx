import { pageMetadata } from "@/lib/seo";
import Contacto from "@/components/Contacto";

export const metadata = pageMetadata({
  title: "Contacto",
  description: "Agenda una reunión o escríbenos para evaluar las necesidades de personas, seguridad o cumplimiento de tu empresa en la Región de Los Lagos.",
  path: "/contacto",
});

export default function ContactoPage() {
  return (
    <div className="pt-24 md:pt-28">
      <Contacto headingLevel="h1" />
    </div>
  );
}
