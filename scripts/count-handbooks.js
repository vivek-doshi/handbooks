#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

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

const handbookFiles = walk(repoRoot).sort((a, b) => a.localeCompare(b));

console.log(`Handbook count: ${handbookFiles.length}`);
for (const file of handbookFiles) {
  console.log(file);
}
