/**
 * 🔍 BÚSQUEDA ULTRA SIMPLE - FIXED V3
 * Ahora busca en categorías Y subcategorías descriptivas
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
  
  // Variaciones de palabras compuestas (st patrick → stpatrick)
  const compactVariation = q.replace(/\s+/g, '');
  if (compactVariation !== q) {
    variations.push(compactVariation);
    variations.push(compactVariation + 's');
  }
  
  console.log(`🔍 Buscando variaciones:`, variations);
  
  const results = videos.filter(video => {
    // 1. Buscar en el NOMBRE del archivo
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
    
    // 4. Buscar en categories (SLUGS)
    if (video.categories && Array.isArray(video.categories)) {
      if (video.categories.some(cat =>
        variations.some(v => cat.toLowerCase().includes(v))
      )) {
        console.log(`✅ Match en categories: ${video.name}`);
        return true;
      }
    }
    
    // 5. 🆕 Buscar en subcategories (NOMBRES DESCRIPTIVOS)
    if (video.subcategories && Array.isArray(video.subcategories)) {
      if (video.subcategories.some(sub => {
        const subLower = sub.toLowerCase();
        return variations.some(v => subLower.includes(v));
      })) {
        console.log(`✅ Match en subcategories: ${video.name}`);
        return true;
      }
    }
    
    // 6. 🆕 Buscar en tags
    if (video.tags && Array.isArray(video.tags)) {
      if (video.tags.some(tag => {
        const tagLower = tag.toLowerCase();
        return variations.some(v => tagLower.includes(v));
      })) {
        console.log(`✅ Match en tags: ${video.name}`);
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
