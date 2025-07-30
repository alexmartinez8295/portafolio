"use client";

import { useEffect, useState, useCallback } from 'react';

// La secuencia de teclas para el código Konami
const konamiCode = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export const useKonamiCode = (callback: () => void) => {
  const [keys, setKeys] = useState<string[]>([]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      setKeys((prevKeys) => {
        const updatedKeys = [...prevKeys, event.key].slice(-konamiCode.length);

        if (JSON.stringify(updatedKeys) === JSON.stringify(konamiCode)) {
          callback();
        }

        return updatedKeys;
      });
    },
    [callback]
  );

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);
};
