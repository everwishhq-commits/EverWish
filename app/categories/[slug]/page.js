// 🎬 Cargar videos desde la API
useEffect(() => {
  async function fetchVideos() {
    console.log("🎬 Fetching videos for slug:", slug);
    try {
      // ✅ Usa URL absoluta (funciona en Vercel y local)
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
      const res = await fetch(`${baseUrl}/api/videos`);

      const data = await res.json();
      console.log("✅ Data received:", data);

      // 🔎 Filtra por categoría según el slug
      const allVideos = data.all || [];
      const filtered = allVideos.filter((v) => {
        const cats = v.categories || [detectCategory(v.title)];
        return cats.includes(slug.toLowerCase());
      });

      console.log("📂 Category videos for", slug, ":", filtered);
      setVideos(filtered);
    } catch (err) {
      console.error("❌ Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
  }

  fetchVideos();
}, [slug]);
