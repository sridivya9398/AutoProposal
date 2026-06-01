#!/bin/bash

# Define paths
REPO_DIR="/Users/sridivya/.gemini/antigravity/scratch/AutoProposal"
LOG_FILE="$REPO_DIR/scripts/daily_run.log"

# Add homebrew/node/git to PATH just in case
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:$PATH"

echo "=== Daily Contribution Start: $(date) ===" >> "$LOG_FILE"

# Navigate to repository
cd "$REPO_DIR" || { echo "Failed to cd to $REPO_DIR" >> "$LOG_FILE"; exit 1; }

# Pull latest changes
git pull origin main >> "$LOG_FILE" 2>&1

# Run the node script to update DAILY_LOG.md
node scripts/daily_contribution.cjs >> "$LOG_FILE" 2>&1

# Add DAILY_LOG.md
git add DAILY_LOG.md >> "$LOG_FILE" 2>&1

# Commit and push
git commit -m "docs: local daily pulse update 🚀" >> "$LOG_FILE" 2>&1
COMMIT_STATUS=$?

if [ $COMMIT_STATUS -eq 0 ]; then
  git push origin main >> "$LOG_FILE" 2>&1
  if [ $? -eq 0 ]; then
    echo "Daily contribution pushed successfully." >> "$LOG_FILE"
  else
    echo "Git push failed." >> "$LOG_FILE"
  fi
else
  echo "No changes or commit failed." >> "$LOG_FILE"
fi

echo "=== Daily Contribution End: $(date) ===" >> "$LOG_FILE"
