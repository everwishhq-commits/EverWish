export const runtime = "nodejs"; // 🚀 Ejecutar en Node.js en Vercel

import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // 📂 Carpeta donde están los videos (.mp4)
    const videosDir = path.join(process.cwd(), "public", "videos");
    const files = fs.readdirSync(videosDir).filter(f => f.endsWith(".mp4"));

    // 🌎 Árbol oficial de categorías y subcategorías (canónico)
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
        "Inclusive Love", // 🏳️‍🌈 sin mencionar Pride
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

    // 🧩 Mapa automático (detección rápida por palabras clave en nombre del archivo)
    const categoryMap = {};
    Object.entries(categoryTree).forEach(([cat, subs]) => {
      subs.forEach(sub => {
        categoryMap[sub.toLowerCase().replace(/[^a-z0-9]/g, "")] = cat;
      });
    });

    // 🧠 Procesar todos los videos
    const allVideos = files.map(file => {
      const slug = file.replace(".mp4", "");
      const lower = slug.toLowerCase();
      const title = slug
        .replace(/_/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());

      // Detectar subcategoría por coincidencia de palabras
      const subcategory =
        Object.keys(categoryMap).find(k => lower.includes(k)) || "general";

      const category = categoryMap[subcategory] || "Everyday & Appreciation";

      // Extraer base (para agrupar variantes tipo _1A, _2A, etc.)
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

    // 🧩 Agrupar por baseSlug y dejar solo 1 por grupo (más reciente)
    const grouped = {};
    for (const v of allVideos) {
      const key = v.baseSlug;
      if (!grouped[key] || grouped[key].updatedAt < v.updatedAt) {
        grouped[key] = v;
      }
    }

    // 🎯 Tomar los 10 más recientes o relevantes
    const sorted = Object.values(grouped)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 10);

    // ✅ Respuesta completa
    return new Response(
      JSON.stringify(
        {
          videos: sorted,
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
      }
    );
  } catch (error) {
    console.error("❌ Error leyendo videos:", error);
    return new Response(
      JSON.stringify({
        error: "Error loading videos",
        details: error.message,
      }),
      { status: 500 }
    );
  }
        }
