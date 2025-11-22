// lib/free-trial-config.js

/**
 * 🎁 SISTEMA DE FREE TRIAL PARA USUARIOS VIP
 * 
 * Permite que ciertos usuarios envíen tarjetas GRATIS por un período limitado
 * Objetivo: Publicidad y marketing viral
 */

// ============================================================
// CONFIGURACIÓN DE ADMINS CON ENVÍO GRATUITO ILIMITADO
// ============================================================
export const ADMIN_FREE_USERS = [
  {
    email: "admin@everwish.cards",
    phone: "+15166046558",
    name: "Admin Everwish",
    type: "admin",
    freeCards: "unlimited",
    expiresAt: null,
  },
  {
    email: "everwishhq@gmail.com",
    phone: null,
    name: "Everwish HQ",
    type: "admin",
    freeCards: "unlimited",
    expiresAt: null,
  },
  {
    email: "gabrielvelasco11@hotmail.com",
    phone: null,
    name: "Gabriel Velasco",
    type: "admin",
    freeCards: "unlimited",
    expiresAt: null,
  },
];

// ============================================================
// USUARIOS VIP CON FREE TRIAL (2-3 MESES)
// ============================================================
// Estos usuarios pueden enviar tarjetas gratis por tiempo limitado
// Se agregan manualmente desde el panel de admin

export class FreeTrialManager {
  
  /**
   * Verifica si un usuario tiene acceso gratuito
   */
  static hasFreeTrial(email, phone) {
    // 1. Verificar si es admin
    const isAdmin = ADMIN_FREE_USERS.some(admin => 
      (admin.email && admin.email.toLowerCase() === email?.toLowerCase()) ||
      (admin.phone && admin.phone === phone)
    );
    
    if (isAdmin) {
      return {
        hasAccess: true,
        type: "admin",
        remainingCards: "unlimited",
        expiresAt: null,
      };
    }

    // 2. Verificar si tiene free trial activo
    const trialUsers = this.getTrialUsers();
    const user = trialUsers.find(u => 
      (u.email && u.email.toLowerCase() === email?.toLowerCase()) ||
      (u.phone && u.phone === phone)
    );

    if (!user) {
      return {
        hasAccess: false,
        type: null,
        remainingCards: 0,
        expiresAt: null,
      };
    }

    // Verificar si expiró
    const now = new Date();
    const expiresAt = new Date(user.expiresAt);
    
    if (now > expiresAt) {
      return {
        hasAccess: false,
        type: "expired",
        remainingCards: 0,
        expiresAt: user.expiresAt,
      };
    }

    // Verificar cards restantes
    if (user.usedCards >= user.freeCards) {
      return {
        hasAccess: false,
        type: "limit_reached",
        remainingCards: 0,
        expiresAt: user.expiresAt,
      };
    }

    return {
      hasAccess: true,
      type: "trial",
      remainingCards: user.freeCards - user.usedCards,
      expiresAt: user.expiresAt,
    };
  }

  /**
   * Obtiene la lista de usuarios con free trial
   */
  static getTrialUsers() {
    if (typeof window === "undefined") return [];
    
    try {
      const stored = localStorage.getItem("everwish_trial_users");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Guarda la lista de usuarios con free trial
   */
  static saveTrialUsers(users) {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem("everwish_trial_users", JSON.stringify(users));
    } catch (err) {
      console.error("Error saving trial users:", err);
    }
  }

  /**
   * Agrega un nuevo usuario con free trial
   */
  static addTrialUser({ email, phone, name, months = 2, freeCards = 10 }) {
    const users = this.getTrialUsers();
    
    // Verificar si ya existe
    const exists = users.some(u => 
      (u.email && u.email.toLowerCase() === email?.toLowerCase()) ||
      (u.phone && u.phone === phone)
    );
    
    if (exists) {
      throw new Error("User already has a free trial");
    }

    // Calcular fecha de expiración
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + months);

    const newUser = {
      email: email || null,
      phone: phone || null,
      name,
      freeCards,
      usedCards: 0,
      addedAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      addedBy: "admin", // Quién lo agregó
    };

    users.push(newUser);
    this.saveTrialUsers(users);

    console.log(`✅ Free trial added for ${name} (${months} months, ${freeCards} cards)`);
    return newUser;
  }

  /**
   * Marca una tarjeta como usada para un usuario trial
   */
  static useTrialCard(email, phone) {
    const users = this.getTrialUsers();
    
    const userIndex = users.findIndex(u => 
      (u.email && u.email.toLowerCase() === email?.toLowerCase()) ||
      (u.phone && u.phone === phone)
    );

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    users[userIndex].usedCards += 1;
    this.saveTrialUsers(users);

    console.log(`📧 Trial card used by ${users[userIndex].name} (${users[userIndex].usedCards}/${users[userIndex].freeCards})`);
    
    return users[userIndex];
  }

  /**
   * Elimina un usuario del free trial
   */
  static removeTrialUser(email, phone) {
    const users = this.getTrialUsers();
    
    const filtered = users.filter(u => 
      !(
        (u.email && u.email.toLowerCase() === email?.toLowerCase()) ||
        (u.phone && u.phone === phone)
      )
    );

    this.saveTrialUsers(filtered);
    
    console.log(`🗑️ Free trial removed for ${email || phone}`);
    return true;
  }

  /**
   * Obtiene estadísticas del programa de free trial
   */
  static getStats() {
    const users = this.getTrialUsers();
    const now = new Date();

    const active = users.filter(u => {
      const expiresAt = new Date(u.expiresAt);
      return now <= expiresAt && u.usedCards < u.freeCards;
    });

    const expired = users.filter(u => {
      const expiresAt = new Date(u.expiresAt);
      return now > expiresAt;
    });

    const limitReached = users.filter(u => {
      const expiresAt = new Date(u.expiresAt);
      return now <= expiresAt && u.usedCards >= u.freeCards;
    });

    const totalCardsSent = users.reduce((sum, u) => sum + u.usedCards, 0);

    return {
      totalUsers: users.length,
      active: active.length,
      expired: expired.length,
      limitReached: limitReached.length,
      totalCardsSent,
      users: users.map(u => ({
        ...u,
        status: this.getUserStatus(u),
      })),
    };
  }

  /**
   * Helper: Obtiene el estado de un usuario
   */
  static getUserStatus(user) {
    const now = new Date();
    const expiresAt = new Date(user.expiresAt);
    
    if (now > expiresAt) return "expired";
    if (user.usedCards >= user.freeCards) return "limit_reached";
    return "active";
  }
}

/**
 * Helper para usar en checkout
 */
export function shouldChargeUser(email, phone) {
  const trial = FreeTrialManager.hasFreeTrial(email, phone);
  return !trial.hasAccess;
}

/**
 * Helper para mostrar badge en UI
 */
export function getFreeTrialBadge(email, phone) {
  const trial = FreeTrialManager.hasFreeTrial(email, phone);
  
  if (!trial.hasAccess) return null;
  
  if (trial.type === "admin") {
    return {
      text: "Admin - Unlimited Free",
      color: "purple",
      emoji: "👑",
    };
  }
  
  if (trial.type === "trial") {
    return {
      text: `Free Trial - ${trial.remainingCards} cards left`,
      color: "green",
      emoji: "🎁",
    };
  }
  
  return null;
}
