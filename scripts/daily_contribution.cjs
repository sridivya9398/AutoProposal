const fs = require('fs');
const path = require('path');

async function run() {
  const logFile = path.join(process.cwd(), 'DAILY_LOG.md');
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0];

  // 1. Get Project Stats
  const srcDir = path.join(process.cwd(), 'src');
  const files = getAllFiles(srcDir);
  const componentCount = files.filter(f => f.endsWith('.tsx') || f.endsWith('.jsx')).length;
  const tsFileCount = files.filter(f => f.endsWith('.ts') || f.endsWith('.tsx')).length;

  // 2. Daily Motivation/Tip
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
    "A language that doesn't affect the way you think about programming, is not worth knowing."
  ];
  const tip = tips[Math.floor(Math.random() * tips.length)];

  // 3. Construct the log entry
  const entry = `
## ${dateStr} [${timeStr}]
- **Project Pulse**: All systems operational.
- **Stats**: ${componentCount} components, ${tsFileCount} TypeScript files.
- **Daily Insight**: *"${tip}"*
---
`;

  // 4. Update DAILY_LOG.md
  let content = '';
  if (fs.existsSync(logFile)) {
    content = fs.readFileSync(logFile, 'utf8');
  } else {
    content = '# 🚀 AutoProposal: Daily Evolution Log\n\nThis file is updated daily by the Antigravity AI to track project progress and keep the momentum alive.\n\n';
  }

  // Insert new entry at the top (after header)
  const headerEndIndex = content.indexOf('\n\n') + 2;
  const newContent = content.slice(0, headerEndIndex) + entry + content.slice(headerEndIndex);

  fs.writeFileSync(logFile, newContent);
  console.log(`Updated daily log for ${dateStr}`);
}

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
