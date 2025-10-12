import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public/videos");
    const files = fs.readdirSync(dir);

    const videos = files
      .filter((file) => file.endsWith(".mp4"))
      .map((file) => ({
        title: file
          .replace(/_/g, " ")
          .replace(".mp4", "")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        src: `/videos/${file}`,
        slug: file.replace(".mp4", ""),
      }));

    return new Response(JSON.stringify(videos, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error reading videos:", error);
    return new Response(
      JSON.stringify({ error: "Unable to read videos directory" }),
      { status: 500 }
    );
  }
}
