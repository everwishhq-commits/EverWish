/**
 * 🔍 BÚSQUEDA MEJORADA V3 - Con normalización de espacios
 */

/**
 * Normaliza texto eliminando espacios, acentos y caracteres especiales
 */
function normalize(text) {
  if (!text) return '';
  return text.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, '') // eliminar acentos
    .replace(/[^\w]/g, '') // eliminar todo excepto letras y números
    .trim();
}

export function searchVideos(videos, query) {
  if (!query || !query.trim()) return videos;
  
  // Normalizar la búsqueda (sin espacios, sin acentos, sin puntuación)
  const normalizedQuery = normalize(query);
  
  // Generar variaciones: singular y plural
  const variations = [normalizedQuery];
  
  if (normalizedQuery.endsWith('s') && normalizedQuery.length > 2) {
    variations.push(normalizedQuery.slice(0, -1)); // zombies → zombie
  }
  if (!normalizedQuery.endsWith('s')) {
    variations.push(normalizedQuery + 's'); // zombie → zombies
  }
  
  // Variaciones parciales para búsquedas complejas
  const words = query.toLowerCase().trim().split(/\s+/);
  if (words.length > 1) {
    // Agregar cada palabra individual normalizada
    words.forEach(word => {
      const norm = normalize(word);
      if (norm.length > 2) {
        variations.push(norm);
        if (!norm.endsWith('s')) variations.push(norm + 's');
        if (norm.endsWith('s') && norm.length > 3) variations.push(norm.slice(0, -1));
      }
    });
  }
  
  // Eliminar duplicados
  const uniqueVariations = [...new Set(variations)];
  
  console.log(`🔍 Búsqueda: "${query}"`);
  console.log(`📝 Variaciones:`, uniqueVariations);
  
  const results = videos.filter(video => {
    // 1. Buscar en el NOMBRE del archivo (normalizado)
    const videoName = normalize(video.name || '');
    if (uniqueVariations.some(v => videoName.includes(v))) {
      console.log(`✅ Match en nombre: ${video.name}`);
      return true;
    }
    
    // 2. Buscar en searchTerms (normalizados)
    if (video.searchTerms && Array.isArray(video.searchTerms)) {
      if (video.searchTerms.some(term => {
        const normalizedTerm = normalize(term);
        return uniqueVariations.some(v => 
          normalizedTerm.includes(v) || v.includes(normalizedTerm)
        );
      })) {
        console.log(`✅ Match en searchTerms: ${video.name}`);
        return true;
      }
    }
    
    // 3. Buscar en object (normalizado)
    if (video.object) {
      const obj = normalize(video.object);
      if (uniqueVariations.some(v => obj.includes(v) || v.includes(obj))) {
        console.log(`✅ Match en object: ${video.name}`);
        return true;
      }
    }
    
    // 4. Buscar en categories (normalizadas)
    if (video.categories && Array.isArray(video.categories)) {
      if (video.categories.some(cat => {
        const normalizedCat = normalize(cat);
        return uniqueVariations.some(v => 
          normalizedCat.includes(v) || v.includes(normalizedCat)
        );
      })) {
        console.log(`✅ Match en categories: ${video.name}`);
        return true;
      }
    }
    
    // 5. Buscar en subcategories (normalizadas)
    if (video.subcategories && Array.isArray(video.subcategories)) {
      if (video.subcategories.some(sub => {
        const normalizedSub = normalize(sub);
        return uniqueVariations.some(v => 
          normalizedSub.includes(v) || v.includes(normalizedSub)
        );
      })) {
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
 * 🔥 AGRUPAR POR CATEGORÍA - VERSIÓN ROBUSTA
 */
export function groupByCategory(videos) {
  const grouped = {};
  
  console.log(`📊 Agrupando ${videos.length} videos...`);
  
  videos.forEach((video, index) => {
    // Validación estricta
    if (!video) {
      console.warn(`⚠️ Video ${index} es null/undefined`);
      return;
    }
    
    if (!video.name) {
      console.warn(`⚠️ Video sin nombre:`, video);
      return;
    }
    
    if (!video.categories) {
      console.warn(`⚠️ Video sin categorías: ${video.name}`);
      return;
    }
    
    // Normalizar a array
    let cats = [];
    if (Array.isArray(video.categories)) {
      cats = video.categories;
    } else if (typeof video.categories === 'string') {
      cats = [video.categories];
    } else {
      console.warn(`⚠️ Categorías con formato inválido en ${video.name}:`, video.categories);
      return;
    }
    
    // Validar que no esté vacío
    if (cats.length === 0) {
      console.warn(`⚠️ Array de categorías vacío en ${video.name}`);
      return;
    }
    
    // Agrupar
    cats.forEach(cat => {
      if (!cat || typeof cat !== 'string') {
        console.warn(`⚠️ Categoría inválida en ${video.name}:`, cat);
        return;
      }
      
      if (!grouped[cat]) {
        grouped[cat] = [];
        console.log(`📂 Nueva categoría: ${cat}`);
      }
      
      // Evitar duplicados
      if (!grouped[cat].find(v => v.name === video.name)) {
        grouped[cat].push(video);
        console.log(`   ✅ ${video.name} → ${cat}`);
      }
    });
  });
  
  console.log(`📊 Categorías agrupadas:`, Object.keys(grouped));
  console.log(`📊 Videos por categoría:`, 
    Object.entries(grouped).map(([k, v]) => `${k}: ${v.length}`).join(", ")
  );
  
  return grouped;
}
