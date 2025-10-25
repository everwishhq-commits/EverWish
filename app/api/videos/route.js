import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // 📂 Carpeta donde están los videos
    const videosDir = path.join(process.cwd(), "public/videos");

    // 📜 Leer solo los archivos .mp4
    const files = fs.readdirSync(videosDir).filter((f) => f.endsWith(".mp4"));

    // 🧭 Diccionario base de categorías y subcategorías internacionales
    const categoryMap = {
      // 🎃 Seasonal & Holidays
      halloween: "Seasonal & Holidays",
      thanksgiving: "Seasonal & Holidays",
      christmas: "Seasonal & Holidays",
      newyear: "Seasonal & Holidays",
      easter: "Seasonal & Holidays",
      independence: "Seasonal & Holidays",
      july4th: "Seasonal & Holidays",
      valentinesday: "Seasonal & Holidays",
      stpatricksday: "Seasonal & Holidays",
      hanukkah: "Seasonal & Holidays",
      kwanzaa: "Seasonal & Holidays",
      diwali: "Seasonal & Holidays",
      lunarnewyear: "Seasonal & Holidays",
      ramadan: "Seasonal & Holidays",
      eid: "Seasonal & Holidays",
      pride: "Seasonal & Holidays",
      mothersday: "Seasonal & Holidays",
      fathersday: "Seasonal & Holidays",
      veteransday: "Seasonal & Holidays",
      memorialday: "Seasonal & Holidays",
      labor: "Seasonal & Holidays",
      earthday: "Seasonal & Holidays",
      carnaval: "Seasonal & Holidays",
      holi: "Seasonal & Holidays",
      oktoberfest: "Seasonal & Holidays",
      dayofthedead: "Seasonal & Holidays",
      chinese: "Seasonal & Holidays",

      // 🎂 Birthdays & Celebrations
      birthday: "Birthdays & Celebrations",
      sweet16: "Birthdays & Celebrations",
      quinceanera: "Birthdays & Celebrations",
      milestone: "Birthdays & Celebrations",
      party: "Birthdays & Celebrations",
      surprise: "Birthdays & Celebrations",
      cake: "Birthdays & Celebrations",

      // 💍 Weddings & Anniversaries
      wedding: "Weddings & Anniversaries",
      anniversary: "Weddings & Anniversaries",
      engagement: "Weddings & Anniversaries",
      proposal: "Weddings & Anniversaries",
      vowrenewal: "Weddings & Anniversaries",
      bridalshower: "Weddings & Anniversaries",

      // 💘 Love & Friendship
      love: "Love & Friendship",
      valentine: "Love & Friendship",
      relationship: "Love & Friendship",
      couple: "Love & Friendship",
      romantic: "Love & Friendship",
      friendship: "Love & Friendship",
      crush: "Love & Friendship",
      missyou: "Love & Friendship",
      apology: "Love & Friendship",
      hug: "Love & Friendship",

      // 👨‍👩‍👧 Family & Parenting
      family: "Family & Parenting",
      mother: "Family & Parenting",
      father: "Family & Parenting",
      parents: "Family & Parenting",
      son: "Family & Parenting",
      daughter: "Family & Parenting",
      brother: "Family & Parenting",
      sister: "Family & Parenting",
      grandparents: "Family & Parenting",
      uncle: "Family & Parenting",
      aunt: "Family & Parenting",
      cousin: "Family & Parenting",

      // 👶 Babies & Kids
      baby: "Babies & Kids",
      newborn: "Babies & Kids",
      babyshower: "Babies & Kids",
      pregnancy: "Babies & Kids",
      genderreveal: "Babies & Kids",
      kid: "Babies & Kids",
      child: "Babies & Kids",
      school: "Babies & Kids",
      firstdayofschool: "Babies & Kids",
      backtoschool: "Babies & Kids",

      // 🐾 Pets & Animals
      pet: "Pets & Animals",
      dog: "Pets & Animals",
      cat: "Pets & Animals",
      bunny: "Pets & Animals",
      bird: "Pets & Animals",
      fish: "Pets & Animals",
      turtle: "Pets & Animals",
      hamster: "Pets & Animals",
      horse: "Pets & Animals",
      lion: "Pets & Animals",
      elephant: "Pets & Animals",
      dolphin: "Pets & Animals",
      octopus: "Pets & Animals",

      // 🌸 Sympathy & Condolences
      condolence: "Sympathy & Condolences",
      sympathy: "Sympathy & Condolences",
      memorial: "Sympathy & Condolences",
      loss: "Sympathy & Condolences",
      remembrance: "Sympathy & Condolences",
      funeral: "Sympathy & Condolences",
      comfort: "Sympathy & Condolences",
      healing: "Sympathy & Condolences",

      // 🎓 Achievements & Milestones
      graduation: "Achievements & Milestones",
      congratulations: "Achievements & Milestones",
      newjob: "Achievements & Milestones",
      promotion: "Achievements & Milestones",
      retirement: "Achievements & Milestones",
      newhome: "Achievements & Milestones",
      moving: "Achievements & Milestones",
      success: "Achievements & Milestones",
      goal: "Achievements & Milestones",

      // 💼 Thank You & Appreciation
      thankyou: "Thank You & Appreciation",
      gratitude: "Thank You & Appreciation",
      appreciation: "Thank You & Appreciation",
      teacher: "Thank You & Appreciation",
      coworker: "Thank You & Appreciation",
      volunteer: "Thank You & Appreciation",
      nurse: "Thank You & Appreciation",
      doctor: "Thank You & Appreciation",
      mentor: "Thank You & Appreciation",
      client: "Thank You & Appreciation",
      boss: "Thank You & Appreciation",

      // 💭 Motivation & Inspiration
      motivation: "Motivation & Inspiration",
      encouragement: "Motivation & Inspiration",
      hope: "Motivation & Inspiration",
      faith: "Motivation & Inspiration",
      perseverance: "Motivation & Inspiration",
      strength: "Motivation & Inspiration",
      healingenergy: "Motivation & Inspiration",
      courage: "Motivation & Inspiration",
      selflove: "Motivation & Inspiration",
      mindfulness: "Motivation & Inspiration",

      // 🌈 Spiritual & Reflection
      god: "Spiritual & Reflection",
      blessing: "Spiritual & Reflection",
      spiritual: "Spiritual & Reflection",
      prayer: "Spiritual & Reflection",
      meditation: "Spiritual & Reflection",
      peace: "Spiritual & Reflection",
      universe: "Spiritual & Reflection",
      gratitudeprayer: "Spiritual & Reflection",

      // 🕊️ Support & Recovery
      getwell: "Support & Recovery",
      recovery: "Support & Recovery",
      hospital: "Support & Recovery",
      cheerup: "Support & Recovery",
      health: "Support & Recovery",

      // 🧠 Awareness & Causes
      awareness: "Awareness & Causes",
      cancer: "Awareness & Causes",
      autism: "Awareness & Causes",
      women: "Awareness & Causes",
      men: "Awareness & Causes",
      equality: "Awareness & Causes",
      environment: "Awareness & Causes",
      peaceweek: "Awareness & Causes",

      // 💼 Business & Corporate
      business: "Business & Corporate",
      teamwork: "Business & Corporate",
      clientappreciation: "Business & Corporate",
      corporate: "Business & Corporate",
      welcome: "Business & Corporate",
      farewell: "Business & Corporate",
      meeting: "Business & Corporate",

      // 💌 Everyday & Miscellaneous
      general: "Everyday",
      hello: "Everyday",
      goodmorning: "Everyday",
      goodnight: "Everyday",
      thinkingofyou: "Everyday",
      justbecause: "Everyday",
      positivity: "Everyday",
      smile: "Everyday",
      apologycard: "Everyday",
    };

    // 🧠 Procesar videos
    const videos = files.map((file) => {
      const slug = file.replace(".mp4", "");
      const parts = slug
        .replace(/_/g, "+")
        .split("+")
        .map((p) => p.trim().toLowerCase())
        .filter(Boolean);

      const [object, ...cats] = parts;
      const variantMatch = object.match(/(\d+[a-z]*)$/i);
      const variant = variantMatch ? variantMatch[1] : null;

      // Buscar categoría principal
      const foundCategory =
        Object.entries(categoryMap).find(([key]) => slug.includes(key))?.[1] ||
        "Other";

      // Subcategoría (si existe)
      const subcategory = cats.find(
        (c) => !["general", "1a", "2a", "v1", "v2"].includes(c)
      );

      const categories = cats.map((c) =>
        c.replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase())
      );

      return {
        object: object.replace(/\b\w/g, (ch) => ch.toUpperCase()),
        file: `/videos/${file}`,
        slug,
        category: foundCategory,
        categories,
        subcategory:
          subcategory?.replace(/\b\w/g, (ch) => ch.toUpperCase()) || "General",
        variant,
        tags: [object, ...cats],
      };
    });

    // ✅ Respuesta final
    return new Response(JSON.stringify(videos, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error reading videos:", error);
    return new Response(JSON.stringify({ error: "Failed to load videos" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
      }
