@echo off
echo ========================================================
echo Pushing Sanchara Vyuha AI-TOS v6.0 to GitHub...
echo ========================================================
cd /d "c:\Users\DHANUSH A G\Desktop\Sanchara-Vyuha-depo-main\Sanchara-Vyuha-depo-main"
git add .
git commit -m "docs: remove demo section and add comprehensive master documentation index and ADR references"
git remote set-url origin https://github.com/dhanusharer/sanchara-vyuha-nit.git
git branch -M main
git push -u origin main --force
echo ========================================================
echo PUSH COMPLETE! Check https://github.com/dhanusharer/sanchara-vyuha-nit
echo ========================================================
pause
