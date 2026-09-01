import MisionVision from "@/components/MisionVision";

export const metadata = {
  title: "Misión y Visión | Estribor Consultores",
  description: "Conoce nuestro propósito, compromiso y visión estratégica para guiar a las organizaciones hacia un desarrollo seguro y sostenible.",
};

export default function MisionVisionPage() {
  return (
    <div className="pt-24 md:pt-28">
      <MisionVision />
    </div>
  );
}
