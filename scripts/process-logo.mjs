import sharp from "sharp";

const inputPath = "C:/Users/maz/.gemini/antigravity/brain/3da49ff9-01a8-4846-a15f-9ed3d1f8d9bb/.user_uploaded/media_1794678379096_dc2a1f5f.jpg";

async function processLogo() {
  const metadata = await sharp(inputPath).metadata();
  console.log("Original dimensions:", metadata.width, metadata.height);

  // Load raw image data to create a transparent background version
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels; // 4 (RGBA)

  // Pixel flood/chroma key: If near pure white outside the circle, make transparent
  // Specifically, find pixels where r > 240 && g > 240 && b > 240
  // But wait! Inside the red play button or instagram icon or chat bubble, there are white icons.
  // We want to keep inner white icons white, while outer white background becomes transparent!
  // We can do a flood fill from (0,0) or check distance from center!
  // The chain is a circle centered at (width/2, height/2).
  // Let's compute distance from center:
  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = width * 0.44;
  const innerRadius = width * 0.22;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // If it's outside the chain or inside the center hole, and it is white/near-white
      if ((dist > outerRadius || dist < innerRadius) && r > 235 && g > 235 && b > 235) {
        data[idx + 3] = 0; // alpha = 0 (transparent)
      } else if (dist > outerRadius && r > 220 && g > 220 && b > 220) {
        // smooth anti-aliased edge
        const alpha = Math.max(0, 255 - ((r + g + b) / 3 - 220) * 15);
        data[idx + 3] = Math.min(data[idx + 3], alpha);
      }
    }
  }

  // Create transparent buffer
  const transparentPng = await sharp(data, {
    raw: { width, height, channels: 4 }
  })
    .trim() // trim transparent edges
    .png()
    .toBuffer();

  // Save public logo
  await sharp(transparentPng)
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile("public/logo.png");

  // Save app icon (Next.js automatically serves src/app/icon.png as favicon)
  await sharp(transparentPng)
    .resize(192, 192, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile("src/app/icon.png");

  // Save apple icon
  await sharp(transparentPng)
    .resize(180, 180, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile("src/app/apple-icon.png");

  // Also save a crisp 32x32 and 48x48 icon
  await sharp(transparentPng)
    .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile("public/favicon-32x32.png");

  // Replace src/app/favicon.ico
  // An .ico file can be created or sharp can output ico/png format
  await sharp(transparentPng)
    .resize(48, 48, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile("src/app/favicon.ico");

  await sharp(transparentPng)
    .resize(48, 48, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile("public/favicon.ico");

  console.log("Logo successfully processed and applied to all icon destinations!");
}

processLogo().catch(console.error);
