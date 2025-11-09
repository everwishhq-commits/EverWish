"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Grupos de subcategorías por categoría
const SUBCATEGORY_GROUPS = {
  "seasonal-global-celebrations": {
    "Seasons": ["New Year", "Spring", "Summer", "Fall", "Winter"],
    "Cultural Celebrations": ["Lunar New Year", "Valentine's Day", "St. Patrick's Day", "Carnival", "Cinco de Mayo", "Oktoberfest", "Day of the Dead"],
    "Family Days": ["Mother's Day", "Father's Day", "Grandparents Day", "Easter"],
    "Holiday Season": ["Halloween", "Thanksgiving", "Christmas", "Hanukkah", "Kwanzaa"],
    "American Holidays": ["MLK Day", "Presidents' Day", "Memorial Day", "Independence Day", "Labor Day", "Veterans Day", "Columbus Day", "Juneteenth"],
  },
  "birthdays-celebrations": {
    "Ages": ["Baby", "Kids", "Teens", "Adult"],
    "Milestones": ["Sweet 16", "18th", "21st", "30th", "40th", "50th"],
    "Styles": ["Funny", "Belated", "Surprise"],
  },
  "love-weddings-anniversaries": {
    "Romance": ["Love", "I Love You", "Miss You", "Hugs"],
    "Wedding": ["Wedding", "Engagement", "Proposal"],
    "Anniversary": ["Anniversary", "1 Year", "5 Years", "10 Years"],
  },
  "family-friendship": {
    "Friendship": ["Best Friends", "Friend"],
    "Parents": ["Mom", "Dad"],
    "Siblings": ["Sister", "Brother"],
    "Extended Family": ["Grandparents", "Aunt", "Uncle"],
  },
  "work": {
    "Achievements": ["New Job", "Promotion", "New Business"],
    "Graduation": ["Graduation", "College", "High School"],
    "Professions": ["Teacher", "Nurse", "Firefighter", "Police", "Military"],
    "Appreciation": ["Coworker", "Boss", "Team"],
  },
  "babies-parenting": {
    "Arrival": ["Pregnancy", "Baby Shower", "Newborn", "Twins"],
    "Parents": ["New Parents", "Mom Life", "Dad Life"],
  },
  "pets-animal-lovers": {
    "Dogs": ["Dog", "Puppy"],
    "Cats": ["Cat", "Kitten"],
    "Other": ["Pet", "Cute", "Funny"],
  },
  "support-healing-care": {
    "Health": ["Get Well", "Recovery", "Hospital"],
    "Support": ["Thinking of You", "Stay Strong"],
    "Loss": ["Sympathy", "Condolences"],
  },
  "diversity-connection": {
    "Inclusion": ["Diversity", "All Welcome", "Multicultural"],
    "Values": ["Kindness", "Peace", "Unity"],
  },
  "sports": {
    "Team Sports": ["Soccer", "Basketball", "Football"],
    "Fitness": ["Gym", "Yoga"],
  },
  "wellness-mindful-living": {
    "Wellness": ["Self-Care", "Meditation", "Gratitude"],
    "Lifestyle": ["Healthy Living", "Nature"],
  },
  "life-journeys-transitions": {
    "Achievements": ["Congratulations", "Good Luck"],
    "Moving": ["New Home", "Housewarming"],
    "Everyday": ["Just Because", "Thank You"],
  },
};

export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q");
  
  const [allVideos, setAllVideos] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();

        const normalize = (str) =>
          str?.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-").trim();

        const currentCategory = normalize(slug);

        const filtered = (data.videos || []).filter((v) => {
          const mainMatch = normalize(v.category).includes(currentCategory) || 
                           currentCategory.includes(normalize(v.category));
          
          if (mainMatch) return true;
          
          if (v.categories && Array.isArray(v.categories)) {
            return v.categories.some(cat => {
              const normCat = normalize(cat);
              return normCat.includes(currentCategory) || currentCategory.includes(normCat);
            });
          }
          
          return false;
        });

        setAllVideos(filtered);
      } catch (err) {
        console.error("❌ Error loading videos:", err);
      } finally {
        setLoading(false);
      }
    }

    loadVideos();
  }, [slug, searchTerm]);

  const groups = SUBCATEGORY_GROUPS[slug] || {};
  const groupNames = Object.keys(groups);

  const activeVideos = activeSub
    ? allVideos.filter(v => v.subcategory === activeSub)
    : [];

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-[#fff5f8] text-gray-600">
        <p className="animate-pulse text-lg">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff5f8] text-gray-800 flex flex-col items-center py-10 px-4">
      <button
        onClick={() => router.push("/categories")}
        className="text-pink-500 hover:text-pink-600 font-semibold mb-6"
      >
        ← Back to Main Categories
      </button>

      <h1 className="text-4xl font-extrabold text-pink-600 mb-3 capitalize text-center">
        {slug.replace(/-/g, " ")}
      </h1>

      {!activeGroup && (
        <div className="flex flex-wrap justify-center gap-4 max-w-5xl">
          {groupNames.map((groupName, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveGroup(groupName)}
              whileHover={{ scale: 1.05 }}
              className="px-5 py-3 rounded-full bg-white shadow-sm border border-pink-100 hover:border-pink-200 hover:bg-pink-50 text-gray-700 font-semibold"
            >
              {groupName}
            </motion.button>
          ))}
        </div>
      )}

      {activeGroup && !activeSub && (
        <>
          <button
            onClick={() => setActiveGroup(null)}
            className="text-pink-500 hover:text-pink-600 font-semibold mb-4"
          >
            ← Back to Groups
          </button>
          
          <h2 className="text-2xl font-bold text-pink-600 mb-6">{activeGroup}</h2>
          
          <div className="flex flex-wrap justify-center gap-4 max-w-5xl">
            {groups[activeGroup].map((subName, i) => (
              <motion.button
                key={i}
                onClick={() => setActiveSub(subName)}
                whileHover={{ scale: 1.05 }}
                className="px-5 py-3 rounded-full bg-white shadow-sm border border-pink-100 hover:border-pink-200 hover:bg-pink-50 text-gray-700 font-semibold"
              >
                {subName}
              </motion.button>
            ))}
          </div>
        </>
      )}

      <AnimatePresence>
        {activeSub && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSub(null)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="relative bg-white rounded-3xl shadow-xl w-[90%] max-w-5xl h-[70vh] overflow-y-auto border border-pink-100 p-6">
                <button
                  onClick={() => setActiveSub(null)}
                  className="absolute top-3 right-5 text-gray-400 hover:text-pink-500 text-2xl font-bold"
                >
                  ×
                </button>

                <h2 className="text-2xl font-bold text-pink-600 mb-4">{activeSub}</h2>

                {activeVideos.length === 0 ? (
                  <p className="text-gray-500 text-center mt-10">No cards found.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {activeVideos.map((video, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => router.push(`/edit/${video.name}`)}
                        className="cursor-pointer bg-white rounded-3xl shadow-md border border-pink-100 overflow-hidden hover:shadow-lg"
                      >
                        <video
                          src={video.file}
                          className="object-cover w-full aspect-[4/5]"
                          playsInline
                          loop
                          muted
                          onMouseEnter={(e) => e.target.play()}
                          onMouseLeave={(e) => {
                            e.target.pause();
                            e.target.currentTime = 0;
                          }}
                        />
                        <div className="text-center py-2 text-gray-700 font-semibold text-sm">
                          {video.object || video.name}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
          }
