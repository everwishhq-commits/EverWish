/**
 * 🧩 checkClientExports.js
 * Valida que los componentes del frontend tengan "use client" (solo advertencias).
 * Ignora las rutas API y no detiene el build.
 */

import fs from "fs";
import path from "path";

console.log("\n🔍 Escaneando /components y /app\n");

const rootDirs = ["components", "app"];
const apiPath = path.join(process.cwd(), "app", "api");

const issues = [];

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;

  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // ❌ Ignorar rutas API
      if (filePath.startsWith(apiPath)) continue;
      scanDir(filePath);
      continue;
    }

    if (file.endsWith(".js") || file.endsWith(".jsx") || file.endsWith(".ts") || file.endsWith(".tsx")) {
      const content = fs.readFileSync(filePath, "utf8");

      // Ignorar layout.tsx de Next automáticamente (manejado por el sistema)
      if (file === "layout.js" || file === "layout.tsx") {
        if (!content.includes('"use client"') && !content.includes("'use client'")) {
          issues.push(`⚠️ Falta 'use client' en ${filePath}`);
        }
        continue;
      }

      // Ignorar archivos de rutas API
      if (filePath.includes("/api/")) continue;

      // ⚠️ Revisar si falta "use client"
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

console.log("\n💡 Este script solo muestra advertencias (no detiene el build).\n");
