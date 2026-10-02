import { pageMetadata } from "@/lib/seo";
import MisionVision from "@/components/MisionVision";

export const metadata = pageMetadata({
  title: "Misión y Visión",
  description: "Conoce nuestro propósito, compromiso y visión estratégica para guiar a las organizaciones hacia un desarrollo seguro y sostenible.",
  path: "/mision-vision",
});

export default function MisionVisionPage() {
  return (
    <div className="pt-24 md:pt-28">
      <MisionVision />
    </div>
  );
}
