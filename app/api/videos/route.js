export const runtime = "nodejs"; // 🚀 Ejecutar en Node.js en Vercel

import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // 📂 Carpeta donde están los videos (.mp4)
    const videosDir = path.join(process.cwd(), "public", "videos");

    // 📜 Leer todos los archivos de video
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

    // 🧩 Generar mapa inverso subcategoría → categoría
    const categoryMap = {};
    Object.entries(categoryTree).forEach(([cat, subs]) => {
      subs.forEach((sub) => {
        categoryMap[sub.toLowerCase().replace(/[^a-z0-9]/g, "")] = cat;
      });
    });

    // 🧠 Leer todos los videos con datos enriquecidos
    const videos = files.map((file) => {
      const slug = file.replace(".mp4", "");
      const lower = slug.toLowerCase();

      // 🏷️ Crear nombre legible (objeto base)
      const object = slug
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      // 🔎 Detectar subcategoría
      const subcategory =
        Object.keys(categoryMap).find((k) => lower.includes(k)) ||
        "General";

      // 🧭 Buscar categoría principal
      const category = categoryMap[subcategory] || "Everyday & Appreciation";

      // 🔢 Detectar base (para grupos tipo _1A, _2A, etc.)
      const baseSlug = slug.replace(/_\d+[A-Z]?$/i, "");

      // 📅 Fecha de actualización
      const updatedAt = fs.statSync(path.join(videosDir, file)).mtimeMs;

      return {
        object,
        slug,
        baseSlug,
        src: `/videos/${file}`,
        category,
        subcategory,
        updatedAt,
      };
    });

    // 🧮 Agrupar por baseSlug → mantener solo el más reciente
    const grouped = {};
    for (const v of videos) {
      if (!grouped[v.baseSlug] || grouped[v.baseSlug].updatedAt < v.updatedAt) {
        grouped[v.baseSlug] = v;
      }
    }

    // 🗂️ Resultado ordenado
    const sorted = Object.values(grouped).sort((a, b) =>
      a.object.localeCompare(b.object)
    );

    // ✅ Responder JSON con todos los campos solicitados
    return new Response(
      JSON.stringify(
        {
          updatedAt: new Date().toISOString(),
          total: sorted.length,
          videos: sorted,
          categories: categoryTree,
        },
        null,
        2
      ),
      {
        headers: { "Content-Type": "application/json" },
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
