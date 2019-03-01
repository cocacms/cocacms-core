"use strict";
const path = require("path");
const fs = require("fs");
const Cache = require("file-system-cache");

class Plugin {
  constructor(app, plugins) {
    this.app = app;
    this.plugins = plugins;
    this.caller = {};
    this.cache = Cache.default({
      basePath: path.join(app.baseDir, "config/cocacms/.cache"),
      ns: "plugin"
    });
  }

  _getCocaPluginRunner(plugin) {
    const fullpath = path.join(plugin.path, "index.js");
    if (!fs.existsSync(fullpath)) {
      this.error(`${fullpath}不存在`);
    }
    const Class = require(fullpath);
    return new Class(this.app.createAnonymousContext(), plugin.setting);
  }

  reload(name) {
    let plugin = this.cache.getSync(name, null);
    // 不存在缓存
    if (!plugin) {
      plugin = this.plugins[name];
    }

    if (plugin.install === true && plugin.enable === true) {
      delete this.caller[plugin.name];
      this.caller[plugin.name] = this._getCocaPluginRunner(plugin);
    } else {
      delete this.caller[plugin.name];
    }

    return plugin;
  }

  get(name) {
    let plugin = this.cache.getSync(name, null);
    if (!plugin) {
      plugin = this.reload(name);
    }
    return plugin;
  }

  set(name, key, value) {
    let plugin = this.cache.getSync(name, null);
    if (!plugin) {
      plugin = this.reload(name);
    }

    plugin[key] = value;
    this.cache.setSync(name, plugin);
    this.reload(name);
  }

  install(name) {
    const plugin = this.plugins[name];
    const _o = this._getCocaPluginRunner(plugin);

    _o.install && _o.install();
    this.set(name, "install", true);
  }

  uninstall(name) {
    const plugin = this.plugins[name];
    const _o = this._getCocaPluginRunner(plugin);

    _o.uninstall && _o.uninstall();
    this.set(name, "install", true);
  }
}
module.exports = {
  /**
   * 获取cms插件
   */
  loadCocaCmsPlugin() {
    // loader plugins from application
    const appPlugins = this.readPluginConfigs(
      path.join(this.options.baseDir, "config/cocacms/plugin.default")
    );

    // loader plugins from framework
    const eggPluginConfigPaths = this.eggPaths.map(eggPath =>
      path.join(eggPath, "config/cocacms/plugin.default")
    );
    const eggPlugins = this.readPluginConfigs(eggPluginConfigPaths);

    this.allCocaPlugins = {};
    this.appCocaPlugins = appPlugins;
    this.eggCocaPlugins = eggPlugins;

    this._extendPlugins(this.allCocaPlugins, eggPlugins);
    this._extendPlugins(this.allCocaPlugins, appPlugins);

    const plugins = {};
    const env = this.serverEnv;
    for (const name in this.allCocaPlugins) {
      const plugin = this.allCocaPlugins[name];

      // resolve the real plugin.path based on plugin or package
      plugin.path = this.getPluginPath(plugin, this.options.baseDir);

      // read plugin information from ${plugin.path}/package.json
      this.mergePluginConfig(plugin);

      // disable the plugin that not match the serverEnv
      if (env && plugin.env.length && !plugin.env.includes(env)) {
        this.options.logger.info(
          "Plugin %s is disabled by env unmatched, require env(%s) but got env is %s",
          name,
          plugin.env,
          env
        );
        plugin.enable = false;
        continue;
      }

      plugins[name] = plugin;
    }

    for (const name in plugins) {
      const plugin = plugins[name];
      const configPath = path.join(plugin.path, "config.js");
      if (fs.existsSync(configPath)) {
        plugin.config = Object.assign({}, require(configPath));
        plugin.setting = {};
      }
    }

    this.options.app.cocaPlugin = new Plugin(this.app, plugins);
  }
};
