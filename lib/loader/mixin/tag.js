"use strict";
const fs = require("fs");
const path = require("path");

module.exports = {
  /**
   * 注册自定义模板标签
   */
  loadTag() {
    const directory = path.join(this.options.baseDir, "app/tag");

    const dirs = fs.readdirSync(directory, "utf8");
    for (const filename of dirs) {
      const dir = path.join(directory, filename);
      if (!fs.statSync(dir).isDirectory()) {
        const tagInstance = require(dir);
        const tag = filename.replace(".js", "");
        if (tag.indexOf("_") === 0) {
          continue;
        }
        this.app.nunjucks.addExtension(`${tag}Extension`, new tagInstance());

        this.app.logger.info(
          "[cocacms] Loading Nunjucks Tag to App, tag is %j",
          tag
        );
      }
    }
  }
};
