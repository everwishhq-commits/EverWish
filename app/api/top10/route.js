// pages/api/top10.js
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const dir = path.join(process.cwd(), "public/top10");
  const files = fs.readdirSync(dir);

  const images = files.map((file) => ({
    src: `/top10/${file}`,
    title: file.replace(/\.[^/.]+$/, ""), // quitar extensión
  }));

  res.status(200).json(images);
}
