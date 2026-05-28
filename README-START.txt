SCAMSHIELD AI - DO THIS NOW
============================

1. Double-click: SETUP-NOW.bat
   (wait 2-5 minutes for npm install)

2. Browser opens: http://localhost:3010

3. Sign in:
   Email: demo@scamshield.ai
   Password: Demo1234!

If SETUP-NOW.bat fails:
- Install Node.js: https://nodejs.org
- Open PowerShell in this folder and run:
    cd C:\Users\Administrator\Desktop\scamsheild.ai
    robocopy C:\Users\Administrator\scamshield-ai . /E /XD node_modules .next .git
    npm install
    npm run dev

Deploy later: see docs\DEPLOYMENT.md (Vercel + Render)
