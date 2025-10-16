import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { animationCategories, getAnimationsForSlug } from "./animationsets";

export function AnimationOverlay({ slug, animation }) {
  const [items, setItems] = useState([]);
  const [key, setKey] = useState(0);

  // 🟣 Detección automática de tema oscuro
  const isDarkTheme = ["halloween", "night", "ghost", "dark"].some((kw) =>
    slug.toLowerCase().includes(kw)
  );

  // 🔹 Categoría y conjunto activo
  const category = getAnimationsForSlug(slug);
  const categoryData = animationCategories[category];
  const activeSet =
    categoryData.options[animation] ||
    categoryData.default ||
    animationCategories.default.default;

  useEffect(() => {
    const total = 18; // cantidad equilibrada
    const newItems = Array.from({ length: total }, (_, i) => ({
      id: i,
      emoji: activeSet[Math.floor(Math.random() * activeSet.length)],
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 22 + 18}px`,
      delay: Math.random() * 10 + i * 0.6, // aparición escalonada
      duration: Math.random() * 10 + 15, // flotación lenta
      opacity: Math.random() * 0.4 + 0.4,
      driftx: Math.random() * 80 - 40, // izquierda/derecha
      floatamp: Math.random() * 25 + 10, // ondulación vertical
    }));
    setItems(newItems);
    setKey((k) => k + 1);
  }, [slug, animation]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        className="fixed inset-0 pointer-events-none z-[999] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{
              y: "110vh",
              x: 0,
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              y: [
                "110vh",
                `calc(-20vh + ${Math.sin(item.floatamp)}px)`,
                `calc(-25vh - ${Math.sin(item.floatamp / 2)}px)`,
              ],
              x: item.driftx,
              opacity: [0, item.opacity, 0],
              scale: 1,
              rotate: Math.random() * 20 - 10,
              filter: isDarkTheme
                ? "drop-shadow(0px 0px 6px rgba(255,255,255,0.6))"
                : "none",
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              left: item.left,
              fontSize: item.size,
              userSelect: "none",
              pointerEvents: "none",
              color: isDarkTheme ? "#ffd6a5" : "#ffb6c1",
              opacity: item.opacity,
              zIndex: 900 + index,
            }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
