"use strict";
const locales = require("koa-locales");
const fs = require("fs");
const path = require("path");

module.exports = {
  /**
   * 加载主题
   */
  loadTheme() {
    if (!this.config.i18n) {
      this.config.i18n = {};
    }

    if (!this.config.i18n.dirs) {
      this.config.i18n.dirs = [];
    }

    let themes = this.config.view.root ? this.config.view.root : [];
    if (!Array.isArray(themes)) {
      themes = themes.split(",");
    }

    const staticDirs = [];

    for (const themeRootPath of themes) {
      if (!fs.existsSync(themeRootPath)) {
        continue;
      }

      const dirs = fs.readdirSync(themeRootPath, "utf8");
      for (const filename of dirs) {
        const dir = path.join(themeRootPath, filename);
        if (fs.statSync(dir).isDirectory()) {
          const localesDir = path.join(dir, "locales");
          const staticDir = path.join(dir, "static");
          if (
            fs.existsSync(localesDir) &&
            fs.statSync(localesDir).isDirectory()
          ) {
            this.config.i18n.dirs.push(localesDir);
          }

          if (
            fs.existsSync(staticDir) &&
            fs.statSync(staticDir).isDirectory()
          ) {
            staticDirs.push({
              dir: staticDir,
              prefix: `/static/${filename}/`
            });
          }
        }
      }
    }

    this.config.themesStatic = staticDirs;

    this.app.logger.info(
      "[cocacms] Loading Theme Lauguage to App, Theme Lauguage is %j",
      this.config.i18n.dirs
    );

    locales(this.app, this.config.i18n);
  }
};
