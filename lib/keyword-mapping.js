/**
 * 🎯 MAPEO CON MÚLTIPLES CATEGORÍAS + PLURALES AUTOMÁTICOS
 * Un video puede estar en varias categorías/subcategorías a la vez
 * Los plurales se manejan automáticamente (zombie/zombies, cat/cats, etc.)
 * 
 * Formato: objeto_keywords_variante.mp4
 * Ejemplo: zombie_halloween_birthday_1A.mp4
 */

import { findInMap } from './auto-plural.js';

// ============================================================
// MAPEO: Palabra clave → Subcategorías (puede retornar ARRAY)
// ============================================================
export const KEYWORD_TO_SUBCATEGORIES = {
  // ========== OBJETOS QUE PUEDEN ESTAR EN MÚLTIPLES LUGARES ==========
  
  // Zombie: Halloween + Birthday (zombie/zombies automático)
  "zombie": ["Halloween", "Birthday Celebration"],
  
  // Ghost: Halloween + Birthday (ghost/ghosts automático)
  "ghost": ["Halloween", "Birthday Celebration"],
  
  // Pumpkin: Halloween + Thanksgiving (pumpkin/pumpkins automático)
  "pumpkin": ["Halloween", "Thanksgiving"],
  
  // ========== MAJOR HOLIDAYS ==========
  "halloween": ["Halloween"],
  "thanksgiving": ["Thanksgiving"],
  "christmas": ["Christmas"],
  "xmas": ["Christmas"],
  "easter": ["Easter"],
  "newyear": ["New Year"],
  
  // ========== CULTURAL & NATIONAL ==========
  "independenceday": ["Independence Day"],
  "july4": ["Independence Day"],
  "patrick": ["St Patrick's Day"],
  "stpatrick": ["St Patrick's Day"],
  "stpatrickday": ["St Patrick's Day"],
  "stpatricksday": ["St Patrick's Day"],
  "cincodemayo": ["Cinco de Mayo"],
  "veteransday": ["Veterans Day"],
  "diwali": ["Diwali"],
  "hanukkah": ["Hanukkah"],
  "ramadan": ["Ramadan & Eid"],
  "eid": ["Ramadan & Eid"],
  "chinesenewyear": ["Chinese New Year"],
  
  // ========== SEASONAL ==========
  "spring": ["Spring"],
  "summer": ["Summer"],
  "fall": ["Fall"],
  "autumn": ["Fall"],
  "winter": ["Winter"],
  
  // ========== LOVE DAYS ==========
  "valentine": ["Valentine's Day"],
  "valentines": ["Valentine's Day"],
  "valentinesday": ["Valentine's Day"],
  "mothersday": ["Mother's Day"],
  "fathersday": ["Father's Day"],
  
  // ========== BIRTHDAYS & CELEBRATIONS ==========
  "birthday": ["Birthday Celebration"],
  "birthdays": ["Birthday Celebration"],
  "birthdaycelebration": ["Birthday Celebration"],
  "milestone": ["Milestone Birthday"],
  "milestonebirthday": ["Milestone Birthday"],
  "kids": ["Kids Birthday Party"],
  "kidsbirthdayparty": ["Kids Birthday Party"],
  "surprise": ["Surprise Party"],
  "surpriseparty": ["Surprise Party"],
  "virtual": ["Virtual Celebration"],
  "virtualcelebration": ["Virtual Celebration"],
  
  // ========== LOVE & ROMANCE ==========
  "love": ["Love & Affection", "Romantic Moments"],
  "romance": ["Romantic Moments"],
  "romantic": ["Romantic Moments"],
  "romanticmoments": ["Romantic Moments"],
  "hug": ["Warm Hugs"],
  "hugs": ["Warm Hugs"],
  "warmhugs": ["Warm Hugs"],
  "wedding": ["Wedding Celebration"],
  "weddingcelebration": ["Wedding Celebration"],
  "engagement": ["Engagement Joy"],
  "engagementjoy": ["Engagement Joy"],
  "bridal": ["Bridal Shower"],
  "bridalshower": ["Bridal Shower"],
  "anniversary": ["Anniversary Celebration"],
  "anniversarycelebration": ["Anniversary Celebration"],
  "milestoneanniversary": ["Milestone Anniversary"],
  
  // ========== FAMILY & FRIENDSHIP ==========
  "family": ["Family Gathering"],
  "familygathering": ["Family Gathering"],
  "familyreunion": ["Family Reunion"],
  "sibling": ["Sibling Connection"],
  "siblingconnection": ["Sibling Connection"],
  "friend": ["Best Friend Forever", "Friendship Appreciation"],
  "friendship": ["Friendship Appreciation"],
  "bestfriend": ["Best Friend Forever"],
  "bestfriendforever": ["Best Friend Forever"],
  "friendshipappreciation": ["Friendship Appreciation"],
  "longdistance": ["Long Distance Friendship"],
  
  // ========== WORK ==========
  "graduation": ["Graduation Celebration"],
  "graduate": ["Graduation Celebration"],
  "newjob": ["New Job Celebration"],
  "promotion": ["Promotion Success"],
  "promotionsuccess": ["Promotion Success"],
  "retirement": ["Retirement Celebration"],
  "retirementcelebration": ["Retirement Celebration"],
  "workanniversary": ["Work Anniversary"],
  "team": ["Team Success"],
  "teamsuccess": ["Team Success"],
  "project": ["Project Completion"],
  
  // ========== BABIES & PARENTING ==========
  "baby": ["Baby Shower", "Baby Arrival"],
  "babyshower": ["Baby Shower"],
  "babyarrival": ["Baby Arrival"],
  "gender": ["Gender Reveal"],
  "genderreveal": ["Gender Reveal"],
  "firststeps": ["First Steps"],
  "firstbirthday": ["First Birthday"],
  "adoption": ["Adoption Celebration"],
  
  // ========== PETS & ANIMALS ==========
  "dog": ["Furry Companions"],
  "dogs": ["Furry Companions"],
  "cat": ["Household Friends"],
  "cats": ["Household Friends"],
  "pet": ["Furry Companions"],
  "pets": ["Furry Companions"],
  "furry": ["Furry Companions"],
  "furrycompanions": ["Furry Companions"],
  "householdfriends": ["Household Friends"],
  "farm": ["Barnyard Companions"],
  "farmanimals": ["Barnyard Companions"],
  "barnyardcompanions": ["Barnyard Companions"],
  "fish": ["Underwater Universe"],
  "turtle": ["Underwater Universe"],
  "turtles": ["Underwater Universe"],
  "underwater": ["Underwater Universe"],
  "seaanimals": ["Sea Animals"],
  "bird": ["Wings in Motion"],
  "birds": ["Wings in Motion"],
  "flying": ["Wings in Motion"],
  "wildlife": ["Amazing Life"],
  "wild": ["Wild Animals"],
  
  // ========== SUPPORT & CARE ==========
  "getwell": ["Get Well Soon"],
  "getwellsoon": ["Get Well Soon"],
  "recovery": ["Recovery & Healing"],
  "hospital": ["Hospital Support"],
  "condolence": ["Condolence Message"],
  "sympathy": ["Sympathy & Support"],
  "memorial": ["Memorial Tribute"],
  "strong": ["Stay Strong"],
  "staystrong": ["Stay Strong"],
  "thinking": ["Thinking of You"],
  
  // ========== DIVERSITY & CONNECTION ==========
  "pride": ["Pride Celebration"],
  "diversity": ["Cultural Diversity"],
  "unity": ["Unity Message"],
  "neighbor": ["Neighbor Appreciation"],
  "community": ["Community Support"],
  
  // ========== SPORTS ==========
  "sport": ["Team Sports Energy"],
  "sports": ["Team Sports Energy"],
  "championship": ["Championship Moment"],
  "victory": ["Victory Celebration"],
  "fitness": ["Fitness & Training Journey"],
  "gym": ["Gym Motivation"],
  "running": ["Running Achievement"],
  "yoga": ["Yoga Practice"],
  "marathon": ["Marathon Completion"],
  
  // ========== WELLNESS ==========
  "meditation": ["Meditation Practice"],
  "mindfulness": ["Mindfulness Moment"],
  "stress": ["Stress Relief"],
  "selfcare": ["Self-Care Reminder"],
  "relaxation": ["Relaxation Time"],
  "spa": ["Spa Day"],
  "healthy": ["Healthy Lifestyle"],
  "nutrition": ["Nutrition Journey"],
  
  // ========== NATURE & LIFE JOURNEYS ==========
  "home": ["New Home Celebration"],
  "newhome": ["New Home Celebration"],
  "newbeginning": ["New Chapter Beginning"],
  "moving": ["Moving to a New Place"],
  "travel": ["Travel Adventure"],
  "vacation": ["Vacation Memory"],
  "roadtrip": ["Road Trip"],
  "landscape": ["Beautiful Landscape Scene"],
  "outdoor": ["Outdoor Adventure Moment"],
  "nature": ["Nature Appreciation"],
  "desert": ["Beautiful Landscape Scene", "Outdoor Adventure Moment"],
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
 * 🔥 CLASIFICACIÓN CON MÚLTIPLES CATEGORÍAS + PLURALES AUTOMÁTICOS
 * Analiza TODAS las palabras del nombre del archivo
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
  
  // 🔥 ANALIZAR TODAS LAS PALABRAS (no solo la segunda)
  parts.forEach((part, index) => {
    if (index === 0) return; // Saltar el objeto
    
    const keyword = part.toLowerCase();
    
    // 🔄 Buscar con plurales automáticos
    const subcats = findInMap(keyword, KEYWORD_TO_SUBCATEGORIES);
    
    if (subcats) {
      // Agregar todas las subcategorías asociadas a esta palabra
      subcats.forEach(sub => {
        allSubcategories.add(sub);
        
        // Agregar la categoría base correspondiente
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
