import { writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../public/products");

const BASE = "https://shop.ubreakifix.com/cdn/shop/files/";

const files = [
  // Audio
  "EBOLA06XBUEN02.png",
  "EBOLA07XPDEN01.png",
  "JBLENDURPEAK3BLKAM.png",
  "EBGAIRPOPRBLK124.png",
  "JBLVBEAM2WHTAM.png",
  "JBLT310CWHTAM.png",
  "JBLFLIP7BLKAM.png",
  "JBLCLIP5BLKAM.png",
  "JBLCHARGE6BLKAM.png",
  "JBLT520BTBLKAM.png",
  "JBLQTUM100M2BLKAM.png",
  "JBLTBUDS2BLKAM.png",
  "JBLVBUDS2BLKAM.png",
  "JBLENDURACE2BLKAM.png",
  "JBLJR470NCWHTAM.png",
  "JBLJR320PURAM.png",
  // Cases
  "77-98429.png",
  "77-98294.png",
  "114546114040.png",
  "214461113636.png",
  "77-94492.png",
  "77-94620.png",
  "77-92833.png",
  "77-92554.png",
  "77-97323.png",
  "77-97656.png",
  "77-95183.png",
  "AA-GSTYLUS22-MILITARY-BLK.png",
  "MTHT-SPECM-LIPP.png",
  "AA-GSTYLUS22-TPUACRYLIC-CLR.png",
  "77-56650.png",
  "CM046030.png",
  // Screen Protection
  "200118666.png",
  "200118721.png",
  "200118722.png",
  "77-98674.png",
  "77-98682.png",
  "77-98686.png",
  "77-97840.png",
  "VTGLP1F211SS03A.png",
  "GGBILEC208GG01A.png",
  "VTBILPC208GG21V.png",
  "VG-GGFLEXW215AP04A.png",
  "77-96635.png",
  "581641.png",
  "AA-CELERO3-33SINGLE.png",
  "GGGLAST340AP04A.png",
  "77-95031.png",
  // Power
  "A1367H11-1.png",
  "A1339111-1.png",
  "401114329.png",
  "401107913.png",
  "MCBAT-ASR5K175252.png",
  "WC30-CCBX-87438.png",
  "WALL-PD-30W-W.png",
  "78-80892.png",
  "78-80893.png",
  "WLS10-ASR266583.png",
  "COILCABACVNV.png",
  "409911482.png",
  "WCB002DQWH.png",
  "WCB007DQWH.png",
  "DP121CMCRFW18VNV.png",
  "RQ1300VPAVNV.png",
  // Accessories
  "800859.png",
  "801938.png",
  "801675.png",
  "801923.png",
  "KS053956.png",
  "STODK-01-R8.jpg",
  "STODKP-01-R8.jpg",
  "78-80446.png",
  "OHSNAP-SNAP4LUXE.png",
];

async function download(filename) {
  const url = BASE + filename;
  const dest = join(OUT_DIR, filename);

  if (existsSync(dest)) {
    console.log(`  skip  ${filename}`);
    return;
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; image-downloader/1.0)" },
    });
    if (!res.ok) {
      console.error(`  FAIL  ${filename} — HTTP ${res.status}`);
      return;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(dest, buf);
    console.log(`  OK    ${filename} (${(buf.length / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`  ERR   ${filename} — ${err.message}`);
  }
}

console.log(`Downloading ${files.length} images to public/products/...\n`);
// Download 5 at a time to be polite
for (let i = 0; i < files.length; i += 5) {
  await Promise.all(files.slice(i, i + 5).map(download));
}
console.log("\nDone.");
