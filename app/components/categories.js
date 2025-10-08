"use client";

const mainCategories = [
  { name: "Seasonal & Holidays", emoji: "🎉", color: "bg-yellow-200", slug: "seasonal-holidays" },
  { name: "Birthdays", emoji: "🎂", color: "bg-pink-200", slug: "birthdays" },
  { name: "Love & Romance", emoji: "💘", color: "bg-rose-200", slug: "love-romance" },
  { name: "Family & Relationships", emoji: "👨‍👩‍👧‍👦", color: "bg-blue-200", slug: "family-relationships" },
  { name: "Babies & Parenting", emoji: "👶", color: "bg-sky-200", slug: "babies-parenting" },
  { name: "Weddings & Anniversaries", emoji: "💍", color: "bg-indigo-200", slug: "weddings-anniversaries" },
  { name: "Congratulations & Milestones", emoji: "🏆", color: "bg-amber-200", slug: "congrats-milestones" },
  { name: "School & Graduation", emoji: "🎓", color: "bg-lime-200", slug: "school-graduation" },
  { name: "Work & Professional", emoji: "💼", color: "bg-cyan-200", slug: "work-professional" },
  { name: "House & Moving", emoji: "🏡", color: "bg-emerald-200", slug: "house-moving" },
  { name: "Health & Support", emoji: "🩺", color: "bg-teal-200", slug: "health-support" },
  { name: "Sympathy & Remembrance", emoji: "🕊️", color: "bg-gray-200", slug: "sympathy-remembrance" },
  { name: "Encouragement & Motivation", emoji: "🌟", color: "bg-yellow-100", slug: "encouragement-motivation" },
  { name: "Thank You & Appreciation", emoji: "🙏", color: "bg-violet-200", slug: "thank-you-appreciation" },
  { name: "Invitations & Events", emoji: "✉️", color: "bg-fuchsia-200", slug: "invitations-events" },
  { name: "Religious & Spiritual", emoji: "🕯️", color: "bg-orange-200", slug: "religious-spiritual" },
  { name: "Cultural & Regional", emoji: "🌍", color: "bg-stone-200", slug: "cultural-regional" },
  { name: "Kids & Teens", emoji: "🧸", color: "bg-purple-200", slug: "kids-teens" },
  { name: "Humor & Memes", emoji: "😄", color: "bg-rose-100", slug: "humor-memes" },
  { name: "Pets & Animal Lovers", emoji: "🐾", color: "bg-green-100", slug: "pets" },
  { name: "Just Because & Everyday", emoji: "💌", color: "bg-blue-100", slug: "just-because" },
  { name: "Gifts & Surprises", emoji: "🎁", color: "bg-purple-100", slug: "gifts-surprises" },
  { name: "Inspirations & Quotes", emoji: "📝", color: "bg-slate-200", slug: "inspirations-quotes" },
  { name: "Custom & AI Creations", emoji: "🤖", color: "bg-teal-100", slug: "custom-ai" },
];

export default function Categories() {
  return (
    <section className="mt-12 bg-white rounded-3xl shadow-lg py-12 px-4">
      <h2 className="text-2xl font-bold mb-8 text-center">Categories</h2>

      <div className="flex overflow-x-auto gap-6 px-2 scrollbar-hide">
        {mainCategories.map((cat, i) => (
          <div
            key={i}
            className={`flex-none w-40 h-40 ${cat.color} rounded-2xl flex flex-col items-center justify-center shadow-md text-center transition-transform transform hover:scale-105 cursor-pointer`}
            onClick={() => (window.location.href = `/categories/${cat.slug}`)}
          >
            <div className="text-4xl">{cat.emoji}</div>
            <p className="mt-3 text-sm font-semibold text-gray-800">{cat.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
  }
