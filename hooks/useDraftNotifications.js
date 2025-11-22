"use client";

import { useEffect, useState } from "react";
import { 
  getDrafts, 
  getDraftStats, 
  getUserEmailForNotifications,
  hasAbandonedDrafts 
} from "@/lib/auth";

export function useDraftNotifications() {
  const [shouldNotify, setShouldNotify] = useState(false);
  const [draftStats, setDraftStats] = useState(null);

  useEffect(() => {
    checkForAbandonedDrafts();
    const interval = setInterval(checkForAbandonedDrafts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const checkForAbandonedDrafts = () => {
    const stats = getDraftStats();
    const email = getUserEmailForNotifications();
    
    if (stats.total > 0) {
      setDraftStats(stats);
      
      if (stats.isTemp && stats.total > 0) {
        setShouldNotify(true);
      }
      
      if (!stats.isTemp && hasAbandonedDrafts(3)) {
        setShouldNotify(true);
        if (email) {
          sendEmailNotification(email, stats);
        }
      }
    }
  };

  const sendEmailNotification = async (email, stats) => {
    try {
      const lastNotification = localStorage.getItem("last_draft_notification");
      if (lastNotification) {
        const daysSince = Math.floor(
          (Date.now() - new Date(lastNotification)) / (1000 * 60 * 60 * 24)
        );
        if (daysSince < 3) {
          console.log("⏭️ Notificación ya enviada recientemente");
          return;
        }
      }

      console.log("📧 Enviando notificación de drafts abandonados...", {
        email,
        drafts: stats.total,
        daysSinceOldest: stats.daysSinceOldest
      });

      localStorage.setItem("last_draft_notification", new Date().toISOString());
      
      const emailData = {
        to: email,
        subject: "¡Tienes tarjetas sin terminar! 🎨",
        template: "abandoned_drafts",
        data: {
          draftCount: stats.total,
          oldestDraft: stats.oldestDraft,
          link: `${window.location.origin}/myspace`
        }
      };

      console.log("✅ Notificación programada:", emailData);

    } catch (error) {
      console.error("❌ Error enviando notificación:", error);
    }
  };

  const dismissNotification = () => {
    setShouldNotify(false);
  };

  return {
    shouldNotify,
    draftStats,
    dismissNotification,
    checkForAbandonedDrafts
  };
}

export function DraftNotificationBanner({ onDismiss }) {
  const { shouldNotify, draftStats, dismissNotification } = useDraftNotifications();

  if (!shouldNotify || !draftStats) return null;

  const handleDismiss = () => {
    dismissNotification();
    if (onDismiss) onDismiss();
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🛒</div>
          
          <div className="flex-1">
            <h3 className="font-bold mb-1">
              {draftStats.isTemp ? "¡No pierdas tus creaciones!" : "Tienes tarjetas sin terminar"}
            </h3>
            <p className="text-sm text-white/90 mb-3">
              {draftStats.isTemp
                ? `Tienes ${draftStats.total} tarjeta${draftStats.total > 1 ? 's' : ''} en proceso. Compra para guardarlas.`
                : `Tienes ${draftStats.total} draft${draftStats.total > 1 ? 's' : ''} esperando. ¡Termínalos ahora!`}
            </p>
            
            <div className="flex gap-2">
              <a href="/myspace" className="px-4 py-2 bg-white text-orange-600 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors">
                Ver Carrito
              </a>
              
              <button onClick={handleDismiss} className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium text-sm hover:bg-white/30 transition-colors">
                Después
              </button>
            </div>
          </div>
          
          <button onClick={handleDismiss} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export async function requestDraftNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("Este navegador no soporta notificaciones");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

export function sendBrowserNotification(title, body, link) {
  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      body,
      icon: "/icon-192.png",
      badge: "/badge-72.png",
      tag: "draft-reminder",
      requireInteraction: false,
    });

    notification.onclick = () => {
      window.focus();
      window.location.href = link;
      notification.close();
    };
  }
              }
