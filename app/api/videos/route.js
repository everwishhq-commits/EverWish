export const runtime = "nodejs"; // 🚀 Ejecutar en Node.js en Vercel

import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // 📂 Carpeta donde están los videos
    const videosDir = path.join(process.cwd(), "public", "videos");

    // 📜 Leer solo archivos .mp4
    const files = fs
      .readdirSync(videosDir)
      .filter((file) => file.toLowerCase().endsWith(".mp4"));

    // 🌎 Árbol oficial de categorías y subcategorías
    const categoryTree = {
      "Seasonal & Global Celebrations": [
        "Halloween",
        "Christmas",
        "Thanksgiving",
        "Easter",
        "New Year",
        "Independence Day",
        "July 4th",
        "Valentine’s Day",
        "St. Patrick’s Day",
        "Hanukkah",
        "Diwali",
        "Chinese New Year",
        "Mother’s Day",
        "Father’s Day",
        "Veterans Day",
        "Memorial Day",
        "Labor Day",
        "Earth Day",
        "Women’s Day",
        "Cultural Heritage",
      ],
      "Birthdays & Celebrations": [
        "Adult Birthday",
        "Kids Birthday",
        "Milestone Birthday",
        "Funny Birthday",
        "General Birthday",
      ],
      "Love, Weddings & Anniversaries": [
        "Wedding",
        "Engagement",
        "Anniversary",
        "Renewal of Vows",
        "Proposal",
        "Romantic",
        "Togetherness",
        "Inclusive Love", // 🌈 sin mencionar Pride directamente
      ],
      "Family & Friendship": [
        "Parents",
        "Siblings",
        "Grandparents",
        "Friendship",
        "Community",
        "Reunion",
        "General Family",
      ],
      "Babies & Parenting": [
        "Baby Shower",
        "Newborn",
        "Pregnancy",
        "Gender Reveal",
        "Adoption",
        "First Birthday",
      ],
      "Pets & Animal Lovers": [
        "Dogs",
        "Cats",
        "Birds",
        "Turtles",
        "Fish",
        "Farm Animals",
        "Wildlife",
      ],
      "Support, Healing & Care": [
        "Condolence",
        "Memorial",
        "Loss of Pet",
        "Get Well Soon",
        "Emotional Support",
        "Caregiver",
      ],
      "Everyday & Appreciation": [
        "General",
        "Encouragement",
        "Thank You",
        "Congratulations",
        "Thinking of You",
        "Just Because",
        "Good Luck",
        "Motivational",
      ],
      "Creativity & Expression": [
        "Artistic",
        "Design",
        "Cultural Festivity",
        "Crafts",
        "Visual Arts",
        "Music",
      ],
      "Diversity & Connection": [
        "Unity",
        "Equality",
        "Respect",
        "Humanity",
        "Inclusive Culture",
      ],
      "Kids & Teens": [
        "Cartoon Style",
        "Adventure",
        "Fantasy",
        "Learning",
        "Friendship",
      ],
      "Wellness & Mindful Living": [
        "Faith",
        "Hope",
        "Peace",
        "Meditation",
        "Healing",
        "Nature & Balance",
      ],
      "Life Journeys & Transitions": [
        "Graduation",
        "New Home",
        "Retirement",
        "Career Change",
        "Travel",
        "New Chapter",
      ],
    };

    // 🧩 Mapa inverso para detectar categoría a partir del nombre del archivo
    const categoryMap = {};
    Object.entries(categoryTree).forEach(([cat, subs]) => {
      subs.forEach((sub) => {
        categoryMap[sub.toLowerCase().replace(/[^a-z0-9]/g, "")] = cat;
      });
    });

    // 🧠 Procesar todos los videos
    const allVideos = files.map((file) => {
      const slug = file.replace(".mp4", "");
      const title = slug
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      const lower = slug.toLowerCase();

      // 🧩 Detectar subcategoría por coincidencia
      const subcategory =
        Object.keys(categoryMap).find((k) => lower.includes(k)) || "General";
      const category = categoryMap[subcategory] || "Everyday & Appreciation";

      // Agrupar variantes tipo “1A”, “2A”
      const baseSlug = slug.replace(/_\d+[A-Z]?$/i, "");

      return {
        title,
        slug,
        baseSlug,
        src: `/videos/${file}`,
        category,
        subcategory,
        updatedAt: fs.statSync(path.join(videosDir, file)).mtimeMs,
      };
    });

    // 🧮 Agrupar por baseSlug → mantener solo la versión más reciente
    const grouped = {};
    for (const v of allVideos) {
      const key = v.baseSlug;
      if (!grouped[key] || grouped[key].updatedAt < v.updatedAt) {
        grouped[key] = v;
      }
    }

    // 🎯 Seleccionar las 10 más recientes / actualizadas
    const top10 = Object.values(grouped)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 10);

    // ✅ Respuesta final
    return new Response(
      JSON.stringify(
        {
          videos: top10,
          categories: categoryTree,
          updatedAt: new Date().toISOString(),
        },
        null,
        2
      ),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("❌ Error leyendo videos:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to load videos",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
        }
