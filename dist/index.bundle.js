
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
    })({
      0: [
        // 这里可以了解下 CommonJS、CMD 模块系统的实现
        function(require, module, exports){
          "use strict";

var _hello = _interopRequireDefault(require("./hello.js"));

var _hi = _interopRequireDefault(require("./hi.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

console.log(_hello["default"] + _hi["default"]);
        },
        {"./hello.js":1,"./hi.js":2}
      ],
    
      1: [
        // 这里可以了解下 CommonJS、CMD 模块系统的实现
        function(require, module, exports){
          "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _component = require("./component.js");

var str = "A mini ".concat(_component.component);
var _default = str;
exports["default"] = _default;
        },
        {"./component.js":3}
      ],
    
      2: [
        // 这里可以了解下 CommonJS、CMD 模块系统的实现
        function(require, module, exports){
          "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _component = require("./component.js");

var str = "B mini ".concat(_component.component);
var _default = str;
exports["default"] = _default;
        },
        {"./component.js":3}
      ],
    
      3: [
        // 这里可以了解下 CommonJS、CMD 模块系统的实现
        function(require, module, exports){
          "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.component = void 0;
var component = 'Webpack';
exports.component = component;
        },
        {}
      ],
    })
  