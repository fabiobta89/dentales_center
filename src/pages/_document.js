import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Open Graph / Social Sharing */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dentalescenter.com/" />
        <meta property="og:title" content="Dentales Center - Clínica Dental de Confianza" />
        <meta property="og:description" content="Cuidamos tu sonrisa con los mejores tratamientos dentales. Agenda tu cita hoy y descubre nuestro equipo de especialistas." />
        <meta property="og:image" content="https://dentalescenter.com/images/og_image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="es_ES" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://dentalescenter.com/" />
        <meta name="twitter:title" content="Dentales Center - Clínica Dental de Confianza" />
        <meta name="twitter:description" content="Cuidamos tu sonrisa con los mejores tratamientos dentales. Agenda tu cita hoy y descubre nuestro equipo de especialistas." />
        <meta name="twitter:image" content="https://dentalescenter.com/images/og_image.jpg" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
