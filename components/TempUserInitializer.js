"use client";

import { useEffect } from "react";
import { initTempUser, getDraftStats } from "@/lib/auth";

/**
 * Componente que inicializa automáticamente el usuario temporal
 * Agrega esto en tu layout o _app.js para que se ejecute en toda la app
 */
export default function TempUserInitializer() {
  useEffect(() => {
    // Inicializar usuario temporal al cargar la app
    const user = initTempUser();
    
    // Log para debug (puedes quitar esto en producción)
    if (user?.isTemp) {
      console.log("👤 Usuario temporal activo:", user.tempId);
      
      // Mostrar estadísticas de drafts
      const stats = getDraftStats();
      if (stats.total > 0) {
        console.log("📊 Drafts pendientes:", stats);
      }
    }
  }, []);

  // Este componente no renderiza nada
  return null;
}
