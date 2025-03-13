const fs = require('fs').promises;
const path = require('path');

async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

async function appendToFile(filePath, content) {
  await fs.appendFile(filePath, content + '\n', 'utf8');
}

module.exports = {
  ensureDirectoryExists,
  appendToFile
};