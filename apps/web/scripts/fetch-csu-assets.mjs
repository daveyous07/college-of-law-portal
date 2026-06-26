import { writeFileSync, mkdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
mkdirSync(dir, { recursive: true });

const assets = [
  {
    file: "csu-official-seal.png",
    urls: [
      "http://cotsu.edu.ph/images/CSU-OfficialSeal.png",
      "http://www.cotsu.edu.ph/images/CSU-OfficialSeal.png",
    ],
  },
  { file: "csu-logo.png", urls: ["http://cotsu.edu.ph/images/logo12.png", "http://www.cotsu.edu.ph/images/logo12.png"] },
  { file: "csu-banner.png", urls: ["http://cotsu.edu.ph/images/banner/bannercsu.png", "http://www.cotsu.edu.ph/images/banner/bannercsu.png"] },
];

for (const { file, urls } of assets) {
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
        signal: AbortSignal.timeout(30000),
      });
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 1000) continue;
      writeFileSync(join(dir, file), buf);
      console.log(`Saved ${file}: ${buf.length} bytes from ${url}`);
      break;
    } catch (e) {
      console.log(`Failed ${url}:`, e.message);
    }
  }
}

for (const f of ["csu-official-seal.png", "csu-logo.png", "csu-banner.png"]) {
  try {
    const s = statSync(join(dir, f));
    console.log(`${f}: ${s.size} bytes`);
  } catch {
    console.log(`${f}: missing`);
  }
}
