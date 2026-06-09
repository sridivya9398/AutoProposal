#!/bin/bash

# Define paths
ACTIVE_REPO="/Users/sridivya/.gemini/antigravity/scratch/AutoProposal"
CRON_REPO="/Users/sridivya/.gemini/antigravity/scratch/AutoProposal_cron"
LOG_FILE="/Users/sridivya/.gemini/antigravity/scratch/AutoProposal/scripts/daily_run.log"

# Add homebrew/node/git to PATH just in case
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:$PATH"

echo "=== Daily Contribution Start: $(date) ===" >> "$LOG_FILE"

# 1. Wait for internet connection (up to 2 minutes)
MAX_RETRIES=12
RETRY_DELAY=10
CONNECTED=false

for ((i=1; i<=MAX_RETRIES; i++)); do
  if curl -s -I --connect-timeout 5 https://github.com > /dev/null; then
    CONNECTED=true
    echo "Internet connection verified on attempt $i." >> "$LOG_FILE"
    break
  else
    echo "GitHub not reachable. Attempt $i of $MAX_RETRIES. Retrying in ${RETRY_DELAY}s..." >> "$LOG_FILE"
    sleep $RETRY_DELAY
  fi
done

if [ "$CONNECTED" = false ]; then
  echo "No internet connection. Exiting daily run." >> "$LOG_FILE"
  echo "=== Daily Contribution End: $(date) (FAILED - NO NETWORK) ===" >> "$LOG_FILE"
  exit 1
fi

# 2. Setup the isolated repository clone if it doesn't exist
if [ ! -d "$CRON_REPO" ]; then
  echo "Cloning isolated repository to $CRON_REPO..." >> "$LOG_FILE"
  cd "$ACTIVE_REPO" || exit 1
  REMOTE_URL=$(git config --get remote.origin.url)
  git clone "$REMOTE_URL" "$CRON_REPO" >> "$LOG_FILE" 2>&1
  if [ $? -ne 0 ]; then
    echo "Failed to clone repository. Exiting." >> "$LOG_FILE"
    exit 1
  fi
fi

# 3. Perform git operations inside the isolated repository
cd "$CRON_REPO" || { echo "Failed to cd to $CRON_REPO" >> "$LOG_FILE"; exit 1; }

# Ensure we are clean and on main
git checkout main >> "$LOG_FILE" 2>&1
git reset --hard origin/main >> "$LOG_FILE" 2>&1
git clean -fd >> "$LOG_FILE" 2>&1

echo "Pulling latest changes..." >> "$LOG_FILE"
git pull origin main >> "$LOG_FILE" 2>&1

# Run the node script to update DAILY_LOG.md
echo "Running daily contribution node script..." >> "$LOG_FILE"
node scripts/daily_contribution.cjs >> "$LOG_FILE" 2>&1

# Check if there are changes to commit
if git diff --quiet DAILY_LOG.md; then
  echo "No new changes to DAILY_LOG.md (today's entry might already exist)." >> "$LOG_FILE"
else
  # Commit and push
  git add DAILY_LOG.md >> "$LOG_FILE" 2>&1
  git commit -m "docs: local daily pulse update 🚀" >> "$LOG_FILE" 2>&1
  
  echo "Pushing changes..." >> "$LOG_FILE"
  git push origin main >> "$LOG_FILE" 2>&1
  PUSH_STATUS=$?
  
  if [ $PUSH_STATUS -eq 0 ]; then
    echo "Daily contribution pushed successfully." >> "$LOG_FILE"
    
    # Sync DAILY_LOG.md back to the active repo if it exists and is not dirty
    if [ -d "$ACTIVE_REPO" ]; then
      cd "$ACTIVE_REPO" || exit 1
      if git diff --quiet DAILY_LOG.md; then
         echo "Syncing updated DAILY_LOG.md back to active workspace." >> "$LOG_FILE"
         cp "$CRON_REPO/DAILY_LOG.md" "$ACTIVE_REPO/DAILY_LOG.md"
      fi
    fi
  else
    echo "Git push failed in isolated repo." >> "$LOG_FILE"
  fi
fi

echo "=== Daily Contribution End: $(date) ===" >> "$LOG_FILE"
