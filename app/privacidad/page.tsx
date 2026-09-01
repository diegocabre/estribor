import React from "react";
import Link from "next/link";
import { legalConfig } from "@/lib/legalConfig";
import { ShieldCheck, ArrowLeft, Lock, FileText, CheckCircle2, Cookie, Mail } from "lucide-react";

export const metadata = {
  title: `Política de Privacidad y Cookies | ${legalConfig.brandName}`,
  description: "Política de Privacidad y Tratamiento de Datos Personales conforme a la Ley N° 19.628 y Ley N° 21.719 en Chile.",
};

export default function PrivacidadPage() {
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-electric/10 text-brand-electric text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-4 h-4" />
              Cumplimiento Normativo Chile
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-navy tracking-tight leading-tight">
              Política de Privacidad y Protección de Datos Personales
            </h1>
            <p className="text-xs sm:text-sm text-brand-gray-dark mt-3">
              Última actualización: <span className="font-semibold text-brand-navy">{legalConfig.lastUpdated}</span>
            </p>
          </div>

          {/* Content Body */}
          <div className="space-y-8 text-sm sm:text-base text-brand-gray-dark leading-relaxed">
            <section>
              <p>
                La presente Política de Privacidad describe la forma en que <strong>{legalConfig.companyName}</strong> (en adelante, &quot;{legalConfig.brandName}&quot;, &quot;nosotros&quot; o &quot;el Responsable&quot;) recopila, almacena, procesa, protege y trata los datos personales de los usuarios y titulares que acceden, navegan o hacen uso de nuestro sitio web <strong>{legalConfig.websiteUrl}</strong>.
              </p>
              <p className="mt-3">
                Nuestro actuar se fundamenta en el estricto cumplimiento del marco legal chileno, especialmente la <strong>Ley N° 19.628 sobre Protección de la Vida Privada</strong> y sus modificaciones de la <strong>Ley N° 21.719</strong>, implementando principios de licitud, finalidad, proporcionalidad, transparencia y seguridad de la información.
              </p>
            </section>

            {/* 1. Identificación del Responsable */}
            <section className="bg-brand-bg/50 p-6 rounded-xl border border-brand-gray/20">
              <h2 className="text-lg font-bold text-brand-navy mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-gold" />
                1. Identificación del Responsable del Tratamiento
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><strong>Razón Social / Titular:</strong> {legalConfig.companyName}</li>
                <li><strong>RUT:</strong> {legalConfig.companyRut}</li>
                <li><strong>Domicilio Legal:</strong> {legalConfig.companyAddress}</li>
                <li><strong>Correo de Contacto General:</strong> {legalConfig.contactEmail}</li>
                <li><strong>Correo para Derechos de Privacidad (ARCOP):</strong> {legalConfig.privacyEmail}</li>
              </ul>
            </section>

            {/* 2. Datos Personales Recopilados */}
            <section>
              <h2 className="text-lg font-bold text-brand-navy mb-3">2. Datos Personales que Recopilamos</h2>
              <p>
                A través del sitio web únicamente recopilamos aquellos datos personales que el usuario nos entrega de manera libre y voluntaria a través de nuestros canales de contacto o procesos de selección:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-3 text-xs sm:text-sm">
                <li>
                  <strong>Formularios de Contacto y Asesoría:</strong> Nombre completo, correo electrónico, número de teléfono, empresa y mensaje de consulta.
                </li>
                <li>
                  <strong>Portal de Empleo / Postulaciones:</strong> Datos curriculares, antecedentes académicos y laborales, datos de contacto y archivo de Currículum Vitae (PDF) adjunto.
                </li>
                <li>
                  <strong>Datos Técnicos y Analítica Web:</strong> Dirección IP anonimizada, tipo de navegador, páginas consultadas y tiempo de navegación (a través de cookies estadísticas previa autorización del usuario).
                </li>
              </ul>
              <p className="mt-3 text-xs italic text-brand-gray-dark">
                * No solicitamos ni tratamos datos sensibles (origen racial, creencias religiosas, opiniones políticas ni datos de salud) en este sitio web.
              </p>
            </section>

            {/* 3. Finalidades del Tratamiento */}
            <section>
              <h2 className="text-lg font-bold text-brand-navy mb-3">3. Finalidad del Tratamiento de Datos</h2>
              <p>Sus datos personales son tratados con las siguientes finalidades explícitas:</p>
              <ul className="list-disc pl-5 space-y-2 mt-3 text-xs sm:text-sm">
                <li>Atender, gestionar y responder formalmente a consultas, solicitudes de cotización o asesorías requeridas.</li>
                <li>Gestionar procesos de selección de personal y postulaciones laborales en el caso del Portal de Empleo.</li>
                <li>Enviar información comercial, artículos del blog o novedades de servicios solo cuando exista autorización explícita.</li>
                <li>Garantizar la estabilidad, seguridad técnica y prevención de fraudes en nuestra plataforma digital.</li>
              </ul>
            </section>

            {/* 4. Base Legal */}
            <section>
              <h2 className="text-lg font-bold text-brand-navy mb-3">4. Base Legal y Licitud</h2>
              <p>
                El tratamiento de datos personales realizado por {legalConfig.brandName} se ampara en el <strong>consentimiento libre, informado y expreso</strong> otorgado por el titular al enviar cualquiera de nuestros formularios o al configurar sus preferencias de cookies, así como en la necesidad de ejecutar medidas precontractuales o contractuales solicitadas por el titular.
              </p>
            </section>

            {/* 5. Transferencia a Terceros y Encargados */}
            <section>
              <h2 className="text-lg font-bold text-brand-navy mb-3">5. Comunicación de Datos a Terceros</h2>
              <p>
                {legalConfig.brandName} <strong>no vende, arrienda ni comercializa</strong> bajo ninguna circunstancia datos personales a terceros.
              </p>
              <p className="mt-2 text-xs sm:text-sm">
                Para el correcto funcionamiento operativo y tecnológico, los datos pueden ser procesados por proveedores en calidad de Encargados del Tratamiento (servicios de hosting seguro, bases de datos y plataformas de mensajería electrónica), todos los cuales cuentan con estándares de seguridad acordes a la normativa legal.
              </p>
            </section>

            {/* 6. Derechos ARCOP */}
            <section className="bg-brand-navy text-white p-6 sm:p-8 rounded-xl">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-brand-gold" />
                6. Derechos del Titular (Derechos ARCOP)
              </h2>
              <p className="text-xs sm:text-sm text-white/80 mb-4">
                De conformidad con la legislación de datos personales en Chile, usted puede ejercer gratuitamente los siguientes derechos:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <span className="font-bold text-brand-gold block mb-1">Acceso</span>
                  Conocer qué datos personales suyos mantenemos registrados y cómo son tratados.
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <span className="font-bold text-brand-gold block mb-1">Rectificación</span>
                  Solicitar la corrección, actualización o complementación de datos erróneos.
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <span className="font-bold text-brand-gold block mb-1">Cancelación / Supresión</span>
                  Solicitar la eliminación de sus datos cuando no exista fundamento legal para su conservación.
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <span className="font-bold text-brand-gold block mb-1">Oposición y Portabilidad</span>
                  Oponerse a usos específicos o solicitar copia de sus datos en formato estructurado.
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-xs text-white/70">
                  Para ejercer sus derechos, envíe una solicitud a:
                  <span className="font-mono text-white block mt-0.5">{legalConfig.privacyEmail}</span>
                </div>
                <a
                  href={`mailto:${legalConfig.privacyEmail}?subject=Solicitud%20Derechos%20ARCOP%20-%20Proteccion%20de%20Datos`}
                  className="px-4 py-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-navy text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1.5"
                >
                  <Mail className="w-4 h-4" />
                  Enviar Solicitud ARCOP
                </a>
              </div>
            </section>

            {/* 7. Política de Cookies */}
            <section id="cookies" className="pt-4">
              <h2 className="text-lg font-bold text-brand-navy mb-3 flex items-center gap-2">
                <Cookie className="w-5 h-5 text-brand-electric" />
                7. Política de Cookies y Tecnologías de Rastreo
              </h2>
              <p className="text-xs sm:text-sm">
                Las cookies son pequeños archivos que se almacenan en su navegador para permitir el funcionamiento del sitio y conocer patrones generales de navegación.
              </p>
              <div className="space-y-3 mt-3 text-xs sm:text-sm">
                <div className="p-3 bg-brand-bg rounded-lg border border-brand-gray/10">
                  <strong>Cookies Técnicas (Esenciales):</strong> Necesarias para la navegación y seguridad del sitio. No requieren autorización previa.
                </div>
                <div className="p-3 bg-brand-bg rounded-lg border border-brand-gray/10">
                  <strong>Cookies Analíticas (Opcionales):</strong> Utilizadas para medir visitas y fuentes de tráfico con el fin de mejorar nuestros contenidos. Solo se activan si usted las acepta expresamente en el banner de cookies.
                </div>
              </div>
              <p className="mt-3 text-xs">
                Usted puede modificar sus preferencias de cookies en cualquier momento borrando las cookies de su navegador web o haciendo uso de los controles de configuración de privacidad de su navegador (Chrome, Edge, Safari, Firefox).
              </p>
            </section>

            {/* 8. Seguridad */}
            <section className="pt-4 border-t border-brand-gray/20">
              <h2 className="text-lg font-bold text-brand-navy mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-brand-gold" />
                8. Medidas de Seguridad de la Información
              </h2>
              <p className="text-xs sm:text-sm">
                {legalConfig.brandName} adopta medidas técnicas y organizativas para resguardar la confidencialidad, integridad y disponibilidad de la información personal, incluyendo conexiones seguras con cifrado HTTPS/SSL, control de accesos restringido y almacenamiento seguro.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
