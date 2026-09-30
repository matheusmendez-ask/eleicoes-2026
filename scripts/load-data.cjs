// Carrega js/data.js (script de navegador) dentro do Node, sem dependências.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

function loadData() {
  const code = fs.readFileSync(path.join(ROOT, 'js', 'data.js'), 'utf8');
  return vm.runInNewContext(`${code}\n;ELECTION_DATA`, {}, { filename: 'js/data.js' });
}

module.exports = { ROOT, loadData };
