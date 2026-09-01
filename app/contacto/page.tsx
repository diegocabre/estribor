import Contacto from "@/components/Contacto";

export const metadata = {
  title: "Contacto | Estribor Consultores",
  description: "Contáctanos para evaluar las necesidades de gestión, seguridad o cumplimiento de tu organización en Chile.",
};

export default function ContactoPage() {
  return (
    <div className="pt-24 md:pt-28">
      <Contacto />
    </div>
  );
}
