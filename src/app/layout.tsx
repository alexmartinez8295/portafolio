import { Roboto_Mono } from 'next/font/google';
import Navbar from '../components/Navbar';
import { AOSInit } from '../components/AOSInit';
import { KonamiCodeDetector } from '../components/KonamiCodeDetector';
import './globals.css';

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

export const metadata = {
  title: 'Alx.is.dev - AlxSites®',
  description: 'Portafolio personal de un Ingeniero de Software apasionado por la tecnología y la innovación.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="images/favicon.svg" sizes="any" type="image/svg+xml"/>
        <link rel="stylesheet" href="/assets/css/fontawesome-all.min.css" />
      </head>
      <body className={`${robotoMono.className} main-content-padding`}>
        <KonamiCodeDetector />
        <AOSInit />
        <Navbar />
        {children}
      </body>
    </html>
  );
}