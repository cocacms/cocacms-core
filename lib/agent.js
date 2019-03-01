"use strict";
const path = require("path");
const egg = require("egg");

const EGG_PATH = Symbol.for("egg#eggPath");

class CocaCmsAgent extends egg.Agent {
  get [EGG_PATH]() {
    return path.dirname(__dirname);
  }
}

module.exports = CocaCmsAgent;
