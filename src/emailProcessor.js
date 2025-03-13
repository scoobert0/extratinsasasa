const path = require('path');
const { EMAIL_PATTERN } = require('./utils/regex');
const { ensureDirectoryExists, appendToFile } = require('./utils/fileUtils');

class EmailProcessor {
  static async processLine(line) {
    const match = line.trim().match(EMAIL_PATTERN.FORMAT);
    if (!match) return null;

    const [, email, password] = match;
    const provider = email.split('@')[1];
    return { email, password, provider };
  }

  static async processAndSave(line, outputDir) {
    const result = await this.processLine(line);
    if (!result) return null;

    const { email, password, provider } = result;
    const outputPath = path.join(outputDir, `${provider}.txt`);
    await appendToFile(outputPath, `${email}:${password}`);
    return provider;
  }
}

module.exports = EmailProcessor;