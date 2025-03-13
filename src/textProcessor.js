const { CC_PATTERN, CONSULTAVEL_PATTERN, PHONE_PATTERN, CPF_PATTERN, GOV_PATTERN, GOV_DOMAINS, CONSULTATION_PATTERN, CONSULTATION_DOMAINS } = require('./utils/regex');
const path = require('path');
const fs = require('fs').promises;

class TextProcessor {
  static async processLine(line, mode) {
    const trimmedLine = line.trim();
    
    if (mode === 'cc') {
      const match = trimmedLine.match(CC_PATTERN.CARD_FORMAT);
      if (match) {
        return `${match[1]}|${match[2]}|${match[3]}|${match[4]}`;
      }
      return null;
    }

    if (mode === 'consultavel') {
      // Remove all spaces from the line for better matching
      const noSpacesLine = trimmedLine.replace(/\s+/g, '');
      
      // First try to match the full pattern with validity and CVV
      const fullMatch = noSpacesLine.match(CONSULTAVEL_PATTERN.FORMAT);
      if (fullMatch) {
        const cardNumber = `${fullMatch[1]} ${fullMatch[2]} ${fullMatch[3]}:${fullMatch[4]}`;
        const senha = fullMatch[5];
        const validity = fullMatch[6];
        const year = fullMatch[7];
        const cvv = fullMatch[8];
        
        if (validity && year && cvv) {
          return `CONSULTAVEL - ${cardNumber} - SENHA ${senha} - VALIDADE ${validity}/${year} - CVV ${cvv}`;
        }
        return `CONSULTAVEL - ${cardNumber} - SENHA ${senha}`;
      }

      // If no full match, try to find just the card pattern
      const cardMatch = noSpacesLine.match(CONSULTAVEL_PATTERN.CARD_ONLY);
      if (cardMatch) {
        // Look for validity and CVV pattern in the rest of the line
        const validityMatch = noSpacesLine.match(/\|(\d{2})\|(\d{4})\|(\d{3})/);
        if (validityMatch) {
          const cardNumber = `${cardMatch[1]} ${cardMatch[2]} ${cardMatch[3]}:${cardMatch[4]}`;
          const validity = validityMatch[1];
          const year = validityMatch[2];
          const cvv = validityMatch[3];
          return `CONSULTAVEL - ${cardNumber} - VALIDADE ${validity}/${year} - CVV ${cvv}`;
        }
        const cardNumber = `${cardMatch[1]} ${cardMatch[2]} ${cardMatch[3]}:${cardMatch[4]}`;
        return `CONSULTAVEL - ${cardNumber}`;
      }
      
      return null;
    }

    if (mode === 'phone') {
      const match = trimmedLine.match(PHONE_PATTERN.FORMAT);
      if (match) {
        return `+55${match[1]}:${match[2]}`;
      }
      return null;
    }

    if (mode === 'cpf6') {
      const match = trimmedLine.match(CPF_PATTERN.FORMAT_6);
      if (match) {
        return `${match[1].replace(/[.-]/g, '')}:${match[2]}`;
      }
      return null;
    }

    if (mode === 'cpf8') {
      const match = trimmedLine.match(CPF_PATTERN.FORMAT_8);
      if (match) {
        return `${match[1].replace(/[.-]/g, '')}:${match[2]}`;
      }
      return null;
    }

    if (mode === 'cpfalpha') {
      const match = trimmedLine.match(CPF_PATTERN.FORMAT_ALPHANUM);
      if (match) {
        return `${match[1].replace(/[.-]/g, '')}:${match[2]}`;
      }
      return null;
    }

    if (mode === 'gov') {
      const match = trimmedLine.match(GOV_PATTERN.FORMAT);
      if (match) {
        const [, domain, password] = match;
        const cleanDomain = domain.toLowerCase();
        
        // Check if the domain matches any of our target domains
        const matchedDomain = GOV_DOMAINS.find(govDomain => 
          cleanDomain.includes(govDomain) || 
          cleanDomain.endsWith('.gov.br')
        );

        if (matchedDomain) {
          const outputDir = path.join('data', 'gov_logins', cleanDomain);
          await fs.mkdir(outputDir, { recursive: true });
          
          const outputPath = path.join(outputDir, 'logins.txt');
          await fs.appendFile(outputPath, `${trimmedLine}\n`);
          
          return `${cleanDomain}:${password}`;
        }
      }
      return null;
    }

    if (mode === 'consultation') {
      const match = trimmedLine.match(CONSULTATION_PATTERN.FORMAT);
      if (match) {
        const [, domain, password] = match;
        const cleanDomain = domain.toLowerCase();
        
        // Check if the domain matches any of our consultation domains
        const matchedDomain = CONSULTATION_DOMAINS.find(consultDomain => 
          cleanDomain.includes(consultDomain)
        );

        if (matchedDomain) {
          const outputDir = path.join('data', 'consultation_logins', cleanDomain);
          await fs.mkdir(outputDir, { recursive: true });
          
          const outputPath = path.join(outputDir, 'logins.txt');
          await fs.appendFile(outputPath, `${trimmedLine}\n`);
          
          return `${cleanDomain}:${password}`;
        }
      }
      return null;
    }

    // Original processing logic for term search
    const parts = trimmedLine.split(/[\s:]+/);
    if (parts.length >= 2) {
      const username = parts[parts.length - 2];
      const password = parts[parts.length - 1];
      return `${username}:${password}`;
    }
    return null;
  }
}

module.exports = TextProcessor;