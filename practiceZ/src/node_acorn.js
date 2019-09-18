
const acorn = require('acorn');
const fs = require('fs');
const path = require('path');

function parseAndWrite() {
  let AST = acorn.parse('new Car()');
  AST = getPureAcornObj(AST.body[0]);
  const AST_JSON = JSON.stringify(AST, null, 2);
  fs.writeFileSync(path.join(__dirname, './AST.json'), AST_JSON, { encoding: 'utf-8' });
}

const NO_PURE_FIELDS = ['start', 'end'];
function getPureAcornObj(obj, newObj = {}) {
  if (Array.isArray(obj)) {
    return obj.map(item => getPureAcornObj(item));
  }

  for (let key in obj) {
    if (NO_PURE_FIELDS.includes(key)) continue;
    const val = obj[key];
    newObj[key] = typeof val === 'object'
      ? getPureAcornObj(val)
      : val;
  }
  return newObj;
}

parseAndWrite();