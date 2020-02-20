const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');

let ID = 0;

function createAssets(filename) {
  const entryContent = fs.readFileSync(filename, 'utf-8');

  let AST = parser.parse(entryContent, {
    sourceType: "module",
  });

  // 依赖项
  const dependencies = [];

  // visitor
  traverse(AST, {
    ImportDeclaration: (path) => {
      const node = path.node;
      const value = node.source.value;

      dependencies.push(value);
    }
  })

  const { code } = babel.transformFromAstSync(AST, null, {
    presets: ['@babel/preset-env']
  })

  let id = ID++;

  return {
    id,
    filename,
    dependencies,
    code,
  }
}

function createGraph(filename) {
  const entryFileInfos = createAssets(filename);

  const queue = [entryFileInfos];
  const dependenciesHash = {};

  for (let asset of queue) {
    const dirName = path.dirname(asset.filename);

    // 存放依赖关系
    asset.mapping = {};
    asset.dependencies.forEach((relativePath) => {
      const absoluteName = path.join(dirName, relativePath);
      const childsInfos = createAssets(absoluteName);

      asset.mapping[relativePath] = childsInfos.id;

      // 依赖去重
      if (!dependenciesHash[absoluteName]) {
        dependenciesHash[absoluteName] = childsInfos.id;
        asset.mapping[relativePath] = childsInfos.id;
        queue.push(childsInfos);
      } else {
        asset.mapping[relativePath] = dependenciesHash[absoluteName];
      }
    });
  }

  console.log('queue', queue);

  return queue;
}

function bundle(graph) {
  let modules = '';

  graph.forEach((mod) => {
    modules += `
      ${mod.id}: [
        // 这里可以了解下 CommonJS、CMD 模块系统的实现
        function(require, module, exports){
          ${mod.code}
        },
        ${JSON.stringify(mod.mapping)}
      ],
    `
  });

  return `
    (function(modules){

      function require(id) {
        const [fn, mapping] = modules[id];

        console.log('mapping', mapping);

        function localRequire(relativePath) {
          console.log('mapping[relativePath]', mapping[relativePath]);
          return require(mapping[relativePath]);
        }

        const module = {
          exports: {}
        }

        // 实现包装每个 JS 文件的 require、mudule、exports
        fn(localRequire, module, module.exports);

        return module.exports;
      }

      // 执行 require(0)，即是执行入口文件
      require(0);
    })({${modules}})
  `;
}

const graph = createGraph('./src/index.js');
const result = bundle(graph);

console.log('result', result);
fs.mkdir('./dist', 0777, function (err) {
  fs.writeFileSync("./dist/index.bundle.js", result);
});
