// lib/auth.js - Sistema de autenticación con usuario temporal

// ============================================================
// USUARIO TEMPORAL (localStorage - no usa servidor)
// ============================================================

function generateTempId() {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getTempUser() {
  if (typeof window === "undefined") return null;
  
  try {
    let tempUser = localStorage.getItem("everwish_temp_user");
    
    if (!tempUser) {
      // Crear usuario temporal automáticamente
      const newTempUser = {
        tempId: generateTempId(),
        createdAt: new Date().toISOString(),
        isTemp: true,
      };
      localStorage.setItem("everwish_temp_user", JSON.stringify(newTempUser));
      return newTempUser;
    }
    
    return JSON.parse(tempUser);
  } catch (error) {
    console.error("Error getting temp user:", error);
    return null;
  }
}

// ============================================================
// USUARIO REAL (después del pago)
// ============================================================

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  
  try {
    const userStr = localStorage.getItem("everwish_user");
    if (userStr) {
      return { ...JSON.parse(userStr), isTemp: false };
    }
    
    // Si no hay usuario real, retornar el temporal
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
    // Limpiar usuario temporal
    localStorage.removeItem("everwish_temp_user");
  } catch (error) {
    console.error("Error setting current user:", error);
  }
}

export function logout() {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem("everwish_user");
    // NO borrar el usuario temporal ni los borradores
  } catch (error) {
    console.error("Error during logout:", error);
  }
}

export function isAuthenticated() {
  const user = getCurrentUser();
  return user && !user.isTemp;
}

export function loginAfterPayment(email, phone, name = "") {
  const tempUser = getTempUser();
  
  const user = {
    email,
    phone,
    name,
    tempId: tempUser?.tempId, // Guardar referencia al ID temporal
    loginDate: new Date().toISOString(),
  };
  
  setCurrentUser(user);
  
  // Migrar borradores a tarjetas compradas
  migrateDraftsToUser(email);
  
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
      tempUserId: user?.tempId || user?.email,
      status: "draft",
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
    return draftsStr ? JSON.parse(draftsStr) : [];
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
  } catch (error) {
    console.error("Error deleting draft:", error);
  }
}

// ============================================================
// TARJETAS COMPRADAS (localStorage hasta que Neon funcione)
// ============================================================

export function savePurchasedCard(cardData) {
  if (typeof window === "undefined") return null;
  
  try {
    const purchased = getPurchasedCards();
    
    const card = {
      ...cardData,
      status: "purchased",
      purchasedAt: new Date().toISOString(),
    };
    
    purchased.push(card);
    localStorage.setItem("everwish_purchased", JSON.stringify(purchased));
    
    // Eliminar de borradores si existe
    if (cardData.id) {
      deleteDraft(cardData.id);
    }
    
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
    return purchasedStr ? JSON.parse(purchasedStr) : [];
  } catch (error) {
    console.error("Error getting purchased cards:", error);
    return [];
  }
}

// ============================================================
// MIGRACIÓN: Usuario temporal → Usuario real
// ============================================================

function migrateDraftsToUser(email) {
  if (typeof window === "undefined") return;
  
  try {
    // Los borradores se mantienen, solo se asocian al nuevo usuario
    const drafts = getDrafts();
    const updatedDrafts = drafts.map(draft => ({
      ...draft,
      userEmail: email,
    }));
    localStorage.setItem("everwish_drafts", JSON.stringify(updatedDrafts));
  } catch (error) {
    console.error("Error migrating drafts:", error);
  }
                  }
