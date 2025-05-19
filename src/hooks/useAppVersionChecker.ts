// src/hooks/useAppVersionChecker.ts
import { useEffect, useRef } from "react";

const isDev = import.meta.env.DEV;

export function useAppVersionChecker() {
  const currentHash = useRef<string | null>(null);

  useEffect(() => {
    if (isDev) return; // ⛔ Ignora em dev

    fetch('/meta.json', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        currentHash.current = data.hash;
      });

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/meta.json', { cache: 'no-store' });
        const data = await res.json();

        if (currentHash.current && data.hash !== currentHash.current) {
          console.log('🔄 Nova versão detectada. Recarregando...');
          window.location.reload();
        }
      } catch (err) {
        console.error('Erro ao verificar versão', err);
      }
    }, 60000); // verifica a cada 1 min

    return () => clearInterval(interval);
  }, []);
}