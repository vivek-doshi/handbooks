#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const outputFile = path.join(__dirname, 'handbook-random-svgs.json');

function isHandbookFile(fileName) {
  return /handbook\.html$/i.test(fileName) || /_handbook\.html$/i.test(fileName);
}

function walk(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === '.ai' || entry.name === 'node_modules') {
      continue;
    }

    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (!isHandbookFile(entry.name)) {
      continue;
    }

    files.push(path.relative(repoRoot, fullPath).replace(/\\/g, '/'));
  }

  return files;
}

const svgTemplates = [
  '<svg viewBox="0 0 180 120" aria-hidden="true"><rect x="20" y="20" width="140" height="80" rx="18" fill="rgba(89,193,255,0.16)"></rect><path d="M44 42h92M44 60h72M44 78h88" stroke="#ebf0fa" stroke-width="8" stroke-linecap="round"></path><path d="M120 50l14 14-14 14" fill="none" stroke="#67d7a5" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
  '<svg viewBox="0 0 180 120" aria-hidden="true"><rect x="20" y="20" width="140" height="80" rx="18" fill="rgba(14,165,233,0.16)"></rect><rect x="40" y="36" width="100" height="10" rx="5" fill="rgba(14,165,233,0.70)"></rect><rect x="40" y="54" width="76" height="10" rx="5" fill="rgba(103,215,165,0.70)"></rect><rect x="40" y="72" width="48" height="10" rx="5" fill="rgba(255,143,90,0.72)"></rect></svg>',
  '<svg viewBox="0 0 180 120" aria-hidden="true"><ellipse cx="90" cy="30" rx="40" ry="14" fill="rgba(82,189,255,0.30)"></ellipse><path d="M50 30v38c0 8 18 14 40 14s40-6 40-14V30" fill="rgba(82,189,255,0.18)"></path><path d="M50 48c0 8 18 14 40 14s40-6 40-14" fill="none" stroke="#ebf0fa" stroke-width="4"></path><path d="M50 68c0 8 18 14 40 14s40-6 40-14" fill="none" stroke="#67d7a5" stroke-width="4"></path></svg>',
  '<svg viewBox="0 0 180 120" aria-hidden="true"><rect x="24" y="24" width="132" height="72" rx="18" fill="rgba(16,185,129,0.16)"></rect><path d="M52 72V48h24c10 0 18 7 18 16s-8 16-18 16H52Z" fill="none" stroke="#ebf0fa" stroke-width="8" stroke-linejoin="round"></path><path d="M106 46h20M116 46v24" stroke="#59c1ff" stroke-width="8" stroke-linecap="round"></path></svg>',
  '<svg viewBox="0 0 180 120" aria-hidden="true"><rect x="20" y="20" width="140" height="80" rx="18" fill="rgba(167,139,250,0.18)"></rect><circle cx="52" cy="60" r="14" fill="rgba(89,193,255,0.30)" stroke="#59c1ff" stroke-width="3"></circle><circle cx="90" cy="40" r="12" fill="rgba(103,215,165,0.30)" stroke="#67d7a5" stroke-width="3"></circle><circle cx="128" cy="60" r="14" fill="rgba(255,143,90,0.30)" stroke="#ff8f5a" stroke-width="3"></circle></svg>',
  '<svg viewBox="0 0 180 120" aria-hidden="true"><rect x="22" y="20" width="136" height="80" rx="20" fill="rgba(14,165,233,0.16)"></rect><path d="M48 78V42l28 18-28 18Z" fill="rgba(89,193,255,0.30)"></path><path d="M96 44h34M96 60h24M96 76h34" stroke="#ebf0fa" stroke-width="8" stroke-linecap="round"></path></svg>',
  '<svg viewBox="0 0 180 120" aria-hidden="true"><ellipse cx="72" cy="74" rx="34" ry="18" fill="rgba(36,150,237,0.24)" stroke="#2496ed" stroke-width="2.5"></ellipse><path d="M38 74Q24 62 28 54Q32 66 38 68Z" fill="rgba(36,150,237,0.34)"></path><circle cx="132" cy="50" r="20" fill="rgba(50,108,229,0.18)" stroke="#326ce5" stroke-width="2.5"></circle></svg>',
  '<svg viewBox="0 0 180 120" aria-hidden="true"><rect x="20" y="20" width="140" height="80" rx="18" fill="rgba(0,199,183,0.14)"></rect><rect x="38" y="36" width="104" height="48" rx="12" fill="rgba(89,193,255,0.16)"></rect><path d="M52 52h46M52 68h62" stroke="#ebf0fa" stroke-width="8" stroke-linecap="round"></path></svg>'
];

function randomTemplate() {
  const index = Math.floor(Math.random() * svgTemplates.length);
  return svgTemplates[index];
}

function generateMap() {
  const handbookFiles = walk(repoRoot).sort((a, b) => a.localeCompare(b));
  const mapping = {};

  for (const handbook of handbookFiles) {
    mapping[handbook] = randomTemplate();
  }

  return mapping;
}

const svgByHandbook = generateMap();
const result = {
  generatedAt: new Date().toISOString(),
  totalHandbooks: Object.keys(svgByHandbook).length,
  svgByHandbook
};

fs.writeFileSync(outputFile, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
console.log(`Generated random SVG map for ${result.totalHandbooks} handbooks.`);
console.log(path.relative(repoRoot, outputFile).replace(/\\/g, '/'));
