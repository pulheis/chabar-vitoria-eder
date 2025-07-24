import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// Fonte cursiva para elementos decorativos
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dancingScript = {
  fontFamily: "'Dancing Script', cursive",
};

export const metadata: Metadata = {
  title: "Chá Bar - Éder & Vitória | 23 de agosto de 2025",
  description: "Confirme sua presença no Chá Bar do casal Éder e Vitória. 23 de agosto de 2025, às 13h em Ibiúna - SP. Venha celebrar conosco este momento especial!",
  keywords: ["chá bar", "casamento", "éder", "vitória", "confirmação presença", "ibiúna"],
  authors: [{ name: "Éder & Vitória" }],
  openGraph: {
    title: "Chá Bar - Éder & Vitória",
    description: "Confirme sua presença no nosso Chá Bar! 23 de agosto de 2025, às 13h",
    type: "website",
    locale: "pt_BR",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Amiko:wght@400;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#f4ede4" />
        <meta name="color-scheme" content="light" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Chá Bar - Éder & Vitória" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gray-800 focus:text-white focus:rounded-lg focus:shadow-lg"
        >
          Pular para o conteúdo principal
        </a>
        <main id="main-content" role="main">
          {children}
        </main>
      </body>
    </html>
  );
}
