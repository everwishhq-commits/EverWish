useEffect(() => {
  async function fetchVideos() {
    console.log("🎬 Fetching videos for slug:", slug);
    try {
      const res = await fetch("/api/videos");
      const data = await res.json();
      console.log("✅ Data received:", data);

      const categoryVideos = data.categories?.[slug] || [];
      console.log("📂 Category videos for", slug, ":", categoryVideos);

      setVideos(categoryVideos);
    } catch (err) {
      console.error("❌ Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
  }

  fetchVideos();
}, [slug]);
