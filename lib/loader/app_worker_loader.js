"use strict";
const path = require("path");

const egg = require("egg");

class CocaCmsAppWorkerLoader extends egg.AppWorkerLoader {
  loadConfig() {
    super.loadConfig();
    this.loadTheme();
  }

  load() {
    this.loadHook();
    super.load();
    this.app.logger.info("[cocacms] Start Loading CocaCMS");
    this.loadException();
    this.loadTag();
    this.loadCocaCmsPlugin();
  }

  /**
   * 加载异常扩展
   */
  loadException() {
    const directory = path.join(__dirname, "../exception");
    this.app.logger.info(
      "[cocacms] Loading Exception Extend to App, Exception is %j",
      directory
    );
    this.loadToApp(directory, "exception");
  }
}

const loaders = [
  require("./mixin/hook"),
  require("./mixin/plugin"),
  require("./mixin/tag"),
  require("./mixin/theme")
];

for (const loader of loaders) {
  Object.assign(CocaCmsAppWorkerLoader.prototype, loader);
}

module.exports = CocaCmsAppWorkerLoader;
