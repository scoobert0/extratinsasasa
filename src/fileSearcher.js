const fs = require('fs');
const readline = require('readline');
const cliProgress = require('cli-progress');
const path = require('path');
const TextProcessor = require('./textProcessor');
const EmailProcessor = require('./emailProcessor');
const { ensureDirectoryExists } = require('./utils/fileUtils');

class FileSearcher {
  constructor(inputFile, searchTerm, outputFile, mode) {
    this.inputFile = path.join('data', inputFile);
    this.searchTerm = searchTerm;
    this.outputFile = path.join('data', outputFile);
    this.mode = mode;
  }

  async search() {
    try {
      const stats = await fs.promises.stat(this.inputFile);
      const fileSize = stats.size;
      let bytesRead = 0;

      if (this.mode === 'email' || this.mode === 'gov' || this.mode === 'consultation') {
        await ensureDirectoryExists(this.outputFile);
      } else {
        await fs.promises.writeFile(this.outputFile, '', 'utf8');
      }
      
      const inputStream = fs.createReadStream(this.inputFile);
      const reader = readline.createInterface({
        input: inputStream,
        crlfDelay: Infinity
      });

      const progressBar = new cliProgress.SingleBar({
        format: '⏳ Progress |{bar}| {percentage}% | 🎯 Matches: {matches}',
        barCompleteChar: '█',
        barIncompleteChar: '░'
      });

      let matchCount = 0;
      progressBar.start(100, 0, { matches: 0 });

      inputStream.on('data', (chunk) => {
        bytesRead += chunk.length;
        const progress = Math.round((bytesRead / fileSize) * 100);
        progressBar.update(progress, { matches: matchCount });
      });

      const outputStream = this.mode !== 'email' && this.mode !== 'gov' && this.mode !== 'consultation' ? 
        fs.createWriteStream(this.outputFile, { flags: 'a' }) : null;

      for await (const line of reader) {
        if (this.mode === 'email') {
          const provider = await EmailProcessor.processAndSave(line, this.outputFile);
          if (provider) matchCount++;
        } else if (this.mode === 'gov' || this.mode === 'consultation') {
          const result = await TextProcessor.processLine(line, this.mode);
          if (result) matchCount++;
        } else {
          const shouldProcess = this.mode === 'cc' || 
                              this.mode === 'consultavel' || 
                              this.containsTerm(line);
          if (shouldProcess) {
            const processedLine = await TextProcessor.processLine(line, this.mode);
            if (processedLine) {
              outputStream.write(processedLine + '\n');
              matchCount++;
            }
          }
        }
        progressBar.update(null, { matches: matchCount });
      }

      progressBar.stop();
      if (outputStream) outputStream.end();
      return matchCount;
    } catch (error) {
      throw new Error(`❌ Search failed: ${error.message}`);
    }
  }

  containsTerm(line) {
    return line.toLowerCase().includes(this.searchTerm.toLowerCase());
  }
}

module.exports = FileSearcher;