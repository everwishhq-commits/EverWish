/**
 * 🔍 BÚSQUEDA ULTRA SIMPLE - FIXED
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
  
  console.log(`🔍 Buscando variaciones:`, variations);
  
  const results = videos.filter(video => {
    // 1. Buscar en el NOMBRE del archivo (la forma más directa)
    const videoName = (video.name || '').toLowerCase();
    if (variations.some(v => videoName.includes(v))) {
      console.log(`✅ Match en nombre: ${video.name}`);
      return true;
    }
    
    // 2. Buscar en searchTerms
    if (video.searchTerms && Array.isArray(video.searchTerms)) {
      if (video.searchTerms.some(term => 
        variations.some(v => term.includes(v) || v.includes(term))
      )) {
        console.log(`✅ Match en searchTerms: ${video.name}`);
        return true;
      }
    }
    
    // 3. Buscar en object
    if (video.object) {
      const obj = video.object.toLowerCase();
      if (variations.some(v => obj.includes(v) || v.includes(obj))) {
        console.log(`✅ Match en object: ${video.name}`);
        return true;
      }
    }
    
    // 4. Buscar en categories
    if (video.categories && Array.isArray(video.categories)) {
      if (video.categories.some(cat =>
        variations.some(v => cat.toLowerCase().includes(v))
      )) {
        console.log(`✅ Match en categories: ${video.name}`);
        return true;
      }
    }
    
    // 5. Buscar en subcategories
    if (video.subcategories && Array.isArray(video.subcategories)) {
      if (video.subcategories.some(sub =>
        variations.some(v => sub.toLowerCase().includes(v))
      )) {
        console.log(`✅ Match en subcategories: ${video.name}`);
        return true;
      }
    }
    
    return false;
  });
  
  console.log(`📊 Total encontrados: ${results.length}`);
  return results;
}

/**
 * Filtrar por categoría exacta
 */
export function filterByCategory(videos, categorySlug) {
  return videos.filter(v => {
    if (!v.categories) return false;
    if (Array.isArray(v.categories)) {
      return v.categories.includes(categorySlug);
    }
    return v.categories === categorySlug;
  });
}

/**
 * Filtrar por subcategoría exacta
 */
export function filterBySubcategory(videos, subcategory) {
  return videos.filter(v => {
    if (!v.subcategories) return false;
    if (Array.isArray(v.subcategories)) {
      return v.subcategories.includes(subcategory);
    }
    return v.subcategories === subcategory;
  });
}

/**
 * Agrupar videos por categoría - FIXED
 */
export function groupByCategory(videos) {
  const grouped = {};
  
  videos.forEach(video => {
    if (!video.categories) {
      console.warn(`⚠️ Video sin categorías: ${video.name}`);
      return;
    }
    
    const cats = Array.isArray(video.categories) ? video.categories : [video.categories];
    
    cats.forEach(cat => {
      if (!grouped[cat]) {
        grouped[cat] = [];
      }
      // Evitar duplicados
      if (!grouped[cat].find(v => v.name === video.name)) {
        grouped[cat].push(video);
      }
    });
  });
  
  console.log(`📊 Categorías agrupadas:`, Object.keys(grouped));
  console.log(`📊 Videos por categoría:`, Object.entries(grouped).map(([k, v]) => `${k}: ${v.length}`));
  
  return grouped;
                                }
