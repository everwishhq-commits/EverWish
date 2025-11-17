/**
 * 🎯 MAPEO EXACTO - Coincide 100% con categories-config.js
 */

// ============================================================
// MAPEO: Palabra en archivo → Subcategoría EXACTA de config
// ============================================================
export const FILENAME_TO_SUBCATEGORY = {
  // ========== SEASONAL & GLOBAL CELEBRATIONS ==========
  // Major Holidays
  "halloween": "Halloween",
  "thanksgiving": "Thanksgiving",
  "christmas": "Christmas",
  "xmas": "Christmas",
  "easter": "Easter",
  "newyear": "New Year",
  
  // Cultural & National Celebrations
  "independenceday": "Independence Day",
  "july4": "Independence Day",
  "stpatrick": "St Patrick's Day",
  "cincodemayo": "Cinco de Mayo",
  "veteransday": "Veterans Day",
  "diwali": "Diwali",
  "hanukkah": "Hanukkah",
  "ramadan": "Ramadan & Eid",
  "eid": "Ramadan & Eid",
  "chinesenewyear": "Chinese New Year",
  
  // Seasonal Moments
  "spring": "Spring",
  "summer": "Summer",
  "fall": "Fall",
  "autumn": "Fall",
  "winter": "Winter",
  
  // Love Days
  "valentine": "Valentine's Day",
  "valentines": "Valentine's Day",
  "mothersday": "Mother's Day",
  "mothers": "Mother's Day",
  "fathersday": "Father's Day",
  "fathers": "Father's Day",
  
  // ========== BIRTHDAYS & CELEBRATIONS ==========
  "birthday": "Birthday Celebration",
  "milestone": "Milestone Birthday",
  "kids": "Kids Birthday Party",
  "surprise": "Surprise Party",
  "virtual": "Virtual Celebration",
  
  // ========== LOVE, WEDDINGS & ANNIVERSARIES ==========
  "love": "Love & Affection",
  "affection": "Love & Affection",
  "hugs": "Warm Hugs",
  "hug": "Warm Hugs",
  "romance": "Romantic Moments",
  "romantic": "Romantic Moments",
  "wedding": "Wedding Celebration",
  "engagement": "Engagement Joy",
  "bridal": "Bridal Shower",
  "anniversary": "Anniversary Celebration",
  
  // ========== FAMILY & FRIENDSHIP ==========
  "family": "Family Gathering",
  "reunion": "Family Reunion",
  "sibling": "Sibling Connection",
  "siblings": "Sibling Connection",
  "bestfriend": "Best Friend Forever",
  "friend": "Friendship Appreciation",
  "friendship": "Friendship Appreciation",
  
  // ========== WORK & PROFESSIONAL LIFE ==========
  "graduation": "Graduation Celebration",
  "graduate": "Graduation Celebration",
  "newjob": "New Job Celebration",
  "job": "New Job Celebration",
  "promotion": "Promotion Success",
  "retirement": "Retirement Celebration",
  "work": "Work Anniversary",
  "team": "Team Success",
  "project": "Project Completion",
  
  // ========== BABIES & PARENTING ==========
  "babyshower": "Baby Shower",
  "shower": "Baby Shower",
  "baby": "Baby Arrival",
  "newborn": "Baby Arrival",
  "gender": "Gender Reveal",
  "reveal": "Gender Reveal",
  "firststeps": "First Steps",
  "firstbirthday": "First Birthday",
  "adoption": "Adoption Celebration",
  
  // ========== PETS & ANIMAL LOVERS ==========
  // Companion Animals
  "dog": "Furry Companions",
  "dogs": "Furry Companions",
  "puppy": "Furry Companions",
  "cat": "Household Friends",
  "cats": "Household Friends",
  "kitten": "Household Friends",
  "pet": "Loyal Sidekicks",
  "pets": "Loyal Sidekicks",
  
  // Farm & Rural Life
  "farm": "Barnyard Companions",
  "cow": "Barnyard Companions",
  "pig": "Barnyard Companions",
  "chicken": "Barnyard Companions",
  "horse": "Barnyard Companions",
  "goat": "Farm Animals",
  "sheep": "Farm Animals",
  
  // Aquatic Life
  "fish": "Underwater Universe",
  "turtle": "Underwater Universe",
  "dolphin": "Sea Animals",
  "whale": "Sea Animals",
  "shark": "Sea Animals",
  "octopus": "Sea Animals",
  "underwater": "Underwater Universe",
  "sea": "Sea Animals",
  
  // Flying Friends
  "bird": "Wings in Motion",
  "birds": "Wings in Motion",
  "parrot": "Flying Animals",
  "eagle": "Flying Animals",
  "owl": "Flying Animals",
  
  // Wildlife
  "wild": "Amazing Life",
  "lion": "Wild Animals",
  "tiger": "Wild Animals",
  "bear": "Wild Animals",
  "elephant": "Wild Animals",
  "giraffe": "Wild Animals",
  "zebra": "Wild Animals",
  
  // ========== SUPPORT, HEALING & CARE ==========
  "getwell": "Get Well Soon",
  "recovery": "Recovery & Healing",
  "hospital": "Hospital Support",
  "condolence": "Condolence Message",
  "sympathy": "Sympathy & Support",
  "memorial": "Memorial Tribute",
  "strong": "Stay Strong",
  "courage": "You've Got This",
  "thinking": "Thinking of You",
  
  // ========== DIVERSITY & CONNECTION ==========
  "pride": "Pride Celebration",
  "diversity": "Cultural Diversity",
  "unity": "Unity Message",
  "neighbor": "Neighbor Appreciation",
  "community": "Community Support",
  
  // ========== SPORTS ==========
  "sports": "Team Sports Energy",
  "sport": "Team Sports Energy",
  "championship": "Championship Moment",
  "victory": "Victory Celebration",
  "fitness": "Fitness & Training Journey",
  "training": "Fitness & Training Journey",
  "gym": "Gym Motivation",
  "running": "Running Achievement",
  "yoga": "Yoga Practice",
  "marathon": "Marathon Completion",
  
  // ========== WELLNESS & MINDFUL LIVING ==========
  "meditation": "Meditation Practice",
  "mindfulness": "Mindfulness Moment",
  "stress": "Stress Relief",
  "selfcare": "Self-Care Reminder",
  "relaxation": "Relaxation Time",
  "spa": "Spa Day",
  "wellness": "Healthy Lifestyle",
  "health": "Healthy Lifestyle",
  "nutrition": "Nutrition Journey",
  
  // ========== NATURE & LIFE JOURNEYS ==========
  "newhome": "New Home Celebration",
  "newbeginning": "New Chapter Beginning",
  "moving": "Moving to a New Place",
  "travel": "Travel Adventure",
  "vacation": "Vacation Memory",
  "trip": "Road Trip",
  "roadtrip": "Road Trip",
  "landscape": "Beautiful Landscape Scene",
  "outdoor": "Outdoor Adventure Moment",
  "nature": "Nature Appreciation",
};

// ============================================================
// MAPEO: Subcategoría → Categoría Base (EXACTO de config)
// ============================================================
export const SUBCATEGORY_TO_CATEGORY = {
  // SEASONAL & GLOBAL CELEBRATIONS
  "Halloween": "seasonal-global-celebrations",
  "Thanksgiving": "seasonal-global-celebrations",
  "Christmas": "seasonal-global-celebrations",
  "Easter": "seasonal-global-celebrations",
  "New Year": "seasonal-global-celebrations",
  "Independence Day": "seasonal-global-celebrations",
  "St Patrick's Day": "seasonal-global-celebrations",
  "Cinco de Mayo": "seasonal-global-celebrations",
  "Veterans Day": "seasonal-global-celebrations",
  "Diwali": "seasonal-global-celebrations",
  "Hanukkah": "seasonal-global-celebrations",
  "Ramadan & Eid": "seasonal-global-celebrations",
  "Chinese New Year": "seasonal-global-celebrations",
  "Spring": "seasonal-global-celebrations",
  "Summer": "seasonal-global-celebrations",
  "Fall": "seasonal-global-celebrations",
  "Winter": "seasonal-global-celebrations",
  "Valentine's Day": "seasonal-global-celebrations",
  "Mother's Day": "seasonal-global-celebrations",
  "Father's Day": "seasonal-global-celebrations",
  
  // BIRTHDAYS & CELEBRATIONS
  "Birthday Celebration": "birthdays-celebrations",
  "Milestone Birthday": "birthdays-celebrations",
  "Kids Birthday Party": "birthdays-celebrations",
  "Surprise Party": "birthdays-celebrations",
  "Virtual Celebration": "birthdays-celebrations",
  
  // LOVE, WEDDINGS & ANNIVERSARIES
  "Love & Affection": "love-weddings-anniversaries",
  "Warm Hugs": "love-weddings-anniversaries",
  "Romantic Moments": "love-weddings-anniversaries",
  "Wedding Celebration": "love-weddings-anniversaries",
  "Engagement Joy": "love-weddings-anniversaries",
  "Bridal Shower": "love-weddings-anniversaries",
  "Anniversary Celebration": "love-weddings-anniversaries",
  "Milestone Anniversary": "love-weddings-anniversaries",
  
  // FAMILY & FRIENDSHIP
  "Family Gathering": "family-friendship",
  "Family Reunion": "family-friendship",
  "Sibling Connection": "family-friendship",
  "Best Friend Forever": "family-friendship",
  "Friendship Appreciation": "family-friendship",
  "Long Distance Friendship": "family-friendship",
  
  // WORK & PROFESSIONAL LIFE
  "Graduation Celebration": "work",
  "New Job Celebration": "work",
  "Promotion Success": "work",
  "Retirement Celebration": "work",
  "Work Anniversary": "work",
  "Team Success": "work",
  "Project Completion": "work",
  
  // BABIES & PARENTING
  "Baby Shower": "babies-parenting",
  "Baby Arrival": "babies-parenting",
  "Gender Reveal": "babies-parenting",
  "First Steps": "babies-parenting",
  "First Birthday": "babies-parenting",
  "Adoption Celebration": "babies-parenting",
  
  // PETS & ANIMAL LOVERS
  "Furry Companions": "pets-animal-lovers",
  "Household Friends": "pets-animal-lovers",
  "Loyal Sidekicks": "pets-animal-lovers",
  "Barnyard Companions": "pets-animal-lovers",
  "Farm Animals": "pets-animal-lovers",
  "Underwater Universe": "pets-animal-lovers",
  "Sea Animals": "pets-animal-lovers",
  "Wings in Motion": "pets-animal-lovers",
  "Flying Animals": "pets-animal-lovers",
  "Amazing Life": "pets-animal-lovers",
  "Wild Animals": "pets-animal-lovers",
  
  // SUPPORT, HEALING & CARE
  "Get Well Soon": "support-healing-care",
  "Recovery & Healing": "support-healing-care",
  "Hospital Support": "support-healing-care",
  "Condolence Message": "support-healing-care",
  "Sympathy & Support": "support-healing-care",
  "Memorial Tribute": "support-healing-care",
  "Stay Strong": "support-healing-care",
  "You've Got This": "support-healing-care",
  "Thinking of You": "support-healing-care",
  
  // DIVERSITY & CONNECTION
  "Pride Celebration": "hear-every-heart",
  "Cultural Diversity": "hear-every-heart",
  "Unity Message": "hear-every-heart",
  "Neighbor Appreciation": "hear-every-heart",
  "Community Support": "hear-every-heart",
  
  // SPORTS
  "Team Sports Energy": "sports",
  "Championship Moment": "sports",
  "Victory Celebration": "sports",
  "Fitness & Training Journey": "sports",
  "Gym Motivation": "sports",
  "Running Achievement": "sports",
  "Yoga Practice": "sports",
  "Marathon Completion": "sports",
  
  // WELLNESS & MINDFUL LIVING
  "Meditation Practice": "wellness-mindful-living",
  "Mindfulness Moment": "wellness-mindful-living",
  "Stress Relief": "wellness-mindful-living",
  "Self-Care Reminder": "wellness-mindful-living",
  "Relaxation Time": "wellness-mindful-living",
  "Spa Day": "wellness-mindful-living",
  "Healthy Lifestyle": "wellness-mindful-living",
  "Nutrition Journey": "wellness-mindful-living",
  
  // NATURE & LIFE JOURNEYS
  "New Home Celebration": "life-journeys-transitions",
  "New Chapter Beginning": "life-journeys-transitions",
  "Moving to a New Place": "life-journeys-transitions",
  "Travel Adventure": "life-journeys-transitions",
  "Vacation Memory": "life-journeys-transitions",
  "Road Trip": "life-journeys-transitions",
  "Beautiful Landscape Scene": "life-journeys-transitions",
  "Outdoor Adventure Moment": "life-journeys-transitions",
  "Nature Appreciation": "life-journeys-transitions",
};

export function classifyByFilename(filename) {
  const nameWithoutExt = filename.replace(/\.mp4$/i, '');
  const nameWithoutVariant = nameWithoutExt.replace(/_\d+[A-Z]$/i, '');
  const parts = nameWithoutVariant.split('_').filter(Boolean);
  
  const object = parts[0] || "Unknown";
  const categoriesFound = new Set();
  const subcategoriesFound = new Set();
  
  parts.forEach(part => {
    const lowerPart = part.toLowerCase();
    if (FILENAME_TO_SUBCATEGORY[lowerPart]) {
      const subcat = FILENAME_TO_SUBCATEGORY[lowerPart];
      subcategoriesFound.add(subcat);
      if (SUBCATEGORY_TO_CATEGORY[subcat]) {
        categoriesFound.add(SUBCATEGORY_TO_CATEGORY[subcat]);
      }
    }
  });
  
  if (categoriesFound.size === 0) {
    categoriesFound.add("general");
  }
  
  return {
    categories: [...categoriesFound],
    subcategories: [...subcategoriesFound],
    searchTerms: parts,
    object: object.charAt(0).toUpperCase() + object.slice(1),
  };
}

export const classifyByKeywords = classifyByFilename;

export function searchByKeyword(videos, query) {
  const q = query.toLowerCase().trim();
  return videos.filter(video => {
    if (video.name.toLowerCase().includes(q)) return true;
    if (video.object?.toLowerCase().includes(q)) return true;
    if (video.searchTerms?.some(term => term.toLowerCase().includes(q))) return true;
    if (video.categories?.some(cat => cat.toLowerCase().includes(q))) return true;
    if (video.subcategories?.some(sub => sub.toLowerCase().includes(q))) return true;
    return false;
  });
}
