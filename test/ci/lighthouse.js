#!/usr/bin/env node

const bot = require('circle-github-bot').create();
const report = require('../../artifacts/lighthouse.report.json');

const scores = Object.values(report.categories).reduce(
  (agg, category) => `${agg}<h4>${category.title}</h4><div>${category.score}</div>`,
  '',
);

bot.comment(
  process.env.GH_AUTH_TOKEN,
  `
<h3>Lighthouse report</h3>

${scores}

<h4>Full Report</h4>
<strong>${bot.artifactLink('artifacts/lighthouse.report.html', 'Lighthouse Report')}</strong>
`,
);
