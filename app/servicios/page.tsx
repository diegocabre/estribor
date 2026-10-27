import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import Servicios from "@/components/Servicios";

export const metadata = pageMetadata({
  title: "Servicios",
  description: "Asesorías en gestión de personas, seguridad y salud en el trabajo, sostenibilidad y comunicaciones corporativas para empresas de todo Chile.",
  path: "/servicios",
});

export default function ServiciosPage() {
  return (
    <div className="pt-24 md:pt-28">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Servicios", path: "/servicios" },
        ])}
      />
      <Servicios />
    </div>
  );
}
