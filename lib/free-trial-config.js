// lib/free-trial-config.js

// Lista de emails admin con acceso VIP permanente
const ADMIN_EMAILS = [
  "gevem249@gmail.com",
  "gabrielvelasco11@hotmail.com",
  "admin@everwish.cards"
];

// Función para verificar si es usuario admin
export function isAdminUser(email, phone) {
  if (!email && !phone) return false;
  
  // Verificar por email
  if (email && ADMIN_EMAILS.includes(email.toLowerCase())) {
    return true;
  }
  
  // Los admin tienen envío gratis ilimitado
  return false;
}

// Estructura de usuarios VIP con free trial
// En producción esto vendría de la base de datos
let FREE_TRIAL_USERS = [];

// Función para agregar usuario VIP
export function addFreeTrialUser(email, phone, durationMonths = 1, freeCards = 10) {
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + durationMonths);
  
  const newUser = {
    id: Date.now().toString(),
    email: email?.toLowerCase() || "",
    phone: phone || "",
    freeCards,
    usedCards: 0,
    expiresAt: expiresAt.toISOString(),
    createdAt: new Date().toISOString(),
    status: "active"
  };
  
  FREE_TRIAL_USERS.push(newUser);
  return newUser;
}

// Función para obtener información de free trial
export function getFreeTrialInfo(email, phone) {
  // Verificar si es admin primero
  if (isAdminUser(email, phone)) {
    return {
      isActive: true,
      isAdmin: true,
      cardsRemaining: null, // ilimitado
      freeCards: null,
      expiresAt: null
    };
  }
  
  // Buscar en usuarios VIP
  const user = FREE_TRIAL_USERS.find(
    u => u.email === email?.toLowerCase() || u.phone === phone
  );
  
  if (!user) {
    return {
      isActive: false,
      isAdmin: false,
      cardsRemaining: 0,
      freeCards: 0,
      expiresAt: null
    };
  }
  
  // Verificar si expiró
  const now = new Date();
  const expiresAt = new Date(user.expiresAt);
  const isExpired = now > expiresAt;
  
  // Verificar si alcanzó el límite
  const limitReached = user.usedCards >= user.freeCards;
  
  return {
    isActive: !isExpired && !limitReached,
    isAdmin: false,
    cardsRemaining: Math.max(0, user.freeCards - user.usedCards),
    freeCards: user.freeCards,
    expiresAt: user.expiresAt,
    status: isExpired ? "expired" : limitReached ? "limit_reached" : "active"
  };
}

// Función para obtener todos los usuarios VIP
export function getAllFreeTrialUsers() {
  return FREE_TRIAL_USERS.map(user => ({
    ...user,
    ...getFreeTrialInfo(user.email, user.phone)
  }));
}

// Función para eliminar usuario VIP
export function removeFreeTrialUser(userId) {
  const index = FREE_TRIAL_USERS.findIndex(u => u.id === userId);
  if (index !== -1) {
    FREE_TRIAL_USERS.splice(index, 1);
    return true;
  }
  return false;
}

// Función para incrementar contador de tarjetas usadas
export function incrementCardUsage(email, phone) {
  const user = FREE_TRIAL_USERS.find(
    u => u.email === email?.toLowerCase() || u.phone === phone
  );
  
  if (user) {
    user.usedCards += 1;
    return true;
  }
  
  return false;
}

// Función para verificar si debe cobrar
export function shouldCharge(email, phone) {
  const trialInfo = getFreeTrialInfo(email, phone);
  return !trialInfo.isActive;
}
