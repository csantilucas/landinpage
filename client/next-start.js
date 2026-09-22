const path = require('path');

// Garante que o diretório de trabalho seja a pasta client
process.chdir(__dirname);

// Define as variáveis de ambiente de produção
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '3000';

// Inicia o binário oficial do Next.js
process.argv = [process.argv[0], path.resolve(__dirname, 'node_modules/next/dist/bin/next'), 'start'];
require('./node_modules/next/dist/bin/next');