
const acorn = require('acorn');
const escodegen = require('escodegen');

const funFile = `
  // 打印
  const bar = () => {
    console.log(true);
  };
`
const comments = [];

const AST = acorn.parse(funFile, {
  ranges: true,
  locations: true,
  ecmaVersion: 11,
  sourceType: "module",
  onComment: comments
});

AST.comments = comments;
console.log(AST);

const instance = escodegen.generate(AST);

console.log(instance);