"use strict";
const egg = require("egg");

const Application = require("./lib/application.js");
const Agent = require("./lib/agent.js");
const AppWorkerLoader = require("./lib/loader/app_worker_loader.js");

module.exports = Object.assign(egg, {
  Application,
  Agent,
  AppWorkerLoader
});
