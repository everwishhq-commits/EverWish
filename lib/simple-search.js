/**
 * 🔍 BÚSQUEDA SIMPLE Y DIRECTA
 * 
 * Busca palabras exactas en:
 * - Nombre del archivo
 * - Términos de búsqueda
 * - Categorías
 * - Subcategorías
 */

/**
 * Busca videos por cualquier palabra
 * @param {Array} videos - Videos del index.json
 * @param {string} query - Palabra a buscar
 * @returns {Array} - Videos que coinciden
 */
export function searchVideos(videos, query) {
  if (!query || !query.trim()) return videos;
  
  const q = query.toLowerCase().trim();
  
  console.log(`🔍 Buscando: "${q}"`);
  
  const results = videos.filter(video => {
    // 1. Buscar en el nombre del archivo
    if (video.name.toLowerCase().includes(q)) {
      console.log(`✅ Match en nombre: ${video.name}`);
      return true;
    }
    
    // 2. Buscar en searchTerms (palabras individuales del nombre)
    if (video.searchTerms?.some(term => term.includes(q))) {
      console.log(`✅ Match en searchTerms: ${video.name}`);
      return true;
    }
    
    // 3. Buscar en object
    if (video.object?.toLowerCase().includes(q)) {
      console.log(`✅ Match en object: ${video.name}`);
      return true;
    }
    
    // 4. Buscar en categorías
    if (video.categories?.some(cat => cat.toLowerCase().includes(q))) {
      console.log(`✅ Match en categorías: ${video.name}`);
      return true;
    }
    
    // 5. Buscar en subcategorías
    if (video.subcategories?.some(sub => sub.toLowerCase().includes(q))) {
      console.log(`✅ Match en subcategorías: ${video.name}`);
      return true;
    }
    
    return false;
  });
  
  console.log(`📊 Encontrados: ${results.length} videos`);
  return results;
}

/**
 * Filtra videos por categoría exacta
 * @param {Array} videos - Videos del index.json
 * @param {string} categorySlug - Slug de la categoría
 * @returns {Array} - Videos de esa categoría
 */
export function filterByCategory(videos, categorySlug) {
  return videos.filter(video => 
    video.categories?.includes(categorySlug)
  );
}

/**
 * Filtra videos por subcategoría exacta
 * @param {Array} videos - Videos del index.json
 * @param {string} subcategory - Nombre de la subcategoría
 * @returns {Array} - Videos de esa subcategoría
 */
export function filterBySubcategory(videos, subcategory) {
  return videos.filter(video => 
    video.subcategories?.includes(subcategory)
  );
}

/**
 * Agrupa videos por categoría base
 * @param {Array} videos - Videos del index.json
 * @returns {Object} - { "categorySlug": [videos...] }
 */
export function groupByCategory(videos) {
  const grouped = {};
  
  videos.forEach(video => {
    if (!video.categories) return;
    
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
  
  return grouped;
}

/**
 * Obtiene subcategorías únicas de un grupo de videos
 * @param {Array} videos - Videos filtrados
 * @returns {Array} - Lista de subcategorías únicas
 */
export function getUniqueSubcategories(videos) {
  const subs = new Set();
  
  videos.forEach(video => {
    if (video.subcategories) {
      video.subcategories.forEach(sub => subs.add(sub));
    }
  });
  
  return [...subs].sort();
}

/**
 * Obtiene categorías base que contienen resultados de búsqueda
 * @param {Array} videos - Videos que coinciden con la búsqueda
 * @param {Array} baseCategories - Categorías base del sistema
 * @returns {Array} - Categorías con videos encontrados
 */
export function getCategoriesWithResults(videos, baseCategories) {
  const grouped = groupByCategory(videos);
  
  return baseCategories
    .map(cat => ({
      ...cat,
      count: grouped[cat.slug]?.length || 0
    }))
    .filter(cat => cat.count > 0);
}
