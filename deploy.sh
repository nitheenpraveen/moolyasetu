#!/bin/bash
set -e

cd ~/moolyasetu
git init
git add .
git commit -m "Deploy-ready: frontend + backend + UI"
git remote set-url origin https://github.com/nitheenpraveen/moolyasetu.git
git push origin main --force

cd backend
heroku login
heroku git:remote -a moolyasetu
git push heroku main --force

cd ../frontend
vercel login
vercel --prod --confirm