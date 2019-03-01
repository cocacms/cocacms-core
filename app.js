"use strict";

module.exports = app => {
  // 注册主题静态资源解析
  const index = app.config.coreMiddleware.indexOf("bodyParser");
  if (index === -1) {
    app.config.coreMiddleware.push("themestatic");
  } else {
    app.config.coreMiddleware.splice(index, 0, "themestatic");
  }

  app.beforeStart(async () => {
    const ctx = app.createAnonymousContext();
    if (app.hooks && typeof app.hooks.appLoaded === "function") {
      await app.hooks.appLoaded(ctx);
    }

    for (const name in app.cocaPlugin.plugins) {
      app.cocaPlugin.reload(name);
    }

    // if (app.pluginHook.appLoaded && Array.isArray(app.pluginHook.appLoaded)) {
    //   for (const appLoaded of app.pluginHook.appLoaded) {
    //     await appLoaded(ctx);
    //   }
    // }
  });
};
