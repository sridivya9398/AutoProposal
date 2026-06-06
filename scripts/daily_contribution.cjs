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

  // 2. Component of the Day
  const randomComp = componentFiles.length > 0 
    ? path.relative(process.cwd(), componentFiles[Math.floor(Math.random() * componentFiles.length)])
    : 'No components found yet.';

  // 3. Daily Motivation/Tip
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

  // 4. Construct the log entry
  const todoSection = todos.length > 0 
    ? `\n- **Unfinished Business (TODOs)**:\n  - ${todos.slice(0, 5).join('\n  - ')}${todos.length > 5 ? `\n  - *...and ${todos.length - 5} more*` : ''}`
    : '\n- **Status**: No pending TODOs found! (Clean Slate) ✨';

  const entry = `
## ${dateStr} [${timeStr}]
- **Project Pulse**: All systems operational.
- **Growth**: ${totalLOC.toLocaleString()} total lines of code across ${tsFiles.length} TS files.
- **Component of the Day**: \`${randomComp}\` (Give it some love today! 🛠️)
- **Daily Insight**: *"${tip}"*${todoSection}
---
`;

  // 5. Update DAILY_LOG.md
  let content = '';
  if (fs.existsSync(logFile)) {
    content = fs.readFileSync(logFile, 'utf8');
    if (content.includes(`## ${dateStr}`) && !process.argv.includes('--force')) {
      console.log(`Daily log for ${dateStr} already exists. Skipping to avoid duplicates.`);
      return;
    }
  } else {
    content = '# 🚀 AutoProposal: Daily Evolution Log\n\nThis file is updated daily by the Antigravity AI to track project progress and keep the momentum alive.\n\n';
  }

  // Insert new entry at the top (after header)
  const headerEndIndex = content.indexOf('\n\n') + 2;
  const newContent = content.slice(0, headerEndIndex) + entry + content.slice(headerEndIndex);

  fs.writeFileSync(logFile, newContent);
  console.log(`Updated daily log for ${dateStr} with enhanced metrics.`);
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
