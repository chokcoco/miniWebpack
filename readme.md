## miniWebpack

## Dependencies 
```
{
  "@babel/core": "^7.8.4",
  "@babel/parser": "^7.8.4",
  "@babel/preset-env": "^7.8.4",
  "@babel/traverse": "^7.8.4"
}
```

### @babel/parser

编译代码拿到 AST。

```javascript
var fs = require('fs');
var parser = require('@babel/parser');

function entryRead(pathname) {
  const entryContent = fs.readFileSync(pathname, 'utf-8');

  let AST = parser.parse(entryContent, {
    sourceType: "module",
  });
}

entryRead('./src/index.js');
```

### @babel/traverse

Babel Traverse（遍历）模块维护了整棵树的状态，并且负责替换、移除和添加节点。

我们使用 @babel/traverse 递归（或者使用队列）拿到所有依赖文件信息数组。

```javascript
const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

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
```

### @babel/core 、@babel/preset-env

将 ES6 编译的的 AST 代码转回 ES5 语法代码。’

## Run

```
$ node webpack.config.js
```
