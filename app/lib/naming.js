
export function getRelatedName(name, suffix) {
  if (!name) return "";
  // Si el nombre tiene 1A, lo reemplaza por 1B o viceversa
  if (name.endsWith("1A")) return name.replace("1A", suffix);
  if (name.endsWith("1B")) return name.replace("1B", suffix);
  return `${name}_${suffix}`;
}
