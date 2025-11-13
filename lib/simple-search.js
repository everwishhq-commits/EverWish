/**
 * 🔍 BÚSQUEDA ULTRA SIMPLE
 * Busca en: searchTerms, object, categories, subcategories
 */

export function searchVideos(videos, query) {
  if (!query || !query.trim()) return videos;
  
  const q = query.toLowerCase().trim();
  
  // Generar variaciones: singular y plural
  const variations = [q];
  if (q.endsWith('s')) {
    variations.push(q.slice(0, -1)); // zombies → zombie
  } else {
    variations.push(q + 's'); // zombie → zombies
  }
  
  return videos.filter(video => {
    // Buscar en searchTerms (contiene todas las partes del nombre)
    if (video.searchTerms && video.searchTerms.some(term => 
      variations.some(v => term.includes(v) || v.includes(term))
    )) {
      return true;
    }
    
    // Buscar en object
    if (video.object && variations.some(v => 
      video.object.toLowerCase().includes(v) || v.includes(video.object.toLowerCase())
    )) {
      return true;
    }
    
    // Buscar en categories
    if (video.categories && video.categories.some(cat =>
      variations.some(v => cat.toLowerCase().includes(v) || v.includes(cat.toLowerCase()))
    )) {
      return true;
    }
    
    // Buscar en subcategories
    if (video.subcategories && video.subcategories.some(sub =>
      variations.some(v => sub.toLowerCase().includes(v) || v.includes(sub.toLowerCase()))
    )) {
      return true;
    }
    
    return false;
  });
}

/**
 * Filtrar por categoría exacta
 */
export function filterByCategory(videos, categorySlug) {
  return videos.filter(v => v.categories && v.categories.includes(categorySlug));
}

/**
 * Filtrar por subcategoría exacta
 */
export function filterBySubcategory(videos, subcategory) {
  return videos.filter(v => v.subcategories && v.subcategories.includes(subcategory));
}

/**
 * Agrupar videos por categoría
 */
export function groupByCategory(videos) {
  const grouped = {};
  
  videos.forEach(video => {
    if (!video.categories) return;
    
    video.categories.forEach(cat => {
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(video);
    });
  });
  
  return grouped;
}
