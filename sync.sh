#!/bin/bash

# Fetch latest from GitHub
git fetch origin

echo "🔍 Checking differences between local and GitHub..."

# Check if local has commits not on GitHub
LOCAL_DIFF=$(git log --oneline origin/main..main)

# Check if GitHub has commits not on local
REMOTE_DIFF=$(git log --oneline main..origin/main)

if [ -z "$LOCAL_DIFF" ] && [ -z "$REMOTE_DIFF" ]; then
  echo "✅ Local and GitHub are identical."
else
  echo "⚠️ Differences found!"

  if [ -n "$LOCAL_DIFF" ]; then
    echo "👉 Local commits not pushed to GitHub:"
    echo "$LOCAL_DIFF"
    echo "📤 Pushing local changes to GitHub..."
    git push origin main
  fi

  if [ -n "$REMOTE_DIFF" ]; then
    echo "👉 GitHub commits not pulled locally:"
    echo "$REMOTE_DIFF"
    echo "📥 Pulling changes from GitHub..."
    git pull origin main
  fi
fi

echo "✅ Local and GitHub are now synchronized."