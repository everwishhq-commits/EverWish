/**
 * 🔄 SISTEMA DE PLURALES AUTOMÁTICOS
 * Convierte palabras a singular/plural automáticamente
 */

/**
 * Genera todas las variaciones de una palabra (singular/plural)
 */
export function getWordVariations(word) {
  if (!word) return [];
  
  const normalized = word.toLowerCase().trim();
  const variations = new Set([normalized]);
  
  // Si termina en 's', generar singular
  if (normalized.endsWith('s') && normalized.length > 2) {
    // zombies → zombie
    if (normalized.endsWith('ies') && normalized.length > 4) {
      variations.add(normalized.slice(0, -3) + 'y');
    }
    // cats → cat
    else if (!normalized.endsWith('ss')) {
      variations.add(normalized.slice(0, -1));
    }
  }
  
  // Si NO termina en 's', generar plural
  if (!normalized.endsWith('s')) {
    // party → parties
    if (normalized.endsWith('y') && normalized.length > 2 && 
        !'aeiou'.includes(normalized[normalized.length - 2])) {
      variations.add(normalized.slice(0, -1) + 'ies');
    }
    // box → boxes, church → churches
    else if (normalized.endsWith('x') || normalized.endsWith('ch') || 
             normalized.endsWith('sh') || normalized.endsWith('s')) {
      variations.add(normalized + 'es');
    }
    // cat → cats
    else {
      variations.add(normalized + 's');
    }
  }
  
  return [...variations];
}

/**
 * Busca una palabra en un mapeo considerando plurales
 */
export function findInMap(word, keywordMap) {
  const variations = getWordVariations(word);
  
  for (const variant of variations) {
    if (keywordMap[variant]) {
      return keywordMap[variant];
    }
  }
  
  return null;
}
