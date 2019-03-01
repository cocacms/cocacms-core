"use strict";

const range = require("koa-range");
const compose = require("koa-compose");
const staticCache = require("koa-static-cache");
const LRU = require("ylru");

module.exports = (_, app) => {
  const options = app.config.static;
  const themesStatic = app.config.themesStatic || [];

  function rangeMiddleware(ctx, next) {
    if (options.prefix && !ctx.path.startsWith(options.prefix)) return next();
    return range(ctx, next);
  }

  const middlewares = [rangeMiddleware];

  for (const staticOption of themesStatic) {
    const newOptions = Object.assign({}, options, staticOption);
    if (newOptions.dynamic && !newOptions.files) {
      newOptions.files = new LRU(newOptions.maxFiles);
    }

    app.logger.info(
      "[egg-static] starting static serve %s -> %s",
      newOptions.prefix,
      newOptions.dir
    );
    middlewares.push(staticCache(newOptions));
  }

  return compose(middlewares);
};
