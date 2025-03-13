const { promptUser } = require('./src/cli');
const FileSearcher = require('./src/fileSearcher');
const chalk = require('chalk');

function colorize(text) {
  const lines = text.split('\n');
  return lines.map((line, index) => {
    const hue = (index * 10) % 360;
    const r = Math.floor(Math.sin(hue * Math.PI / 180) * 127 + 128);
    const g = Math.floor(Math.sin((hue + 120) * Math.PI / 180) * 127 + 128);
    const b = Math.floor(Math.sin((hue + 240) * Math.PI / 180) * 127 + 128);
    return chalk.rgb(r, g, b)(line);
  }).join('\n');
}

const ASCII_ART = `
  ___ ___ ___     _______                                                      
 |   Y   |   |   |   _   |                                                     
 |.  |   |.  |   |.  1   |                                                     
 |.  |   |.  |___|.  ____|                                                     
 |:  1   |:  1   |:  |                                                         
 |::.. . |::.. . |::.|                                                         
 \`-------\`-------\`---'                                                         
  _______ _______ _______ _______ _______ ___ ___     ___ ___ _______          
 |   _   |   _   |   _   |   _   |   _   |   Y   |   |   Y   |       |         
 |   1___|.  1___|.  1   |.  l   |.  1___|.  1   |   |.  |   |___|   |         
 |____   |.  __)_|.  _   |.  _   |.  |___|.  _   |   |.  |   |/  ___/          
 |:  1   |:  1   |:  |   |:  |   |:  1   |:  |   |   |:  1   |:  1  \\          
 |::.. . |::.. . |::.|:. |::.|:. |::.. . |::.|:. |    \\:.. ./|::.. . |         
 \`-------\`-------\`--- ---\`--- ---\`-------\`--- ---'     \`---' \`-------'         
  _______ ___ ___     _______ _______ _______ _______ _______  _______ _______ 
 |   _   |   Y   |   |   _   |   _   |   _   |   _   |   _   \\|   _   |   _   \\
 |.  1   |   1   |   |   1___|.  1___|.  |   |.  |   |.  1   /|.  1___|.  l   /
 |.  __   \\_   _/    |____   |.  |___|.  |   |.  |   |.  _   \\|.  __)_|.  _   1
 |:  1    \\|:  |     |:  1   |:  1   |:  1   |:  1   |:  1    |:  1   |:  |   |
 |::.. .  /|::.|     |::.. . |::.. . |::.. . |::.. . |::.. .  |::.. . |::.|:. |
 \`-------' \`---'     \`-------\`-------\`-------\`-------\`-------'\`-------\`--- ---'
`;

async function main() {
  try {
    // Display colored ASCII art
    console.log(colorize(ASCII_ART));
    console.log('\n'); // Add some spacing after the art

    // Get user input
    const { mode, searchTerm, inputFile, outputFile } = await promptUser();

    console.log('\n🚀 INICIANDO BUSCA...');
    console.log(`🔍 MODO: ${mode === 'cc' ? 'Extract credit cards' : 'Search for term'}`);
    console.log(`📄 ARQUIVO INICIAL: ${inputFile}`);
    console.log(`💾 ARQUIVO DE SAIDA: ${outputFile}\n`);

    // Execute search
    const searcher = new FileSearcher(inputFile, searchTerm, outputFile, mode);
    const matchCount = await searcher.search();

    console.log(`\n✅ BUSCA COMPLETA COM SUCESSO:`);
    console.log(`📊 ENCONTRADOS ${matchCount} NA BUSCA`);
    console.log(`💾 RESULTADOS NO ARQUIVO: ${outputFile} NA PASTA DATA`);

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();