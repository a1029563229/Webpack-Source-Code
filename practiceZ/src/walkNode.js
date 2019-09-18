const ast = require('./AST_X');

function walk(tree, dependencies = []) {
  if (!tree || typeof tree !== 'object' || !tree.type) return;
  const dependency = getDependency(tree);
  if (typeof dependency === 'string') return dependencies.push(dependency);
  for (let key in tree) {
    const v = tree[key];
    if (Array.isArray(v)) {
      v.map(item => walk(item, dependencies));
    } else if (typeof v === 'object') {
      walk(v, dependencies);
    }
  }
  return dependencies;
}

function getDependency(tree) {
  if (
    tree.type === 'CallExpression' &&
    tree.callee &&
    tree.callee.type === 'Identifier' &&
    tree.callee.name === 'require' &&
    tree.arguments.length === 1 &&
    tree.arguments[0].type === 'Literal'
  ) {
    return tree.arguments[0].value;
  }
  return tree;
}

const dependencies = walk(ast);
console.log(dependencies);