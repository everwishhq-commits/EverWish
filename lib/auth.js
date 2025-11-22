// lib/auth.js - Sistema de autenticación con usuario temporal automático

// ============================================================
// USUARIO TEMPORAL (Automático al entrar)
// ============================================================

function generateTempId() {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Obtiene o crea automáticamente un usuario temporal
 * Este usuario se crea al primer acceso y persiste hasta que se convierta en usuario real
 */
export function getTempUser() {
  if (typeof window === "undefined") return null;
  
  try {
    let tempUser = localStorage.getItem("everwish_temp_user");
    
    if (!tempUser) {
      // Crear usuario temporal automáticamente en el primer acceso
      const newTempUser = {
        tempId: generateTempId(),
        createdAt: new Date().toISOString(),
        isTemp: true,
        firstVisit: new Date().toISOString(),
      };
      localStorage.setItem("everwish_temp_user", JSON.stringify(newTempUser));
      
      // Log para analytics (puedes conectar con tu sistema de tracking)
      console.log("🆕 Nuevo usuario temporal creado:", newTempUser.tempId);
      
      return newTempUser;
    }
    
    return JSON.parse(tempUser);
  } catch (error) {
    console.error("Error getting temp user:", error);
    return null;
  }
}

/**
 * Inicializa el usuario temporal automáticamente
 * Llama esto en _app.js o layout para garantizar que siempre exista
 */
export function initTempUser() {
  return getTempUser();
}

// ============================================================
// USUARIO REAL (después del pago)
// ============================================================

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  
  try {
    const userStr = localStorage.getItem("everwish_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      return { ...user, isTemp: false };
    }
    
    // Si no hay usuario real, retornar/crear el temporal
    return getTempUser();
  } catch (error) {
    console.error("Error getting current user:", error);
    return getTempUser();
  }
}

export function setCurrentUser(user) {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem("everwish_user", JSON.stringify({
      ...user,
      isTemp: false,
    }));
  } catch (error) {
    console.error("Error setting current user:", error);
  }
}

/**
 * Logout solo limpia el usuario real, pero mantiene el temporal
 * Esto permite que el usuario vuelva a ser "temporal" pero con sus drafts
 */
export function logout() {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem("everwish_user");
    // NO borrar el usuario temporal ni los borradores
    // Esto permite que el usuario vuelva a ver sus drafts sin login
  } catch (error) {
    console.error("Error during logout:", error);
  }
}

/**
 * Verifica si el usuario actual es real (pagó)
 */
export function isAuthenticated() {
  const user = getCurrentUser();
  return user && !user.isTemp;
}

/**
 * Convierte un usuario temporal en usuario real después del pago
 * Migra todos los drafts y mantiene el historial
 */
export function loginAfterPayment(email, phone, name = "") {
  const tempUser = getTempUser();
  
  const user = {
    email,
    phone,
    name,
    tempId: tempUser?.tempId, // Guardar referencia al ID temporal
    convertedAt: new Date().toISOString(),
    originalCreation: tempUser?.createdAt,
  };
  
  setCurrentUser(user);
  
  // Migrar borradores al nuevo usuario
  migrateDraftsToUser(email, tempUser?.tempId);
  
  // Log para analytics
  console.log("✅ Usuario convertido de temporal a real:", {
    tempId: tempUser?.tempId,
    email,
    draftsCount: getDrafts().length
  });
  
  return user;
}

// ============================================================
// BORRADORES (localStorage - carrito)
// ============================================================

export function saveDraft(cardData) {
  if (typeof window === "undefined") return null;
  
  try {
    const user = getCurrentUser();
    const drafts = getDrafts();
    
    const draft = {
      id: cardData.id || `draft_${Date.now()}`,
      ...cardData,
      tempUserId: user?.tempId,
      userEmail: user?.email || null,
      status: "draft",
      createdAt: cardData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Actualizar o agregar
    const existingIndex = drafts.findIndex(d => d.id === draft.id);
    if (existingIndex >= 0) {
      drafts[existingIndex] = draft;
    } else {
      drafts.push(draft);
    }
    
    localStorage.setItem("everwish_drafts", JSON.stringify(drafts));
    
    // Log para analytics
    console.log("💾 Draft guardado:", {
      id: draft.id,
      slug: draft.slug,
      isTemp: user?.isTemp
    });
    
    return draft;
  } catch (error) {
    console.error("Error saving draft:", error);
    return null;
  }
}

export function getDrafts() {
  if (typeof window === "undefined") return [];
  
  try {
    const draftsStr = localStorage.getItem("everwish_drafts");
    const drafts = draftsStr ? JSON.parse(draftsStr) : [];
    
    // Ordenar por fecha de actualización (más reciente primero)
    return drafts.sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  } catch (error) {
    console.error("Error getting drafts:", error);
    return [];
  }
}

export function getDraftById(draftId) {
  const drafts = getDrafts();
  return drafts.find(d => d.id === draftId) || null;
}

export function deleteDraft(draftId) {
  if (typeof window === "undefined") return;
  
  try {
    const drafts = getDrafts();
    const filtered = drafts.filter(d => d.id !== draftId);
    localStorage.setItem("everwish_drafts", JSON.stringify(filtered));
    
    console.log("🗑️ Draft eliminado:", draftId);
  } catch (error) {
    console.error("Error deleting draft:", error);
  }
}

/**
 * Obtiene estadísticas de drafts para notificaciones
 */
export function getDraftStats() {
  const drafts = getDrafts();
  const user = getCurrentUser();
  
  return {
    total: drafts.length,
    isTemp: user?.isTemp || false,
    oldestDraft: drafts.length > 0 ? drafts[drafts.length - 1] : null,
    newestDraft: drafts.length > 0 ? drafts[0] : null,
    daysSinceOldest: drafts.length > 0 ? 
      Math.floor((Date.now() - new Date(drafts[drafts.length - 1].createdAt)) / (1000 * 60 * 60 * 24)) : 0
  };
}

// ============================================================
// TARJETAS COMPRADAS
// ============================================================

export function savePurchasedCard(cardData) {
  if (typeof window === "undefined") return null;
  
  try {
    const purchased = getPurchasedCards();
    const user = getCurrentUser();
    
    const card = {
      ...cardData,
      userEmail: user?.email || null,
      tempUserId: user?.tempId,
      status: "purchased",
      purchasedAt: new Date().toISOString(),
    };
    
    purchased.push(card);
    localStorage.setItem("everwish_purchased", JSON.stringify(purchased));
    
    // Eliminar de borradores si existe
    if (cardData.id) {
      deleteDraft(cardData.id);
    }
    
    console.log("✅ Tarjeta comprada:", {
      id: card.id,
      slug: card.slug,
      email: user?.email
    });
    
    return card;
  } catch (error) {
    console.error("Error saving purchased card:", error);
    return null;
  }
}

export function getPurchasedCards() {
  if (typeof window === "undefined") return [];
  
  try {
    const purchasedStr = localStorage.getItem("everwish_purchased");
    const purchased = purchasedStr ? JSON.parse(purchasedStr) : [];
    
    // Ordenar por fecha de compra (más reciente primero)
    return purchased.sort((a, b) => 
      new Date(b.purchasedAt) - new Date(a.purchasedAt)
    );
  } catch (error) {
    console.error("Error getting purchased cards:", error);
    return [];
  }
}

// ============================================================
// MIGRACIÓN: Usuario temporal → Usuario real
// ============================================================

function migrateDraftsToUser(email, tempId) {
  if (typeof window === "undefined") return;
  
  try {
    const drafts = getDrafts();
    
    // Asociar todos los drafts del usuario temporal al nuevo email
    const updatedDrafts = drafts.map(draft => ({
      ...draft,
      userEmail: email,
      migratedAt: new Date().toISOString(),
      originalTempId: draft.tempUserId || tempId,
    }));
    
    localStorage.setItem("everwish_drafts", JSON.stringify(updatedDrafts));
    
    console.log("🔄 Drafts migrados:", {
      count: updatedDrafts.length,
      fromTemp: tempId,
      toEmail: email
    });
  } catch (error) {
    console.error("Error migrating drafts:", error);
  }
}

// ============================================================
// UTILIDADES PARA NOTIFICACIONES
// ============================================================

/**
 * Verifica si el usuario tiene drafts abandonados
 * Útil para mostrar notificaciones o emails
 */
export function hasAbandonedDrafts(daysSinceLastUpdate = 3) {
  const drafts = getDrafts();
  
  return drafts.some(draft => {
    const daysSince = Math.floor(
      (Date.now() - new Date(draft.updatedAt)) / (1000 * 60 * 60 * 24)
    );
    return daysSince >= daysSinceLastUpdate;
  });
}

/**
 * Obtiene email del usuario para notificaciones
 * Retorna null si es usuario temporal
 */
export function getUserEmailForNotifications() {
  const user = getCurrentUser();
  return user && !user.isTemp ? user.email : null;
}

/**
 * Marca que se envió una notificación sobre drafts
 */
export function markNotificationSent(draftId) {
  if (typeof window === "undefined") return;
  
  try {
    const drafts = getDrafts();
    const updated = drafts.map(d => 
      d.id === draftId 
        ? { ...d, lastNotificationSent: new Date().toISOString() }
        : d
    );
    localStorage.setItem("everwish_drafts", JSON.stringify(updated));
  } catch (error) {
    console.error("Error marking notification:", error);
  }
    }
