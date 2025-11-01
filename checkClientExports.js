import fs from "fs";
import path from "path";

const foldersToCheck = [
  path.join(process.cwd(), "components"),
  path.join(process.cwd(), "app"),
];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const hasDefaultExport = /export\s+default\s+function\s+\w+/i.test(content);
  const hasUseClient = /["']use client["']/.test(content);
  return { hasDefaultExport, hasUseClient };
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir);
  let results = [];
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (/\.(jsx|js|tsx|ts)$/.test(file)) {
      results.push(filePath);
    }
  }
  return results;
}

console.log("\n🔍 Escaneando /components y /app\n");

let hasErrors = false;

for (const dir of foldersToCheck) {
  const allFiles = walk(dir);
  if (allFiles.length === 0) continue;

  console.log(`📁 Carpeta: ${path.relative(process.cwd(), dir)}\n`);

  for (const file of allFiles) {
    const { hasDefaultExport, hasUseClient } = checkFile(file);
    const relative = path.relative(process.cwd(), file);
    if (!hasDefaultExport || !hasUseClient) {
      hasErrors = true;
      console.log(`⚠️ ${relative}`);
      if (!hasDefaultExport) console.log("   ❌ Falta 'export default function'");
      if (!hasUseClient) console.log("   ⚠️ Falta 'use client'");
    }
  }

  console.log("");
}

if (!hasErrors) {
  console.log("✅ Todo está correcto: los componentes exportan bien y tienen 'use client' cuando corresponde.\n");
} else {
  console.log("💡 Corrige los archivos listados arriba antes de volver a desplegar.\n");
}
