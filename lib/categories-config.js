/**
 * 🗂️ CONFIGURACIÓN DE CATEGORÍAS Y SUBCATEGORÍAS
 * Define las 12 categorías base y sus subcategorías agrupadas
 */

export const BASE_CATEGORIES = [
  { name: "Holidays", emoji: "🎉", slug: "seasonal-global-celebrations" },
  { name: "Celebrations", emoji: "🎂", slug: "birthdays-celebrations" },
  { name: "Love & Romance", emoji: "💝", slug: "love-weddings-anniversaries" },
  { name: "Family & Friendship", emoji: "🫶", slug: "family-friendship" },
  { name: "Work & Professional Life", emoji: "💼", slug: "work" },
  { name: "Babies & Parenting", emoji: "🧸", slug: "babies-parenting" },
  { name: "Animal Lovers", emoji: "🐾", slug: "pets-animal-lovers" },
  { name: "Support, Healing & Care", emoji: "🕊️", slug: "support-healing-care" },
  { name: "Connection", emoji: "🧩", slug: "hear-every-heart" },
  { name: "Sports", emoji: "🏟️", slug: "sports" },
  { name: "Wellness & Mindful Living", emoji: "🕯️", slug: "wellness-mindful-living" },
  { name: "Nature & Life Journeys", emoji: "🏕️", slug: "life-journeys-transitions" },
];

export const SUBCATEGORY_GROUPS = {
  "seasonal-global-celebrations": {
    "Major Holidays": [
      "Halloween",
      "Thanksgiving",
      "Christmas",
      "Easter",
      "New Year",
    ],
    "Cultural & National Celebrations": [
      "Independence Day",
      "St Patrick's Day",
      "Cinco de Mayo",
      "Veterans Day",
      "Diwali",
      "Hanukkah",
      "Ramadan & Eid",
      "Chinese New Year",
    ],
    "Seasonal Moments": [
      "Spring",
      "Summer",
      "Fall",
      "Winter",
    ],
    "Love Days": [
      "Valentine's Day",
      "Mother's Day",
      "Father's Day",
    ],
  },
  
  "birthdays-celebrations": {
    "Birthday Celebrations": [
      "Birthday Celebration",
      "Milestone Birthday",
      "Kids Birthday Party",
    ],
    "Special Moments": [
      "Surprise Party",
      "Virtual Celebration",
    ],
  },
  
  "love-weddings-anniversaries": {
    "Love & Affection": [
      "Love & Affection",
      "Warm Hugs",
      "Romantic Moments",
    ],
    "Wedding Journey": [
      "Wedding Celebration",
      "Engagement Joy",
      "Bridal Shower",
    ],
    "Anniversary Milestones": [
      "Anniversary Celebration",
      "Milestone Anniversary",
    ],
  },
  
  "family-friendship": {
    "Family Bonds": [
      "Family Gathering",
      "Family Reunion",
      "Sibling Connection",
    ],
    "Friendship Moments": [
      "Best Friend Forever",
      "Friendship Appreciation",
      "Long Distance Friendship",
    ],
  },
  
  "work": {
    "Career Milestones": [
      "Graduation Celebration",
      "New Job Celebration",
      "Promotion Success",
      "Retirement Celebration",
    ],
    "Professional Achievements": [
      "Work Anniversary",
      "Team Success",
      "Project Completion",
    ],
  },
  
  "babies-parenting": {
    "New Baby": [
      "Baby Shower",
      "Baby Arrival",
      "Gender Reveal",
    ],
    "Parenting Journey": [
      "First Steps",
      "First Birthday",
      "Adoption Celebration",
    ],
  },
  
  "pets-animal-lovers": {
    "Companion Animals": [
      "Furry Companions",
      "Household Friends",
      "Loyal Sidekicks",
    ],
    "Farm & Rural Life": [
      "Barnyard Companions",
      "Farm Animals",
    ],
    "Aquatic Life": [
      "Underwater Universe",
      "Sea Animals",
    ],
    "Flying Friends": [
      "Wings in Motion",
      "Flying Animals",
    ],
    "Wildlife": [
      "Amazing Life",
      "Wild Animals",
    ],
  },
  
  "support-healing-care": {
    "Get Well Wishes": [
      "Get Well Soon",
      "Recovery & Healing",
      "Hospital Support",
    ],
    "Sympathy & Condolences": [
      "Condolence Message",
      "Sympathy & Support",
      "Memorial Tribute",
    ],
    "Encouragement": [
      "Stay Strong",
      "You've Got This",
      "Thinking of You",
    ],
  },
  
  "hear-every-heart": {
    "Diversity & Inclusion": [
      "Pride Celebration",
      "Cultural Diversity",
      "Unity Message",
    ],
    "Community Connection": [
      "Neighbor Appreciation",
      "Community Support",
    ],
  },
  
  "sports": {
    "Team Sports": [
      "Team Sports Energy",
      "Championship Moment",
      "Victory Celebration",
      "Soccer",
      "Basketball",
      "Baseball",
      "Football",
      "Hockey",
      "Volleyball",
      "Tennis",
    ],
    "Individual Sports": [
      "Golf",
      "Swimming",
      "Track and Field",
      "Gymnastics",
      "Martial Arts",
    ],
    "Fitness & Training": [
      "Fitness & Training Journey",
      "Gym Motivation",
      "Running Achievement",
      "Yoga Practice",
      "Marathon Completion",
    ],
  },
  
  "wellness-mindful-living": {
    "Mental Wellness": [
      "Meditation Practice",
      "Mindfulness Moment",
      "Stress Relief",
    ],
    "Self-Care": [
      "Self-Care Reminder",
      "Relaxation Time",
      "Spa Day",
    ],
    "Healthy Living": [
      "Healthy Lifestyle",
      "Nutrition Journey",
    ],
  },
  
  "life-journeys-transitions": {
    "New Beginnings": [
      "New Home Celebration",
      "New Chapter Beginning",
      "Moving to a New Place",
    ],
    "Travel & Adventure": [
      "Travel Adventure",
      "Vacation Memory",
      "Road Trip",
    ],
    "Nature & Outdoors": [
      "Beautiful Landscape Scene",
      "Outdoor Adventure Moment",
      "Nature Appreciation",
    ],
  },
};
