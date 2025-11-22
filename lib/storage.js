// lib/storage.js - Sistema híbrido localStorage + Neon

/**
 * Sistema de almacenamiento híbrido:
 * - Guarda PRIMERO en localStorage (instantáneo)
 * - Sincroniza con Neon en segundo plano (backup)
 * - Mejor de ambos mundos: velocidad + persistencia
 */

// ============================================================
// CONFIGURACIÓN
// ============================================================

const SYNC_ENABLED = false; // Activar cuando Neon esté listo
const SYNC_DEBOUNCE = 2000; // Esperar 2s antes de sincronizar
const MAX_RETRY = 3;

let syncTimeout = null;
let syncQueue = [];

// ============================================================
// DRAFT OPERATIONS (localStorage first)
// ============================================================

export async function saveDraft(cardData) {
  try {
    // 1. Guardar PRIMERO en localStorage (instantáneo)
    const draft = saveToLocalStorage(cardData);
    
    // 2. Sincronizar con Neon en segundo plano (no bloqueante)
    if (SYNC_ENABLED) {
      queueSync('save', draft);
    }
    
    return draft;
  } catch (error) {
    console.error("Error saving draft:", error);
    return null;
  }
}

export function getDrafts() {
  try {
    const draftsStr = localStorage.getItem("everwish_drafts");
    const drafts = draftsStr ? JSON.parse(draftsStr) : [];
    
    return drafts.sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  } catch (error) {
    console.error("Error getting drafts:", error);
    return [];
  }
}

export async function deleteDraft(draftId) {
  try {
    // 1. Eliminar de localStorage (instantáneo)
    const drafts = getDrafts();
    const filtered = drafts.filter(d => d.id !== draftId);
    localStorage.setItem("everwish_drafts", JSON.stringify(filtered));
    
    // 2. Sincronizar con Neon
    if (SYNC_ENABLED) {
      queueSync('delete', { id: draftId });
    }
    
    console.log("🗑️ Draft eliminado:", draftId);
  } catch (error) {
    console.error("Error deleting draft:", error);
  }
}

// ============================================================
// LOCALSTORAGE OPERATIONS (Core)
// ============================================================

function saveToLocalStorage(cardData) {
  const drafts = getDrafts();
  
  const draft = {
    id: cardData.id || `draft_${Date.now()}`,
    ...cardData,
    status: "draft",
    createdAt: cardData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    syncedAt: null, // Se actualiza cuando se sincroniza con Neon
  };
  
  const existingIndex = drafts.findIndex(d => d.id === draft.id);
  if (existingIndex >= 0) {
    drafts[existingIndex] = draft;
  } else {
    drafts.push(draft);
  }
  
  localStorage.setItem("everwish_drafts", JSON.stringify(drafts));
  
  console.log("💾 Draft guardado en localStorage:", draft.id);
  return draft;
}

// ============================================================
// NEON SYNC (Background)
// ============================================================

function queueSync(operation, data) {
  // Agregar a la cola
  syncQueue.push({ operation, data, timestamp: Date.now() });
  
  // Debounce: esperar antes de sincronizar
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }
  
  syncTimeout = setTimeout(() => {
    processSyncQueue();
  }, SYNC_DEBOUNCE);
}

async function processSyncQueue() {
  if (syncQueue.length === 0) return;
  
  console.log(`🔄 Sincronizando ${syncQueue.length} operaciones con Neon...`);
  
  const operations = [...syncQueue];
  syncQueue = [];
  
  for (const op of operations) {
    try {
      await syncToNeon(op.operation, op.data);
    } catch (error) {
      console.error("❌ Error sincronizando:", error);
      // Reintentar después
      if (op.retries < MAX_RETRY) {
        syncQueue.push({ ...op, retries: (op.retries || 0) + 1 });
      }
    }
  }
}

async function syncToNeon(operation, data) {
  if (!SYNC_ENABLED) return;
  
  const endpoint = operation === 'delete' ? '/api/drafts/delete' : '/api/drafts/save';
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`Sync failed: ${response.status}`);
  }
  
  // Actualizar el draft en localStorage con la info de sincronización
  if (operation === 'save') {
    updateSyncStatus(data.id);
  }
  
  console.log("✅ Sincronizado con Neon:", data.id || data);
}

function updateSyncStatus(draftId) {
  const drafts = getDrafts();
  const updated = drafts.map(d => 
    d.id === draftId 
      ? { ...d, syncedAt: new Date().toISOString() }
      : d
  );
  localStorage.setItem("everwish_drafts", JSON.stringify(updated));
}

// ============================================================
// RECOVERY: Cargar desde Neon si localStorage vacío
// ============================================================

export async function loadDraftsFromNeon(userEmail) {
  if (!SYNC_ENABLED || !userEmail) return [];
  
  try {
    console.log("📥 Cargando drafts desde Neon...");
    
    const response = await fetch(`/api/drafts?email=${userEmail}`);
    if (!response.ok) throw new Error("Failed to load from Neon");
    
    const neonDrafts = await response.json();
    
    // Mergear con localStorage (localStorage tiene prioridad)
    const localDrafts = getDrafts();
    const merged = mergeDrafts(localDrafts, neonDrafts);
    
    localStorage.setItem("everwish_drafts", JSON.stringify(merged));
    
    console.log("✅ Drafts cargados desde Neon:", merged.length);
    return merged;
    
  } catch (error) {
    console.error("❌ Error cargando desde Neon:", error);
    return getDrafts(); // Fallback a localStorage
  }
}

function mergeDrafts(localDrafts, neonDrafts) {
  const merged = [...localDrafts];
  
  for (const neonDraft of neonDrafts) {
    const exists = merged.find(d => d.id === neonDraft.id);
    
    if (!exists) {
      // Agregar draft que solo existe en Neon
      merged.push(neonDraft);
    } else if (new Date(neonDraft.updatedAt) > new Date(exists.updatedAt)) {
      // Actualizar si la versión de Neon es más reciente
      const index = merged.findIndex(d => d.id === neonDraft.id);
      merged[index] = neonDraft;
    }
  }
  
  return merged;
}

// ============================================================
// SYNC STATUS
// ============================================================

export function getSyncStatus() {
  const drafts = getDrafts();
  const pending = drafts.filter(d => !d.syncedAt).length;
  
  return {
    enabled: SYNC_ENABLED,
    total: drafts.length,
    synced: drafts.length - pending,
    pending: pending,
    lastSync: drafts[0]?.syncedAt || null,
  };
}

export function forceSyncAll() {
  if (!SYNC_ENABLED) {
    console.warn("⚠️ Sync no está habilitado");
    return;
  }
  
  const drafts = getDrafts();
  drafts.forEach(draft => {
    queueSync('save', draft);
  });
  
  console.log(`🔄 Forzando sincronización de ${drafts.length} drafts...`);
}

// ============================================================
// PURCHASED CARDS (mismo sistema híbrido)
// ============================================================

export async function savePurchasedCard(cardData) {
  try {
    const purchased = getPurchasedCards();
    
    const card = {
      ...cardData,
      status: "purchased",
      purchasedAt: new Date().toISOString(),
    };
    
    purchased.push(card);
    localStorage.setItem("everwish_purchased", JSON.stringify(purchased));
    
    // Eliminar de drafts
    if (cardData.id) {
      await deleteDraft(cardData.id);
    }
    
    // Sincronizar con Neon
    if (SYNC_ENABLED) {
      queueSync('purchase', card);
    }
    
    console.log("✅ Tarjeta comprada:", card.id);
    return card;
    
  } catch (error) {
    console.error("Error saving purchased card:", error);
    return null;
  }
}

export function getPurchasedCards() {
  try {
    const purchasedStr = localStorage.getItem("everwish_purchased");
    const purchased = purchasedStr ? JSON.parse(purchasedStr) : [];
    
    return purchased.sort((a, b) => 
      new Date(b.purchasedAt) - new Date(a.purchasedAt)
    );
  } catch (error) {
    console.error("Error getting purchased cards:", error);
    return [];
  }
}
