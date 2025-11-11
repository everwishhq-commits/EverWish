// lib/carousel-manager.js
"use client";

/**
 * 🎡 SISTEMA INTELIGENTE DE CARRUSEL
 * - Máximo 10 videos activos
 * - Rotación gradual (1 video cada 24 horas)
 * - Prioridad estacional automática
 * - Ranking por votos y compras
 * - Opción de forzar inmediatamente
 * 
 * ARCHIVO PRINCIPAL: Importar desde components/carousel.js
 */

// 📅 DETECTAR TEMPORADA ACTUAL
function getCurrentSeason() {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const day = now.getDate();

  // Halloween (Octubre)
  if (month === 9) return "halloween";
  
  // Thanksgiving (4to jueves de noviembre)
  if (month === 10) {
    const thanksgiving = getNthThursday(now.getFullYear(), 10, 4);
    if (day >= thanksgiving.getDate() - 7 && day <= thanksgiving.getDate() + 3) {
      return "thanksgiving";
    }
  }
  
  // Christmas (Diciembre)
  if (month === 11) return "christmas";
  
  // Valentine's Day (Febrero)
  if (month === 1) return "valentines";
  
  // Easter (variable, marzo/abril)
  if (month === 2 || month === 3) return "easter";
  
  // Independence Day (Julio)
  if (month === 6) return "july4";
  
  // General
  return "general";
}

// Calcular el n-ésimo día de la semana de un mes
function getNthThursday(year, month, n) {
  const firstDay = new Date(year, month, 1);
  const firstThursday = 1 + ((11 - firstDay.getDay()) % 7);
  return new Date(year, month, firstThursday + (n - 1) * 7);
}

// 🎯 CALCULAR SCORE DE VIDEO
function calculateVideoScore(video) {
  let score = 0;
  
  // 1. Temporada (peso: 50 puntos)
  const currentSeason = getCurrentSeason();
  const videoCategories = [
    video.name?.toLowerCase(),
    video.subcategory?.toLowerCase(),
    ...(video.tags || []).map(t => t.toLowerCase()),
  ].join(" ");
  
  if (videoCategories.includes(currentSeason)) {
    score += 50;
  }
  
  // 2. Popularidad (peso: 30 puntos)
  const views = video.views || 0;
  const purchases = video.purchases || 0;
  const votes = video.votes || 0;
  
  score += Math.min(30, (purchases * 5 + votes * 2 + views * 0.1));
  
  // 3. Novedad (peso: 20 puntos)
  const createdAt = new Date(video.createdAt || video.uploadedAt || Date.now());
  const daysSinceCreated = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  
  if (daysSinceCreated < 7) score += 20; // Muy nuevo
  else if (daysSinceCreated < 30) score += 10; // Reciente
  
  return score;
}

// 📊 OBTENER VIDEOS DEL CARRUSEL
export async function getCarouselVideos() {
  try {
    // Cargar configuración persistente
    const config = await loadCarouselConfig();
    
    // Cargar todos los videos disponibles
    const res = await fetch("/api/videos", { cache: "no-store" });
    const data = await res.json();
    const allVideos = data.videos || [];
    
    // Agregar score a cada video
    const videosWithScore = allVideos.map(v => ({
      ...v,
      score: calculateVideoScore(v),
      carouselInfo: config.videos[v.name] || null,
    }));
    
    // Ordenar por score
    videosWithScore.sort((a, b) => b.score - a.score);
    
    // Aplicar rotación gradual
    const activeVideos = applyRotation(videosWithScore, config);
    
    return activeVideos.slice(0, 10);
  } catch (err) {
    console.error("❌ Error obteniendo videos del carrusel:", err);
    return [];
  }
}

// 🔄 APLICAR ROTACIÓN GRADUAL
function applyRotation(allVideos, config) {
  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;
  
  // Videos actualmente en el carrusel
  const currentActive = Object.entries(config.videos)
    .filter(([_, info]) => info.active)
    .map(([name, info]) => ({
      name,
      ...info,
      video: allVideos.find(v => v.name === name),
    }))
    .filter(item => item.video) // Solo los que aún existen
    .sort((a, b) => a.addedAt - b.addedAt); // Más antiguo primero
  
  // Videos candidatos (no activos, ordenados por score)
  const candidates = allVideos.filter(v => 
    !config.videos[v.name]?.active &&
    !config.videos[v.name]?.forced // Excluir forzados ya usados
  );
  
  // Verificar si es momento de rotar
  const lastRotation = config.lastRotation || 0;
  const hoursSinceRotation = (now - lastRotation) / (1000 * 60 * 60);
  
  if (hoursSinceRotation >= 24 && candidates.length > 0) {
    // Reemplazar el video MÁS ANTIGUO con el candidato con MEJOR SCORE
    if (currentActive.length >= 10) {
      const oldestVideo = currentActive[0];
      const newVideo = candidates[0];
      
      console.log(`🔄 Rotación: ${oldestVideo.name} → ${newVideo.name}`);
      
      // Actualizar configuración
      config.videos[oldestVideo.name] = {
        ...config.videos[oldestVideo.name],
        active: false,
        removedAt: now,
      };
      
      config.videos[newVideo.name] = {
        active: true,
        addedAt: now,
        forced: false,
      };
      
      config.lastRotation = now;
      saveCarouselConfig(config);
      
      // Actualizar lista activa
      currentActive.shift();
      currentActive.push({
        name: newVideo.name,
        active: true,
        addedAt: now,
        video: newVideo,
      });
    }
  }
  
  // Si hay menos de 10 activos, completar con candidatos
  while (currentActive.length < 10 && candidates.length > 0) {
    const newVideo = candidates.shift();
    
    config.videos[newVideo.name] = {
      active: true,
      addedAt: now,
      forced: false,
    };
    
    currentActive.push({
      name: newVideo.name,
      active: true,
      addedAt: now,
      video: newVideo,
    });
  }
  
  saveCarouselConfig(config);
  
  // Retornar solo los objetos de video
  return currentActive.map(item => item.video);
}

// 💾 CARGAR CONFIGURACIÓN (desde localStorage o API)
async function loadCarouselConfig() {
  try {
    // Intentar cargar desde localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("everwish_carousel_config");
      if (stored) return JSON.parse(stored);
    }
    
    // Si no existe, crear configuración inicial
    return {
      videos: {},
      lastRotation: Date.now(),
      version: "1.0",
    };
  } catch {
    return {
      videos: {},
      lastRotation: Date.now(),
      version: "1.0",
    };
  }
}

// 💾 GUARDAR CONFIGURACIÓN
function saveCarouselConfig(config) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("everwish_carousel_config", JSON.stringify(config));
    }
  } catch (err) {
    console.error("❌ Error guardando configuración del carrusel:", err);
  }
}

// ⚡ FORZAR VIDEO AL CARRUSEL (sin esperar 24 horas)
export async function forceVideoToCarousel(videoName) {
  try {
    const config = await loadCarouselConfig();
    const now = Date.now();
    
    // Marcar como forzado y activo
    config.videos[videoName] = {
      active: true,
      addedAt: now,
      forced: true,
      forcedAt: now,
    };
    
    // Si hay más de 10 activos, remover el más antiguo NO forzado
    const activeVideos = Object.entries(config.videos)
      .filter(([_, info]) => info.active)
      .sort((a, b) => {
        // Priorizar no-forzados para remoción
        if (a[1].forced && !b[1].forced) return 1;
        if (!a[1].forced && b[1].forced) return -1;
        return a[1].addedAt - b[1].addedAt;
      });
    
    if (activeVideos.length > 10) {
      const [oldestName, _] = activeVideos[0];
      config.videos[oldestName] = {
        ...config.videos[oldestName],
        active: false,
        removedAt: now,
      };
      
      console.log(`🔄 Video forzado: ${videoName} reemplazó a ${oldestName}`);
    }
    
    saveCarouselConfig(config);
    return true;
  } catch (err) {
    console.error("❌ Error forzando video al carrusel:", err);
    return false;
  }
}

// 📊 OBTENER ESTADÍSTICAS DEL CARRUSEL
export async function getCarouselStats() {
  try {
    const config = await loadCarouselConfig();
    
    const active = Object.values(config.videos).filter(v => v.active).length;
    const pending = Object.values(config.videos).filter(v => !v.active && !v.forced).length;
    const forced = Object.values(config.videos).filter(v => v.forced).length;
    
    const lastRotation = config.lastRotation || 0;
    const hoursSinceRotation = (Date.now() - lastRotation) / (1000 * 60 * 60);
    const nextRotationIn = Math.max(0, 24 - hoursSinceRotation);
    
    return {
      active,
      pending,
      forced,
      nextRotationIn: Math.round(nextRotationIn * 10) / 10,
      currentSeason: getCurrentSeason(),
    };
  } catch {
    return {
      active: 0,
      pending: 0,
      forced: 0,
      nextRotationIn: 0,
      currentSeason: "general",
    };
  }
}

// 🗑️ REMOVER VIDEO DEL CARRUSEL MANUALMENTE
export async function removeVideoFromCarousel(videoName) {
  try {
    const config = await loadCarouselConfig();
    
    if (config.videos[videoName]) {
      config.videos[videoName] = {
        ...config.videos[videoName],
        active: false,
        removedAt: Date.now(),
      };
      
      saveCarouselConfig(config);
      console.log(`🗑️ Video removido del carrusel: ${videoName}`);
      return true;
    }
    
    return false;
  } catch (err) {
    console.error("❌ Error removiendo video:", err);
    return false;
  }
}

// 🔄 RESETEAR CARRUSEL (útil para testing)
export async function resetCarousel() {
  try {
    const config = {
      videos: {},
      lastRotation: Date.now(),
      version: "1.0",
    };
    
    saveCarouselConfig(config);
    console.log("✅ Carrusel reseteado");
    return true;
  } catch (err) {
    console.error("❌ Error reseteando carrusel:", err);
    return false;
  }
  }
