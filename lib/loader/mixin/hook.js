"use strict";
const path = require("path");

module.exports = {
  /**
   * 加载hook
   */
  loadHook() {
    const directory = path.join(this.options.baseDir, "app/hook");
    this.app.logger.info(
      "[cocacms] Loading Hook Extend to App, hook is %j",
      directory
    );
    this.loadToApp([path.join(__dirname, "app/hook"), directory], "hooks");
  }
};
