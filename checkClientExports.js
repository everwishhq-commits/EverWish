/**
 * ✅ checkClientExports.js — versión segura para Vercel
 * - Ignora completamente /api (no revisa rutas del servidor)
 * - Solo muestra advertencias de "use client" en componentes visuales
 * - NO DETIENE el build (no usa process.exit)
 */

import fs from "fs";
import path from "path";

console.log("\n🔍 Escaneando /components y /app\n");

const rootDirs = ["components", "app"];
const issues = [];

/**
 * Revisa archivos recursivamente, excluyendo /api/
 */
function scanDir(dir) {
  if (!fs.existsSync(dir)) return;

  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    // Ignorar carpetas API y node_modules
    if (filePath.includes("/api/") || filePath.includes("node_modules")) continue;

    if (stat.isDirectory()) {
      scanDir(filePath);
      continue;
    }

    // Solo revisar archivos JS o TS
    if (!/\.(js|jsx|ts|tsx)$/.test(file)) continue;

    const content = fs.readFileSync(filePath, "utf8");

    // Ignorar si es un layout o server component explícito
    if (
      filePath.includes("route.js") ||
      filePath.includes("layout.js") ||
      filePath.includes("middleware.js")
    ) {
      continue;
    }

    // Revisar si falta "use client"
    if (!content.includes('"use client"') && !content.includes("'use client'")) {
      issues.push(`⚠️ Falta 'use client' en ${filePath}`);
    }
  }
}

// Escanear ambas carpetas principales
for (const dir of rootDirs) {
  scanDir(path.join(process.cwd(), dir));
}

// Reporte final
if (issues.length > 0) {
  console.log("\n⚠️ Archivos que podrían necesitar 'use client':");
  for (const i of issues) console.log("  " + i);
} else {
  console.log("✅ Todos los archivos están correctos.");
}

console.log("\n💡 Solo advertencias — no se detiene el build.\n");
