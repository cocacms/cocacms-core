"use strict";
const path = require("path");
const egg = require("egg");
const Router = require("./router.js");
const CocaCmsAppWorkerLoader = require("./loader/app_worker_loader.js");

const EGG_PATH = Symbol.for("egg#eggPath");
const EGG_LOADER = Symbol.for("egg#loader");
const ROUTER = Symbol("EggCore#router");

class CocaCmsApplication extends egg.Application {
  get [EGG_PATH]() {
    return path.dirname(__dirname);
  }
  get [EGG_LOADER]() {
    return CocaCmsAppWorkerLoader;
  }
  /**
   * get router
   * @member {Router} EggCore#router
   * @since 1.0.0
   */
  get router() {
    if (this[ROUTER]) {
      return this[ROUTER];
    }
    const router = (this[ROUTER] = new Router({ sensitive: true }, this));
    // register router middleware
    this.beforeStart(() => {
      this.use(router.middleware());
    });
    return router;
  }
}
module.exports = CocaCmsApplication;
