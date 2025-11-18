/**
 * 🎯 MAPEO EXACTO según categories-config.js
 * 
 * Formato de archivo: objeto_subcategoriatodojunto_variante.mp4
 * Ejemplo: fireworks_stpatrickday_1A.mp4
 */

// ============================================================
// MAPEO: Nombre en archivo → Subcategoría EXACTA de config
// ============================================================
export const FILENAME_TO_SUBCATEGORY = {
  // ========== SEASONAL & GLOBAL CELEBRATIONS ==========
  
  // Major Holidays
  "halloween": "Halloween",
  "thanksgiving": "Thanksgiving",
  "christmas": "Christmas",
  "easter": "Easter",
  "newyear": "New Year",
  
  // Cultural & National Celebrations
  "independenceday": "Independence Day",
  "stpatrickday": "St Patrick's Day",
  "stpatricksday": "St Patrick's Day",
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
  "winter": "Winter",
  
  // Love Days
  "valentinesday": "Valentine's Day",
  "mothersday": "Mother's Day",
  "fathersday": "Father's Day",
  
  // ========== BIRTHDAYS & CELEBRATIONS ==========
  
  // Birthday Celebrations
  "birthdaycelebration": "Birthday Celebration",
  "milestonebirthday": "Milestone Birthday",
  "kidsbirthdayparty": "Kids Birthday Party",
  
  // Special Moments
  "surpriseparty": "Surprise Party",
  "virtualcelebration": "Virtual Celebration",
  
  // ========== LOVE, WEDDINGS & ANNIVERSARIES ==========
  
  // Love & Affection
  "loveaffection": "Love & Affection",
  "warmhugs": "Warm Hugs",
  "romanticmoments": "Romantic Moments",
  
  // Wedding Journey
  "weddingcelebration": "Wedding Celebration",
  "engagementjoy": "Engagement Joy",
  "bridalshower": "Bridal Shower",
  
  // Anniversary Milestones
  "anniversarycelebration": "Anniversary Celebration",
  "milestoneanniversary": "Milestone Anniversary",
  
  // ========== FAMILY & FRIENDSHIP ==========
  
  // Family Bonds
  "familygathering": "Family Gathering",
  "familyreunion": "Family Reunion",
  "siblingconnection": "Sibling Connection",
  
  // Friendship Moments
  "bestfriendforever": "Best Friend Forever",
  "friendshipappreciation": "Friendship Appreciation",
  "longdistancefriendship": "Long Distance Friendship",
  
  // ========== WORK & PROFESSIONAL LIFE ==========
  
  // Career Milestones
  "graduationcelebration": "Graduation Celebration",
  "newjobcelebration": "New Job Celebration",
  "promotionsuccess": "Promotion Success",
  "retirementcelebration": "Retirement Celebration",
  
  // Professional Achievements
  "workanniversary": "Work Anniversary",
  "teamsuccess": "Team Success",
  "projectcompletion": "Project Completion",
  
  // ========== BABIES & PARENTING ==========
  
  // New Baby
  "babyshower": "Baby Shower",
  "babyarrival": "Baby Arrival",
  "genderreveal": "Gender Reveal",
  
  // Parenting Journey
  "firststeps": "First Steps",
  "firstbirthday": "First Birthday",
  "adoptioncelebration": "Adoption Celebration",
  
  // ========== PETS & ANIMAL LOVERS ==========
  
  // Companion Animals
  "furrycompanions": "Furry Companions",
  "householdfriends": "Household Friends",
  "loyalsidekicks": "Loyal Sidekicks",
  
  // Farm & Rural Life
  "barnyardcompanions": "Barnyard Companions",
  "farmanimals": "Farm Animals",
  
  // Aquatic Life
  "underwateruniverse": "Underwater Universe",
  "seaanimals": "Sea Animals",
  
  // Flying Friends
  "wingsinmotion": "Wings in Motion",
  "flyinganimals": "Flying Animals",
  
  // Wildlife
  "amazinglife": "Amazing Life",
  "wildanimals": "Wild Animals",
  
  // ========== SUPPORT, HEALING & CARE ==========
  
  // Get Well Wishes
  "getwellsoon": "Get Well Soon",
  "recoveryhealing": "Recovery & Healing",
  "hospitalsupport": "Hospital Support",
  
  // Sympathy & Condolences
  "condolencemessage": "Condolence Message",
  "sympathysupport": "Sympathy & Support",
  "memorialtribute": "Memorial Tribute",
  
  // Encouragement
  "staystrong": "Stay Strong",
  "youvegotthis": "You've Got This",
  "thinkingofyou": "Thinking of You",
  
  // ========== DIVERSITY & CONNECTION ==========
  
  // Diversity & Inclusion
  "pridecelebration": "Pride Celebration",
  "culturaldiversity": "Cultural Diversity",
  "unitymessage": "Unity Message",
  
  // Community Connection
  "neighborappreciation": "Neighbor Appreciation",
  "communitysupport": "Community Support",
  
  // ========== SPORTS ==========
  
  // Team Sports
  "teamsportsenergy": "Team Sports Energy",
  "championshipmoment": "Championship Moment",
  "victorycelebration": "Victory Celebration",
  
  // Fitness & Training
  "fitnesstrainingjourney": "Fitness & Training Journey",
  "gymmotivation": "Gym Motivation",
  "runningachievement": "Running Achievement",
  "yogapractice": "Yoga Practice",
  "marathoncompletion": "Marathon Completion",
  
  // ========== WELLNESS & MINDFUL LIVING ==========
  
  // Mental Wellness
  "meditationpractice": "Meditation Practice",
  "mindfulnessmoment": "Mindfulness Moment",
  "stressrelief": "Stress Relief",
  
  // Self-Care
  "selfcarereminder": "Self-Care Reminder",
  "relaxationtime": "Relaxation Time",
  "spaday": "Spa Day",
  
  // Healthy Living
  "healthylifestyle": "Healthy Lifestyle",
  "nutritionjourney": "Nutrition Journey",
  
  // ========== NATURE & LIFE JOURNEYS ==========
  
  // New Beginnings
  "newhomecelebration": "New Home Celebration",
  "newchapterbeginning": "New Chapter Beginning",
  "movingtoanewplace": "Moving to a New Place",
  
  // Travel & Adventure
  "traveladventure": "Travel Adventure",
  "vacationmemory": "Vacation Memory",
  "roadtrip": "Road Trip",
  
  // Nature & Outdoors
  "beautifullandscapescene": "Beautiful Landscape Scene",
  "outdooradventuremoment": "Outdoor Adventure Moment",
  "natureappreciation": "Nature Appreciation",
};

// ============================================================
// MAPEO: Subcategoría → Categoría Base
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

/**
 * Clasifica archivo por la segunda parte del nombre
 * Formato: objeto_subcategoriatodojunto_variante.mp4
 */
export function classifyByFilename(filename) {
  const nameWithoutExt = filename.replace(/\.mp4$/i, '');
  const nameWithoutVariant = nameWithoutExt.replace(/_\d+[A-Z]$/i, '');
  const parts = nameWithoutVariant.split('_').filter(Boolean);
  
  if (parts.length < 2) {
    return {
      categories: ["general"],
      subcategories: [],
      searchTerms: parts,
      object: (parts[0] || "Unknown").charAt(0).toUpperCase() + (parts[0] || "").slice(1),
    };
  }
  
  const object = parts[0];
  const subcategoryKey = parts[1].toLowerCase();
  
  const subcategoryName = FILENAME_TO_SUBCATEGORY[subcategoryKey];
  
  if (!subcategoryName) {
    console.log(`\n❌ NO ENCONTRADO: ${subcategoryKey} en ${filename}`);
    console.log(`   → Debes agregar: "${subcategoryKey}": "Nombre Subcategoría"`);
    return {
      categories: ["general"],
      subcategories: [],
      searchTerms: parts,
      object: object.charAt(0).toUpperCase() + object.slice(1),
    };
  }
  
  const category = SUBCATEGORY_TO_CATEGORY[subcategoryName];
  
  return {
    categories: [category],
    subcategories: [subcategoryName],
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
