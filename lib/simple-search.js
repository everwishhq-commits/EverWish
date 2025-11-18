/**
 * 🔍 BÚSQUEDA SIMPLE Y DIRECTA
 * Usa EXACTAMENTE los datos del index.json sin modificar nada
 */

/**
 * Normaliza texto para búsqueda (sin acentos, minúsculas)
 */
function normalize(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * 🔥 BÚSQUEDA PRINCIPAL
 * Busca en: name, object, categories, subcategories, searchTerms
 */
export function searchVideos(videos, query) {
  if (!query || !query.trim()) return videos;
  
  const q = normalize(query);
  console.log(`🔍 Buscando: "${q}"`);
  
  const results = videos.filter(video => {
    // 1. Buscar en el nombre del archivo
    if (normalize(video.name).includes(q)) {
      console.log(`✅ Match en name: ${video.name}`);
      return true;
    }
    
    // 2. Buscar en el objeto
    if (normalize(video.object).includes(q)) {
      console.log(`✅ Match en object: ${video.name}`);
      return true;
    }
    
    // 3. Buscar en categorías
    if (video.categories && Array.isArray(video.categories)) {
      if (video.categories.some(cat => normalize(cat).includes(q))) {
        console.log(`✅ Match en categories: ${video.name}`);
        return true;
      }
    }
    
    // 4. Buscar en subcategorías
    if (video.subcategories && Array.isArray(video.subcategories)) {
      if (video.subcategories.some(sub => normalize(sub).includes(q))) {
        console.log(`✅ Match en subcategories: ${video.name}`);
        return true;
      }
    }
    
    // 5. Buscar en términos de búsqueda
    if (video.searchTerms && Array.isArray(video.searchTerms)) {
      if (video.searchTerms.some(term => normalize(term).includes(q))) {
        console.log(`✅ Match en searchTerms: ${video.name}`);
        return true;
      }
    }
    
    return false;
  });
  
  console.log(`📊 Total encontrados: ${results.length}`);
  return results;
}

/**
 * Filtra videos por categoría EXACTA
 */
export function filterByCategory(videos, categorySlug) {
  if (!categorySlug) return videos;
  
  const results = videos.filter(video => {
    if (!video.categories) return false;
    return video.categories.includes(categorySlug);
  });
  
  console.log(`📂 Categoría "${categorySlug}": ${results.length} videos`);
  return results;
}

/**
 * Filtra videos por subcategoría EXACTA
 */
export function filterBySubcategory(videos, subcategory) {
  if (!subcategory) return videos;
  
  const results = videos.filter(video => {
    if (!video.subcategories) return false;
    return video.subcategories.includes(subcategory);
  });
  
  console.log(`📁 Subcategoría "${subcategory}": ${results.length} videos`);
  return results;
}

/**
 * Agrupa videos por categoría base
 * Retorna: { "seasonal-global-celebrations": [...], "love-weddings-anniversaries": [...] }
 */
export function groupByCategory(videos) {
  const grouped = {};
  
  videos.forEach(video => {
    if (!video.categories || !Array.isArray(video.categories)) {
      console.warn(`⚠️ Video sin categorías: ${video.name}`);
      return;
    }
    
    video.categories.forEach(cat => {
      if (!grouped[cat]) {
        grouped[cat] = [];
      }
      
      // Evitar duplicados
      if (!grouped[cat].find(v => v.name === video.name)) {
        grouped[cat].push(video);
      }
    });
  });
  
  console.log(`📊 Grupos:`, Object.keys(grouped));
  return grouped;
}

/**
 * Obtiene subcategorías únicas de un conjunto de videos
 */
export function getUniqueSubcategories(videos) {
  const subs = new Set();
  
  videos.forEach(video => {
    if (video.subcategories && Array.isArray(video.subcategories)) {
      video.subcategories.forEach(sub => subs.add(sub));
    }
  });
  
  return [...subs].sort();
                                        }
