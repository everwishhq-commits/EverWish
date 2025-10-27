export const runtime = "nodejs"; // 🚀 Ejecutar en Node.js en Vercel

import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // 📂 Carpeta donde están los videos (.mp4)
    const videosDir = path.join(process.cwd(), "public", "videos");
    const indexFile = path.join(videosDir, "index.json");

    // 📜 Leer todos los .mp4
    const files = fs.readdirSync(videosDir).filter((f) => f.endsWith(".mp4"));

    // 🌎 Categorías y subcategorías (organización principal)
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
        "Inclusive Love",
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

    // 🧩 Crear mapa inverso (sub → categoría)
    const categoryMap = {};
    Object.entries(categoryTree).forEach(([cat, subs]) => {
      subs.forEach((sub) => {
        categoryMap[sub.toLowerCase().replace(/[^a-z0-9]/g, "")] = cat;
      });
    });

    // 📄 Leer index.json si ya existe
    let existingData = [];
    if (fs.existsSync(indexFile)) {
      try {
        existingData = JSON.parse(fs.readFileSync(indexFile, "utf8"));
      } catch {
        existingData = [];
      }
    }

    // 🧠 Procesar todos los videos
    const allVideos = files.map((file) => {
      const slug = file.replace(".mp4", "");
      const lower = slug.toLowerCase();
      const title = slug
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      // 🔍 Detección automática de subcategoría
      const subcategory =
        Object.keys(categoryMap).find((k) => lower.includes(k)) || "General";
      const category = categoryMap[subcategory] || "Everyday & Appreciation";
      const baseSlug = slug.replace(/_\d+[A-Z]?$/i, "");
      const updatedAt = fs.statSync(path.join(videosDir, file)).mtimeMs;

      const existing = existingData.find((v) => v.slug === slug);

      return {
        slug,
        title: existing?.title || title, // editable
        message: existing?.message || "", // texto opcional
        src: `/videos/${file}`,
        baseSlug,
        category,
        subcategory,
        updatedAt,
      };
    });

    // 🧮 Agrupar versiones (_1A, _2A, etc.) y mantener la más reciente
    const grouped = {};
    for (const v of allVideos) {
      if (!grouped[v.baseSlug] || grouped[v.baseSlug].updatedAt < v.updatedAt) {
        grouped[v.baseSlug] = v;
      }
    }

    // 🕒 Ordenar los más nuevos primero
    const finalList = Object.values(grouped).sort(
      (a, b) => b.updatedAt - a.updatedAt
    );

    // 💾 Guardar/actualizar index.json
    fs.writeFileSync(indexFile, JSON.stringify(finalList, null, 2), "utf8");

    // ✅ Respuesta JSON
    return new Response(
      JSON.stringify(
        {
          updatedAt: new Date().toISOString(),
          total: finalList.length,
          videos: finalList,
          categories: categoryTree,
        },
        null,
        2
      ),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("❌ Error leyendo videos:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to load or save videos",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
        }
