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

Babel Traverse（遍历）模块维护了整棵树的状态，并且负责替换、移除和添加节点。我们可以和 Babylon 一起使用来遍历和更新节点。

```javascript
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";

const code = `function square(n) {
  return n * n;
}`;

const ast = parser.parse(code);

traverse(ast, {
  enter(path) {
    if (path.isIdentifier({ name: "n" })) {
      path.node.name = "x";
    }
  }
});
```

### @babel/core 、@babel/preset-env

将 ES6 编译的的 AST 代码转回 ES5 语法代码。