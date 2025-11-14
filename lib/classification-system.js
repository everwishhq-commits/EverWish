/**
 * 🎯 SISTEMA DE CLASIFICACIÓN EXPANDIDO V14.0
 * Categorías ampliadas con más celebraciones y momentos
 */

export const BASE_CATEGORIES = [
  { name: "Holidays & Celebrations", emoji: "🎉", slug: "seasonal-global-celebrations" },
  { name: "Birthdays & Parties", emoji: "🎂", slug: "birthdays-celebrations" },
  { name: "Love & Romance", emoji: "💝", slug: "love-weddings-anniversaries" },
  { name: "Family & Friendship", emoji: "🫶", slug: "family-friendship" },
  { name: "Work & Education", emoji: "💼", slug: "work" },
  { name: "Babies & Parenting", emoji: "🧸", slug: "babies-parenting" },
  { name: "Animal Lovers", emoji: "🐾", slug: "pets-animal-lovers" },
  { name: "Support & Care", emoji: "🕊️", slug: "support-healing-care" },
  { name: "Diversity & Unity", emoji: "🧩", slug: "hear-every-heart" },
  { name: "Sports & Fitness", emoji: "🏟️", slug: "sports" },
  { name: "Wellness & Mindfulness", emoji: "🕯️", slug: "wellness-mindful-living" },
  { name: "Life Journeys", emoji: "🏕️", slug: "life-journeys-transitions" },
];

export const SUBCATEGORY_GROUPS = {
  "seasonal-global-celebrations": {
    "Holiday Seasons": [
      "New Year",
      "New Year's Eve",
      "Lunar New Year",
      "Chinese New Year",
      "Spring Festival",
      "Halloween",
      "Thanksgiving",
      "Christmas",
      "Christmas Eve",
      "Easter",
      "St Patrick's Day",
      "Mardi Gras",
      "Cinco de Mayo"
    ],
    "Cultural & Religious Days": [
      "Valentine's Day",
      "Hanukkah",
      "Diwali",
      "Ramadan",
      "Eid",
      "Rosh Hashanah",
      "Yom Kippur",
      "Passover",
      "Day of the Dead",
      "Día de Muertos",
      "Carnival",
      "Kwanzaa",
      "Orthodox Easter",
      "Oktoberfest",
      "Songkran",
      "Mid-Autumn Festival",
      "Moon Festival",
      "Dragon Boat Festival",
      "Vesak",
      "Loy Krathong",
      "Holi",
      "Nowruz",
      "Persian New Year",
      "La Tomatina",
      "San Fermin",
      "Running of the Bulls",
      "Bastille Day",
      "Guy Fawkes Night",
      "Burns Night",
      "Anzac Day",
      "Canada Day",
      "Australia Day",
      "Boxing Day",
      "Epiphany",
      "Three Kings Day",
      "Corpus Christi",
      "All Saints Day",
      "Assumption Day"
    ],
    "International Days (Celebrated Worldwide)": [
      "Mother's Day",
      "Father's Day",
      "Women's Day",
      "Children's Day",
      "Friendship Day",
      "Teachers Day",
      "Nurses Day",
      "World Peace Day",
      "New Year's Day",
      "Halloween Worldwide"
    ],
    "National & Civic Days (USA)": [
      "Independence Day",
      "Fourth of July",
      "Memorial Day",
      "Veterans Day",
      "Labor Day",
      "MLK Day",
      "Presidents Day",
      "Columbus Day",
      "Flag Day",
      "Constitution Day"
    ],
    "Family & Appreciation Days": [
      "Grandparents Day",
      "Siblings Day",
      "Administrative Professionals Day",
      "Secretary's Day",
      "Teacher Appreciation Day",
      "Boss Day",
      "Military Appreciation"
    ],
    "Awareness & Causes": [
      "Pride Month",
      "International Women's Day",
      "Earth Day",
      "World Mental Health Day",
      "Breast Cancer Awareness",
      "Autism Awareness",
      "Black History Month",
      "Hispanic Heritage Month",
      "Asian Pacific Heritage Month",
      "World Health Day",
      "World Environment Day",
      "Human Rights Day"
    ],
    "Seasonal": [
      "Spring",
      "Summer",
      "Fall",
      "Autumn",
      "Winter",
      "First Day of Spring",
      "First Day of Summer",
      "First Day of Fall",
      "First Day of Winter"
    ]
  },

  "birthdays-celebrations": {
    "Birthday Milestones (Global)": [
      "Birthday",
      "Happy Birthday",
      "First Birthday",
      "Quinceañera",
      "Sweet 16",
      "18th Birthday",
      "21st Birthday",
      "30th Birthday",
      "40th Birthday",
      "50th Birthday",
      "60th Birthday",
      "70th Birthday",
      "80th Birthday",
      "Over the Hill"
    ],
    "Celebrations & Events": [
      "Party",
      "Surprise Party",
      "Gender Reveal",
      "Baby Shower",
      "Bridal Shower",
      "Celebration"
    ]
  },

  "love-weddings-anniversaries": {
    "Romance & Dating": [
      "Love",
      "Hugs",
      "Romantic",
      "First Date",
      "I Love You"
    ],
    "Wedding & Engagement": [
      "Wedding",
      "Engagement",
      "Proposal",
      "Bachelor Party",
      "Bachelorette Party"
    ],
    "Anniversaries": [
      "Anniversary",
      "Paper Anniversary",
      "Silver Anniversary",
      "Golden Anniversary"
    ]
  },

  "family-friendship": {
    "Family Moments (Global)": [
      "Mother's Day",
      "Father's Day",
      "Parents Day",
      "Grandparents Day",
      "Family Reunion",
      "Siblings Day",
      "Daughter's Day",
      "Son's Day",
      "Children's Day",
      "Family Time",
      "Family Love"
    ],
    "Friendship (Global)": [
      "Friends",
      "Best Friends",
      "Friendship Day",
      "Thank You Friend",
      "Forever Friends",
      "BFF"
    ]
  },

  "work": {
    "Career Achievements (Global)": [
      "New Job",
      "First Day at Work",
      "Promotion",
      "Retirement",
      "Work Anniversary",
      "Employee of the Month",
      "Boss Day",
      "Professionals Day",
      "Career Success"
    ],
    "Education & Learning (Global)": [
      "Graduation",
      "High School Graduation",
      "College Graduation",
      "University Graduation",
      "School",
      "Teacher Appreciation",
      "Teachers Day",
      "Back to School",
      "First Day of School",
      "Last Day of School",
      "Good Grades",
      "Exam Success"
    ]
  },

  "babies-parenting": {
    "Baby Milestones (Global)": [
      "Newborn",
      "New Baby",
      "Baby Shower",
      "Pregnancy Announcement",
      "We're Pregnant",
      "Gender Reveal",
      "It's a Boy",
      "It's a Girl",
      "Twins",
      "First Steps",
      "First Words",
      "First Birthday",
      "First Tooth"
    ],
    "Parenting Moments (Global)": [
      "Mom Life",
      "Dad Life",
      "Parent Pride",
      "Adoption",
      "Foster Care",
      "New Parents",
      "Parenthood"
    ]
  },

  "pets-animal-lovers": {
    "Companion Animals": [
      "Dogs",
      "Cats",
      "Puppies",
      "Kittens",
      "Pet Adoption",
      "Pet Birthday"
    ],
    "Sea Animals": [
      "Sea Animals",
      "Ocean Life",
      "Marine Animals"
    ],
    "Farm Animals": [
      "Farm Animals",
      "Barnyard Friends"
    ],
    "Flying Animals": [
      "Birds",
      "Flying Animals",
      "Butterflies"
    ],
    "Wild Animals": [
      "Wild Animals",
      "Safari Animals",
      "Forest Animals"
    ]
  },

  "support-healing-care": {
    "Support & Encouragement": [
      "Get Well",
      "Get Well Soon",
      "Thinking of You",
      "Recovery",
      "Cheer Up",
      "You Got This",
      "Stay Strong",
      "Hang in There",
      "Feel Better",
      "Speedy Recovery"
    ],
    "Sympathy & Remembrance": [
      "Condolences",
      "Loss",
      "In Memory",
      "Sympathy",
      "With Deepest Sympathy",
      "Rest in Peace"
    ],
    "Emotional Support": [
      "I'm Here For You",
      "Sending Love",
      "Comfort",
      "Hope",
      "Strength"
    ]
  },

  "hear-every-heart": {
    "Diversity & Inclusion": [
      "Inclusivity",
      "Unity",
      "Peace",
      "For Everyone",
      "Pride",
      "Cultural Celebration",
      "Together",
      "Equality",
      "Acceptance"
    ],
    "Emotions & Feelings": [
      "I'm Sorry",
      "Forgive Me",
      "Miss You",
      "Thinking of You",
      "You're Special",
      "You Matter",
      "You're Amazing",
      "Believe in Yourself",
      "I'm Proud of You",
      "You're Not Alone"
    ]
  },

  "sports": {
    "Team Sports": [
      "Soccer",
      "Basketball",
      "Football",
      "Baseball",
      "Hockey",
      "Volleyball"
    ],
    "Fitness & Activities": [
      "Gym",
      "Yoga",
      "Running",
      "Training",
      "Marathon",
      "Cycling"
    ]
  },

  "wellness-mindful-living": {
    "Wellness & Self-Care": [
      "Self-Care",
      "Meditation",
      "Mindfulness",
      "Inner Peace",
      "Relaxation",
      "Mental Health"
    ]
  },

  "life-journeys-transitions": {
    "New Beginnings": [
      "New Home",
      "Moving",
      "Housewarming",
      "New Chapter",
      "Fresh Start"
    ],
    "Everyday Moments": [
      "Thank You",
      "Just Because",
      "Apology",
      "Congratulations",
      "Good Luck",
      "Bon Voyage",
      "Miss You"
    ]
  }
};

// 🎯 MAPEO DIRECTO ACTUALIZADO (palabra → categoría)
const DIRECT_CATEGORY_MAP = {
  // 🎉 Holidays & Celebrations (EXPANDIDO)
  newyear: "seasonal-global-celebrations",
  newyearseve: "seasonal-global-celebrations",
  lunarnewyear: "seasonal-global-celebrations",
  chinesenewyear: "seasonal-global-celebrations",
  springfestival: "seasonal-global-celebrations",
  halloween: "seasonal-global-celebrations",
  christmas: "seasonal-global-celebrations",
  xmas: "seasonal-global-celebrations",
  christmaseve: "seasonal-global-celebrations",
  thanksgiving: "seasonal-global-celebrations",
  easter: "seasonal-global-celebrations",
  stpatricksday: "seasonal-global-celebrations",
  stpatricks: "seasonal-global-celebrations",
  mardigras: "seasonal-global-celebrations",
  cincodemayo: "seasonal-global-celebrations",
  valentine: "seasonal-global-celebrations",
  valentines: "seasonal-global-celebrations",
  valentinesday: "seasonal-global-celebrations",
  hanukkah: "seasonal-global-celebrations",
  diwali: "seasonal-global-celebrations",
  ramadan: "seasonal-global-celebrations",
  eid: "seasonal-global-celebrations",
  roshhashanah: "seasonal-global-celebrations",
  yomkippur: "seasonal-global-celebrations",
  passover: "seasonal-global-celebrations",
  dayofthedead: "seasonal-global-celebrations",
  carnival: "seasonal-global-celebrations",
  kwanzaa: "seasonal-global-celebrations",
  orthodoxeaster: "seasonal-global-celebrations",
  
  // 🇺🇸 USA National Days
  july4: "seasonal-global-celebrations",
  fourthofjuly: "seasonal-global-celebrations",
  independenceday: "seasonal-global-celebrations",
  memorialday: "seasonal-global-celebrations",
  veteransday: "seasonal-global-celebrations",
  laborday: "seasonal-global-celebrations",
  mlkday: "seasonal-global-celebrations",
  mlk: "seasonal-global-celebrations",
  presidentsday: "seasonal-global-celebrations",
  columbusday: "seasonal-global-celebrations",
  flagday: "seasonal-global-celebrations",
  constitutionday: "seasonal-global-celebrations",
  
  // 👪 Family & Appreciation Days
  mothersday: "seasonal-global-celebrations",
  fathersday: "seasonal-global-celebrations",
  grandparentsday: "seasonal-global-celebrations",
  siblingsday: "seasonal-global-celebrations",
  secretaryday: "seasonal-global-celebrations",
  bossday: "seasonal-global-celebrations",
  nursesday: "seasonal-global-celebrations",
  teacherappreciation: "seasonal-global-celebrations",
  militaryappreciation: "seasonal-global-celebrations",
  
  // 🏳️‍🌈 Awareness & Heritage
  pridemonth: "seasonal-global-celebrations",
  pride: "seasonal-global-celebrations",
  womensday: "seasonal-global-celebrations",
  earthday: "seasonal-global-celebrations",
  mentalhealthday: "seasonal-global-celebrations",
  breastcancerawareness: "seasonal-global-celebrations",
  autismawareness: "seasonal-global-celebrations",
  blackhistorymonth: "seasonal-global-celebrations",
  hispanicheritage: "seasonal-global-celebrations",
  asianpacificheritage: "seasonal-global-celebrations",
  
  // 🌸 Seasonal
  spring: "seasonal-global-celebrations",
  summer: "seasonal-global-celebrations",
  fall: "seasonal-global-celebrations",
  autumn: "seasonal-global-celebrations",
  winter: "seasonal-global-celebrations",
  firstdayofspring: "seasonal-global-celebrations",
  firstdayofsummer: "seasonal-global-celebrations",
  firstdayoffall: "seasonal-global-celebrations",
  firstdayofwinter: "seasonal-global-celebrations",
  
  // 🌍 International Days (NUEVO)
  childrensday: "seasonal-global-celebrations",
  friendshipday: "seasonal-global-celebrations",
  teachersday: "seasonal-global-celebrations",
  worldpeaceday: "seasonal-global-celebrations",
  newyearsday: "seasonal-global-celebrations",
  worldhealthday: "seasonal-global-celebrations",
  worldenvironmentday: "seasonal-global-celebrations",
  humanrightsday: "seasonal-global-celebrations",
  
  // 🎂 Birthdays (EXPANDIDO)
  birthday: "birthdays-celebrations",
  happybirthday: "birthdays-celebrations",
  firstbirthday: "birthdays-celebrations",
  quinceanera: "birthdays-celebrations",
  quinceañera: "birthdays-celebrations",
  sweet16: "birthdays-celebrations",
  party: "birthdays-celebrations",
  celebration: "birthdays-celebrations",
  surprise: "birthdays-celebrations",
  genderreveal: "birthdays-celebrations",
  babyshower: "birthdays-celebrations",
  bridalshower: "birthdays-celebrations",
  
  // 💝 Love & Romance
  love: "love-weddings-anniversaries",
  romance: "love-weddings-anniversaries",
  romantic: "love-weddings-anniversaries",
  hugs: "love-weddings-anniversaries",
  wedding: "love-weddings-anniversaries",
  engagement: "love-weddings-anniversaries",
  proposal: "love-weddings-anniversaries",
  anniversary: "love-weddings-anniversaries",
  
  // 🫶 Family & Friendship (EXPANDIDO GLOBAL)
  family: "family-friendship",
  mother: "family-friendship",
  mothers: "family-friendship",
  father: "family-friendship",
  fathers: "family-friendship",
  parents: "family-friendship",
  parentsday: "family-friendship",
  grandparents: "family-friendship",
  grandparentsday: "family-friendship",
  siblings: "family-friendship",
  siblingsday: "family-friendship",
  daughter: "family-friendship",
  daughtersday: "family-friendship",
  son: "family-friendship",
  sonsday: "family-friendship",
  children: "family-friendship",
  familytime: "family-friendship",
  familylove: "family-friendship",
  familyreunion: "family-friendship",
  friends: "family-friendship",
  friendship: "family-friendship",
  bestfriends: "family-friendship",
  bff: "family-friendship",
  foreverfriends: "family-friendship",
  
  // 💼 Work & Education (EXPANDIDO GLOBAL)
  work: "work",
  job: "work",
  newjob: "work",
  firstday: "work",
  firstdayatwork: "work",
  promotion: "work",
  retirement: "work",
  graduation: "work",
  graduate: "work",
  highschool: "work",
  college: "work",
  university: "work",
  school: "work",
  teacher: "work",
  teachersday: "work",
  backtoschool: "work",
  firstdayofschool: "work",
  lastdayofschool: "work",
  goodgrades: "work",
  examsuccess: "work",
  careersuccess: "work",
  
  // 🧸 Babies & Parenting (EXPANDIDO GLOBAL)
  baby: "babies-parenting",
  newborn: "babies-parenting",
  newbaby: "babies-parenting",
  babyshower: "babies-parenting",
  pregnancy: "babies-parenting",
  werepregnant: "babies-parenting",
  genderreveal: "babies-parenting",
  itsaboy: "babies-parenting",
  itsagirl: "babies-parenting",
  twins: "babies-parenting",
  firststeps: "babies-parenting",
  firstwords: "babies-parenting",
  firsttooth: "babies-parenting",
  adoption: "babies-parenting",
  newparents: "babies-parenting",
  parenthood: "babies-parenting",
  
  // 🐾 Animals
  pets: "pets-animal-lovers",
  pet: "pets-animal-lovers",
  dog: "pets-animal-lovers",
  dogs: "pets-animal-lovers",
  cat: "pets-animal-lovers",
  cats: "pets-animal-lovers",
  puppy: "pets-animal-lovers",
  puppies: "pets-animal-lovers",
  kitten: "pets-animal-lovers",
  kittens: "pets-animal-lovers",
  seaanimals: "pets-animal-lovers",
  farmanimals: "pets-animal-lovers",
  flyinganimals: "pets-animal-lovers",
  wildanimals: "pets-animal-lovers",
  
  // 🕊️ Support & Care (EXPANDIDO)
  support: "support-healing-care",
  getwell: "support-healing-care",
  getwellsoon: "support-healing-care",
  recovery: "support-healing-care",
  cheerup: "support-healing-care",
  staystrong: "support-healing-care",
  hangingthere: "support-healing-care",
  feelbetter: "support-healing-care",
  speedyrecovery: "support-healing-care",
  sympathy: "support-healing-care",
  condolences: "support-healing-care",
  inmemory: "support-healing-care",
  restinpeace: "support-healing-care",
  rip: "support-healing-care",
  sendingleve: "support-healing-care",
  comfort: "support-healing-care",
  hope: "support-healing-care",
  strength: "support-healing-care",
  
  // 🧩 Diversity & Unity + Emotions (NUEVO)
  diversity: "hear-every-heart",
  inclusivity: "hear-every-heart",
  unity: "hear-every-heart",
  equality: "hear-every-heart",
  acceptance: "hear-every-heart",
  together: "hear-every-heart",
  imsorry: "hear-every-heart",
  forgiveme: "hear-every-heart",
  missyou: "hear-every-heart",
  thinkingofyou: "hear-every-heart",
  yourespecial: "hear-every-heart",
  youmatter: "hear-every-heart",
  youreamazing: "hear-every-heart",
  believeinyourself: "hear-every-heart",
  improudofyou: "hear-every-heart",
  yourenotalone: "hear-every-heart",
  
  // 🏟️ Sports & Fitness
  sports: "sports",
  soccer: "sports",
  basketball: "sports",
  football: "sports",
  baseball: "sports",
  gym: "sports",
  yoga: "sports",
  fitness: "sports",
  running: "sports",
  
  // 🕯️ Wellness
  wellness: "wellness-mindful-living",
  meditation: "wellness-mindful-living",
  selfcare: "wellness-mindful-living",
  mindfulness: "wellness-mindful-living",
  
  // 🏕️ Life Journeys (EXPANDIDO)
  moving: "life-journeys-transitions",
  newhome: "life-journeys-transitions",
  housewarming: "life-journeys-transitions",
  newbeginning: "life-journeys-transitions",
  newbeginnings: "life-journeys-transitions",
  newchapter: "life-journeys-transitions",
  freshstart: "life-journeys-transitions",
  newcity: "life-journeys-transitions",
  newadventure: "life-journeys-transitions",
  thankyou: "life-journeys-transitions",
  thanks: "life-journeys-transitions",
  thankyousomuch: "life-journeys-transitions",
  justbecause: "life-journeys-transitions",
  apology: "life-journeys-transitions",
  congratulations: "life-journeys-transitions",
  congrats: "life-journeys-transitions",
  goodluck: "life-journeys-transitions",
  bestwishes: "life-journeys-transitions",
  bonvoyage: "life-journeys-transitions",
  safetravels: "life-journeys-transitions",
  youdidit: "life-journeys-transitions",
  welldone: "life-journeys-transitions",
  proudofyou: "life-journeys-transitions",
  waytogo: "life-journeys-transitions",
  success: "life-journeys-transitions",
  achievementunlocked: "life-journeys-transitions",
  dreambig: "life-journeys-transitions",
};

// 🎯 MAPEO DE SUBCATEGORÍAS ACTUALIZADO
const DIRECT_SUBCATEGORY_MAP = {
  // Holiday Seasons (EXPANDIDO)
  newyear: "New Year",
  newyearseve: "New Year's Eve",
  lunarnewyear: "Lunar New Year",
  chinesenewyear: "Chinese New Year",
  halloween: "Halloween",
  christmas: "Christmas",
  xmas: "Christmas",
  christmaseve: "Christmas Eve",
  thanksgiving: "Thanksgiving",
  easter: "Easter",
  stpatricks: "St Patrick's Day",
  stpatricksday: "St Patrick's Day",
  mardigras: "Mardi Gras",
  cincodemayo: "Cinco de Mayo",
  
  // Cultural & Religious (EXPANDIDO)
  valentine: "Valentine's Day",
  valentines: "Valentine's Day",
  valentinesday: "Valentine's Day",
  hanukkah: "Hanukkah",
  diwali: "Diwali",
  ramadan: "Ramadan",
  eid: "Eid",
  roshhashanah: "Rosh Hashanah",
  yomkippur: "Yom Kippur",
  passover: "Passover",
  dayofthedead: "Day of the Dead",
  carnival: "Carnival",
  kwanzaa: "Kwanzaa",
  orthodoxeaster: "Orthodox Easter",
  
  // National & Civic (USA) (EXPANDIDO)
  july4: "Independence Day",
  fourthofjuly: "Fourth of July",
  independenceday: "Independence Day",
  memorialday: "Memorial Day",
  veteransday: "Veterans Day",
  laborday: "Labor Day",
  mlk: "MLK Da
