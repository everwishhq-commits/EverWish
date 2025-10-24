/**
 * 🌐 Everwish Glossary Index
 * Combines all glossary parts into one searchable object.
 * Place this file inside `/lib/glossary_index.js`
 * Requires the JSON parts in `/public/glossary/`
 */

export async function loadGlossary() {
  try {
    const parts = [
      "/glossary/glossary_full_part1.json",
      "/glossary/glossary_full_part2.json",
      "/glossary/glossary_full_part3.json",
      "/glossary/glossary_full_part4.json"
    ];

    const data = await Promise.all(
      parts.map(async (path) => {
        const res = await fetch(path, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load ${path}`);
        return res.json();
      })
    );

    // 🧩 Combine all parts into a single object
    const merged = Object.assign({}, ...data);

    // 🧠 Create a unified searchable array
    const glossaryList = Object.entries(merged).flatMap(([category, info]) => {
      const base = {
        category,
        keywords_en: info.keywords_en || [],
        keywords_es: info.keywords_es || [],
        subcategories: info.related_subcategories || []
      };
      return base;
    });

    console.log("✅ Glossary loaded successfully:", glossaryList.length, "entries");
    return merged;
  } catch (error) {
    console.error("❌ Error loading glossary files:", error);
    return {};
  }
}

/**
 * 🔍 Search function that matches keywords, subcategories, or categories
 * across all glossary parts (English and Spanish).
 */
export async function searchGlossary(term) {
  const glossary = await loadGlossary();
  const q = term.toLowerCase().trim();
  const results = [];

  for (const [category, info] of Object.entries(glossary)) {
    const allWords = [
      ...(info.keywords_en || []),
      ...(info.keywords_es || []),
      ...(info.related_subcategories || [])
    ].map((w) => w.toLowerCase());

    const matches = allWords.filter((w) => w.includes(q));

    if (matches.length > 0) {
      results.push({
        category,
        matches,
        sample: matches.slice(0, 5)
      });
    }
  }

  // 🔢 Rank by number of matches (most relevant first)
  return results.sort((a, b) => b.matches.length - a.matches.length);
}

/**
 * 💡 Example:
 * const results = await searchGlossary("perro");
 * console.log(results);
 * -> [{ category: "pets-animal-lovers", matches: ["dog", "puppy", "perro"], ... }]
 */
