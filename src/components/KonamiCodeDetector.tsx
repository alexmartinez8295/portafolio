"use client";

import { useRouter } from 'next/navigation';
import { useKonamiCode } from './useKonamiCode';

// Este componente no renderiza nada. Solo escucha el código Konami.
export const KonamiCodeDetector = () => {
  const router = useRouter();

  // Cuando el código se introduce correctamente, redirige a /login
  useKonamiCode(() => {
    router.push('/login');
  });

  return null; // No renderiza ningún elemento en el DOM
};
