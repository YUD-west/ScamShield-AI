const { execSync } = require("child_process");

for (const PORT of ["3011", "3010"]) {
  try {
    const out = execSync(`netstat -ano | findstr :${PORT}`, { encoding: "utf8" });
    for (const line of out.split(/\r?\n/)) {
      const pid = line.trim().split(/\s+/).pop();
      if (pid && /^\d+$/.test(pid) && pid !== "0") {
        try {
          execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
          console.log(`[scamshield] Freed port ${PORT}`);
        } catch {
          /* ignore */
        }
      }
    }
  } catch {
    /* free */
  }
}
