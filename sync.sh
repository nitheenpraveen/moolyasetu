#!/bin/bash
set -e

echo "🔄 Syncing local → GitHub, Heroku, Vercel..."

# --- GitHub Sync (SSH, force overwrite) ---
git add .
git commit -m "Auto-sync: $(date)" || echo "No changes to commit"
git push origin main --force

# --- Heroku Deploy ---
cd backend
heroku git:remote -a moolyasetu-b1120af93c94
git push heroku main --force
cd ..

# --- Vercel Deploy ---
cd frontend
vercel --prod --confirm
cd ..

echo "✅ Sync complete: Local, GitHub, Heroku, Vercel are now equal."