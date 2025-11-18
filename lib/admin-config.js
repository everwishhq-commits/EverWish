export const ADMIN_EMAILS = [
  "admin@everwish.cards",
  "everwishhq@gmail.com",
  "gabrielvelasco11@hotmail.com",
];

export const ADMIN_PHONES = [
  "+15166046558",
];

export function isAdminUser(email, phone) {
  if (email && ADMIN_EMAILS.includes(email.toLowerCase().trim())) return true;
  if (phone) {
    const cleanPhone = phone.replace(/\D/g, "");
    return ADMIN_PHONES.some(adminPhone => {
      const cleanAdminPhone = adminPhone.replace(/\D/g, "");
      return cleanPhone.includes(cleanAdminPhone);
    });
  }
  return false;
}

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("everwishUser");
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
}

export function isCurrentUserAdmin() {
  const user = getCurrentUser();
  return user ? isAdminUser(user.email, user.phone) : false;
}
