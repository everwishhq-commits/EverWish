/**
 * 🔍 BÚSQUEDA CON PRIORIZACIÓN
 * Si buscas "summer", los que tienen "Summer" como subcategoría aparecen primero
 */

/**
 * Calcula score de relevancia para ordenar resultados
 */
function calculateRelevance(video, query) {
  const q = query.toLowerCase().trim();
  let score = 0;
  
  // 🏆 MÁXIMA PRIORIDAD: Coincidencia exacta en subcategoría
  if (video.subcategories?.some(sub => sub.toLowerCase() === q)) {
    score += 1000;
  }
  
  // 🥇 ALTA PRIORIDAD: Subcategoría contiene la búsqueda
  if (video.subcategories?.some(sub => sub.toLowerCase().includes(q))) {
    score += 500;
  }
  
  // 🥈 MEDIA PRIORIDAD: Categoría contiene la búsqueda
  if (video.categories?.some(cat => cat.toLowerCase().includes(q))) {
    score += 100;
  }
  
  // 🥉 BAJA PRIORIDAD: Nombre del objeto
  if (video.object?.toLowerCase().includes(q)) {
    score += 50;
  }
  
  // Nombre del archivo
  if (video.name.toLowerCase().includes(q)) {
    score += 25;
  }
  
  // Términos de búsqueda
  if (video.searchTerms?.some(term => term.toLowerCase().includes(q))) {
    score += 10;
  }
  
  return score;
}

/**
 * Busca videos y los ordena por relevancia
 */
export function searchVideos(videos, query) {
  if (!query || !query.trim()) return videos;
  
  const q = query.toLowerCase().trim();
  
  console.log(`🔍 Buscando: "${q}"`);
  
  // Filtrar videos que coincidan
  const results = videos.filter(video => {
    if (video.name.toLowerCase().includes(q)) return true;
    if (video.object?.toLowerCase().includes(q)) return true;
    if (video.searchTerms?.some(term => term.toLowerCase().includes(q))) return true;
    if (video.categories?.some(cat => cat.toLowerCase().includes(q))) return true;
    if (video.subcategories?.some(sub => sub.toLowerCase().includes(q))) return true;
    return false;
  });
  
  // Calcular relevancia y ordenar
  const withScores = results.map(video => ({
    ...video,
    relevanceScore: calculateRelevance(video, q)
  }));
  
  // Ordenar por score (mayor a menor)
  withScores.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  console.log(`📊 Encontrados: ${results.length} videos (ordenados por relevancia)`);
  
  // Remover el score temporal antes de retornar
  return withScores.map(({ relevanceScore, ...video }) => video);
}

/**
 * Filtra videos por categoría exacta
 */
export function filterByCategory(videos, categorySlug) {
  return videos.filter(video => 
    video.categories?.includes(categorySlug)
  );
}

/**
 * Filtra videos por subcategoría exacta
 */
export function filterBySubcategory(videos, subcategory) {
  return videos.filter(video => 
    video.subcategories?.includes(subcategory)
  );
}

/**
 * Agrupa videos por categoría base
 */
export function groupByCategory(videos) {
  const grouped = {};
  
  videos.forEach(video => {
    if (!video.categories) return;
    
    video.categories.forEach(cat => {
      if (!grouped[cat]) {
        grouped[cat] = [];
      }
      
      if (!grouped[cat].find(v => v.name === video.name)) {
        grouped[cat].push(video);
      }
    });
  });
  
  return grouped;
}

/**
 * Obtiene subcategorías únicas de un grupo de videos
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
 */
export function getCategoriesWithResults(videos, baseCategories) {
  const grouped = groupByCategory(videos);
  
  return baseCategories
    .map(cat => ({
      ...cat,
      count: grouped[cat.slug]?.length || 0
    }));
    // Ya NO filtramos cat.count > 0
  }
