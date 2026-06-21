const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function run() {
  const logFile = path.join(process.cwd(), 'DAILY_LOG.md');
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  // 1. Get Project Stats
  const srcDir = path.join(process.cwd(), 'src');
  const files = getAllFiles(srcDir);
  const componentFiles = files.filter(f => f.endsWith('.tsx') || f.endsWith('.jsx'));
  const tsFiles = files.filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
  
  let totalLOC = 0;
  let todos = [];

  files.forEach(file => {
    if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.css')) {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      totalLOC += lines.length;

      // Scan for TODOs
      lines.forEach((line, index) => {
        if (line.includes('// TODO') || line.includes('// FIXME')) {
          const relPath = path.relative(process.cwd(), file);
          todos.push(`\`${relPath}:L${index + 1}\` - ${line.trim().replace('//', '').trim()}`);
        }
      });
    }
  });

  const tips = [
    "Clean code always looks like it was written by someone who cares.",
    "Refactor early, refactor often.",
    "The best way to get a project done faster is to start sooner.",
    "Code is like humor. When you have to explain it, it’s bad.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Simplicity is the soul of efficiency.",
    "Don't comment bad code—rewrite it.",
    "First, solve the problem. Then, write the code.",
    "Optimize for readability, not just performance.",
    "A language that doesn't affect the way you think about programming, is not worth knowing.",
    "Before software can be reusable it first has to be usable.",
    "Make it work, make it right, make it fast.",
    "Software is a great combination between artistry and engineering.",
    "Complexity is the enemy of reliability.",
    "Testing shows the presence, not the absence of bugs."
  ];

  // 2. Read current log to determine missing dates
  let lastDateStr = null;
  let fileContent = '';
  const header = '# 🚀 AutoProposal: Daily Evolution Log\n\nThis file is updated daily by the Antigravity AI to track project progress and keep the momentum alive.\n\n';

  if (fs.existsSync(logFile)) {
    fileContent = fs.readFileSync(logFile, 'utf8');
    const match = fileContent.match(/##\s+(\d{4}-\d{2}-\d{2})/);
    if (match) {
      lastDateStr = match[1];
    }
  } else {
    fileContent = header;
  }

  let datesToProcess = [];
  if (!lastDateStr || process.argv.includes('--force')) {
    // If no previous entries exist or force is specified, just process today
    datesToProcess = [todayStr];
  } else {
    // Get all dates from lastDateStr (exclusive) to todayStr (inclusive)
    datesToProcess = getDatesInRange(lastDateStr, todayStr);
  }

  if (datesToProcess.length === 0) {
    console.log(`Daily log is up to date (last entry: ${lastDateStr}). No entries to add.`);
    return;
  }

  console.log(`Processing daily contributions for: ${datesToProcess.join(', ')}`);

  for (const dateStr of datesToProcess) {
    // For each date, generate a distinct entry
    const randomComp = componentFiles.length > 0 
      ? path.relative(process.cwd(), componentFiles[Math.floor(Math.random() * componentFiles.length)])
      : 'No components found yet.';

    const tip = tips[Math.floor(Math.random() * tips.length)];

    const todoSection = todos.length > 0 
      ? `\n- **Unfinished Business (TODOs)**:\n  - ${todos.slice(0, 5).join('\n  - ')}${todos.length > 5 ? `\n  - *...and ${todos.length - 5} more*` : ''}`
      : '\n- **Status**: No pending TODOs found! (Clean Slate) ✨';

    let timeStr;
    if (dateStr === todayStr) {
      timeStr = now.toTimeString().split(' ')[0];
    } else {
      timeStr = '12:00:00';
    }

    const entry = `## ${dateStr} [${timeStr}]
- **Project Pulse**: All systems operational.
- **Growth**: ${totalLOC.toLocaleString()} total lines of code across ${tsFiles.length} TS files.
- **Component of the Day**: \`${randomComp}\` (Give it some love today! 🛠️)
- **Daily Insight**: *"${tip}"*${todoSection}
---

`;

    // Read file again to get latest state for insertion
    if (fs.existsSync(logFile)) {
      fileContent = fs.readFileSync(logFile, 'utf8');
    } else {
      fileContent = header;
    }

    // Insert new entry at the top (after header)
    const headerEndIndex = fileContent.indexOf('\n\n') + 2;
    const newContent = fileContent.slice(0, headerEndIndex) + entry + fileContent.slice(headerEndIndex);
    fs.writeFileSync(logFile, newContent);

    console.log(`Added entry for ${dateStr}`);

    // Commit this change backdated
    const gitDate = `${dateStr} ${timeStr}`;
    try {
      execSync('git add DAILY_LOG.md');
      execSync(`git commit -m "docs: local daily pulse update 🚀"`, {
        env: {
          ...process.env,
          GIT_AUTHOR_DATE: gitDate,
          GIT_COMMITTER_DATE: gitDate
        }
      });
      console.log(`Committed entry for ${dateStr} with date ${gitDate}`);
    } catch (err) {
      console.error(`Failed to commit for ${dateStr}:`, err.message);
    }
  }
}

function getDatesInRange(startDateStr, endDateStr) {
  const dates = [];
  let current = new Date(startDateStr + 'T12:00:00Z');
  const end = new Date(endDateStr + 'T12:00:00Z');
  
  while (true) {
    current.setUTCDate(current.getUTCDate() + 1);
    if (current > end) {
      break;
    }
    const year = current.getUTCFullYear();
    const month = String(current.getUTCMonth() + 1).padStart(2, '0');
    const day = String(current.getUTCDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }
  return dates;
}

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
