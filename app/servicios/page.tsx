import { pageMetadata } from "@/lib/seo";
import Servicios from "@/components/Servicios";

export const metadata = pageMetadata({
  title: "Servicios",
  description: "Asesorías especializadas en seguridad y salud en el trabajo, cumplimiento normativo, asesoría técnica y gestión organizacional en Chile.",
  path: "/servicios",
});

export default function ServiciosPage() {
  return (
    <div className="pt-24 md:pt-28">
      <Servicios />
    </div>
  );
}
