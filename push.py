import subprocess
import os

print("Modifying remote URL and executing push...")
os.system("git add .")
os.system('git commit -m "feat: complete Sanchara Vyuha AI-TOS v6.0 platform with IEEE review, README, and live depot dispatch GIS map"')
os.system("git remote set-url origin https://github.com/dhanusharer/sanchara-vyuha-nit.git")
os.system("git branch -M main")
os.system("git push -u origin main --force")
print("Push command executed!")
