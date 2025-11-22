import "./globals.css";
import TempUserInitializer from "@/components/TempUserInitializer";
import { DraftNotificationBanner } from "@/hooks/useDraftNotifications";

export const metadata = {
  title: "Everwish",
  description: "Everwish digital cards",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {/* Inicializar usuario temporal automáticamente */}
        <TempUserInitializer />
        
        {/* Banner de notificaciones de drafts */}
        <DraftNotificationBanner />
        
        {/* Contenido de la app */}
        {children}
      </body>
    </html>
  );
}
