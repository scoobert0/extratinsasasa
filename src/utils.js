const fs = require('fs').promises;

async function validateInputFile(filePath) {
  try {
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) {
      throw new Error('Input path is not a file');
    }
    return true;
  } catch (error) {
    throw new Error(`Invalid input file: ${error.message}`);
  }
}

function validateSearchTerm(term) {
  if (!term || typeof term !== 'string' || term.trim().length === 0) {
    throw new Error('Search term must be a non-empty string');
  }
  return term.trim();
}

module.exports = {
  validateInputFile,
  validateSearchTerm
};