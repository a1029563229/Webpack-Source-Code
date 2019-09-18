
const acorn = require('acorn');
const fs = require('fs');
const path = require('path');

function parseAndWrite() {
  let AST = acorn.parse(`
    const acorn = require('acorn');
    const fs = require('fs');
    const path = require('path');

    function parseAndWrite() {
      let AST = acorn.parse('');
      const AST_JSON = JSON.stringify(AST, null, 2);
      fs.writeFileSync(path.join(__dirname, './AST_X.json'), AST_JSON, { encoding: 'utf-8' });
    }

    parseAndWrite();
  `);
  const AST_JSON = JSON.stringify(AST, null, 2);
  fs.writeFileSync(path.join(__dirname, './AST_X.json'), AST_JSON, { encoding: 'utf-8' });
}

parseAndWrite();