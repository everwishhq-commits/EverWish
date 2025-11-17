const fs = require('fs');

// Cargar config
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const { categories, directMap } = config;

function classifyVideo(videoName) {
    const lowerName = videoName.toLowerCase();

    // 1. Revisar coincidencias directas
    for (const key in directMap) {
        if (lowerName.includes(key.toLowerCase())) {
            return directMap[key];
        }
    }

    // 2. Revisar subcategorías
    for (const baseCategory in categories) {
        const subcategories = categories[baseCategory];
        for (const sub of subcategories) {
            if (lowerName.includes(sub.toLowerCase())) {
                return baseCategory;
            }
        }
    }

    return "Uncategorized";
}

function filterByCategory(videos, category) {
    return videos.filter(v => classifyVideo(v) === category);
}

function groupVideosByCategory(videos) {
    const grouped = {};
    for (const video of videos) {
        const cat = classifyVideo(video);
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(video);
    }
    return grouped;
}

// --- EJEMPLO DE USO ---
const videos = [
    "Halloween_party_2025.mp4",
    "Tutorial_JS_basico.mp4",
    "Fiesta_verano.mp4",
    "Christmas_Eve.mp4",
    "Birthday_Bash.mp4",
    "Video_Sin_Categoria.mp4"
];

console.log("Clasificación individual:");
videos.forEach(v => console.log(`${v} -> ${classifyVideo(v)}`));

console.log("\nVideos de Holidays:");
console.log(filterByCategory(videos, "Holidays"));

console.log("\nVideos agrupados por categoría:");
console.log(groupVideosByCategory(videos));
