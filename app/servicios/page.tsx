import Servicios from "@/components/Servicios";

export const metadata = {
  title: "Servicios | Estribor Consultores",
  description: "Asesorías especializadas en seguridad y salud en el trabajo, cumplimiento normativo, asesoría técnica y gestión organizacional en Chile.",
};

export default function ServiciosPage() {
  return (
    <div className="pt-24 md:pt-28">
      <Servicios />
    </div>
  );
}
