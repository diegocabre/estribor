import React from "react";
import Link from "next/link";
import { legalConfig } from "@/lib/legalConfig";
import { Scale, ArrowLeft, Shield, FileCheck, AlertCircle } from "lucide-react";

export const metadata = {
  title: `Términos y Condiciones de Uso | ${legalConfig.brandName}`,
  description: "Términos y condiciones de uso del sitio web y servicios de Estribor Consultores.",
};

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-brand-bg py-16 px-4 sm:px-6 lg:px-8 text-brand-navy">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb / Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-electric hover:text-brand-navy transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        {/* Main Document Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-brand-gray/20 p-8 sm:p-12">
          {/* Header */}
          <div className="border-b border-brand-gray/20 pb-8 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-navy text-xs font-bold uppercase tracking-wider mb-4">
              <Scale className="w-4 h-4 text-brand-gold" />
              Marco Legal y Operativo
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-navy tracking-tight leading-tight">
              Términos y Condiciones de Uso
            </h1>
            <p className="text-xs sm:text-sm text-brand-gray-dark mt-3">
              Última actualización: <span className="font-semibold text-brand-navy">{legalConfig.lastUpdated}</span>
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8 text-sm sm:text-base text-brand-gray-dark leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-brand-navy mb-2 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-brand-electric" />
                1. Información General y Aceptación
              </h2>
              <p>
                El presente sitio web <strong>{legalConfig.websiteUrl}</strong> es operado por <strong>{legalConfig.companyName}</strong> (en adelante, &quot;{legalConfig.brandName}&quot;), con domicilio en {legalConfig.companyAddress}, correo de contacto: {legalConfig.contactEmail}.
              </p>
              <p className="mt-2">
                El acceso, navegación y uso de este sitio web atribuye la condición de usuario e implica la aceptación plena e incondicional de los presentes Términos y Condiciones. Si usted no está de acuerdo con las condiciones aquí establecidas, le recomendamos abstenerse de utilizar este sitio.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-brand-navy mb-2">2. Objeto y Servicios</h2>
              <p>
                {legalConfig.brandName} es una firma de consultoría especializada en Seguridad y Salud en el Trabajo, Cumplimiento Normativo (incluyendo Ley Karin), Sostenibilidad Organizacional y Gestión de Personas en Chile.
              </p>
              <p className="mt-2">
                El sitio web tiene por objeto ofrecer información corporativa, detalle de servicios, publicaciones técnicas, canales de contacto y un portal para la postulación a procesos de selección laboral.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-brand-navy mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-gold" />
                3. Propiedad Intelectual e Industrial
              </h2>
              <p>
                Todos los elementos constitutivos del sitio web, incluyendo marcas comerciales, logotipos, textos explicativos, metodologías, diseños visuales, iconografía y código fuente, son propiedad exclusiva de {legalConfig.brandName} o cuentan con las debidas licencias de uso.
              </p>
              <p className="mt-2">
                Queda expresamente prohibida la reproducción total o parcial, explotación comercial, ingeniería inversa o distribución de dichos contenidos sin la previa autorización expresa y por escrito de {legalConfig.brandName}.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-brand-navy mb-2">4. Obligaciones y Conducta del Usuario</h2>
              <p>El usuario se compromete a:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2 text-xs sm:text-sm">
                <li>Hacer un uso diligente, honesto y conforme a la ley de todos los canales y formularios disponibles.</li>
                <li>Entregar información verídica y comprobable al postular a vacantes laborales o solicitar cotizaciones.</li>
                <li>No introducir virus, scripts maliciosos ni intentar vulnerar la seguridad de los servidores o bases de datos de la empresa.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-brand-navy mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-brand-electric" />
                5. Limitación de Responsabilidad
              </h2>
              <p>
                La información provista en los artículos del blog o material divulgativo tiene fines puramente informativos y orientativos, no constituyendo por sí misma una asesoría jurídica o pericial vinculante hasta la formalización de un contrato de prestación de servicios profesionales.
              </p>
              <p className="mt-2 text-xs sm:text-sm">
                {legalConfig.brandName} no se responsabiliza por interrupciones imprevistas del servicio derivadas de caídas en proveedores de internet o causas de fuerza mayor fuera de nuestro control razonable.
              </p>
            </section>

            <section className="bg-brand-bg/50 p-6 rounded-xl border border-brand-gray/20">
              <h2 className="text-lg font-bold text-brand-navy mb-2">6. Legislación Aplicable y Jurisdicción</h2>
              <p className="text-xs sm:text-sm">
                Los presentes Términos y Condiciones se rigen e interpretan en conformidad con las leyes de la <strong>República de Chile</strong>. Cualquier controversia, desacuerdo o reclamación relativa a su validez, interpretación o ejecución será sometida a la jurisdicción de los Tribunales Ordinarios de Justicia de <strong>{legalConfig.cityJurisdiction}</strong>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
