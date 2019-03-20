#!/usr/bin/env node

const bot = require('circle-github-bot').create();
const report = require('../../artifacts/lighthouse.report.json');

const scores = Object.values(report.categories).reduce(
  (agg, category) => `${agg}
| ${category.title} | ${category.score * 100} |`,
  '',
);

bot.comment(
  process.env.GH_AUTH_TOKEN,
  `
<h3>Lighthouse report</h3>

| Category        | Score           |
| --------------- |----------------:|${scores}

<h3>Full Report</h3>
<strong>${bot
    .artifactLink('artifacts/lighthouse.report.html', 'Lighthouse Report')
    .replace('/project/', '/repo/')}</strong>
`,
);
