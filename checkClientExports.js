/**
 * ✅ checkClientExports.js — versión segura
 * - Ignora /api (no revisa rutas)
 * - Solo avisa si faltan "use client" en componentes visuales
 * - No detiene el build de Vercel
 */

import fs from "fs";
import path from "path";

console.log("\n🔍 Escaneando /components y /app\n");

const rootDirs = ["components", "app"];
const issues = [];

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;

  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // 🔒 Ignorar rutas API
      if (filePath.includes("/api/")) continue;
      scanDir(filePath);
      continue;
    }

    // Solo revisar archivos JS/TS visibles
    if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      const content = fs.readFileSync(filePath, "utf8");

      // 🧩 Ignorar server components o route handlers
      if (filePath.includes("/api/")) continue;

      // ⚠️ Revisar uso de "use client"
      if (!content.includes('"use client"') && !content.includes("'use client'")) {
        issues.push(`⚠️ Falta 'use client' en ${filePath}`);
      }
    }
  }
}

for (const dir of rootDirs) {
  scanDir(path.join(process.cwd(), dir));
}

if (issues.length > 0) {
  console.log("\n⚠️ Archivos que podrían necesitar 'use client':");
  for (const i of issues) console.log("  " + i);
} else {
  console.log("✅ Todos los archivos están correctos.");
}

console.log("\n💡 Solo advertencias — no se detiene el build.\n");
