/**
 * 🎯 MAPEO COMPLETO Y DEFINITIVO DE KEYWORDS
 * 
 * Sistema de nombres de archivo:
 * [objeto]_[subcategoría]_[variante].mp4
 * 
 * Ejemplos:
 * - zombie_halloween_1A.mp4
 * - heart_loveaffection_2A.mp4
 * - trophy_victorycelebration_1A.mp4
 * 
 * El objeto NO influye en la clasificación
 * El variante (1A, 2A, etc.) es solo para diferenciar diseños
 * La subcategoría (segunda parte) ES la que determina la clasificación
 */

import { findInMap } from './auto-plural.js';

// ============================================================
// MAPEO COMPLETO: Keyword → Subcategoría
// Incluye TODAS las subcategorías en versión "pegada"
// ============================================================
export const KEYWORD_TO_SUBCATEGORIES = {
  
  // ============================================================
  // SEASONAL & GLOBAL CELEBRATIONS
  // ============================================================
  
  // Major Holidays
  "halloween": ["Halloween"],
  "thanksgiving": ["Thanksgiving"],
  "christmas": ["Christmas"],
  "xmas": ["Christmas"],
  "easter": ["Easter"],
  "newyear": ["New Year"],
  
  // Cultural & National Celebrations
  "independenceday": ["Independence Day"],
  "july4": ["Independence Day"],
  "stpatrickday": ["St Patrick's Day"],
  "stpatricksday": ["St Patrick's Day"],
  "cincodemayo": ["Cinco de Mayo"],
  "veteransday": ["Veterans Day"],
  "diwali": ["Diwali"],
  "hanukkah": ["Hanukkah"],
  "ramadan": ["Ramadan & Eid"],
  "eid": ["Ramadan & Eid"],
  "chinesenewyear": ["Chinese New Year"],
  
  // Seasonal Moments
  "spring": ["Spring"],
  "summer": ["Summer"],
  "fall": ["Fall"],
  "autumn": ["Fall"],
  "winter": ["Winter"],
  
  // Love Days
  "valentinesday": ["Valentine's Day"],
  "valentine": ["Valentine's Day"],
  "valentines": ["Valentine's Day"],
  "mothersday": ["Mother's Day"],
  "fathersday": ["Father's Day"],
  
  // ============================================================
  // BIRTHDAYS & CELEBRATIONS
  // ============================================================
  
  "birthdaycelebration": ["Birthday Celebration"],
  "birthday": ["Birthday Celebration"],
  "milestonebirthday": ["Milestone Birthday"],
  "kidsbirthdayparty": ["Kids Birthday Party"],
  "surpriseparty": ["Surprise Party"],
  "virtualcelebration": ["Virtual Celebration"],
  
  // ============================================================
  // LOVE, WEDDINGS & ANNIVERSARIES
  // ============================================================
  
  // Love & Affection
  "loveaffection": ["Love & Affection"],
  "love": ["Love & Affection"],
  "warmhugs": ["Warm Hugs"],
  "hugs": ["Warm Hugs"],
  "romanticmoments": ["Romantic Moments"],
  "romantic": ["Romantic Moments"],
  "romance": ["Romantic Moments"],
  
  // Wedding Journey
  "weddingcelebration": ["Wedding Celebration"],
  "wedding": ["Wedding Celebration"],
  "engagementjoy": ["Engagement Joy"],
  "engagement": ["Engagement Joy"],
  "bridalshower": ["Bridal Shower"],
  "bridal": ["Bridal Shower"],
  
  // Anniversary Milestones
  "anniversarycelebration": ["Anniversary Celebration"],
  "anniversary": ["Anniversary Celebration"],
  "milestoneanniversary": ["Milestone Anniversary"],
  
  // ============================================================
  // FAMILY & FRIENDSHIP
  // ============================================================
  
  // Family Bonds
  "familygathering": ["Family Gathering"],
  "family": ["Family Gathering"],
  "familyreunion": ["Family Reunion"],
  "siblingconnection": ["Sibling Connection"],
  "sibling": ["Sibling Connection"],
  
  // Friendship Moments
  "bestfriendforever": ["Best Friend Forever"],
  "bestfriend": ["Best Friend Forever"],
  "friendshipappreciation": ["Friendship Appreciation"],
  "friendship": ["Friendship Appreciation"],
  "longdistancefriendship": ["Long Distance Friendship"],
  
  // ============================================================
  // WORK & PROFESSIONAL LIFE
  // ============================================================
  
  // Career Milestones
  "graduationcelebration": ["Graduation Celebration"],
  "graduation": ["Graduation Celebration"],
  "newjobcelebration": ["New Job Celebration"],
  "newjob": ["New Job Celebration"],
  "promotionsuccess": ["Promotion Success"],
  "promotion": ["Promotion Success"],
  "retirementcelebration": ["Retirement Celebration"],
  "retirement": ["Retirement Celebration"],
  
  // Professional Achievements
  "workanniversary": ["Work Anniversary"],
  "teamsuccess": ["Team Success"],
  "team": ["Team Success"],
  "projectcompletion": ["Project Completion"],
  "project": ["Project Completion"],
  
  // ============================================================
  // BABIES & PARENTING
  // ============================================================
  
  // New Baby
  "babyshower": ["Baby Shower"],
  "babyarrival": ["Baby Arrival"],
  "baby": ["Baby Arrival"],
  "genderreveal": ["Gender Reveal"],
  "gender": ["Gender Reveal"],
  
  // Parenting Journey
  "firststeps": ["First Steps"],
  "firstbirthday": ["First Birthday"],
  "adoptioncelebration": ["Adoption Celebration"],
  "adoption": ["Adoption Celebration"],
  
  // ============================================================
  // PETS & ANIMAL LOVERS
  // ============================================================
  
  // Companion Animals
  "furrycompanions": ["Furry Companions"],
  "furry": ["Furry Companions"],
  "householdfriends": ["Household Friends"],
  "loyalsidekicks": ["Loyal Sidekicks"],
  
  // Farm & Rural Life
  "barnyardcompanions": ["Barnyard Companions"],
  "barnyard": ["Barnyard Companions"],
  "farmanimals": ["Farm Animals"],
  "farm": ["Farm Animals"],
  
  // Aquatic Life
  "underwateruniverse": ["Underwater Universe"],
  "underwater": ["Underwater Universe"],
  "seaanimals": ["Sea Animals"],
  "sea": ["Sea Animals"],
  
  // Flying Friends
  "wingsinmotion": ["Wings in Motion"],
  "wings": ["Wings in Motion"],
  "flyinganimals": ["Flying Animals"],
  "flying": ["Flying Animals"],
  
  // Wildlife
  "amazinglife": ["Amazing Life"],
  "wildanimals": ["Wild Animals"],
  "wild": ["Wild Animals"],
  
  // Common animals (can appear in multiple contexts)
  "dog": ["Furry Companions"],
  "dogs": ["Furry Companions"],
  "cat": ["Household Friends"],
  "cats": ["Household Friends"],
  "pet": ["Furry Companions"],
  "pets": ["Furry Companions"],
  "fish": ["Underwater Universe"],
  "turtle": ["Underwater Universe"],
  "turtles": ["Underwater Universe"],
  "bird": ["Wings in Motion"],
  "birds": ["Wings in Motion"],
  
  // ============================================================
  // SUPPORT, HEALING & CARE
  // ============================================================
  
  // Get Well Wishes
  "getwellsoon": ["Get Well Soon"],
  "getwell": ["Get Well Soon"],
  "recoveryhealing": ["Recovery & Healing"],
  "recovery": ["Recovery & Healing"],
  "hospitalsupport": ["Hospital Support"],
  "hospital": ["Hospital Support"],
  
  // Sympathy & Condolences
  "condolencemessage": ["Condolence Message"],
  "condolence": ["Condolence Message"],
  "sympathysupport": ["Sympathy & Support"],
  "sympathy": ["Sympathy & Support"],
  "memorialtribute": ["Memorial Tribute"],
  "memorial": ["Memorial Tribute"],
  
  // Encouragement
  "staystrong": ["Stay Strong"],
  "strong": ["Stay Strong"],
  "youvegotthis": ["You've Got This"],
  "thinkingofyou": ["Thinking of You"],
  "thinking": ["Thinking of You"],
  
  // ============================================================
  // DIVERSITY & CONNECTION (HEAR EVERY HEART)
  // ============================================================
  
  // Diversity & Inclusion
  "pridecelebration": ["Pride Celebration"],
  "pride": ["Pride Celebration"],
  "culturaldiversity": ["Cultural Diversity"],
  "diversity": ["Cultural Diversity"],
  "unitymessage": ["Unity Message"],
  "unity": ["Unity Message"],
  
  // Community Connection
  "neighborappreciation": ["Neighbor Appreciation"],
  "neighbor": ["Neighbor Appreciation"],
  "communitysupport": ["Community Support"],
  "community": ["Community Support"],
  
  // ============================================================
  // SPORTS
  // ============================================================
  
  // Team Sports
  "teamsportsenergy": ["Team Sports Energy"],
  "sports": ["Team Sports Energy"],
  "sport": ["Team Sports Energy"],
  "championshipmoment": ["Championship Moment"],
  "championship": ["Championship Moment"],
  "victorycelebration": ["Victory Celebration"],
  "victory": ["Victory Celebration"],
  
  // Fitness & Training
  "fitnesstrainingjourney": ["Fitness & Training Journey"],
  "fitness": ["Fitness & Training Journey"],
  "gymmotivation": ["Gym Motivation"],
  "gym": ["Gym Motivation"],
  "runningachievement": ["Running Achievement"],
  "running": ["Running Achievement"],
  "yogapractice": ["Yoga Practice"],
  "yoga": ["Yoga Practice"],
  "marathoncompletion": ["Marathon Completion"],
  "marathon": ["Marathon Completion"],
  
  // ============================================================
  // WELLNESS & MINDFUL LIVING
  // ============================================================
  
  // Mental Wellness
  "meditationpractice": ["Meditation Practice"],
  "meditation": ["Meditation Practice"],
  "mindfulnessmoment": ["Mindfulness Moment"],
  "mindfulness": ["Mindfulness Moment"],
  "stressrelief": ["Stress Relief"],
  "stress": ["Stress Relief"],
  
  // Self-Care
  "selfcarereminder": ["Self-Care Reminder"],
  "selfcare": ["Self-Care Reminder"],
  "relaxationtime": ["Relaxation Time"],
  "relaxation": ["Relaxation Time"],
  "spaday": ["Spa Day"],
  "spa": ["Spa Day"],
  
  // Healthy Living
  "healthylifestyle": ["Healthy Lifestyle"],
  "healthy": ["Healthy Lifestyle"],
  "nutritionjourney": ["Nutrition Journey"],
  "nutrition": ["Nutrition Journey"],
  
  // ============================================================
  // NATURE & LIFE JOURNEYS
  // ============================================================
  
  // New Beginnings
  "newhomecelebration": ["New Home Celebration"],
  "newhome": ["New Home Celebration"],
  "home": ["New Home Celebration"],
  "newchapterbeginning": ["New Chapter Beginning"],
  "newchapter": ["New Chapter Beginning"],
  "movingtoanewplace": ["Moving to a New Place"],
  "moving": ["Moving to a New Place"],
  
  // Travel & Adventure
  "traveladventure": ["Travel Adventure"],
  "travel": ["Travel Adventure"],
  "vacationmemory": ["Vacation Memory"],
  "vacation": ["Vacation Memory"],
  "roadtrip": ["Road Trip"],
  
  // Nature & Outdoors
  "beautifullandscapescene": ["Beautiful Landscape Scene"],
  "landscape": ["Beautiful Landscape Scene"],
  "outdooradventuremoment": ["Outdoor Adventure Moment"],
  "outdoor": ["Outdoor Adventure Moment"],
  "adventure": ["Outdoor Adventure Moment"],
  "natureappreciation": ["Nature Appreciation"],
  "nature": ["Nature Appreciation"],
  
  // Common landscape objects
  "desert": ["Beautiful Landscape Scene"],
  "mountain": ["Beautiful Landscape Scene"],
  "mountains": ["Beautiful Landscape Scene"],
  "forest": ["Beautiful Landscape Scene"],
  "beach": ["Beautiful Landscape Scene"],
  "ocean": ["Beautiful Landscape Scene"],
  "city": ["Beautiful Landscape Scene"],
  "countryside": ["Beautiful Landscape Scene"],
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
 * 🔥 CLASIFICACIÓN AUTOMÁTICA
 * Analiza el nombre del archivo y extrae la subcategoría
 */
export function classifyByFilename(filename) {
  const nameWithoutExt = filename.replace(/\.mp4$/i, '');
  const nameWithoutVariant = nameWithoutExt.replace(/_\d+[A-Z]$/i, '');
  const parts = nameWithoutVariant.split('_').filter(Boolean);
  
  if (parts.length === 0) {
    return {
      categories: ["general"],
      subcategories: [],
      searchTerms: [],
      object: "Unknown",
    };
  }
  
  const object = parts[0];
  const allSubcategories = new Set();
  const allCategories = new Set();
  
  // Analizar TODAS las palabras (especialmente la segunda que es la subcategoría)
  parts.forEach((part, index) => {
    if (index === 0) return; // Saltar el objeto
    
    const keyword = part.toLowerCase();
    
    // Buscar con soporte de plurales automáticos
    const subcats = findInMap(keyword, KEYWORD_TO_SUBCATEGORIES);
    
    if (subcats) {
      subcats.forEach(sub => {
        allSubcategories.add(sub);
        
        const category = SUBCATEGORY_TO_CATEGORY[sub];
        if (category) {
          allCategories.add(category);
        }
      });
    }
  });
  
  // Si no se encontró nada, retornar general
  if (allSubcategories.size === 0) {
    console.log(`\n⚠️ NO CLASIFICADO: ${filename}`);
    console.log(`   Palabras: ${parts.join(", ")}`);
    console.log(`   💡 Agrega la keyword "${parts[1]}" al mapeo`);
    return {
      categories: ["general"],
      subcategories: [],
      searchTerms: parts,
      object: object.charAt(0).toUpperCase() + object.slice(1),
    };
  }
  
  return {
    categories: [...allCategories],
    subcategories: [...allSubcategories],
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
