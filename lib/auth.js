// lib/auth.js - Sistema de autenticación simple con localStorage

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  
  try {
    const userStr = localStorage.getItem("everwish_user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export function setCurrentUser(user) {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem("everwish_user", JSON.stringify(user));
  } catch (error) {
    console.error("Error setting current user:", error);
  }
}

export function logout() {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem("everwish_user");
  } catch (error) {
    console.error("Error during logout:", error);
  }
}

export function isAuthenticated() {
  return getCurrentUser() !== null;
}

// Auto-login después de pago exitoso
export function loginAfterPayment(email, phone, customerName = "") {
  const user = {
    email,
    phone,
    name: customerName,
    loginDate: new Date().toISOString()
  };
  
  setCurrentUser(user);
  return user;
}
