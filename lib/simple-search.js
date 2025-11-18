/**
 * 🔍 BÚSQUEDA SIMPLE Y DIRECTA
 * Busca en TODOS los campos del video sin necesidad de mapeo adicional
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
 * NO necesita mapeo adicional, usa lo que YA está en el index.json
 */
export function searchVideos(videos, query) {
  if (!query || !query.trim()) return videos;
  
  const q = normalize(query);
  console.log(`🔍 Buscando: "${q}"`);
  
  const results = videos.filter(video => {
    // 1. Buscar en el nombre del archivo
    if (normalize(video.name).includes(q)) {
      return true;
    }
    
    // 2. Buscar en el objeto
    if (normalize(video.object).includes(q)) {
      return true;
    }
    
    // 3. Buscar en categorías (slug)
    if (video.categories && Array.isArray(video.categories)) {
      if (video.categories.some(cat => normalize(cat).includes(q))) {
        return true;
      }
    }
    
    // 4. Buscar en subcategorías (nombre completo)
    if (video.subcategories && Array.isArray(video.subcategories)) {
      if (video.subcategories.some(sub => normalize(sub).includes(q))) {
        return true;
      }
    }
    
    // 5. Buscar en términos de búsqueda
    if (video.searchTerms && Array.isArray(video.searchTerms)) {
      if (video.searchTerms.some(term => normalize(term).includes(q))) {
        return true;
      }
    }
    
    // 6. 🔥 NUEVO: Buscar palabra por palabra en categorías y subcategorías
    // Esto hace que "love" encuentre "love-weddings-anniversaries"
    // Y que "sport" encuentre "sports"
    const categoryWords = (video.categories || []).join(" ").split(/[-\s]+/);
    if (categoryWords.some(word => normalize(word).includes(q) || q.includes(normalize(word)))) {
      return true;
    }
    
    const subcategoryWords = (video.subcategories || []).join(" ").split(/[\s&]+/);
    if (subcategoryWords.some(word => normalize(word).includes(q) || q.includes(normalize(word)))) {
      return true;
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
