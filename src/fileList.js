const fs = require('fs').promises;
const path = require('path');

async function getTextFiles() {
  try {
    // Ensure data directory exists
    await fs.mkdir('data').catch(() => {});
    
    const files = await fs.readdir('data');
    return files.filter(file => file.endsWith('.txt'));
  } catch (error) {
    throw new Error(`Failed to read directory: ${error.message}`);
  }
}

module.exports = { getTextFiles };