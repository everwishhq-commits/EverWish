/**
 * 🔍 BÚSQUEDA MEJORADA V4 - Con normalización robusta
 */

function normalize(text) {
  if (!text) return '';
  return text.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, '') // eliminar acentos
    .replace(/[^a-z0-9]/g, '') // eliminar todo excepto letras y números
    .trim();
}

export function searchVideos(videos, query) {
  if (!query || !query.trim()) return videos;
  
  const normalizedQuery = normalize(query);
  
  // Generar variaciones: singular y plural
  const variations = [normalizedQuery];
  
  if (normalizedQuery.endsWith('s') && normalizedQuery.length > 2) {
    variations.push(normalizedQuery.slice(0, -1));
  }
  if (!normalizedQuery.endsWith('s')) {
    variations.push(normalizedQuery + 's');
  }
  
  // Agregar palabras individuales si la búsqueda tiene múltiples términos
  const words = query.toLowerCase().trim().split(/\s+/);
  if (words.length > 1) {
    words.forEach(word => {
      const norm = normalize(word);
      if (norm.length > 2) {
        variations.push(norm);
        if (!norm.endsWith('s')) variations.push(norm + 's');
        if (norm.endsWith('s') && norm.length > 3) variations.push(norm.slice(0, -1));
      }
    });
  }
  
  const uniqueVariations = [...new Set(variations)];
  
  console.log(`🔍 Búsqueda: "${query}"`);
  console.log(`📝 Variaciones:`, uniqueVariations);
  
  const results = videos.filter(video => {
    // 1. Nombre del archivo
    const videoName = normalize(video.name || '');
    if (uniqueVariations.some(v => videoName.includes(v))) {
      console.log(`✅ Match en nombre: ${video.name}`);
      return true;
    }
    
    // 2. SearchTerms
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
    
    // 3. Object
    if (video.object) {
      const obj = normalize(video.object);
      if (uniqueVariations.some(v => obj.includes(v) || v.includes(obj))) {
        console.log(`✅ Match en object: ${video.name}`);
        return true;
      }
    }
    
    // 4. Categories (normalizar cada categoría)
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
    
    // 5. Subcategories (CRÍTICO: normalizar)
    if (video.subcategories && Array.isArray(video.subcategories)) {
      if (video.subcategories.some(sub => {
        const normalizedSub = normalize(sub); // "St Patrick's Day" → "stpatricksday"
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

export function filterByCategory(videos, categorySlug) {
  return videos.filter(v => {
    if (!v.categories) return false;
    if (Array.isArray(v.categories)) {
      return v.categories.some(cat => {
        const catNorm = normalize(cat);
        const slugNorm = normalize(categorySlug);
        return catNorm === slugNorm || catNorm.includes(slugNorm);
      });
    }
    const catNorm = normalize(v.categories);
    const slugNorm = normalize(categorySlug);
    return catNorm === slugNorm || catNorm.includes(slugNorm);
  });
}

export function filterBySubcategory(videos, subcategory) {
  return videos.filter(v => {
    if (!v.subcategories) return false;
    if (Array.isArray(v.subcategories)) {
      return v.subcategories.some(sub => {
        const subNorm = normalize(sub);
        const searchNorm = normalize(subcategory);
        return subNorm === searchNorm || subNorm.includes(searchNorm);
      });
    }
    const subNorm = normalize(v.subcategories);
    const searchNorm = normalize(subcategory);
    return subNorm === searchNorm || subNorm.includes(searchNorm);
  });
}

export function groupByCategory(videos) {
  const grouped = {};
  
  console.log(`📊 Agrupando ${videos.length} videos...`);
  
  videos.forEach((video, index) => {
    if (!video || !video.name) {
      console.warn(`⚠️ Video ${index} inválido`);
      return;
    }
    
    if (!video.categories) {
      console.warn(`⚠️ Video sin categorías: ${video.name}`);
      return;
    }
    
    let cats = [];
    if (Array.isArray(video.categories)) {
      cats = video.categories;
    } else if (typeof video.categories === 'string') {
      cats = [video.categories];
    } else {
      console.warn(`⚠️ Categorías con formato inválido en ${video.name}:`, video.categories);
      return;
    }
    
    if (cats.length === 0) {
      console.warn(`⚠️ Array de categorías vacío en ${video.name}`);
      return;
    }
    
    cats.forEach(cat => {
      if (!cat || typeof cat !== 'string') {
        console.warn(`⚠️ Categoría inválida en ${video.name}:`, cat);
        return;
      }
      
      if (!grouped[cat]) {
        grouped[cat] = [];
        console.log(`📂 Nueva categoría: ${cat}`);
      }
      
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
