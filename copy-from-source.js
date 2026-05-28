const fs = require("fs");
const path = require("path");

const SRC = "C:\\Users\\Administrator\\scamshield-ai";
const DEST = "C:\\Users\\Administrator\\Desktop\\scamsheild.ai";

const SKIP_DIRS = new Set(["node_modules", ".next", ".git"]);
const SKIP_FILES = new Set(["copy-from-source.js", "db-setup-log.txt"]);

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    if (SKIP_DIRS.has(name)) continue;
    const s = path.join(src, name);
    const d = path.join(dest, name);
    const st = fs.statSync(s);
    if (st.isDirectory()) {
      copyDir(s, d);
    } else if (!SKIP_FILES.has(name) && !name.endsWith(".log")) {
      fs.copyFileSync(s, d);
    }
  }
}

copyDir(SRC, DEST);
console.log("Copied ScamShield AI to", DEST);
