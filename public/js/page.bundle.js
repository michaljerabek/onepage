/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] =
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}

/******/
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "54ba3f0cff6f5bcae5d4"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				Object.defineProperty(fn, name, (function(name) {
/******/ 					return {
/******/ 						configurable: true,
/******/ 						enumerable: true,
/******/ 						get: function() {
/******/ 							return __webpack_require__[name];
/******/ 						},
/******/ 						set: function(value) {
/******/ 							__webpack_require__[name] = value;
/******/ 						}
/******/ 					};
/******/ 				}(name)));
/******/ 			}
/******/ 		}
/******/ 		Object.defineProperty(fn, "e", {
/******/ 			enumerable: true,
/******/ 			value: function(chunkId) {
/******/ 				if(hotStatus === "ready")
/******/ 					hotSetStatus("prepare");
/******/ 				hotChunksLoading++;
/******/ 				return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 					finishChunkLoading();
/******/ 					throw err;
/******/ 				});
/******/
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		});
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(__webpack_require__.s === moduleId) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					dependency = moduleOutdatedDependencies[j];
/******/ 					idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return Promise.resolve(outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].e;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			e: {},
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.e, module, module.e, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.e;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost/js/";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(32)(__webpack_require__.s = 32);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {


	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.e = __webpack_require__(42);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome
	               && 'undefined' != typeof chrome.storage
	                  ? chrome.storage.local
	                  : localstorage();

	/**
	 * Colors.
	 */

	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];

	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */

	function useColors() {
	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  return ('WebkitAppearance' in document.documentElement.style) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (window.console && (console.firebug || (console.exception && console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
	}

	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	exports.formatters.j = function(v) {
	  return JSON.stringify(v);
	};


	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */

	function formatArgs() {
	  var args = arguments;
	  var useColors = this.useColors;

	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);

	  if (!useColors) return args;

	  var c = 'color: ' + this.color;
	  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });

	  args.splice(lastC, 0, c);
	  return args;
	}

	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */

	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === typeof console
	    && console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */

	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch(e) {}
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */

	function load() {
	  var r;
	  try {
	    r = exports.storage.debug;
	  } catch(e) {}
	  return r;
	}

	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */

	exports.enable(load());

	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */

	function localstorage(){
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies.
	 */

	var keys = __webpack_require__(49);
	var hasBinary = __webpack_require__(50);
	var sliceBuffer = __webpack_require__(38);
	var base64encoder = __webpack_require__(40);
	var after = __webpack_require__(36);
	var utf8 = __webpack_require__(61);

	/**
	 * Check if we are running an android browser. That requires us to use
	 * ArrayBuffer with polling transports...
	 *
	 * http://ghinda.net/jpeg-blob-ajax-android/
	 */

	var isAndroid = navigator.userAgent.match(/Android/i);

	/**
	 * Check if we are running in PhantomJS.
	 * Uploading a Blob with PhantomJS does not work correctly, as reported here:
	 * https://github.com/ariya/phantomjs/issues/11395
	 * @type boolean
	 */
	var isPhantomJS = /PhantomJS/i.test(navigator.userAgent);

	/**
	 * When true, avoids using Blobs to encode payloads.
	 * @type boolean
	 */
	var dontSendBlobs = isAndroid || isPhantomJS;

	/**
	 * Current protocol version.
	 */

	exports.protocol = 3;

	/**
	 * Packet types.
	 */

	var packets = exports.packets = {
	    open:     0    // non-ws
	  , close:    1    // non-ws
	  , ping:     2
	  , pong:     3
	  , message:  4
	  , upgrade:  5
	  , noop:     6
	};

	var packetslist = keys(packets);

	/**
	 * Premade error packet.
	 */

	var err = { type: 'error', data: 'parser error' };

	/**
	 * Create a blob api even for blob builder when vendor prefixes exist
	 */

	var Blob = __webpack_require__(41);

	/**
	 * Encodes a packet.
	 *
	 *     <packet type id> [ <data> ]
	 *
	 * Example:
	 *
	 *     5hello world
	 *     3
	 *     4
	 *
	 * Binary is encoded in an identical principle
	 *
	 * @api private
	 */

	exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
	  if ('function' == typeof supportsBinary) {
	    callback = supportsBinary;
	    supportsBinary = false;
	  }

	  if ('function' == typeof utf8encode) {
	    callback = utf8encode;
	    utf8encode = null;
	  }

	  var data = (packet.data === undefined)
	    ? undefined
	    : packet.data.buffer || packet.data;

	  if (global.ArrayBuffer && data instanceof ArrayBuffer) {
	    return encodeArrayBuffer(packet, supportsBinary, callback);
	  } else if (Blob && data instanceof global.Blob) {
	    return encodeBlob(packet, supportsBinary, callback);
	  }

	  // might be an object with { base64: true, data: dataAsBase64String }
	  if (data && data.base64) {
	    return encodeBase64Object(packet, callback);
	  }

	  // Sending data as a utf-8 string
	  var encoded = packets[packet.type];

	  // data fragment is optional
	  if (undefined !== packet.data) {
	    encoded += utf8encode ? utf8.encode(String(packet.data)) : String(packet.data);
	  }

	  return callback('' + encoded);

	};

	function encodeBase64Object(packet, callback) {
	  // packet data is an object { base64: true, data: dataAsBase64String }
	  var message = 'b' + exports.packets[packet.type] + packet.data.data;
	  return callback(message);
	}

	/**
	 * Encode packet helpers for binary types
	 */

	function encodeArrayBuffer(packet, supportsBinary, callback) {
	  if (!supportsBinary) {
	    return exports.encodeBase64Packet(packet, callback);
	  }

	  var data = packet.data;
	  var contentArray = new Uint8Array(data);
	  var resultBuffer = new Uint8Array(1 + data.byteLength);

	  resultBuffer[0] = packets[packet.type];
	  for (var i = 0; i < contentArray.length; i++) {
	    resultBuffer[i+1] = contentArray[i];
	  }

	  return callback(resultBuffer.buffer);
	}

	function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
	  if (!supportsBinary) {
	    return exports.encodeBase64Packet(packet, callback);
	  }

	  var fr = new FileReader();
	  fr.onload = function() {
	    packet.data = fr.result;
	    exports.encodePacket(packet, supportsBinary, true, callback);
	  };
	  return fr.readAsArrayBuffer(packet.data);
	}

	function encodeBlob(packet, supportsBinary, callback) {
	  if (!supportsBinary) {
	    return exports.encodeBase64Packet(packet, callback);
	  }

	  if (dontSendBlobs) {
	    return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
	  }

	  var length = new Uint8Array(1);
	  length[0] = packets[packet.type];
	  var blob = new Blob([length.buffer, packet.data]);

	  return callback(blob);
	}

	/**
	 * Encodes a packet with binary data in a base64 string
	 *
	 * @param {Object} packet, has `type` and `data`
	 * @return {String} base64 encoded message
	 */

	exports.encodeBase64Packet = function(packet, callback) {
	  var message = 'b' + exports.packets[packet.type];
	  if (Blob && packet.data instanceof global.Blob) {
	    var fr = new FileReader();
	    fr.onload = function() {
	      var b64 = fr.result.split(',')[1];
	      callback(message + b64);
	    };
	    return fr.readAsDataURL(packet.data);
	  }

	  var b64data;
	  try {
	    b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
	  } catch (e) {
	    // iPhone Safari doesn't let you apply with typed arrays
	    var typed = new Uint8Array(packet.data);
	    var basic = new Array(typed.length);
	    for (var i = 0; i < typed.length; i++) {
	      basic[i] = typed[i];
	    }
	    b64data = String.fromCharCode.apply(null, basic);
	  }
	  message += global.btoa(b64data);
	  return callback(message);
	};

	/**
	 * Decodes a packet. Changes format to Blob if requested.
	 *
	 * @return {Object} with `type` and `data` (if any)
	 * @api private
	 */

	exports.decodePacket = function (data, binaryType, utf8decode) {
	  // String data
	  if (typeof data == 'string' || data === undefined) {
	    if (data.charAt(0) == 'b') {
	      return exports.decodeBase64Packet(data.substr(1), binaryType);
	    }

	    if (utf8decode) {
	      try {
	        data = utf8.decode(data);
	      } catch (e) {
	        return err;
	      }
	    }
	    var type = data.charAt(0);

	    if (Number(type) != type || !packetslist[type]) {
	      return err;
	    }

	    if (data.length > 1) {
	      return { type: packetslist[type], data: data.substring(1) };
	    } else {
	      return { type: packetslist[type] };
	    }
	  }

	  var asArray = new Uint8Array(data);
	  var type = asArray[0];
	  var rest = sliceBuffer(data, 1);
	  if (Blob && binaryType === 'blob') {
	    rest = new Blob([rest]);
	  }
	  return { type: packetslist[type], data: rest };
	};

	/**
	 * Decodes a packet encoded in a base64 string
	 *
	 * @param {String} base64 encoded message
	 * @return {Object} with `type` and `data` (if any)
	 */

	exports.decodeBase64Packet = function(msg, binaryType) {
	  var type = packetslist[msg.charAt(0)];
	  if (!global.ArrayBuffer) {
	    return { type: type, data: { base64: true, data: msg.substr(1) } };
	  }

	  var data = base64encoder.decode(msg.substr(1));

	  if (binaryType === 'blob' && Blob) {
	    data = new Blob([data]);
	  }

	  return { type: type, data: data };
	};

	/**
	 * Encodes multiple messages (payload).
	 *
	 *     <length>:data
	 *
	 * Example:
	 *
	 *     11:hello world2:hi
	 *
	 * If any contents are binary, they will be encoded as base64 strings. Base64
	 * encoded strings are marked with a b before the length specifier
	 *
	 * @param {Array} packets
	 * @api private
	 */

	exports.encodePayload = function (packets, supportsBinary, callback) {
	  if (typeof supportsBinary == 'function') {
	    callback = supportsBinary;
	    supportsBinary = null;
	  }

	  var isBinary = hasBinary(packets);

	  if (supportsBinary && isBinary) {
	    if (Blob && !dontSendBlobs) {
	      return exports.encodePayloadAsBlob(packets, callback);
	    }

	    return exports.encodePayloadAsArrayBuffer(packets, callback);
	  }

	  if (!packets.length) {
	    return callback('0:');
	  }

	  function setLengthHeader(message) {
	    return message.length + ':' + message;
	  }

	  function encodeOne(packet, doneCallback) {
	    exports.encodePacket(packet, !isBinary ? false : supportsBinary, true, function(message) {
	      doneCallback(null, setLengthHeader(message));
	    });
	  }

	  map(packets, encodeOne, function(err, results) {
	    return callback(results.join(''));
	  });
	};

	/**
	 * Async array map using after
	 */

	function map(ary, each, done) {
	  var result = new Array(ary.length);
	  var next = after(ary.length, done);

	  var eachWithIndex = function(i, el, cb) {
	    each(el, function(error, msg) {
	      result[i] = msg;
	      cb(error, result);
	    });
	  };

	  for (var i = 0; i < ary.length; i++) {
	    eachWithIndex(i, ary[i], next);
	  }
	}

	/*
	 * Decodes data when a payload is maybe expected. Possible binary contents are
	 * decoded from their base64 representation
	 *
	 * @param {String} data, callback method
	 * @api public
	 */

	exports.decodePayload = function (data, binaryType, callback) {
	  if (typeof data != 'string') {
	    return exports.decodePayloadAsBinary(data, binaryType, callback);
	  }

	  if (typeof binaryType === 'function') {
	    callback = binaryType;
	    binaryType = null;
	  }

	  var packet;
	  if (data == '') {
	    // parser error - ignoring payload
	    return callback(err, 0, 1);
	  }

	  var length = ''
	    , n, msg;

	  for (var i = 0, l = data.length; i < l; i++) {
	    var chr = data.charAt(i);

	    if (':' != chr) {
	      length += chr;
	    } else {
	      if ('' == length || (length != (n = Number(length)))) {
	        // parser error - ignoring payload
	        return callback(err, 0, 1);
	      }

	      msg = data.substr(i + 1, n);

	      if (length != msg.length) {
	        // parser error - ignoring payload
	        return callback(err, 0, 1);
	      }

	      if (msg.length) {
	        packet = exports.decodePacket(msg, binaryType, true);

	        if (err.type == packet.type && err.data == packet.data) {
	          // parser error in individual packet - ignoring payload
	          return callback(err, 0, 1);
	        }

	        var ret = callback(packet, i + n, l);
	        if (false === ret) return;
	      }

	      // advance cursor
	      i += n;
	      length = '';
	    }
	  }

	  if (length != '') {
	    // parser error - ignoring payload
	    return callback(err, 0, 1);
	  }

	};

	/**
	 * Encodes multiple messages (payload) as binary.
	 *
	 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
	 * 255><data>
	 *
	 * Example:
	 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
	 *
	 * @param {Array} packets
	 * @return {ArrayBuffer} encoded payload
	 * @api private
	 */

	exports.encodePayloadAsArrayBuffer = function(packets, callback) {
	  if (!packets.length) {
	    return callback(new ArrayBuffer(0));
	  }

	  function encodeOne(packet, doneCallback) {
	    exports.encodePacket(packet, true, true, function(data) {
	      return doneCallback(null, data);
	    });
	  }

	  map(packets, encodeOne, function(err, encodedPackets) {
	    var totalLength = encodedPackets.reduce(function(acc, p) {
	      var len;
	      if (typeof p === 'string'){
	        len = p.length;
	      } else {
	        len = p.byteLength;
	      }
	      return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
	    }, 0);

	    var resultArray = new Uint8Array(totalLength);

	    var bufferIndex = 0;
	    encodedPackets.forEach(function(p) {
	      var isString = typeof p === 'string';
	      var ab = p;
	      if (isString) {
	        var view = new Uint8Array(p.length);
	        for (var i = 0; i < p.length; i++) {
	          view[i] = p.charCodeAt(i);
	        }
	        ab = view.buffer;
	      }

	      if (isString) { // not true binary
	        resultArray[bufferIndex++] = 0;
	      } else { // true binary
	        resultArray[bufferIndex++] = 1;
	      }

	      var lenStr = ab.byteLength.toString();
	      for (var i = 0; i < lenStr.length; i++) {
	        resultArray[bufferIndex++] = parseInt(lenStr[i]);
	      }
	      resultArray[bufferIndex++] = 255;

	      var view = new Uint8Array(ab);
	      for (var i = 0; i < view.length; i++) {
	        resultArray[bufferIndex++] = view[i];
	      }
	    });

	    return callback(resultArray.buffer);
	  });
	};

	/**
	 * Encode as Blob
	 */

	exports.encodePayloadAsBlob = function(packets, callback) {
	  function encodeOne(packet, doneCallback) {
	    exports.encodePacket(packet, true, true, function(encoded) {
	      var binaryIdentifier = new Uint8Array(1);
	      binaryIdentifier[0] = 1;
	      if (typeof encoded === 'string') {
	        var view = new Uint8Array(encoded.length);
	        for (var i = 0; i < encoded.length; i++) {
	          view[i] = encoded.charCodeAt(i);
	        }
	        encoded = view.buffer;
	        binaryIdentifier[0] = 0;
	      }

	      var len = (encoded instanceof ArrayBuffer)
	        ? encoded.byteLength
	        : encoded.size;

	      var lenStr = len.toString();
	      var lengthAry = new Uint8Array(lenStr.length + 1);
	      for (var i = 0; i < lenStr.length; i++) {
	        lengthAry[i] = parseInt(lenStr[i]);
	      }
	      lengthAry[lenStr.length] = 255;

	      if (Blob) {
	        var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
	        doneCallback(null, blob);
	      }
	    });
	  }

	  map(packets, encodeOne, function(err, results) {
	    return callback(new Blob(results));
	  });
	};

	/*
	 * Decodes data when a payload is maybe expected. Strings are decoded by
	 * interpreting each byte as a key code for entries marked to start with 0. See
	 * description of encodePayloadAsBinary
	 *
	 * @param {ArrayBuffer} data, callback method
	 * @api public
	 */

	exports.decodePayloadAsBinary = function (data, binaryType, callback) {
	  if (typeof binaryType === 'function') {
	    callback = binaryType;
	    binaryType = null;
	  }

	  var bufferTail = data;
	  var buffers = [];

	  var numberTooLong = false;
	  while (bufferTail.byteLength > 0) {
	    var tailArray = new Uint8Array(bufferTail);
	    var isString = tailArray[0] === 0;
	    var msgLength = '';

	    for (var i = 1; ; i++) {
	      if (tailArray[i] == 255) break;

	      if (msgLength.length > 310) {
	        numberTooLong = true;
	        break;
	      }

	      msgLength += tailArray[i];
	    }

	    if(numberTooLong) return callback(err, 0, 1);

	    bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
	    msgLength = parseInt(msgLength);

	    var msg = sliceBuffer(bufferTail, 0, msgLength);
	    if (isString) {
	      try {
	        msg = String.fromCharCode.apply(null, new Uint8Array(msg));
	      } catch (e) {
	        // iPhone Safari doesn't let you apply to typed arrays
	        var typed = new Uint8Array(msg);
	        msg = '';
	        for (var i = 0; i < typed.length; i++) {
	          msg += String.fromCharCode(typed[i]);
	        }
	      }
	    }

	    buffers.push(msg);
	    bufferTail = sliceBuffer(bufferTail, msgLength);
	  }

	  var total = buffers.length;
	  buffers.forEach(function(buffer, i) {
	    callback(exports.decodePacket(buffer, binaryType, true), i, total);
	  });
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.e = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			Object.defineProperty(module, "exports", {
				enumerable: true,
				configurable: false,
				get: function() { return module.e; },
				set: function(v) { return module.e = v; }
			});
			Object.defineProperty(module, "loaded", {
				enumerable: true,
				configurable: false,
				get: function() { return module.l; }
			});
			Object.defineProperty(module, "id", {
				enumerable: true,
				configurable: false,
				get: function() { return module.i; }
			});
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {


	/**
	 * Expose `Emitter`.
	 */

	module.e = Emitter;

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks[event] = this._callbacks[event] || [])
	    .push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function(event, fn){
	  var self = this;
	  this._callbacks = this._callbacks || {};

	  function on() {
	    self.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks[event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks[event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks[event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks[event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {


	module.e = function(a, b){
	  var fn = function(){};
	  fn.prototype = b.prototype;
	  a.prototype = new fn;
	  a.prototype.constructor = a;
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.e = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var on = {
	    client: (typeof window !== "undefined" && window.document),
	    server: !(typeof window !== "undefined" && window.document)
	};

	module.e = on;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var parser = __webpack_require__(1);
	var Emitter = __webpack_require__(3);

	/**
	 * Module exports.
	 */

	module.e = Transport;

	/**
	 * Transport abstract constructor.
	 *
	 * @param {Object} options.
	 * @api private
	 */

	function Transport (opts) {
	  this.path = opts.path;
	  this.hostname = opts.hostname;
	  this.port = opts.port;
	  this.secure = opts.secure;
	  this.query = opts.query;
	  this.timestampParam = opts.timestampParam;
	  this.timestampRequests = opts.timestampRequests;
	  this.readyState = '';
	  this.agent = opts.agent || false;
	  this.socket = opts.socket;
	  this.enablesXDR = opts.enablesXDR;

	  // SSL options for Node.js client
	  this.pfx = opts.pfx;
	  this.key = opts.key;
	  this.passphrase = opts.passphrase;
	  this.cert = opts.cert;
	  this.ca = opts.ca;
	  this.ciphers = opts.ciphers;
	  this.rejectUnauthorized = opts.rejectUnauthorized;

	  // other options for Node.js client
	  this.extraHeaders = opts.extraHeaders;
	}

	/**
	 * Mix in `Emitter`.
	 */

	Emitter(Transport.prototype);

	/**
	 * Emits an error.
	 *
	 * @param {String} str
	 * @return {Transport} for chaining
	 * @api public
	 */

	Transport.prototype.onError = function (msg, desc) {
	  var err = new Error(msg);
	  err.type = 'TransportError';
	  err.description = desc;
	  this.emit('error', err);
	  return this;
	};

	/**
	 * Opens the transport.
	 *
	 * @api public
	 */

	Transport.prototype.open = function () {
	  if ('closed' == this.readyState || '' == this.readyState) {
	    this.readyState = 'opening';
	    this.doOpen();
	  }

	  return this;
	};

	/**
	 * Closes the transport.
	 *
	 * @api private
	 */

	Transport.prototype.close = function () {
	  if ('opening' == this.readyState || 'open' == this.readyState) {
	    this.doClose();
	    this.onClose();
	  }

	  return this;
	};

	/**
	 * Sends multiple packets.
	 *
	 * @param {Array} packets
	 * @api private
	 */

	Transport.prototype.send = function(packets){
	  if ('open' == this.readyState) {
	    this.write(packets);
	  } else {
	    throw new Error('Transport not open');
	  }
	};

	/**
	 * Called upon open
	 *
	 * @api private
	 */

	Transport.prototype.onOpen = function () {
	  this.readyState = 'open';
	  this.writable = true;
	  this.emit('open');
	};

	/**
	 * Called with data.
	 *
	 * @param {String} data
	 * @api private
	 */

	Transport.prototype.onData = function(data){
	  var packet = parser.decodePacket(data, this.socket.binaryType);
	  this.onPacket(packet);
	};

	/**
	 * Called with a decoded packet.
	 */

	Transport.prototype.onPacket = function (packet) {
	  this.emit('packet', packet);
	};

	/**
	 * Called upon close.
	 *
	 * @api private
	 */

	Transport.prototype.onClose = function () {
	  this.readyState = 'closed';
	  this.emit('close');
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// browser shim for xmlhttprequest module
	var hasCORS = __webpack_require__(54);

	module.e = function(opts) {
	  var xdomain = opts.xdomain;

	  // scheme must be same when usign XDomainRequest
	  // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
	  var xscheme = opts.xscheme;

	  // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
	  // https://github.com/Automattic/engine.io-client/pull/217
	  var enablesXDR = opts.enablesXDR;

	  // XMLHttpRequest can be disabled on IE
	  try {
	    if ('undefined' != typeof XMLHttpRequest && (!xdomain || hasCORS)) {
	      return new XMLHttpRequest();
	    }
	  } catch (e) { }

	  // Use XDomainRequest for IE8 if enablesXDR is true
	  // because loading bar keeps flashing when using jsonp-polling
	  // https://github.com/yujiosaka/socke.io-ie8-loading-example
	  try {
	    if ('undefined' != typeof XDomainRequest && !xscheme && enablesXDR) {
	      return new XDomainRequest();
	    }
	  } catch (e) { }

	  if (!xdomain) {
	    try {
	      return new ActiveXObject('Microsoft.XMLHTTP');
	    } catch(e) { }
	  }
	}


/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * Compiles a querystring
	 * Returns string representation of the object
	 *
	 * @param {Object}
	 * @api private
	 */

	exports.encode = function (obj) {
	  var str = '';

	  for (var i in obj) {
	    if (obj.hasOwnProperty(i)) {
	      if (str.length) str += '&';
	      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
	    }
	  }

	  return str;
	};

	/**
	 * Parses a simple querystring into an object
	 *
	 * @param {String} qs
	 * @api private
	 */

	exports.decode = function(qs){
	  var qry = {};
	  var pairs = qs.split('&');
	  for (var i = 0, l = pairs.length; i < l; i++) {
	    var pair = pairs[i].split('=');
	    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
	  }
	  return qry;
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {


	/**
	 * Module dependencies.
	 */

	var debug = __webpack_require__(0)('socket.io-parser');
	var json = __webpack_require__(59);
	var isArray = __webpack_require__(5);
	var Emitter = __webpack_require__(3);
	var binary = __webpack_require__(58);
	var isBuf = __webpack_require__(20);

	/**
	 * Protocol version.
	 *
	 * @api public
	 */

	exports.protocol = 4;

	/**
	 * Packet types.
	 *
	 * @api public
	 */

	exports.types = [
	  'CONNECT',
	  'DISCONNECT',
	  'EVENT',
	  'ACK',
	  'ERROR',
	  'BINARY_EVENT',
	  'BINARY_ACK'
	];

	/**
	 * Packet type `connect`.
	 *
	 * @api public
	 */

	exports.CONNECT = 0;

	/**
	 * Packet type `disconnect`.
	 *
	 * @api public
	 */

	exports.DISCONNECT = 1;

	/**
	 * Packet type `event`.
	 *
	 * @api public
	 */

	exports.EVENT = 2;

	/**
	 * Packet type `ack`.
	 *
	 * @api public
	 */

	exports.ACK = 3;

	/**
	 * Packet type `error`.
	 *
	 * @api public
	 */

	exports.ERROR = 4;

	/**
	 * Packet type 'binary event'
	 *
	 * @api public
	 */

	exports.BINARY_EVENT = 5;

	/**
	 * Packet type `binary ack`. For acks with binary arguments.
	 *
	 * @api public
	 */

	exports.BINARY_ACK = 6;

	/**
	 * Encoder constructor.
	 *
	 * @api public
	 */

	exports.Encoder = Encoder;

	/**
	 * Decoder constructor.
	 *
	 * @api public
	 */

	exports.Decoder = Decoder;

	/**
	 * A socket.io Encoder instance
	 *
	 * @api public
	 */

	function Encoder() {}

	/**
	 * Encode a packet as a single string if non-binary, or as a
	 * buffer sequence, depending on packet type.
	 *
	 * @param {Object} obj - packet object
	 * @param {Function} callback - function to handle encodings (likely engine.write)
	 * @return Calls callback with Array of encodings
	 * @api public
	 */

	Encoder.prototype.encode = function(obj, callback){
	  debug('encoding packet %j', obj);

	  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
	    encodeAsBinary(obj, callback);
	  }
	  else {
	    var encoding = encodeAsString(obj);
	    callback([encoding]);
	  }
	};

	/**
	 * Encode packet as string.
	 *
	 * @param {Object} packet
	 * @return {String} encoded
	 * @api private
	 */

	function encodeAsString(obj) {
	  var str = '';
	  var nsp = false;

	  // first is type
	  str += obj.type;

	  // attachments if we have them
	  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
	    str += obj.attachments;
	    str += '-';
	  }

	  // if we have a namespace other than `/`
	  // we append it followed by a comma `,`
	  if (obj.nsp && '/' != obj.nsp) {
	    nsp = true;
	    str += obj.nsp;
	  }

	  // immediately followed by the id
	  if (null != obj.id) {
	    if (nsp) {
	      str += ',';
	      nsp = false;
	    }
	    str += obj.id;
	  }

	  // json data
	  if (null != obj.data) {
	    if (nsp) str += ',';
	    str += json.stringify(obj.data);
	  }

	  debug('encoded %j as %s', obj, str);
	  return str;
	}

	/**
	 * Encode packet as 'buffer sequence' by removing blobs, and
	 * deconstructing packet into object with placeholders and
	 * a list of buffers.
	 *
	 * @param {Object} packet
	 * @return {Buffer} encoded
	 * @api private
	 */

	function encodeAsBinary(obj, callback) {

	  function writeEncoding(bloblessData) {
	    var deconstruction = binary.deconstructPacket(bloblessData);
	    var pack = encodeAsString(deconstruction.packet);
	    var buffers = deconstruction.buffers;

	    buffers.unshift(pack); // add packet info to beginning of data list
	    callback(buffers); // write all the buffers
	  }

	  binary.removeBlobs(obj, writeEncoding);
	}

	/**
	 * A socket.io Decoder instance
	 *
	 * @return {Object} decoder
	 * @api public
	 */

	function Decoder() {
	  this.reconstructor = null;
	}

	/**
	 * Mix in `Emitter` with Decoder.
	 */

	Emitter(Decoder.prototype);

	/**
	 * Decodes an ecoded packet string into packet JSON.
	 *
	 * @param {String} obj - encoded packet
	 * @return {Object} packet
	 * @api public
	 */

	Decoder.prototype.add = function(obj) {
	  var packet;
	  if ('string' == typeof obj) {
	    packet = decodeString(obj);
	    if (exports.BINARY_EVENT == packet.type || exports.BINARY_ACK == packet.type) { // binary packet's json
	      this.reconstructor = new BinaryReconstructor(packet);

	      // no attachments, labeled binary but no binary data to follow
	      if (this.reconstructor.reconPack.attachments === 0) {
	        this.emit('decoded', packet);
	      }
	    } else { // non-binary full packet
	      this.emit('decoded', packet);
	    }
	  }
	  else if (isBuf(obj) || obj.base64) { // raw binary data
	    if (!this.reconstructor) {
	      throw new Error('got binary data when not reconstructing a packet');
	    } else {
	      packet = this.reconstructor.takeBinaryData(obj);
	      if (packet) { // received final buffer
	        this.reconstructor = null;
	        this.emit('decoded', packet);
	      }
	    }
	  }
	  else {
	    throw new Error('Unknown type: ' + obj);
	  }
	};

	/**
	 * Decode a packet String (JSON data)
	 *
	 * @param {String} str
	 * @return {Object} packet
	 * @api private
	 */

	function decodeString(str) {
	  var p = {};
	  var i = 0;

	  // look up type
	  p.type = Number(str.charAt(0));
	  if (null == exports.types[p.type]) return error();

	  // look up attachments if type binary
	  if (exports.BINARY_EVENT == p.type || exports.BINARY_ACK == p.type) {
	    var buf = '';
	    while (str.charAt(++i) != '-') {
	      buf += str.charAt(i);
	      if (i == str.length) break;
	    }
	    if (buf != Number(buf) || str.charAt(i) != '-') {
	      throw new Error('Illegal attachments');
	    }
	    p.attachments = Number(buf);
	  }

	  // look up namespace (if any)
	  if ('/' == str.charAt(i + 1)) {
	    p.nsp = '';
	    while (++i) {
	      var c = str.charAt(i);
	      if (',' == c) break;
	      p.nsp += c;
	      if (i == str.length) break;
	    }
	  } else {
	    p.nsp = '/';
	  }

	  // look up id
	  var next = str.charAt(i + 1);
	  if ('' !== next && Number(next) == next) {
	    p.id = '';
	    while (++i) {
	      var c = str.charAt(i);
	      if (null == c || Number(c) != c) {
	        --i;
	        break;
	      }
	      p.id += str.charAt(i);
	      if (i == str.length) break;
	    }
	    p.id = Number(p.id);
	  }

	  // look up json data
	  if (str.charAt(++i)) {
	    try {
	      p.data = json.parse(str.substr(i));
	    } catch(e){
	      return error();
	    }
	  }

	  debug('decoded %s as %j', str, p);
	  return p;
	}

	/**
	 * Deallocates a parser's resources
	 *
	 * @api public
	 */

	Decoder.prototype.destroy = function() {
	  if (this.reconstructor) {
	    this.reconstructor.finishedReconstruction();
	  }
	};

	/**
	 * A manager of a binary event's 'buffer sequence'. Should
	 * be constructed whenever a packet of type BINARY_EVENT is
	 * decoded.
	 *
	 * @param {Object} packet
	 * @return {BinaryReconstructor} initialized reconstructor
	 * @api private
	 */

	function BinaryReconstructor(packet) {
	  this.reconPack = packet;
	  this.buffers = [];
	}

	/**
	 * Method to be called when binary data received from connection
	 * after a BINARY_EVENT packet.
	 *
	 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
	 * @return {null | Object} returns null if more binary data is expected or
	 *   a reconstructed packet object if all buffers have been received.
	 * @api private
	 */

	BinaryReconstructor.prototype.takeBinaryData = function(binData) {
	  this.buffers.push(binData);
	  if (this.buffers.length == this.reconPack.attachments) { // done with buffer list
	    var packet = binary.reconstructPacket(this.reconPack, this.buffers);
	    this.finishedReconstruction();
	    return packet;
	  }
	  return null;
	};

	/**
	 * Cleans up binary packet reconstruction variables.
	 *
	 * @api private
	 */

	BinaryReconstructor.prototype.finishedReconstruction = function() {
	  this.reconPack = null;
	  this.buffers = [];
	};

	function error(data){
	  return {
	    type: exports.ERROR,
	    data: 'parser error'
	  };
	}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Slice reference.
	 */

	var slice = [].slice;

	/**
	 * Bind `obj` to `fn`.
	 *
	 * @param {Object} obj
	 * @param {Function|String} fn or string
	 * @return {Function}
	 * @api public
	 */

	module.e = function(obj, fn){
	  if ('string' == typeof fn) fn = obj[fn];
	  if ('function' != typeof fn) throw new Error('bind() requires a function');
	  var args = slice.call(arguments, 2);
	  return function(){
	    return fn.apply(obj, args.concat(slice.call(arguments)));
	  }
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies
	 */

	var XMLHttpRequest = __webpack_require__(8);
	var XHR = __webpack_require__(47);
	var JSONP = __webpack_require__(46);
	var websocket = __webpack_require__(48);

	/**
	 * Export transports.
	 */

	exports.polling = polling;
	exports.websocket = websocket;

	/**
	 * Polling transport polymorphic constructor.
	 * Decides on xhr vs jsonp based on feature detection.
	 *
	 * @api private
	 */

	function polling(opts){
	  var xhr;
	  var xd = false;
	  var xs = false;
	  var jsonp = false !== opts.jsonp;

	  if (global.location) {
	    var isSSL = 'https:' == location.protocol;
	    var port = location.port;

	    // some user agents have empty `location.port`
	    if (!port) {
	      port = isSSL ? 443 : 80;
	    }

	    xd = opts.hostname != location.hostname || port != opts.port;
	    xs = opts.secure != isSSL;
	  }

	  opts.xdomain = xd;
	  opts.xscheme = xs;
	  xhr = new XMLHttpRequest(opts);

	  if ('open' in xhr && !opts.forceJSONP) {
	    return new XHR(opts);
	  } else {
	    if (!jsonp) throw new Error('JSONP disabled');
	    return new JSONP(opts);
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var Transport = __webpack_require__(7);
	var parseqs = __webpack_require__(9);
	var parser = __webpack_require__(1);
	var inherit = __webpack_require__(4);
	var yeast = __webpack_require__(21);
	var debug = __webpack_require__(0)('engine.io-client:polling');

	/**
	 * Module exports.
	 */

	module.e = Polling;

	/**
	 * Is XHR2 supported?
	 */

	var hasXHR2 = (function() {
	  var XMLHttpRequest = __webpack_require__(8);
	  var xhr = new XMLHttpRequest({ xdomain: false });
	  return null != xhr.responseType;
	})();

	/**
	 * Polling interface.
	 *
	 * @param {Object} opts
	 * @api private
	 */

	function Polling(opts){
	  var forceBase64 = (opts && opts.forceBase64);
	  if (!hasXHR2 || forceBase64) {
	    this.supportsBinary = false;
	  }
	  Transport.call(this, opts);
	}

	/**
	 * Inherits from Transport.
	 */

	inherit(Polling, Transport);

	/**
	 * Transport name.
	 */

	Polling.prototype.name = 'polling';

	/**
	 * Opens the socket (triggers polling). We write a PING message to determine
	 * when the transport is open.
	 *
	 * @api private
	 */

	Polling.prototype.doOpen = function(){
	  this.poll();
	};

	/**
	 * Pauses polling.
	 *
	 * @param {Function} callback upon buffers are flushed and transport is paused
	 * @api private
	 */

	Polling.prototype.pause = function(onPause){
	  var pending = 0;
	  var self = this;

	  this.readyState = 'pausing';

	  function pause(){
	    debug('paused');
	    self.readyState = 'paused';
	    onPause();
	  }

	  if (this.polling || !this.writable) {
	    var total = 0;

	    if (this.polling) {
	      debug('we are currently polling - waiting to pause');
	      total++;
	      this.once('pollComplete', function(){
	        debug('pre-pause polling complete');
	        --total || pause();
	      });
	    }

	    if (!this.writable) {
	      debug('we are currently writing - waiting to pause');
	      total++;
	      this.once('drain', function(){
	        debug('pre-pause writing complete');
	        --total || pause();
	      });
	    }
	  } else {
	    pause();
	  }
	};

	/**
	 * Starts polling cycle.
	 *
	 * @api public
	 */

	Polling.prototype.poll = function(){
	  debug('polling');
	  this.polling = true;
	  this.doPoll();
	  this.emit('poll');
	};

	/**
	 * Overloads onData to detect payloads.
	 *
	 * @api private
	 */

	Polling.prototype.onData = function(data){
	  var self = this;
	  debug('polling got data %s', data);
	  var callback = function(packet, index, total) {
	    // if its the first message we consider the transport open
	    if ('opening' == self.readyState) {
	      self.onOpen();
	    }

	    // if its a close packet, we close the ongoing requests
	    if ('close' == packet.type) {
	      self.onClose();
	      return false;
	    }

	    // otherwise bypass onData and handle the message
	    self.onPacket(packet);
	  };

	  // decode payload
	  parser.decodePayload(data, this.socket.binaryType, callback);

	  // if an event did not trigger closing
	  if ('closed' != this.readyState) {
	    // if we got data we're not polling
	    this.polling = false;
	    this.emit('pollComplete');

	    if ('open' == this.readyState) {
	      this.poll();
	    } else {
	      debug('ignoring poll - transport state "%s"', this.readyState);
	    }
	  }
	};

	/**
	 * For polling, send a close packet.
	 *
	 * @api private
	 */

	Polling.prototype.doClose = function(){
	  var self = this;

	  function close(){
	    debug('writing close packet');
	    self.write([{ type: 'close' }]);
	  }

	  if ('open' == this.readyState) {
	    debug('transport open - closing');
	    close();
	  } else {
	    // in case we're trying to close while
	    // handshaking is in progress (GH-164)
	    debug('transport not open - deferring close');
	    this.once('open', close);
	  }
	};

	/**
	 * Writes a packets payload.
	 *
	 * @param {Array} data packets
	 * @param {Function} drain callback
	 * @api private
	 */

	Polling.prototype.write = function(packets){
	  var self = this;
	  this.writable = false;
	  var callbackfn = function() {
	    self.writable = true;
	    self.emit('drain');
	  };

	  var self = this;
	  parser.encodePayload(packets, this.supportsBinary, function(data) {
	    self.doWrite(data, callbackfn);
	  });
	};

	/**
	 * Generates uri for connection.
	 *
	 * @api private
	 */

	Polling.prototype.uri = function(){
	  var query = this.query || {};
	  var schema = this.secure ? 'https' : 'http';
	  var port = '';

	  // cache busting is forced
	  if (false !== this.timestampRequests) {
	    query[this.timestampParam] = yeast();
	  }

	  if (!this.supportsBinary && !query.sid) {
	    query.b64 = 1;
	  }

	  query = parseqs.encode(query);

	  // avoid port if default for schema
	  if (this.port && (('https' == schema && this.port != 443) ||
	     ('http' == schema && this.port != 80))) {
	    port = ':' + this.port;
	  }

	  // prepend ? to query
	  if (query.length) {
	    query = '?' + query;
	  }

	  var ipv6 = this.hostname.indexOf(':') !== -1;
	  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {


	var indexOf = [].indexOf;

	module.e = function(arr, obj){
	  if (indexOf) return arr.indexOf(obj);
	  for (var i = 0; i < arr.length; ++i) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Parses an URI
	 *
	 * @author Steven Levithan <stevenlevithan.com> (MIT license)
	 * @api private
	 */

	var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

	var parts = [
	    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
	];

	module.e = function parseuri(str) {
	    var src = str,
	        b = str.indexOf('['),
	        e = str.indexOf(']');

	    if (b != -1 && e != -1) {
	        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
	    }

	    var m = re.exec(str || ''),
	        uri = {},
	        i = 14;

	    while (i--) {
	        uri[parts[i]] = m[i] || '';
	    }

	    if (b != -1 && e != -1) {
	        uri.source = src;
	        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
	        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
	        uri.ipv6uri = true;
	    }

	    return uri;
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {


	/**
	 * Module dependencies.
	 */

	var eio = __webpack_require__(43);
	var Socket = __webpack_require__(18);
	var Emitter = __webpack_require__(19);
	var parser = __webpack_require__(10);
	var on = __webpack_require__(17);
	var bind = __webpack_require__(11);
	var debug = __webpack_require__(0)('socket.io-client:manager');
	var indexOf = __webpack_require__(14);
	var Backoff = __webpack_require__(39);

	/**
	 * IE6+ hasOwnProperty
	 */

	var has = Object.prototype.hasOwnProperty;

	/**
	 * Module exports
	 */

	module.e = Manager;

	/**
	 * `Manager` constructor.
	 *
	 * @param {String} engine instance or engine uri/opts
	 * @param {Object} options
	 * @api public
	 */

	function Manager(uri, opts){
	  if (!(this instanceof Manager)) return new Manager(uri, opts);
	  if (uri && ('object' == typeof uri)) {
	    opts = uri;
	    uri = undefined;
	  }
	  opts = opts || {};

	  opts.path = opts.path || '/socket.io';
	  this.nsps = {};
	  this.subs = [];
	  this.opts = opts;
	  this.reconnection(opts.reconnection !== false);
	  this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
	  this.reconnectionDelay(opts.reconnectionDelay || 1000);
	  this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
	  this.randomizationFactor(opts.randomizationFactor || 0.5);
	  this.backoff = new Backoff({
	    min: this.reconnectionDelay(),
	    max: this.reconnectionDelayMax(),
	    jitter: this.randomizationFactor()
	  });
	  this.timeout(null == opts.timeout ? 20000 : opts.timeout);
	  this.readyState = 'closed';
	  this.uri = uri;
	  this.connecting = [];
	  this.lastPing = null;
	  this.encoding = false;
	  this.packetBuffer = [];
	  this.encoder = new parser.Encoder();
	  this.decoder = new parser.Decoder();
	  this.autoConnect = opts.autoConnect !== false;
	  if (this.autoConnect) this.open();
	}

	/**
	 * Propagate given event to sockets and emit on `this`
	 *
	 * @api private
	 */

	Manager.prototype.emitAll = function() {
	  this.emit.apply(this, arguments);
	  for (var nsp in this.nsps) {
	    if (has.call(this.nsps, nsp)) {
	      this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
	    }
	  }
	};

	/**
	 * Update `socket.id` of all sockets
	 *
	 * @api private
	 */

	Manager.prototype.updateSocketIds = function(){
	  for (var nsp in this.nsps) {
	    if (has.call(this.nsps, nsp)) {
	      this.nsps[nsp].id = this.engine.id;
	    }
	  }
	};

	/**
	 * Mix in `Emitter`.
	 */

	Emitter(Manager.prototype);

	/**
	 * Sets the `reconnection` config.
	 *
	 * @param {Boolean} true/false if it should automatically reconnect
	 * @return {Manager} self or value
	 * @api public
	 */

	Manager.prototype.reconnection = function(v){
	  if (!arguments.length) return this._reconnection;
	  this._reconnection = !!v;
	  return this;
	};

	/**
	 * Sets the reconnection attempts config.
	 *
	 * @param {Number} max reconnection attempts before giving up
	 * @return {Manager} self or value
	 * @api public
	 */

	Manager.prototype.reconnectionAttempts = function(v){
	  if (!arguments.length) return this._reconnectionAttempts;
	  this._reconnectionAttempts = v;
	  return this;
	};

	/**
	 * Sets the delay between reconnections.
	 *
	 * @param {Number} delay
	 * @return {Manager} self or value
	 * @api public
	 */

	Manager.prototype.reconnectionDelay = function(v){
	  if (!arguments.length) return this._reconnectionDelay;
	  this._reconnectionDelay = v;
	  this.backoff && this.backoff.setMin(v);
	  return this;
	};

	Manager.prototype.randomizationFactor = function(v){
	  if (!arguments.length) return this._randomizationFactor;
	  this._randomizationFactor = v;
	  this.backoff && this.backoff.setJitter(v);
	  return this;
	};

	/**
	 * Sets the maximum delay between reconnections.
	 *
	 * @param {Number} delay
	 * @return {Manager} self or value
	 * @api public
	 */

	Manager.prototype.reconnectionDelayMax = function(v){
	  if (!arguments.length) return this._reconnectionDelayMax;
	  this._reconnectionDelayMax = v;
	  this.backoff && this.backoff.setMax(v);
	  return this;
	};

	/**
	 * Sets the connection timeout. `false` to disable
	 *
	 * @return {Manager} self or value
	 * @api public
	 */

	Manager.prototype.timeout = function(v){
	  if (!arguments.length) return this._timeout;
	  this._timeout = v;
	  return this;
	};

	/**
	 * Starts trying to reconnect if reconnection is enabled and we have not
	 * started reconnecting yet
	 *
	 * @api private
	 */

	Manager.prototype.maybeReconnectOnOpen = function() {
	  // Only try to reconnect if it's the first time we're connecting
	  if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
	    // keeps reconnection from firing twice for the same reconnection loop
	    this.reconnect();
	  }
	};


	/**
	 * Sets the current transport `socket`.
	 *
	 * @param {Function} optional, callback
	 * @return {Manager} self
	 * @api public
	 */

	Manager.prototype.open =
	Manager.prototype.connect = function(fn){
	  debug('readyState %s', this.readyState);
	  if (~this.readyState.indexOf('open')) return this;

	  debug('opening %s', this.uri);
	  this.engine = eio(this.uri, this.opts);
	  var socket = this.engine;
	  var self = this;
	  this.readyState = 'opening';
	  this.skipReconnect = false;

	  // emit `open`
	  var openSub = on(socket, 'open', function() {
	    self.onopen();
	    fn && fn();
	  });

	  // emit `connect_error`
	  var errorSub = on(socket, 'error', function(data){
	    debug('connect_error');
	    self.cleanup();
	    self.readyState = 'closed';
	    self.emitAll('connect_error', data);
	    if (fn) {
	      var err = new Error('Connection error');
	      err.data = data;
	      fn(err);
	    } else {
	      // Only do this if there is no fn to handle the error
	      self.maybeReconnectOnOpen();
	    }
	  });

	  // emit `connect_timeout`
	  if (false !== this._timeout) {
	    var timeout = this._timeout;
	    debug('connect attempt will timeout after %d', timeout);

	    // set timer
	    var timer = setTimeout(function(){
	      debug('connect attempt timed out after %d', timeout);
	      openSub.destroy();
	      socket.close();
	      socket.emit('error', 'timeout');
	      self.emitAll('connect_timeout', timeout);
	    }, timeout);

	    this.subs.push({
	      destroy: function(){
	        clearTimeout(timer);
	      }
	    });
	  }

	  this.subs.push(openSub);
	  this.subs.push(errorSub);

	  return this;
	};

	/**
	 * Called upon transport open.
	 *
	 * @api private
	 */

	Manager.prototype.onopen = function(){
	  debug('open');

	  // clear old subs
	  this.cleanup();

	  // mark as open
	  this.readyState = 'open';
	  this.emit('open');

	  // add new subs
	  var socket = this.engine;
	  this.subs.push(on(socket, 'data', bind(this, 'ondata')));
	  this.subs.push(on(socket, 'ping', bind(this, 'onping')));
	  this.subs.push(on(socket, 'pong', bind(this, 'onpong')));
	  this.subs.push(on(socket, 'error', bind(this, 'onerror')));
	  this.subs.push(on(socket, 'close', bind(this, 'onclose')));
	  this.subs.push(on(this.decoder, 'decoded', bind(this, 'ondecoded')));
	};

	/**
	 * Called upon a ping.
	 *
	 * @api private
	 */

	Manager.prototype.onping = function(){
	  this.lastPing = new Date;
	  this.emitAll('ping');
	};

	/**
	 * Called upon a packet.
	 *
	 * @api private
	 */

	Manager.prototype.onpong = function(){
	  this.emitAll('pong', new Date - this.lastPing);
	};

	/**
	 * Called with data.
	 *
	 * @api private
	 */

	Manager.prototype.ondata = function(data){
	  this.decoder.add(data);
	};

	/**
	 * Called when parser fully decodes a packet.
	 *
	 * @api private
	 */

	Manager.prototype.ondecoded = function(packet) {
	  this.emit('packet', packet);
	};

	/**
	 * Called upon socket error.
	 *
	 * @api private
	 */

	Manager.prototype.onerror = function(err){
	  debug('error', err);
	  this.emitAll('error', err);
	};

	/**
	 * Creates a new socket for the given `nsp`.
	 *
	 * @return {Socket}
	 * @api public
	 */

	Manager.prototype.socket = function(nsp){
	  var socket = this.nsps[nsp];
	  if (!socket) {
	    socket = new Socket(this, nsp);
	    this.nsps[nsp] = socket;
	    var self = this;
	    socket.on('connecting', onConnecting);
	    socket.on('connect', function(){
	      socket.id = self.engine.id;
	    });

	    if (this.autoConnect) {
	      // manually call here since connecting evnet is fired before listening
	      onConnecting();
	    }
	  }

	  function onConnecting() {
	    if (!~indexOf(self.connecting, socket)) {
	      self.connecting.push(socket);
	    }
	  }

	  return socket;
	};

	/**
	 * Called upon a socket close.
	 *
	 * @param {Socket} socket
	 */

	Manager.prototype.destroy = function(socket){
	  var index = indexOf(this.connecting, socket);
	  if (~index) this.connecting.splice(index, 1);
	  if (this.connecting.length) return;

	  this.close();
	};

	/**
	 * Writes a packet.
	 *
	 * @param {Object} packet
	 * @api private
	 */

	Manager.prototype.packet = function(packet){
	  debug('writing packet %j', packet);
	  var self = this;

	  if (!self.encoding) {
	    // encode, then write to engine with result
	    self.encoding = true;
	    this.encoder.encode(packet, function(encodedPackets) {
	      for (var i = 0; i < encodedPackets.length; i++) {
	        self.engine.write(encodedPackets[i], packet.options);
	      }
	      self.encoding = false;
	      self.processPacketQueue();
	    });
	  } else { // add packet to the queue
	    self.packetBuffer.push(packet);
	  }
	};

	/**
	 * If packet buffer is non-empty, begins encoding the
	 * next packet in line.
	 *
	 * @api private
	 */

	Manager.prototype.processPacketQueue = function() {
	  if (this.packetBuffer.length > 0 && !this.encoding) {
	    var pack = this.packetBuffer.shift();
	    this.packet(pack);
	  }
	};

	/**
	 * Clean up transport subscriptions and packet buffer.
	 *
	 * @api private
	 */

	Manager.prototype.cleanup = function(){
	  debug('cleanup');

	  var sub;
	  while (sub = this.subs.shift()) sub.destroy();

	  this.packetBuffer = [];
	  this.encoding = false;
	  this.lastPing = null;

	  this.decoder.destroy();
	};

	/**
	 * Close the current socket.
	 *
	 * @api private
	 */

	Manager.prototype.close =
	Manager.prototype.disconnect = function(){
	  debug('disconnect');
	  this.skipReconnect = true;
	  this.reconnecting = false;
	  if ('opening' == this.readyState) {
	    // `onclose` will not fire because
	    // an open event never happened
	    this.cleanup();
	  }
	  this.backoff.reset();
	  this.readyState = 'closed';
	  if (this.engine) this.engine.close();
	};

	/**
	 * Called upon engine close.
	 *
	 * @api private
	 */

	Manager.prototype.onclose = function(reason){
	  debug('onclose');

	  this.cleanup();
	  this.backoff.reset();
	  this.readyState = 'closed';
	  this.emit('close', reason);

	  if (this._reconnection && !this.skipReconnect) {
	    this.reconnect();
	  }
	};

	/**
	 * Attempt a reconnection.
	 *
	 * @api private
	 */

	Manager.prototype.reconnect = function(){
	  if (this.reconnecting || this.skipReconnect) return this;

	  var self = this;

	  if (this.backoff.attempts >= this._reconnectionAttempts) {
	    debug('reconnect failed');
	    this.backoff.reset();
	    this.emitAll('reconnect_failed');
	    this.reconnecting = false;
	  } else {
	    var delay = this.backoff.duration();
	    debug('will wait %dms before reconnect attempt', delay);

	    this.reconnecting = true;
	    var timer = setTimeout(function(){
	      if (self.skipReconnect) return;

	      debug('attempting reconnect');
	      self.emitAll('reconnect_attempt', self.backoff.attempts);
	      self.emitAll('reconnecting', self.backoff.attempts);

	      // check again for the case socket closed in above events
	      if (self.skipReconnect) return;

	      self.open(function(err){
	        if (err) {
	          debug('reconnect attempt error');
	          self.reconnecting = false;
	          self.reconnect();
	          self.emitAll('reconnect_error', err.data);
	        } else {
	          debug('reconnect success');
	          self.onreconnect();
	        }
	      });
	    }, delay);

	    this.subs.push({
	      destroy: function(){
	        clearTimeout(timer);
	      }
	    });
	  }
	};

	/**
	 * Called upon successful reconnect.
	 *
	 * @api private
	 */

	Manager.prototype.onreconnect = function(){
	  var attempt = this.backoff.attempts;
	  this.reconnecting = false;
	  this.backoff.reset();
	  this.updateSocketIds();
	  this.emitAll('reconnect', attempt);
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {


	/**
	 * Module exports.
	 */

	module.e = on;

	/**
	 * Helper for subscriptions.
	 *
	 * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
	 * @param {String} event name
	 * @param {Function} callback
	 * @api public
	 */

	function on(obj, ev, fn) {
	  obj.on(ev, fn);
	  return {
	    destroy: function(){
	      obj.removeListener(ev, fn);
	    }
	  };
	}


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {


	/**
	 * Module dependencies.
	 */

	var parser = __webpack_require__(10);
	var Emitter = __webpack_require__(19);
	var toArray = __webpack_require__(60);
	var on = __webpack_require__(17);
	var bind = __webpack_require__(11);
	var debug = __webpack_require__(0)('socket.io-client:socket');
	var hasBin = __webpack_require__(53);

	/**
	 * Module exports.
	 */

	module.e = exports = Socket;

	/**
	 * Internal events (blacklisted).
	 * These events can't be emitted by the user.
	 *
	 * @api private
	 */

	var events = {
	  connect: 1,
	  connect_error: 1,
	  connect_timeout: 1,
	  connecting: 1,
	  disconnect: 1,
	  error: 1,
	  reconnect: 1,
	  reconnect_attempt: 1,
	  reconnect_failed: 1,
	  reconnect_error: 1,
	  reconnecting: 1,
	  ping: 1,
	  pong: 1
	};

	/**
	 * Shortcut to `Emitter#emit`.
	 */

	var emit = Emitter.prototype.emit;

	/**
	 * `Socket` constructor.
	 *
	 * @api public
	 */

	function Socket(io, nsp){
	  this.io = io;
	  this.nsp = nsp;
	  this.json = this; // compat
	  this.ids = 0;
	  this.acks = {};
	  this.receiveBuffer = [];
	  this.sendBuffer = [];
	  this.connected = false;
	  this.disconnected = true;
	  if (this.io.autoConnect) this.open();
	}

	/**
	 * Mix in `Emitter`.
	 */

	Emitter(Socket.prototype);

	/**
	 * Subscribe to open, close and packet events
	 *
	 * @api private
	 */

	Socket.prototype.subEvents = function() {
	  if (this.subs) return;

	  var io = this.io;
	  this.subs = [
	    on(io, 'open', bind(this, 'onopen')),
	    on(io, 'packet', bind(this, 'onpacket')),
	    on(io, 'close', bind(this, 'onclose'))
	  ];
	};

	/**
	 * "Opens" the socket.
	 *
	 * @api public
	 */

	Socket.prototype.open =
	Socket.prototype.connect = function(){
	  if (this.connected) return this;

	  this.subEvents();
	  this.io.open(); // ensure open
	  if ('open' == this.io.readyState) this.onopen();
	  this.emit('connecting');
	  return this;
	};

	/**
	 * Sends a `message` event.
	 *
	 * @return {Socket} self
	 * @api public
	 */

	Socket.prototype.send = function(){
	  var args = toArray(arguments);
	  args.unshift('message');
	  this.emit.apply(this, args);
	  return this;
	};

	/**
	 * Override `emit`.
	 * If the event is in `events`, it's emitted normally.
	 *
	 * @param {String} event name
	 * @return {Socket} self
	 * @api public
	 */

	Socket.prototype.emit = function(ev){
	  if (events.hasOwnProperty(ev)) {
	    emit.apply(this, arguments);
	    return this;
	  }

	  var args = toArray(arguments);
	  var parserType = parser.EVENT; // default
	  if (hasBin(args)) { parserType = parser.BINARY_EVENT; } // binary
	  var packet = { type: parserType, data: args };

	  packet.options = {};
	  packet.options.compress = !this.flags || false !== this.flags.compress;

	  // event ack callback
	  if ('function' == typeof args[args.length - 1]) {
	    debug('emitting packet with ack id %d', this.ids);
	    this.acks[this.ids] = args.pop();
	    packet.id = this.ids++;
	  }

	  if (this.connected) {
	    this.packet(packet);
	  } else {
	    this.sendBuffer.push(packet);
	  }

	  delete this.flags;

	  return this;
	};

	/**
	 * Sends a packet.
	 *
	 * @param {Object} packet
	 * @api private
	 */

	Socket.prototype.packet = function(packet){
	  packet.nsp = this.nsp;
	  this.io.packet(packet);
	};

	/**
	 * Called upon engine `open`.
	 *
	 * @api private
	 */

	Socket.prototype.onopen = function(){
	  debug('transport is open - connecting');

	  // write connect packet if necessary
	  if ('/' != this.nsp) {
	    this.packet({ type: parser.CONNECT });
	  }
	};

	/**
	 * Called upon engine `close`.
	 *
	 * @param {String} reason
	 * @api private
	 */

	Socket.prototype.onclose = function(reason){
	  debug('close (%s)', reason);
	  this.connected = false;
	  this.disconnected = true;
	  delete this.id;
	  this.emit('disconnect', reason);
	};

	/**
	 * Called with socket packet.
	 *
	 * @param {Object} packet
	 * @api private
	 */

	Socket.prototype.onpacket = function(packet){
	  if (packet.nsp != this.nsp) return;

	  switch (packet.type) {
	    case parser.CONNECT:
	      this.onconnect();
	      break;

	    case parser.EVENT:
	      this.onevent(packet);
	      break;

	    case parser.BINARY_EVENT:
	      this.onevent(packet);
	      break;

	    case parser.ACK:
	      this.onack(packet);
	      break;

	    case parser.BINARY_ACK:
	      this.onack(packet);
	      break;

	    case parser.DISCONNECT:
	      this.ondisconnect();
	      break;

	    case parser.ERROR:
	      this.emit('error', packet.data);
	      break;
	  }
	};

	/**
	 * Called upon a server event.
	 *
	 * @param {Object} packet
	 * @api private
	 */

	Socket.prototype.onevent = function(packet){
	  var args = packet.data || [];
	  debug('emitting event %j', args);

	  if (null != packet.id) {
	    debug('attaching ack callback to event');
	    args.push(this.ack(packet.id));
	  }

	  if (this.connected) {
	    emit.apply(this, args);
	  } else {
	    this.receiveBuffer.push(args);
	  }
	};

	/**
	 * Produces an ack callback to emit with an event.
	 *
	 * @api private
	 */

	Socket.prototype.ack = function(id){
	  var self = this;
	  var sent = false;
	  return function(){
	    // prevent double callbacks
	    if (sent) return;
	    sent = true;
	    var args = toArray(arguments);
	    debug('sending ack %j', args);

	    var type = hasBin(args) ? parser.BINARY_ACK : parser.ACK;
	    self.packet({
	      type: type,
	      id: id,
	      data: args
	    });
	  };
	};

	/**
	 * Called upon a server acknowlegement.
	 *
	 * @param {Object} packet
	 * @api private
	 */

	Socket.prototype.onack = function(packet){
	  var ack = this.acks[packet.id];
	  if ('function' == typeof ack) {
	    debug('calling ack %s with %j', packet.id, packet.data);
	    ack.apply(this, packet.data);
	    delete this.acks[packet.id];
	  } else {
	    debug('bad ack %s', packet.id);
	  }
	};

	/**
	 * Called upon server connect.
	 *
	 * @api private
	 */

	Socket.prototype.onconnect = function(){
	  this.connected = true;
	  this.disconnected = false;
	  this.emit('connect');
	  this.emitBuffered();
	};

	/**
	 * Emit buffered events (received and emitted).
	 *
	 * @api private
	 */

	Socket.prototype.emitBuffered = function(){
	  var i;
	  for (i = 0; i < this.receiveBuffer.length; i++) {
	    emit.apply(this, this.receiveBuffer[i]);
	  }
	  this.receiveBuffer = [];

	  for (i = 0; i < this.sendBuffer.length; i++) {
	    this.packet(this.sendBuffer[i]);
	  }
	  this.sendBuffer = [];
	};

	/**
	 * Called upon server disconnect.
	 *
	 * @api private
	 */

	Socket.prototype.ondisconnect = function(){
	  debug('server disconnect (%s)', this.nsp);
	  this.destroy();
	  this.onclose('io server disconnect');
	};

	/**
	 * Called upon forced client/server side disconnections,
	 * this method ensures the manager stops tracking us and
	 * that reconnections don't get triggered for this.
	 *
	 * @api private.
	 */

	Socket.prototype.destroy = function(){
	  if (this.subs) {
	    // clean subscriptions to avoid reconnections
	    for (var i = 0; i < this.subs.length; i++) {
	      this.subs[i].destroy();
	    }
	    this.subs = null;
	  }

	  this.io.destroy(this);
	};

	/**
	 * Disconnects the socket manually.
	 *
	 * @return {Socket} self
	 * @api public
	 */

	Socket.prototype.close =
	Socket.prototype.disconnect = function(){
	  if (this.connected) {
	    debug('performing disconnect (%s)', this.nsp);
	    this.packet({ type: parser.DISCONNECT });
	  }

	  // remove socket from pool
	  this.destroy();

	  if (this.connected) {
	    // fire events
	    this.onclose('io client disconnect');
	  }
	  return this;
	};

	/**
	 * Sets the compress flag.
	 *
	 * @param {Boolean} if `true`, compresses the sending data
	 * @return {Socket} self
	 * @api public
	 */

	Socket.prototype.compress = function(compress){
	  this.flags = this.flags || {};
	  this.flags.compress = compress;
	  return this;
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {


	/**
	 * Expose `Emitter`.
	 */

	module.e = Emitter;

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks['$' + event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	module.e = isBuf;

	/**
	 * Returns true if obj is a buffer or an arraybuffer.
	 *
	 * @api private
	 */

	function isBuf(obj) {
	  return (global.Buffer && global.Buffer.isBuffer(obj)) ||
	         (global.ArrayBuffer && obj instanceof ArrayBuffer);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('')
	  , length = 64
	  , map = {}
	  , seed = 0
	  , i = 0
	  , prev;

	/**
	 * Return a string representing the specified number.
	 *
	 * @param {Number} num The number to convert.
	 * @returns {String} The string representation of the number.
	 * @api public
	 */
	function encode(num) {
	  var encoded = '';

	  do {
	    encoded = alphabet[num % length] + encoded;
	    num = Math.floor(num / length);
	  } while (num > 0);

	  return encoded;
	}

	/**
	 * Return the integer value specified by the given string.
	 *
	 * @param {String} str The string to convert.
	 * @returns {Number} The integer value represented by the string.
	 * @api public
	 */
	function decode(str) {
	  var decoded = 0;

	  for (i = 0; i < str.length; i++) {
	    decoded = decoded * length + map[str.charAt(i)];
	  }

	  return decoded;
	}

	/**
	 * Yeast: A tiny growing id generator.
	 *
	 * @returns {String} A unique id.
	 * @api public
	 */
	function yeast() {
	  var now = encode(+new Date());

	  if (now !== prev) return seed = 0, prev = now;
	  return now +'.'+ encode(seed++);
	}

	//
	// Map each character to its index.
	//
	for (; i < length; i++) map[alphabet[i]] = i;

	//
	// Expose the `yeast`, `encode` and `decode` functions.
	//
	yeast.encode = encode;
	yeast.decode = decode;
	module.e = yeast;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, node: true*/

	var extend = __webpack_require__(52);
	var on = __webpack_require__(6);

	module.e = extend({}, __webpack_require__(35), on.server ? __webpack_require__(34) : __webpack_require__(33));

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var on = __webpack_require__(6);

	var serverReq = function (socket, reqPrefix, resPrefix) {

	    reqPrefix = typeof reqPrefix !== "string" ? "req" : reqPrefix;

	    resPrefix = typeof resPrefix !== "string" ? "res" : resPrefix;

	    return function req(type, res) {

	        socket.on((reqPrefix ? reqPrefix + "." : "") + type, function (request) {

	            res(request, function (data, broadcast) {

	                if (broadcast === true) {

	                    socket.broadcast.emit((resPrefix ? resPrefix + "." : "") + type, data);

	                } else if (typeof broadcast === "string") {

	                    socket.broadcast.to(broadcast).emit((resPrefix ? resPrefix + "." : "") + type, data);

	                } else {

	                    socket.emit((resPrefix ? resPrefix + "." : "") + type, data);
	                }
	            });
	        });
	    };
	};

	var clientReq = function (socket, reqPrefix, resPrefix) {

	    reqPrefix = typeof reqPrefix !== "string" ? "req" : reqPrefix;

	    resPrefix = typeof resPrefix !== "string" ? "res" : resPrefix;

	    return function req(name, params) {

	        var request = {
	            params: params || {},
	            name: name,
	            hostname: window.location.hostname,
	            time: Date.now()
	        };

	        var promise = new Promise(function (resolve, reject) {

	            socket.once((resPrefix ? resPrefix + "." : "") + name, function (response) {

	                if (response.error) {

	                    return reject(response);
	                }

	                resolve(response);
	            });
	        });

	        socket.emit((reqPrefix ? reqPrefix + "." : "") + name, request);

	        return promise;
	    };
	};
	console.log(on);
	module.e = on.server ? serverReq : clientReq;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	module.e={"v":3,"t":[{"t":7,"e":"h1","f":[{"t":2,"r":"test"}]}]};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*
		Ractive.js v0.8.0-edge
		Fri Feb 19 2016 23:33:53 GMT+0000 (UTC) - commit c5132e4ab8079acfcc142c230ea77f4e52df3877

		http://ractivejs.org
		http://twitter.com/RactiveJS

		Released under the MIT License.
	*/


	(function (global, factory) {
	   true ? module.e = factory() :
	  typeof define === 'function' && define.amd ? define(factory) :
	  global.Ractive = factory();
	}(this, function () { 'use strict';

	var inherits = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};

	var toConsumableArray = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

	    return arr2;
	  } else {
	    return Array.from(arr);
	  }
	};

	var classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	  /*global console, navigator */

	  var win = typeof window !== 'undefined' ? window : null;
	  var doc = win ? document : null;

	  var isClient = !!doc;
	  var isJsdom = typeof navigator !== 'undefined' && /jsDom/.test(navigator.appName);
	  var hasConsole = typeof console !== 'undefined' && typeof console.warn === 'function' && typeof console.warn.apply === 'function';

	  var magicSupported = undefined;
	  try {
	  	Object.defineProperty({}, 'test', { value: 0 });
	  	magicSupported = true;
	  } catch (e) {
	  	magicSupported = false;
	  }

	  var svg = doc ? doc.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1') : false;

	  var vendors = ['o', 'ms', 'moz', 'webkit'];

	  var defaults = {
	  	// render placement:
	  	el: void 0,
	  	append: false,

	  	// template:
	  	template: null,

	  	// parse:
	  	delimiters: ['{{', '}}'],
	  	tripleDelimiters: ['{{{', '}}}'],
	  	staticDelimiters: ['[[', ']]'],
	  	staticTripleDelimiters: ['[[[', ']]]'],
	  	csp: true,
	  	interpolate: false,
	  	preserveWhitespace: false,
	  	sanitize: false,
	  	stripComments: true,

	  	// data & binding:
	  	data: {},
	  	computed: {},
	  	magic: false,
	  	modifyArrays: true,
	  	adapt: [],
	  	isolated: false,
	  	twoway: true,
	  	lazy: false,

	  	// transitions:
	  	noIntro: false,
	  	transitionsEnabled: true,
	  	complete: void 0,

	  	// css:
	  	css: null,
	  	noCssTransform: false
	  };

	  var refPattern = /\[\s*(\*|[0-9]|[1-9][0-9]+)\s*\]/g;
	  var splitPattern = /([^\\](?:\\\\)*)\./;
	  var escapeKeyPattern = /\\|\./g;
	  var unescapeKeyPattern = /((?:\\)+)\1|\\(\.)/g;

	  function escapeKey(key) {
	  	if (typeof key === 'string') {
	  		return key.replace(escapeKeyPattern, '\\$&');
	  	}

	  	return key;
	  }

	  function normalise(ref) {
	  	return ref ? ref.replace(refPattern, '.$1') : '';
	  }

	  function splitKeypath(keypath) {
	  	var parts = normalise(keypath).split(splitPattern),
	  	    result = [];

	  	for (var i = 0; i < parts.length; i += 2) {
	  		result.push(parts[i] + (parts[i + 1] || ''));
	  	}

	  	return result;
	  }

	  function unescapeKey(key) {
	  	if (typeof key === 'string') {
	  		return key.replace(unescapeKeyPattern, '$1$2');
	  	}

	  	return key;
	  }

	  function noop () {}

	  var alreadyWarned = {};
	  var log;
	  var printWarning;
	  var welcome;
	  if (hasConsole) {
	  	(function () {
	  		var welcomeIntro = ['%cRactive.js %c0.8.0-edge %cin debug mode, %cmore...', 'color: rgb(114, 157, 52); font-weight: normal;', 'color: rgb(85, 85, 85); font-weight: normal;', 'color: rgb(85, 85, 85); font-weight: normal;', 'color: rgb(82, 140, 224); font-weight: normal; text-decoration: underline;'];
	  		var welcomeMessage = 'You\'re running Ractive 0.8.0-edge in debug mode - messages will be printed to the console to help you fix problems and optimise your application.\n\nTo disable debug mode, add this line at the start of your app:\n  Ractive.DEBUG = false;\n\nTo disable debug mode when your app is minified, add this snippet:\n  Ractive.DEBUG = /unminified/.test(function(){/*unminified*/});\n\nGet help and support:\n  http://docs.ractivejs.org\n  http://stackoverflow.com/questions/tagged/ractivejs\n  http://groups.google.com/forum/#!forum/ractive-js\n  http://twitter.com/ractivejs\n\nFound a bug? Raise an issue:\n  https://github.com/ractivejs/ractive/issues\n\n';

	  		welcome = function () {
	  			var hasGroup = !!console.groupCollapsed;
	  			console[hasGroup ? 'groupCollapsed' : 'log'].apply(console, welcomeIntro);
	  			console.log(welcomeMessage);
	  			if (hasGroup) {
	  				console.groupEnd(welcomeIntro);
	  			}

	  			welcome = noop;
	  		};

	  		printWarning = function (message, args) {
	  			welcome();

	  			// extract information about the instance this message pertains to, if applicable
	  			if (typeof args[args.length - 1] === 'object') {
	  				var options = args.pop();
	  				var ractive = options ? options.ractive : null;

	  				if (ractive) {
	  					// if this is an instance of a component that we know the name of, add
	  					// it to the message
	  					var _name = undefined;
	  					if (ractive.component && (_name = ractive.component.name)) {
	  						message = '<' + _name + '> ' + message;
	  					}

	  					var node = undefined;
	  					if (node = options.node || ractive.fragment && ractive.fragment.rendered && ractive.find('*')) {
	  						args.push(node);
	  					}
	  				}
	  			}

	  			console.warn.apply(console, ['%cRactive.js: %c' + message, 'color: rgb(114, 157, 52);', 'color: rgb(85, 85, 85);'].concat(args));
	  		};

	  		log = function () {
	  			console.log.apply(console, arguments);
	  		};
	  	})();
	  } else {
	  	printWarning = log = welcome = noop;
	  }

	  function format(message, args) {
	  	return message.replace(/%s/g, function () {
	  		return args.shift();
	  	});
	  }

	  function fatal(message) {
	  	for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	  		args[_key - 1] = arguments[_key];
	  	}

	  	message = format(message, args);
	  	throw new Error(message);
	  }

	  function logIfDebug() {
	  	if (Ractive.DEBUG) {
	  		log.apply(null, arguments);
	  	}
	  }

	  function warn(message) {
	  	for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	  		args[_key2 - 1] = arguments[_key2];
	  	}

	  	message = format(message, args);
	  	printWarning(message, args);
	  }

	  function warnOnce(message) {
	  	for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
	  		args[_key3 - 1] = arguments[_key3];
	  	}

	  	message = format(message, args);

	  	if (alreadyWarned[message]) {
	  		return;
	  	}

	  	alreadyWarned[message] = true;
	  	printWarning(message, args);
	  }

	  function warnIfDebug() {
	  	if (Ractive.DEBUG) {
	  		warn.apply(null, arguments);
	  	}
	  }

	  function warnOnceIfDebug() {
	  	if (Ractive.DEBUG) {
	  		warnOnce.apply(null, arguments);
	  	}
	  }

	  // TODO: deprecate in future release
	  var deprecations = {
	  	construct: {
	  		deprecated: 'beforeInit',
	  		replacement: 'onconstruct'
	  	},
	  	render: {
	  		deprecated: 'init',
	  		message: 'The "init" method has been deprecated ' + 'and will likely be removed in a future release. ' + 'You can either use the "oninit" method which will fire ' + 'only once prior to, and regardless of, any eventual ractive ' + 'instance being rendered, or if you need to access the ' + 'rendered DOM, use "onrender" instead. ' + 'See http://docs.ractivejs.org/latest/migrating for more information.'
	  	},
	  	complete: {
	  		deprecated: 'complete',
	  		replacement: 'oncomplete'
	  	}
	  };

	  var Hook = (function () {
	  	function Hook(event) {
	  		classCallCheck(this, Hook);

	  		this.event = event;
	  		this.method = 'on' + event;
	  		this.deprecate = deprecations[event];
	  	}

	  	Hook.prototype.call = function call(method, ractive, arg) {
	  		if (ractive[method]) {
	  			arg ? ractive[method](arg) : ractive[method]();
	  			return true;
	  		}
	  	};

	  	Hook.prototype.fire = function fire(ractive, arg) {
	  		this.call(this.method, ractive, arg);

	  		// handle deprecations
	  		if (!ractive[this.method] && this.deprecate && this.call(this.deprecate.deprecated, ractive, arg)) {
	  			if (this.deprecate.message) {
	  				warnIfDebug(this.deprecate.message);
	  			} else {
	  				warnIfDebug('The method "%s" has been deprecated in favor of "%s" and will likely be removed in a future release. See http://docs.ractivejs.org/latest/migrating for more information.', this.deprecate.deprecated, this.deprecate.replacement);
	  			}
	  		}

	  		// TODO should probably use internal method, in case ractive.fire was overwritten
	  		arg ? ractive.fire(this.event, arg) : ractive.fire(this.event);
	  	};

	  	return Hook;
	  })();

	  var toString = Object.prototype.toString;
	  // thanks, http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/

	  function isArray(thing) {
	  	return toString.call(thing) === '[object Array]';
	  }

	  function isEqual(a, b) {
	  	if (a === null && b === null) {
	  		return true;
	  	}

	  	if (typeof a === 'object' || typeof b === 'object') {
	  		return false;
	  	}

	  	return a === b;
	  }

	  // http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric

	  function isNumeric(thing) {
	  	return !isNaN(parseFloat(thing)) && isFinite(thing);
	  }

	  function isObject(thing) {
	  	return thing && toString.call(thing) === '[object Object]';
	  }

	  function addToArray(array, value) {
	  	var index = array.indexOf(value);

	  	if (index === -1) {
	  		array.push(value);
	  	}
	  }

	  function arrayContains(array, value) {
	  	for (var i = 0, c = array.length; i < c; i++) {
	  		if (array[i] == value) {
	  			return true;
	  		}
	  	}

	  	return false;
	  }

	  function arrayContentsMatch(a, b) {
	  	var i;

	  	if (!isArray(a) || !isArray(b)) {
	  		return false;
	  	}

	  	if (a.length !== b.length) {
	  		return false;
	  	}

	  	i = a.length;
	  	while (i--) {
	  		if (a[i] !== b[i]) {
	  			return false;
	  		}
	  	}

	  	return true;
	  }

	  function ensureArray(x) {
	  	if (typeof x === 'string') {
	  		return [x];
	  	}

	  	if (x === undefined) {
	  		return [];
	  	}

	  	return x;
	  }

	  function lastItem(array) {
	  	return array[array.length - 1];
	  }

	  function removeFromArray(array, member) {
	  	if (!array) {
	  		return;
	  	}

	  	var index = array.indexOf(member);

	  	if (index !== -1) {
	  		array.splice(index, 1);
	  	}
	  }

	  function toArray(arrayLike) {
	  	var array = [],
	  	    i = arrayLike.length;
	  	while (i--) {
	  		array[i] = arrayLike[i];
	  	}

	  	return array;
	  }

	  var _Promise;
	  var PENDING = {};
	  var FULFILLED = {};
	  var REJECTED = {};
	  if (typeof Promise === 'function') {
	  	// use native Promise
	  	_Promise = Promise;
	  } else {
	  	_Promise = function (callback) {
	  		var fulfilledHandlers = [],
	  		    rejectedHandlers = [],
	  		    state = PENDING,
	  		    result,
	  		    dispatchHandlers,
	  		    makeResolver,
	  		    fulfil,
	  		    reject,
	  		    promise;

	  		makeResolver = function (newState) {
	  			return function (value) {
	  				if (state !== PENDING) {
	  					return;
	  				}

	  				result = value;
	  				state = newState;

	  				dispatchHandlers = makeDispatcher(state === FULFILLED ? fulfilledHandlers : rejectedHandlers, result);

	  				// dispatch onFulfilled and onRejected handlers asynchronously
	  				wait(dispatchHandlers);
	  			};
	  		};

	  		fulfil = makeResolver(FULFILLED);
	  		reject = makeResolver(REJECTED);

	  		try {
	  			callback(fulfil, reject);
	  		} catch (err) {
	  			reject(err);
	  		}

	  		promise = {
	  			// `then()` returns a Promise - 2.2.7
	  			then: function (onFulfilled, onRejected) {
	  				var promise2 = new _Promise(function (fulfil, reject) {

	  					var processResolutionHandler = function (handler, handlers, forward) {

	  						// 2.2.1.1
	  						if (typeof handler === 'function') {
	  							handlers.push(function (p1result) {
	  								var x;

	  								try {
	  									x = handler(p1result);
	  									resolve(promise2, x, fulfil, reject);
	  								} catch (err) {
	  									reject(err);
	  								}
	  							});
	  						} else {
	  							// Forward the result of promise1 to promise2, if resolution handlers
	  							// are not given
	  							handlers.push(forward);
	  						}
	  					};

	  					// 2.2
	  					processResolutionHandler(onFulfilled, fulfilledHandlers, fulfil);
	  					processResolutionHandler(onRejected, rejectedHandlers, reject);

	  					if (state !== PENDING) {
	  						// If the promise has resolved already, dispatch the appropriate handlers asynchronously
	  						wait(dispatchHandlers);
	  					}
	  				});

	  				return promise2;
	  			}
	  		};

	  		promise['catch'] = function (onRejected) {
	  			return this.then(null, onRejected);
	  		};

	  		return promise;
	  	};

	  	_Promise.all = function (promises) {
	  		return new _Promise(function (fulfil, reject) {
	  			var result = [],
	  			    pending,
	  			    i,
	  			    processPromise;

	  			if (!promises.length) {
	  				fulfil(result);
	  				return;
	  			}

	  			processPromise = function (promise, i) {
	  				if (promise && typeof promise.then === 'function') {
	  					promise.then(function (value) {
	  						result[i] = value;
	  						--pending || fulfil(result);
	  					}, reject);
	  				} else {
	  					result[i] = promise;
	  					--pending || fulfil(result);
	  				}
	  			};

	  			pending = i = promises.length;
	  			while (i--) {
	  				processPromise(promises[i], i);
	  			}
	  		});
	  	};

	  	_Promise.resolve = function (value) {
	  		return new _Promise(function (fulfil) {
	  			fulfil(value);
	  		});
	  	};

	  	_Promise.reject = function (reason) {
	  		return new _Promise(function (fulfil, reject) {
	  			reject(reason);
	  		});
	  	};
	  }

	  var Promise$1 = _Promise;

	  // TODO use MutationObservers or something to simulate setImmediate
	  function wait(callback) {
	  	setTimeout(callback, 0);
	  }

	  function makeDispatcher(handlers, result) {
	  	return function () {
	  		var handler;

	  		while (handler = handlers.shift()) {
	  			handler(result);
	  		}
	  	};
	  }

	  function resolve(promise, x, fulfil, reject) {
	  	// Promise Resolution Procedure
	  	var then;

	  	// 2.3.1
	  	if (x === promise) {
	  		throw new TypeError('A promise\'s fulfillment handler cannot return the same promise');
	  	}

	  	// 2.3.2
	  	if (x instanceof _Promise) {
	  		x.then(fulfil, reject);
	  	}

	  	// 2.3.3
	  	else if (x && (typeof x === 'object' || typeof x === 'function')) {
	  			try {
	  				then = x.then; // 2.3.3.1
	  			} catch (e) {
	  				reject(e); // 2.3.3.2
	  				return;
	  			}

	  			// 2.3.3.3
	  			if (typeof then === 'function') {
	  				var called, resolvePromise, rejectPromise;

	  				resolvePromise = function (y) {
	  					if (called) {
	  						return;
	  					}
	  					called = true;
	  					resolve(promise, y, fulfil, reject);
	  				};

	  				rejectPromise = function (r) {
	  					if (called) {
	  						return;
	  					}
	  					called = true;
	  					reject(r);
	  				};

	  				try {
	  					then.call(x, resolvePromise, rejectPromise);
	  				} catch (e) {
	  					if (!called) {
	  						// 2.3.3.3.4.1
	  						reject(e); // 2.3.3.3.4.2
	  						called = true;
	  						return;
	  					}
	  				}
	  			} else {
	  				fulfil(x);
	  			}
	  		} else {
	  			fulfil(x);
	  		}
	  }

	  var TransitionManager = (function () {
	  	function TransitionManager(callback, parent) {
	  		classCallCheck(this, TransitionManager);

	  		this.callback = callback;
	  		this.parent = parent;

	  		this.intros = [];
	  		this.outros = [];

	  		this.children = [];
	  		this.totalChildren = this.outroChildren = 0;

	  		this.detachQueue = [];
	  		this.outrosComplete = false;

	  		if (parent) {
	  			parent.addChild(this);
	  		}
	  	}

	  	TransitionManager.prototype.add = function add(transition) {
	  		var list = transition.isIntro ? this.intros : this.outros;
	  		list.push(transition);
	  	};

	  	TransitionManager.prototype.addChild = function addChild(child) {
	  		this.children.push(child);

	  		this.totalChildren += 1;
	  		this.outroChildren += 1;
	  	};

	  	TransitionManager.prototype.decrementOutros = function decrementOutros() {
	  		this.outroChildren -= 1;
	  		check(this);
	  	};

	  	TransitionManager.prototype.decrementTotal = function decrementTotal() {
	  		this.totalChildren -= 1;
	  		check(this);
	  	};

	  	TransitionManager.prototype.detachNodes = function detachNodes() {
	  		this.detachQueue.forEach(detach);
	  		this.children.forEach(_detachNodes);
	  	};

	  	TransitionManager.prototype.remove = function remove(transition) {
	  		var list = transition.isIntro ? this.intros : this.outros;
	  		removeFromArray(list, transition);
	  		check(this);
	  	};

	  	TransitionManager.prototype.start = function start() {
	  		this.intros.concat(this.outros).forEach(function (t) {
	  			return t.start();
	  		});
	  		this.ready = true;
	  		check(this);
	  	};

	  	return TransitionManager;
	  })();

	  function detach(element) {
	  	element.detach();
	  }

	  function _detachNodes(tm) {
	  	// _ to avoid transpiler quirk
	  	tm.detachNodes();
	  }

	  function check(tm) {
	  	if (!tm.ready || tm.outros.length || tm.outroChildren) return;

	  	// If all outros are complete, and we haven't already done this,
	  	// we notify the parent if there is one, otherwise
	  	// start detaching nodes
	  	if (!tm.outrosComplete) {
	  		if (tm.parent && !tm.parent.outrosComplete) {
	  			tm.parent.decrementOutros(tm);
	  		} else {
	  			tm.detachNodes();
	  		}

	  		tm.outrosComplete = true;
	  	}

	  	// Once everything is done, we can notify parent transition
	  	// manager and call the callback
	  	if (!tm.intros.length && !tm.totalChildren) {
	  		if (typeof tm.callback === 'function') {
	  			tm.callback();
	  		}

	  		if (tm.parent) {
	  			tm.parent.decrementTotal();
	  		}
	  	}
	  }

	  var changeHook = new Hook('change');

	  var batch = undefined;

	  var runloop = {
	  	start: function (instance, returnPromise) {
	  		var promise, fulfilPromise;

	  		if (returnPromise) {
	  			promise = new Promise$1(function (f) {
	  				return fulfilPromise = f;
	  			});
	  		}

	  		batch = {
	  			previousBatch: batch,
	  			transitionManager: new TransitionManager(fulfilPromise, batch && batch.transitionManager),
	  			fragments: [],
	  			tasks: [],
	  			immediateObservers: [],
	  			deferredObservers: [],
	  			instance: instance
	  		};

	  		return promise;
	  	},

	  	end: function () {
	  		flushChanges();
	  		batch = batch.previousBatch;
	  	},

	  	addFragment: function (fragment) {
	  		addToArray(batch.fragments, fragment);
	  	},

	  	addObserver: function (observer, defer) {
	  		addToArray(defer ? batch.deferredObservers : batch.immediateObservers, observer);
	  	},

	  	registerTransition: function (transition) {
	  		transition._manager = batch.transitionManager;
	  		batch.transitionManager.add(transition);
	  	},

	  	// synchronise node detachments with transition ends
	  	detachWhenReady: function (thing) {
	  		batch.transitionManager.detachQueue.push(thing);
	  	},

	  	scheduleTask: function (task, postRender) {
	  		var _batch;

	  		if (!batch) {
	  			task();
	  		} else {
	  			_batch = batch;
	  			while (postRender && _batch.previousBatch) {
	  				// this can't happen until the DOM has been fully updated
	  				// otherwise in some situations (with components inside elements)
	  				// transitions and decorators will initialise prematurely
	  				_batch = _batch.previousBatch;
	  			}

	  			_batch.tasks.push(task);
	  		}
	  	}
	  };

	  function dispatch(observer) {
	  	observer.dispatch();
	  }

	  function flushChanges() {
	  	batch.immediateObservers.forEach(dispatch);

	  	// Now that changes have been fully propagated, we can update the DOM
	  	// and complete other tasks
	  	var i = batch.fragments.length;
	  	var fragment = undefined;

	  	while (i--) {
	  		fragment = batch.fragments[i];

	  		// TODO deprecate this. It's annoying and serves no useful function
	  		var ractive = fragment.ractive;
	  		changeHook.fire(ractive, ractive.viewmodel.changes);
	  		ractive.viewmodel.changes = {};

	  		fragment.update();
	  	}
	  	batch.fragments.length = 0;

	  	batch.transitionManager.start();

	  	batch.deferredObservers.forEach(dispatch);

	  	var tasks = batch.tasks;
	  	batch.tasks = [];

	  	for (i = 0; i < tasks.length; i += 1) {
	  		tasks[i]();
	  	}

	  	// If updating the view caused some model blowback - e.g. a triple
	  	// containing <option> elements caused the binding on the <select>
	  	// to update - then we start over
	  	if (batch.fragments.length) return flushChanges();
	  }

	  function Ractive$updateModel(keypath, cascade) {
	  	var promise = runloop.start(this, true);

	  	if (!keypath) {
	  		this.viewmodel.updateFromBindings(true);
	  	} else {
	  		this.viewmodel.joinAll(splitKeypath(keypath)).updateFromBindings(cascade !== false);
	  	}

	  	runloop.end();

	  	return promise;
	  }

	  var updateHook = new Hook('update');
	  function Ractive$update(keypath) {
	  	var model = keypath ? this.viewmodel.joinAll(splitKeypath(keypath)) : this.viewmodel;

	  	var promise = runloop.start(this, true);
	  	model.mark();
	  	runloop.end();

	  	updateHook.fire(this, model);

	  	return promise;
	  }

	  // This function takes an array, the name of a mutator method, and the
	  // arguments to call that mutator method with, and returns an array that
	  // maps the old indices to their new indices.

	  // So if you had something like this...
	  //
	  //     array = [ 'a', 'b', 'c', 'd' ];
	  //     array.push( 'e' );
	  //
	  // ...you'd get `[ 0, 1, 2, 3 ]` - in other words, none of the old indices
	  // have changed. If you then did this...
	  //
	  //     array.unshift( 'z' );
	  //
	  // ...the indices would be `[ 1, 2, 3, 4, 5 ]` - every item has been moved
	  // one higher to make room for the 'z'. If you removed an item, the new index
	  // would be -1...
	  //
	  //     array.splice( 2, 2 );
	  //
	  // ...this would result in [ 0, 1, -1, -1, 2, 3 ].
	  //
	  // This information is used to enable fast, non-destructive shuffling of list
	  // sections when you do e.g. `ractive.splice( 'items', 2, 2 );

	  function getNewIndices(length, methodName, args) {
	  	var spliceArguments,
	  	    newIndices = [],
	  	    removeStart,
	  	    removeEnd,
	  	    balance,
	  	    i;

	  	spliceArguments = getSpliceEquivalent(length, methodName, args);

	  	if (!spliceArguments) {
	  		return null; // TODO support reverse and sort?
	  	}

	  	balance = spliceArguments.length - 2 - spliceArguments[1];

	  	removeStart = Math.min(length, spliceArguments[0]);
	  	removeEnd = removeStart + spliceArguments[1];

	  	for (i = 0; i < removeStart; i += 1) {
	  		newIndices.push(i);
	  	}

	  	for (; i < removeEnd; i += 1) {
	  		newIndices.push(-1);
	  	}

	  	for (; i < length; i += 1) {
	  		newIndices.push(i + balance);
	  	}

	  	// there is a net shift for the rest of the array starting with index + balance
	  	if (balance !== 0) {
	  		newIndices.touchedFrom = spliceArguments[0];
	  	} else {
	  		newIndices.touchedFrom = length;
	  	}

	  	return newIndices;
	  }

	  // The pop, push, shift an unshift methods can all be represented
	  // as an equivalent splice
	  function getSpliceEquivalent(length, methodName, args) {
	  	switch (methodName) {
	  		case 'splice':
	  			if (args[0] !== undefined && args[0] < 0) {
	  				args[0] = length + Math.max(args[0], -length);
	  			}

	  			while (args.length < 2) {
	  				args.push(length - args[0]);
	  			}

	  			// ensure we only remove elements that exist
	  			args[1] = Math.min(args[1], length - args[0]);

	  			return args;

	  		case 'sort':
	  		case 'reverse':
	  			return null;

	  		case 'pop':
	  			if (length) {
	  				return [length - 1, 1];
	  			}
	  			return [0, 0];

	  		case 'push':
	  			return [length, 0].concat(args);

	  		case 'shift':
	  			return [0, length ? 1 : 0];

	  		case 'unshift':
	  			return [0, 0].concat(args);
	  	}
	  }

	  var arrayProto = Array.prototype;

	  function makeArrayMethod (methodName) {
	  	return function (keypath) {
	  		var model = this.viewmodel.joinAll(splitKeypath(keypath));
	  		var array = model.get();

	  		if (!isArray(array)) {
	  			throw new Error('shuffle array method ' + methodName + ' called on non-array at ' + model.getKeypath());
	  		}

	  		for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	  			args[_key - 1] = arguments[_key];
	  		}

	  		var newIndices = getNewIndices(array.length, methodName, args);
	  		var result = arrayProto[methodName].apply(array, args);

	  		var promise = runloop.start(this, true).then(function () {
	  			return result;
	  		});

	  		if (newIndices) {
	  			model.shuffle(newIndices);
	  		} else {
	  			model.set(result);
	  		}

	  		runloop.end();

	  		return promise;
	  	};
	  }

	  var unshift = makeArrayMethod('unshift');

	  var unrenderHook$1 = new Hook('unrender');
	  function Ractive$unrender() {
	  	if (!this.fragment.rendered) {
	  		warnIfDebug('ractive.unrender() was called on a Ractive instance that was not rendered');
	  		return Promise$1.resolve();
	  	}

	  	var promise = runloop.start(this, true);

	  	// If this is a component, and the component isn't marked for destruction,
	  	// don't detach nodes from the DOM unnecessarily
	  	var shouldDestroy = !this.component || this.component.shouldDestroy || this.shouldDestroy;
	  	this.fragment.unrender(shouldDestroy);

	  	removeFromArray(this.el.__ractive_instances__, this);

	  	unrenderHook$1.fire(this);

	  	runloop.end();
	  	return promise;
	  }

	  function unlink(here) {
	  	var ln = this._links[here];

	  	if (ln) {
	  		ln.unlink();
	  		delete this._links[here];
	  		return this.set(here, ln.intialValue);
	  	} else {
	  		return Promise$1.resolve(true);
	  	}
	  }

	  function Ractive$toHTML() {
	  	return this.fragment.toString(true);
	  }

	  var PREFIX = '/* Ractive.js component styles */';

	  // Holds current definitions of styles.
	  var styleDefinitions = [];

	  // Flag to tell if we need to update the CSS
	  var isDirty = false;

	  // These only make sense on the browser. See additional setup below.
	  var styleElement = null;
	  var styleSheet = null;
	  var styleProperty = null;

	  function addCSS(styleDefinition) {
	  	styleDefinitions.push(styleDefinition);
	  	isDirty = true;
	  }

	  function applyCSS() {

	  	// Apply only seems to make sense when we're in the DOM. Server-side renders
	  	// can call toCSS to get the updated CSS.
	  	if (!doc || !isDirty) return;

	  	styleElement[styleProperty] = getCSS(null);

	  	isDirty = false;
	  }

	  function getCSS(cssIds) {

	  	var filteredStyleDefinitions = cssIds ? styleDefinitions.filter(function (style) {
	  		return ~cssIds.indexOf(style.id);
	  	}) : styleDefinitions;

	  	return filteredStyleDefinitions.reduce(function (styles, style) {
	  		return styles + '\n\n/* {' + style.id + '} */\n' + style.styles;
	  	}, PREFIX);
	  }

	  // If we're on the browser, additional setup needed.
	  if (doc && (!styleElement || !styleElement.parentNode)) {

	  	styleElement = doc.createElement('style');
	  	styleElement.type = 'text/css';

	  	doc.getElementsByTagName('head')[0].appendChild(styleElement);

	  	styleSheet = styleElement.styleSheet;

	  	styleProperty = styleSheet ? 'cssText' : 'innerHTML';
	  }

	  function Ractive$toCSS() {
	  	var cssIds = [this.cssId].concat(toConsumableArray(this.findAllComponents().map(function (c) {
	  		return c.cssId;
	  	})));
	  	var uniqueCssIds = Object.keys(cssIds.reduce(function (ids, id) {
	  		return ids[id] = true, ids;
	  	}, {}));
	  	return getCSS(uniqueCssIds);
	  }

	  // Error messages that are used (or could be) in multiple places
	  var badArguments = 'Bad arguments';
	  var noRegistryFunctionReturn = 'A function was specified for "%s" %s, but no %s was returned';
	  var missingPlugin = function (name, type) {
	    return 'Missing "' + name + '" ' + type + ' plugin. You may need to download a plugin via http://docs.ractivejs.org/latest/plugins#' + type + 's';
	  };

	  function Ractive$toggle(keypath) {
	  	if (typeof keypath !== 'string') {
	  		throw new TypeError(badArguments);
	  	}

	  	var changes = undefined;

	  	if (/\*/.test(keypath)) {
	  		changes = {};

	  		this.viewmodel.findMatches(splitKeypath(keypath)).forEach(function (model) {
	  			changes[model.getKeypath()] = !model.get();
	  		});

	  		return this.set(changes);
	  	}

	  	return this.set(keypath, !this.get(keypath));
	  }

	  function _bind(x) {
	    x.bind();
	  }

	  function cancel(x) {
	    x.cancel();
	  }

	  function _handleChange(x) {
	    x.handleChange();
	  }

	  function _mark(x) {
	    x.mark();
	  }

	  function _render(x) {
	    x.render();
	  }

	  function _rebind(x) {
	    x.rebind();
	  }

	  function _teardown(x) {
	    x.teardown();
	  }

	  function _unbind(x) {
	    x.unbind();
	  }

	  function _unrender(x) {
	    x.unrender();
	  }

	  function unrenderAndDestroy$1(x) {
	    x.unrender(true);
	  }

	  function _update(x) {
	    x.update();
	  }

	  function _toString(x) {
	    return x.toString();
	  }

	  function toEscapedString(x) {
	    return x.toString(true);
	  }

	  var teardownHook = new Hook('teardown');

	  // Teardown. This goes through the root fragment and all its children, removing observers
	  // and generally cleaning up after itself

	  function Ractive$teardown() {
	  	var _this = this;

	  	this.fragment.unbind();
	  	this.viewmodel.teardown();

	  	this._observers.forEach(cancel);

	  	if (this.fragment.rendered && this.el.__ractive_instances__) {
	  		removeFromArray(this.el.__ractive_instances__, this);
	  	}

	  	this.shouldDestroy = true;
	  	var promise = this.fragment.rendered ? this.unrender() : Promise$1.resolve();

	  	Object.keys(this._links).forEach(function (k) {
	  		return _this._links[k].unlink();
	  	});

	  	teardownHook.fire(this);

	  	return promise;
	  }

	  var errorMessage$1 = 'Cannot add to a non-numeric value';
	  function add(ractive, keypath, d) {
	  	if (typeof keypath !== 'string' || !isNumeric(d)) {
	  		throw new Error('Bad arguments');
	  	}

	  	var changes = undefined;

	  	if (/\*/.test(keypath)) {
	  		changes = {};

	  		ractive.viewmodel.findMatches(splitKeypath(keypath)).forEach(function (model) {
	  			var value = model.get();

	  			if (!isNumeric(value)) throw new Error(errorMessage$1);

	  			changes[model.getKeypath()] = value + d;
	  		});

	  		return ractive.set(changes);
	  	}

	  	var value = ractive.get(keypath);

	  	if (!isNumeric(value)) {
	  		throw new Error(errorMessage$1);
	  	}

	  	return ractive.set(keypath, +value + d);
	  }

	  function Ractive$subtract(keypath, d) {
	  	return add(this, keypath, d === undefined ? -1 : -d);
	  }

	  var splice = makeArrayMethod('splice');

	  var sort = makeArrayMethod('sort');

	  var shift = makeArrayMethod('shift');

	  function bind(fn, context) {
	  	if (!/this/.test(fn.toString())) return fn;

	  	var bound = fn.bind(context);
	  	for (var prop in fn) {
	  		bound[prop] = fn[prop];
	  	}return bound;
	  }

	  function Ractive$set(keypath, value) {
	  	var promise = runloop.start(this, true);

	  	// Set multiple keypaths in one go
	  	if (isObject(keypath)) {
	  		var map = keypath;

	  		for (keypath in map) {
	  			if (map.hasOwnProperty(keypath)) {
	  				set(this, keypath, map[keypath]);
	  			}
	  		}
	  	}
	  	// Set a single keypath
	  	else {
	  			set(this, keypath, value);
	  		}

	  	runloop.end();

	  	return promise;
	  }

	  function set(ractive, keypath, value) {
	  	if (typeof value === 'function') value = bind(value, ractive);

	  	if (/\*/.test(keypath)) {
	  		ractive.viewmodel.findMatches(splitKeypath(keypath)).forEach(function (model) {
	  			model.set(value);
	  		});
	  	} else {
	  		var model = ractive.viewmodel.joinAll(splitKeypath(keypath));
	  		model.set(value);
	  	}
	  }

	  var reverse = makeArrayMethod('reverse');

	  var TEMPLATE_VERSION = 3;

	  var pattern = /\$\{([^\}]+)\}/g;

	  function fromExpression(body) {
	  	var length = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

	  	var args = new Array(length);

	  	while (length--) {
	  		args[length] = '_' + length;
	  	}

	  	// Functions created directly with new Function() look like this:
	  	//     function anonymous (_0 /**/) { return _0*2 }
	  	//
	  	// With this workaround, we get a little more compact:
	  	//     function (_0){return _0*2}
	  	return new Function([], 'return function (' + args.join(',') + '){return(' + body + ');};')();
	  }

	  function fromComputationString(str, bindTo) {
	  	var hasThis = undefined;

	  	var functionBody = 'return (' + str.replace(pattern, function (match, keypath) {
	  		hasThis = true;
	  		return '__ractive.get("' + keypath + '")';
	  	}) + ');';

	  	if (hasThis) functionBody = 'var __ractive = this; ' + functionBody;
	  	var fn = new Function(functionBody);
	  	return hasThis ? fn.bind(bindTo) : fn;
	  }

	  var html = 'http://www.w3.org/1999/xhtml';
	  var mathml = 'http://www.w3.org/1998/Math/MathML';
	  var svg$1 = 'http://www.w3.org/2000/svg';
	  var xlink = 'http://www.w3.org/1999/xlink';
	  var xml = 'http://www.w3.org/XML/1998/namespace';
	  var xmlns = 'http://www.w3.org/2000/xmlns';

	  var namespaces = { html: html, mathml: mathml, svg: svg$1, xlink: xlink, xml: xml, xmlns: xmlns };

	  var createElement;
	  var matches;
	  var div;
	  var methodNames;
	  var unprefixed;
	  var prefixed;
	  var i$1;
	  var j$1;
	  var makeFunction;
	  // Test for SVG support
	  if (!svg) {
	  	createElement = function (type, ns, extend) {
	  		if (ns && ns !== html) {
	  			throw 'This browser does not support namespaces other than http://www.w3.org/1999/xhtml. The most likely cause of this error is that you\'re trying to render SVG in an older browser. See http://docs.ractivejs.org/latest/svg-and-older-browsers for more information';
	  		}

	  		return extend ? doc.createElement(type, extend) : doc.createElement(type);
	  	};
	  } else {
	  	createElement = function (type, ns, extend) {
	  		if (!ns || ns === html) {
	  			return extend ? doc.createElement(type, extend) : doc.createElement(type);
	  		}

	  		return extend ? doc.createElementNS(ns, type, extend) : doc.createElementNS(ns, type);
	  	};
	  }

	  function createDocumentFragment() {
	  	return doc.createDocumentFragment();
	  }

	  function getElement(input) {
	  	var output;

	  	if (!input || typeof input === 'boolean') {
	  		return;
	  	}

	  	if (!win || !doc || !input) {
	  		return null;
	  	}

	  	// We already have a DOM node - no work to do. (Duck typing alert!)
	  	if (input.nodeType) {
	  		return input;
	  	}

	  	// Get node from string
	  	if (typeof input === 'string') {
	  		// try ID first
	  		output = doc.getElementById(input);

	  		// then as selector, if possible
	  		if (!output && doc.querySelector) {
	  			output = doc.querySelector(input);
	  		}

	  		// did it work?
	  		if (output && output.nodeType) {
	  			return output;
	  		}
	  	}

	  	// If we've been given a collection (jQuery, Zepto etc), extract the first item
	  	if (input[0] && input[0].nodeType) {
	  		return input[0];
	  	}

	  	return null;
	  }

	  if (!isClient) {
	  	matches = null;
	  } else {
	  	div = createElement('div');
	  	methodNames = ['matches', 'matchesSelector'];

	  	makeFunction = function (methodName) {
	  		return function (node, selector) {
	  			return node[methodName](selector);
	  		};
	  	};

	  	i$1 = methodNames.length;

	  	while (i$1-- && !matches) {
	  		unprefixed = methodNames[i$1];

	  		if (div[unprefixed]) {
	  			matches = makeFunction(unprefixed);
	  		} else {
	  			j$1 = vendors.length;
	  			while (j$1--) {
	  				prefixed = vendors[i$1] + unprefixed.substr(0, 1).toUpperCase() + unprefixed.substring(1);

	  				if (div[prefixed]) {
	  					matches = makeFunction(prefixed);
	  					break;
	  				}
	  			}
	  		}
	  	}

	  	// IE8...
	  	if (!matches) {
	  		matches = function (node, selector) {
	  			var nodes, parentNode, i$1;

	  			parentNode = node.parentNode;

	  			if (!parentNode) {
	  				// empty dummy <div>
	  				div.innerHTML = '';

	  				parentNode = div;
	  				node = node.cloneNode();

	  				div.appendChild(node);
	  			}

	  			nodes = parentNode.querySelectorAll(selector);

	  			i$1 = nodes.length;
	  			while (i$1--) {
	  				if (nodes[i$1] === node) {
	  					return true;
	  				}
	  			}

	  			return false;
	  		};
	  	}
	  }

	  function detachNode(node) {
	  	if (node && typeof node.parentNode !== 'unknown' && node.parentNode) {
	  		node.parentNode.removeChild(node);
	  	}

	  	return node;
	  }

	  function safeToStringValue(value) {
	  	return value == null || !value.toString ? '' : '' + value;
	  }

	  var legacy = null;

	  var create;
	  var defineProperty;
	  var defineProperties;
	  try {
	  	Object.defineProperty({}, 'test', { value: 0 });

	  	if (doc) {
	  		Object.defineProperty(createElement('div'), 'test', { value: 0 });
	  	}

	  	defineProperty = Object.defineProperty;
	  } catch (err) {
	  	// Object.defineProperty doesn't exist, or we're in IE8 where you can
	  	// only use it with DOM objects (what were you smoking, MSFT?)
	  	defineProperty = function (obj, prop, desc) {
	  		obj[prop] = desc.value;
	  	};
	  }

	  try {
	  	try {
	  		Object.defineProperties({}, { test: { value: 0 } });
	  	} catch (err) {
	  		// TODO how do we account for this? noMagic = true;
	  		throw err;
	  	}

	  	if (doc) {
	  		Object.defineProperties(createElement('div'), { test: { value: 0 } });
	  	}

	  	defineProperties = Object.defineProperties;
	  } catch (err) {
	  	defineProperties = function (obj, props) {
	  		var prop;

	  		for (prop in props) {
	  			if (props.hasOwnProperty(prop)) {
	  				defineProperty(obj, prop, props[prop]);
	  			}
	  		}
	  	};
	  }

	  try {
	  	Object.create(null);

	  	create = Object.create;
	  } catch (err) {
	  	// sigh
	  	create = (function () {
	  		var F = function () {};

	  		return function (proto, props) {
	  			var obj;

	  			if (proto === null) {
	  				return {};
	  			}

	  			F.prototype = proto;
	  			obj = new F();

	  			if (props) {
	  				Object.defineProperties(obj, props);
	  			}

	  			return obj;
	  		};
	  	})();
	  }

	  function extend(target) {
	  	var prop, source;

	  	for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	  		sources[_key - 1] = arguments[_key];
	  	}

	  	while (source = sources.shift()) {
	  		for (prop in source) {
	  			if (hasOwn.call(source, prop)) {
	  				target[prop] = source[prop];
	  			}
	  		}
	  	}

	  	return target;
	  }

	  function fillGaps(target) {
	  	for (var _len2 = arguments.length, sources = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	  		sources[_key2 - 1] = arguments[_key2];
	  	}

	  	sources.forEach(function (s) {
	  		for (var key in s) {
	  			if (hasOwn.call(s, key) && !(key in target)) {
	  				target[key] = s[key];
	  			}
	  		}
	  	});

	  	return target;
	  }

	  var hasOwn = Object.prototype.hasOwnProperty;

	  var functions = create(null);
	  function getFunction(str, i) {
	  	if (functions[str]) return functions[str];
	  	return functions[str] = createFunction(str, i);
	  }

	  function addFunctions(template) {
	  	if (!template) return;

	  	var exp = template.e;

	  	if (!exp) return;

	  	Object.keys(exp).forEach(function (str) {
	  		if (functions[str]) return;
	  		functions[str] = exp[str];
	  	});
	  }

	  var TEXT = 1;
	  var INTERPOLATOR = 2;
	  var TRIPLE = 3;
	  var SECTION = 4;
	  var INVERTED = 5;
	  var CLOSING = 6;
	  var ELEMENT = 7;
	  var PARTIAL = 8;
	  var COMMENT = 9;
	  var DELIMCHANGE = 10;
	  var CLOSING_TAG = 14;
	  var COMPONENT = 15;
	  var YIELDER = 16;
	  var INLINE_PARTIAL = 17;
	  var DOCTYPE = 18;
	  var ALIAS = 19;

	  var NUMBER_LITERAL = 20;
	  var STRING_LITERAL = 21;
	  var ARRAY_LITERAL = 22;
	  var OBJECT_LITERAL = 23;
	  var BOOLEAN_LITERAL = 24;
	  var REGEXP_LITERAL = 25;

	  var GLOBAL = 26;
	  var KEY_VALUE_PAIR = 27;

	  var REFERENCE = 30;
	  var REFINEMENT = 31;
	  var MEMBER = 32;
	  var PREFIX_OPERATOR = 33;
	  var BRACKETED = 34;
	  var CONDITIONAL = 35;
	  var INFIX_OPERATOR = 36;

	  var INVOCATION = 40;

	  var SECTION_IF = 50;
	  var SECTION_UNLESS = 51;
	  var SECTION_EACH = 52;
	  var SECTION_WITH = 53;
	  var SECTION_IF_WITH = 54;

	  var ELSE = 60;
	  var ELSEIF = 61;

	  function readComment(parser, tag) {
	  	var index;

	  	if (!parser.matchString('!')) {
	  		return null;
	  	}

	  	index = parser.remaining().indexOf(tag.close);

	  	if (index !== -1) {
	  		parser.pos += index + tag.close.length;
	  		return { t: COMMENT };
	  	}
	  }

	  var expectedExpression = 'Expected a JavaScript expression';
	  var expectedParen = 'Expected closing paren';

	  // bulletproof number regex from https://gist.github.com/Rich-Harris/7544330
	  var numberPattern$1 = /^(?:[+-]?)0*(?:(?:(?:[1-9]\d*)?\.\d+)|(?:(?:0|[1-9]\d*)\.)|(?:0|[1-9]\d*))(?:[eE][+-]?\d+)?/;
	  function readNumberLiteral$1(parser) {
	  	var result;

	  	if (result = parser.matchPattern(numberPattern$1)) {
	  		return {
	  			t: NUMBER_LITERAL,
	  			v: result
	  		};
	  	}

	  	return null;
	  }

	  function readBooleanLiteral(parser) {
	  	var remaining = parser.remaining();

	  	if (remaining.substr(0, 4) === 'true') {
	  		parser.pos += 4;
	  		return {
	  			t: BOOLEAN_LITERAL,
	  			v: 'true'
	  		};
	  	}

	  	if (remaining.substr(0, 5) === 'false') {
	  		parser.pos += 5;
	  		return {
	  			t: BOOLEAN_LITERAL,
	  			v: 'false'
	  		};
	  	}

	  	return null;
	  }

	  var stringMiddlePattern;
	  var escapeSequencePattern;
	  var lineContinuationPattern;
	  // Match one or more characters until: ", ', \, or EOL/EOF.
	  // EOL/EOF is written as (?!.) (meaning there's no non-newline char next).
	  stringMiddlePattern = /^(?=.)[^"'\\]+?(?:(?!.)|(?=["'\\]))/;

	  // Match one escape sequence, including the backslash.
	  escapeSequencePattern = /^\\(?:['"\\bfnrt]|0(?![0-9])|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|(?=.)[^ux0-9])/;

	  // Match one ES5 line continuation (backslash + line terminator).
	  lineContinuationPattern = /^\\(?:\r\n|[\u000A\u000D\u2028\u2029])/;

	  // Helper for defining getDoubleQuotedString and getSingleQuotedString.
	  function makeQuotedStringMatcher (okQuote) {
	  	return function (parser) {
	  		var literal = '"';
	  		var done = false;
	  		var next = undefined;

	  		while (!done) {
	  			next = parser.matchPattern(stringMiddlePattern) || parser.matchPattern(escapeSequencePattern) || parser.matchString(okQuote);
	  			if (next) {
	  				if (next === '"') {
	  					literal += '\\"';
	  				} else if (next === '\\\'') {
	  					literal += '\'';
	  				} else {
	  					literal += next;
	  				}
	  			} else {
	  				next = parser.matchPattern(lineContinuationPattern);
	  				if (next) {
	  					// convert \(newline-like) into a \u escape, which is allowed in JSON
	  					literal += '\\u' + ('000' + next.charCodeAt(1).toString(16)).slice(-4);
	  				} else {
	  					done = true;
	  				}
	  			}
	  		}

	  		literal += '"';

	  		// use JSON.parse to interpret escapes
	  		return JSON.parse(literal);
	  	};
	  }

	  var getSingleQuotedString = makeQuotedStringMatcher('"');
	  var getDoubleQuotedString = makeQuotedStringMatcher('\'');

	  function readStringLiteral (parser) {
	  	var start, string;

	  	start = parser.pos;

	  	if (parser.matchString('"')) {
	  		string = getDoubleQuotedString(parser);

	  		if (!parser.matchString('"')) {
	  			parser.pos = start;
	  			return null;
	  		}

	  		return {
	  			t: STRING_LITERAL,
	  			v: string
	  		};
	  	}

	  	if (parser.matchString('\'')) {
	  		string = getSingleQuotedString(parser);

	  		if (!parser.matchString('\'')) {
	  			parser.pos = start;
	  			return null;
	  		}

	  		return {
	  			t: STRING_LITERAL,
	  			v: string
	  		};
	  	}

	  	return null;
	  }

	  var namePattern$1 = /^[a-zA-Z_$][a-zA-Z_$0-9]*/;

	  var identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;

	  // http://mathiasbynens.be/notes/javascript-properties
	  // can be any name, string literal, or number literal

	  function readKey(parser) {
	  	var token;

	  	if (token = readStringLiteral(parser)) {
	  		return identifier.test(token.v) ? token.v : '"' + token.v.replace(/"/g, '\\"') + '"';
	  	}

	  	if (token = readNumberLiteral$1(parser)) {
	  		return token.v;
	  	}

	  	if (token = parser.matchPattern(namePattern$1)) {
	  		return token;
	  	}

	  	return null;
	  }

	  function readKeyValuePair(parser) {
	  	var start, key, value;

	  	start = parser.pos;

	  	// allow whitespace between '{' and key
	  	parser.allowWhitespace();

	  	var refKey = parser.nextChar() !== '\'' && parser.nextChar() !== '"';

	  	key = readKey(parser);
	  	if (key === null) {
	  		parser.pos = start;
	  		return null;
	  	}

	  	// allow whitespace between key and ':'
	  	parser.allowWhitespace();

	  	// es2015 shorthand property
	  	if (refKey && (parser.nextChar() === ',' || parser.nextChar() === '}')) {
	  		if (!namePattern$1.test(key)) {
	  			parser.error('Expected a valid reference, but found \'' + key + '\' instead.');
	  		}

	  		return {
	  			t: KEY_VALUE_PAIR,
	  			k: key,
	  			v: {
	  				t: REFERENCE,
	  				n: key
	  			}
	  		};
	  	}

	  	// next character must be ':'
	  	if (!parser.matchString(':')) {
	  		parser.pos = start;
	  		return null;
	  	}

	  	// allow whitespace between ':' and value
	  	parser.allowWhitespace();

	  	// next expression must be a, well... expression
	  	value = readExpression(parser);
	  	if (value === null) {
	  		parser.pos = start;
	  		return null;
	  	}

	  	return {
	  		t: KEY_VALUE_PAIR,
	  		k: key,
	  		v: value
	  	};
	  }

	  function readKeyValuePairs(parser) {
	  	var start, pairs, pair, keyValuePairs;

	  	start = parser.pos;

	  	pair = readKeyValuePair(parser);
	  	if (pair === null) {
	  		return null;
	  	}

	  	pairs = [pair];

	  	if (parser.matchString(',')) {
	  		keyValuePairs = readKeyValuePairs(parser);

	  		if (!keyValuePairs) {
	  			parser.pos = start;
	  			return null;
	  		}

	  		return pairs.concat(keyValuePairs);
	  	}

	  	return pairs;
	  }

	  function readObjectLiteral (parser) {
	  	var start, keyValuePairs;

	  	start = parser.pos;

	  	// allow whitespace
	  	parser.allowWhitespace();

	  	if (!parser.matchString('{')) {
	  		parser.pos = start;
	  		return null;
	  	}

	  	keyValuePairs = readKeyValuePairs(parser);

	  	// allow whitespace between final value and '}'
	  	parser.allowWhitespace();

	  	if (!parser.matchString('}')) {
	  		parser.pos = start;
	  		return null;
	  	}

	  	return {
	  		t: OBJECT_LITERAL,
	  		m: keyValuePairs
	  	};
	  }

	  function readExpressionList(parser) {
	  	parser.allowWhitespace();

	  	var expr = readExpression(parser);

	  	if (expr === null) return null;

	  	var expressions = [expr];

	  	// allow whitespace between expression and ','
	  	parser.allowWhitespace();

	  	if (parser.matchString(',')) {
	  		var next = readExpressionList(parser);
	  		if (next === null) parser.error(expectedExpression);

	  		expressions.push.apply(expressions, next);
	  	}

	  	return expressions;
	  }

	  function readArrayLiteral (parser) {
	  	var start, expressionList;

	  	start = parser.pos;

	  	// allow whitespace before '['
	  	parser.allowWhitespace();

	  	if (!parser.matchString('[')) {
	  		parser.pos = start;
	  		return null;
	  	}

	  	expressionList = readExpressionList(parser);

	  	if (!parser.matchString(']')) {
	  		parser.pos = start;
	  		return null;
	  	}

	  	return {
	  		t: ARRAY_LITERAL,
	  		m: expressionList
	  	};
	  }

	  var regexpPattern = /^(\/(?:[^\n\r\u2028\u2029/\\[]|\\.|\[(?:[^\n\r\u2028\u2029\]\\]|\\.)*])+\/(?:([gimuy])(?![a-z]*\2))*(?![a-zA-Z_$0-9]))/;
	  function readNumberLiteral(parser) {
	  	var result;

	  	if (result = parser.matchPattern(regexpPattern)) {
	  		return {
	  			t: REGEXP_LITERAL,
	  			v: result
	  		};
	  	}

	  	return null;
	  }

	  function readLiteral(parser) {
	  	return readNumberLiteral$1(parser) || readBooleanLiteral(parser) || readStringLiteral(parser) || readObjectLiteral(parser) || readArrayLiteral(parser) || readNumberLiteral(parser);
	  }

	  var prefixPattern = /^(?:~\/|(?:\.\.\/)+|\.\/(?:\.\.\/)*|\.)/;
	  var globals;
	  var keywords;
	  // if a reference is a browser global, we don't deference it later, so it needs special treatment
	  globals = /^(?:Array|console|Date|RegExp|decodeURIComponent|decodeURI|encodeURIComponent|encodeURI|isFinite|isNaN|parseFloat|parseInt|JSON|Math|NaN|undefined|null|Object|Number|String|Boolean)\b/;

	  // keywords are not valid references, with the exception of `this`
	  keywords = /^(?:break|case|catch|continue|debugger|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|throw|try|typeof|var|void|while|with)$/;

	  var legalReference = /^(?:[a-zA-Z$_0-9]|\\\.)+(?:(?:\.(?:[a-zA-Z$_0-9]|\\\.)+)|(?:\[[0-9]+\]))*/;
	  var relaxedName = /^[a-zA-Z_$][-\/a-zA-Z_$0-9]*/;
	  function readReference(parser) {
	  	var startPos, prefix, name, global, reference, fullLength, lastDotIndex;

	  	startPos = parser.pos;

	  	name = parser.matchPattern(/^@(?:keypath|rootpath|index|key|ractive|global)/);

	  	if (!name) {
	  		prefix = parser.matchPattern(prefixPattern) || '';
	  		name = !prefix && parser.relaxedNames && parser.matchPattern(relaxedName) || parser.matchPattern(legalReference);

	  		if (!name && prefix === '.') {
	  			prefix = '';
	  			name = '.';
	  		}
	  	}

	  	if (!name) {
	  		return null;
	  	}

	  	// bug out if it's a keyword (exception for ancestor/restricted refs - see https://github.com/ractivejs/ractive/issues/1497)
	  	if (!prefix && !parser.relaxedNames && keywords.test(name)) {
	  		parser.pos = startPos;
	  		return null;
	  	}

	  	// if this is a browser global, stop here
	  	if (!prefix && globals.test(name)) {
	  		global = globals.exec(name)[0];
	  		parser.pos = startPos + global.length;

	  		return {
	  			t: GLOBAL,
	  			v: global
	  		};
	  	}

	  	fullLength = (prefix || '').length + name.length;
	  	reference = (prefix || '') + normalise(name);

	  	if (parser.matchString('(')) {
	  		// if this is a method invocation (as opposed to a function) we need
	  		// to strip the method name from the reference combo, else the context
	  		// will be wrong
	  		// but only if the reference was actually a member and not a refinement
	  		lastDotIndex = reference.lastIndexOf('.');
	  		if (lastDotIndex !== -1 && name[name.length - 1] !== ']') {
	  			var refLength = reference.length;
	  			reference = reference.substr(0, lastDotIndex);
	  			parser.pos = startPos + (fullLength - (refLength - lastDotIndex));
	  		} else {
	  			parser.pos -= 1;
	  		}
	  	}

	  	return {
	  		t: REFERENCE,
	  		n: reference.replace(/^this\./, './').replace(/^this$/, '.')
	  	};
	  }

	  function readBracketedExpression(parser) {
	  	if (!parser.matchString('(')) return null;

	  	parser.allowWhitespace();

	  	var expr = readExpression(parser);

	  	if (!expr) parser.error(expectedExpression);

	  	parser.allowWhitespace();

	  	if (!parser.matchString(')')) parser.error(expectedParen);

	  	return {
	  		t: BRACKETED,
	  		x: expr
	  	};
	  }

	  function readPrimary (parser) {
	  	return readLiteral(parser) || readReference(parser) || readBracketedExpression(parser);
	  }

	  function readRefinement(parser) {
	  	// some things call for strict refinement (partial names), meaning no space between reference and refinement
	  	if (!parser.strictRefinement) {
	  		parser.allowWhitespace();
	  	}

	  	// "." name
	  	if (parser.matchString('.')) {
	  		parser.allowWhitespace();

	  		var _name = parser.matchPattern(namePattern$1);
	  		if (_name) {
	  			return {
	  				t: REFINEMENT,
	  				n: _name
	  			};
	  		}

	  		parser.error('Expected a property name');
	  	}

	  	// "[" expression "]"
	  	if (parser.matchString('[')) {
	  		parser.allowWhitespace();

	  		var expr = readExpression(parser);
	  		if (!expr) parser.error(expectedExpression);

	  		parser.allowWhitespace();

	  		if (!parser.matchString(']')) parser.error('Expected \']\'');

	  		return {
	  			t: REFINEMENT,
	  			x: expr
	  		};
	  	}

	  	return null;
	  }

	  function readMemberOrInvocation (parser) {
	  	var expression = readPrimary(parser);

	  	if (!expression) return null;

	  	while (expression) {
	  		var refinement = readRefinement(parser);
	  		if (refinement) {
	  			expression = {
	  				t: MEMBER,
	  				x: expression,
	  				r: refinement
	  			};
	  		} else if (parser.matchString('(')) {
	  			parser.allowWhitespace();
	  			var expressionList = readExpressionList(parser);

	  			parser.allowWhitespace();

	  			if (!parser.matchString(')')) {
	  				parser.error(expectedParen);
	  			}

	  			expression = {
	  				t: INVOCATION,
	  				x: expression
	  			};

	  			if (expressionList) expression.o = expressionList;
	  		} else {
	  			break;
	  		}
	  	}

	  	return expression;
	  }

	  var readTypeOf;
	  var makePrefixSequenceMatcher;
	  makePrefixSequenceMatcher = function (symbol, fallthrough) {
	  	return function (parser) {
	  		var expression;

	  		if (expression = fallthrough(parser)) {
	  			return expression;
	  		}

	  		if (!parser.matchString(symbol)) {
	  			return null;
	  		}

	  		parser.allowWhitespace();

	  		expression = readExpression(parser);
	  		if (!expression) {
	  			parser.error(expectedExpression);
	  		}

	  		return {
	  			s: symbol,
	  			o: expression,
	  			t: PREFIX_OPERATOR
	  		};
	  	};
	  };

	  // create all prefix sequence matchers, return readTypeOf
	  (function () {
	  	var i, len, matcher, prefixOperators, fallthrough;

	  	prefixOperators = '! ~ + - typeof'.split(' ');

	  	fallthrough = readMemberOrInvocation;
	  	for (i = 0, len = prefixOperators.length; i < len; i += 1) {
	  		matcher = makePrefixSequenceMatcher(prefixOperators[i], fallthrough);
	  		fallthrough = matcher;
	  	}

	  	// typeof operator is higher precedence than multiplication, so provides the
	  	// fallthrough for the multiplication sequence matcher we're about to create
	  	// (we're skipping void and delete)
	  	readTypeOf = fallthrough;
	  })();

	  var readTypeof = readTypeOf;

	  var readLogicalOr;
	  var makeInfixSequenceMatcher;
	  makeInfixSequenceMatcher = function (symbol, fallthrough) {
	  	return function (parser) {
	  		var start, left, right;

	  		left = fallthrough(parser);
	  		if (!left) {
	  			return null;
	  		}

	  		// Loop to handle left-recursion in a case like `a * b * c` and produce
	  		// left association, i.e. `(a * b) * c`.  The matcher can't call itself
	  		// to parse `left` because that would be infinite regress.
	  		while (true) {
	  			start = parser.pos;

	  			parser.allowWhitespace();

	  			if (!parser.matchString(symbol)) {
	  				parser.pos = start;
	  				return left;
	  			}

	  			// special case - in operator must not be followed by [a-zA-Z_$0-9]
	  			if (symbol === 'in' && /[a-zA-Z_$0-9]/.test(parser.remaining().charAt(0))) {
	  				parser.pos = start;
	  				return left;
	  			}

	  			parser.allowWhitespace();

	  			// right operand must also consist of only higher-precedence operators
	  			right = fallthrough(parser);
	  			if (!right) {
	  				parser.pos = start;
	  				return left;
	  			}

	  			left = {
	  				t: INFIX_OPERATOR,
	  				s: symbol,
	  				o: [left, right]
	  			};

	  			// Loop back around.  If we don't see another occurrence of the symbol,
	  			// we'll return left.
	  		}
	  	};
	  };

	  // create all infix sequence matchers, and return readLogicalOr
	  (function () {
	  	var i, len, matcher, infixOperators, fallthrough;

	  	// All the infix operators on order of precedence (source: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Operators/Operator_Precedence)
	  	// Each sequence matcher will initially fall through to its higher precedence
	  	// neighbour, and only attempt to match if one of the higher precedence operators
	  	// (or, ultimately, a literal, reference, or bracketed expression) already matched
	  	infixOperators = '* / % + - << >> >>> < <= > >= in instanceof == != === !== & ^ | && ||'.split(' ');

	  	// A typeof operator is higher precedence than multiplication
	  	fallthrough = readTypeof;
	  	for (i = 0, len = infixOperators.length; i < len; i += 1) {
	  		matcher = makeInfixSequenceMatcher(infixOperators[i], fallthrough);
	  		fallthrough = matcher;
	  	}

	  	// Logical OR is the fallthrough for the conditional matcher
	  	readLogicalOr = fallthrough;
	  })();

	  var readLogicalOr$1 = readLogicalOr;

	  // The conditional operator is the lowest precedence operator, so we start here

	  function getConditional(parser) {
	  	var start, expression, ifTrue, ifFalse;

	  	expression = readLogicalOr$1(parser);
	  	if (!expression) {
	  		return null;
	  	}

	  	start = parser.pos;

	  	parser.allowWhitespace();

	  	if (!parser.matchString('?')) {
	  		parser.pos = start;
	  		return expression;
	  	}

	  	parser.allowWhitespace();

	  	ifTrue = readExpression(parser);
	  	if (!ifTrue) {
	  		parser.error(expectedExpression);
	  	}

	  	parser.allowWhitespace();

	  	if (!parser.matchString(':')) {
	  		parser.error('Expected ":"');
	  	}

	  	parser.allowWhitespace();

	  	ifFalse = readExpression(parser);
	  	if (!ifFalse) {
	  		parser.error(expectedExpression);
	  	}

	  	return {
	  		t: CONDITIONAL,
	  		o: [expression, ifTrue, ifFalse]
	  	};
	  }

	  function readExpression(parser) {
	  	// The conditional operator is the lowest precedence operator (except yield,
	  	// assignment operators, and commas, none of which are supported), so we
	  	// start there. If it doesn't match, it 'falls through' to progressively
	  	// higher precedence operators, until it eventually matches (or fails to
	  	// match) a 'primary' - a literal or a reference. This way, the abstract syntax
	  	// tree has everything in its proper place, i.e. 2 + 3 * 4 === 14, not 20.
	  	return getConditional(parser);
	  }

	  function readExpressionOrReference(parser, expectedFollowers) {
	  	var start, expression, i;

	  	start = parser.pos;
	  	expression = readExpression(parser);

	  	if (!expression) {
	  		// valid reference but invalid expression e.g. `{{new}}`?
	  		var ref = parser.matchPattern(/^(\w+)/);
	  		if (ref) {
	  			return {
	  				t: REFERENCE,
	  				n: ref
	  			};
	  		}

	  		return null;
	  	}

	  	for (i = 0; i < expectedFollowers.length; i += 1) {
	  		if (parser.remaining().substr(0, expectedFollowers[i].length) === expectedFollowers[i]) {
	  			return expression;
	  		}
	  	}

	  	parser.pos = start;
	  	return readReference(parser);
	  }

	  function flattenExpression(expression) {
	  	var refs;

	  	extractRefs(expression, refs = []);

	  	return {
	  		r: refs,
	  		s: stringify(expression)
	  	};

	  	function stringify(node) {
	  		switch (node.t) {
	  			case BOOLEAN_LITERAL:
	  			case GLOBAL:
	  			case NUMBER_LITERAL:
	  			case REGEXP_LITERAL:
	  				return node.v;

	  			case STRING_LITERAL:
	  				return JSON.stringify(String(node.v));

	  			case ARRAY_LITERAL:
	  				return '[' + (node.m ? node.m.map(stringify).join(',') : '') + ']';

	  			case OBJECT_LITERAL:
	  				return '{' + (node.m ? node.m.map(stringify).join(',') : '') + '}';

	  			case KEY_VALUE_PAIR:
	  				return node.k + ':' + stringify(node.v);

	  			case PREFIX_OPERATOR:
	  				return (node.s === 'typeof' ? 'typeof ' : node.s) + stringify(node.o);

	  			case INFIX_OPERATOR:
	  				return stringify(node.o[0]) + (node.s.substr(0, 2) === 'in' ? ' ' + node.s + ' ' : node.s) + stringify(node.o[1]);

	  			case INVOCATION:
	  				return stringify(node.x) + '(' + (node.o ? node.o.map(stringify).join(',') : '') + ')';

	  			case BRACKETED:
	  				return '(' + stringify(node.x) + ')';

	  			case MEMBER:
	  				return stringify(node.x) + stringify(node.r);

	  			case REFINEMENT:
	  				return node.n ? '.' + node.n : '[' + stringify(node.x) + ']';

	  			case CONDITIONAL:
	  				return stringify(node.o[0]) + '?' + stringify(node.o[1]) + ':' + stringify(node.o[2]);

	  			case REFERENCE:
	  				return '_' + refs.indexOf(node.n);

	  			default:
	  				throw new Error('Expected legal JavaScript');
	  		}
	  	}
	  }

	  // TODO maybe refactor this?
	  function extractRefs(node, refs) {
	  	var i, list;

	  	if (node.t === REFERENCE) {
	  		if (refs.indexOf(node.n) === -1) {
	  			refs.unshift(node.n);
	  		}
	  	}

	  	list = node.o || node.m;
	  	if (list) {
	  		if (isObject(list)) {
	  			extractRefs(list, refs);
	  		} else {
	  			i = list.length;
	  			while (i--) {
	  				extractRefs(list[i], refs);
	  			}
	  		}
	  	}

	  	if (node.x) {
	  		extractRefs(node.x, refs);
	  	}

	  	if (node.r) {
	  		extractRefs(node.r, refs);
	  	}

	  	if (node.v) {
	  		extractRefs(node.v, refs);
	  	}
	  }

	  var arrayMemberPattern = /^[0-9][1-9]*$/;
	  function refineExpression(expression, mustache) {
	  	var referenceExpression;

	  	if (expression) {
	  		while (expression.t === BRACKETED && expression.x) {
	  			expression = expression.x;
	  		}

	  		// special case - integers should be treated as array members references,
	  		// rather than as expressions in their own right
	  		if (expression.t === REFERENCE) {
	  			mustache.r = expression.n;
	  		} else {
	  			if (expression.t === NUMBER_LITERAL && arrayMemberPattern.test(expression.v)) {
	  				mustache.r = expression.v;
	  			} else if (referenceExpression = getReferenceExpression(expression)) {
	  				mustache.rx = referenceExpression;
	  			} else {
	  				mustache.x = flattenExpression(expression);
	  			}
	  		}

	  		return mustache;
	  	}
	  }

	  // TODO refactor this! it's bewildering
	  function getReferenceExpression(expression) {
	  	var members = [],
	  	    refinement;

	  	while (expression.t === MEMBER && expression.r.t === REFINEMENT) {
	  		refinement = expression.r;

	  		if (refinement.x) {
	  			if (refinement.x.t === REFERENCE) {
	  				members.unshift(refinement.x);
	  			} else {
	  				members.unshift(flattenExpression(refinement.x));
	  			}
	  		} else {
	  			members.unshift(refinement.n);
	  		}

	  		expression = expression.x;
	  	}

	  	if (expression.t !== REFERENCE) {
	  		return null;
	  	}

	  	return {
	  		r: expression.n,
	  		m: members
	  	};
	  }

	  function readInterpolator(parser, tag) {
	  	var start, expression, interpolator, err;

	  	start = parser.pos;

	  	// TODO would be good for perf if we could do away with the try-catch
	  	try {
	  		expression = readExpressionOrReference(parser, [tag.close]);
	  	} catch (e) {
	  		err = e;
	  	}

	  	if (!expression) {
	  		if (parser.str.charAt(start) === '!') {
	  			// special case - comment
	  			parser.pos = start;
	  			return null;
	  		}

	  		if (err) {
	  			throw err;
	  		}
	  	}

	  	if (!parser.matchString(tag.close)) {
	  		parser.error('Expected closing delimiter \'' + tag.close + '\' after reference');

	  		if (!expression) {
	  			// special case - comment
	  			if (parser.nextChar() === '!') {
	  				return null;
	  			}

	  			parser.error('Expected expression or legal reference');
	  		}
	  	}

	  	interpolator = { t: INTERPOLATOR };
	  	refineExpression(expression, interpolator); // TODO handle this differently - it's mysterious

	  	return interpolator;
	  }

	  var yieldPattern = /^yield\s*/;
	  function readYielder(parser, tag) {
	  	if (!parser.matchPattern(yieldPattern)) return null;

	  	var name = parser.matchPattern(/^[a-zA-Z_$][a-zA-Z_$0-9\-]*/);

	  	parser.allowWhitespace();

	  	if (!parser.matchString(tag.close)) {
	  		parser.error("expected legal partial name");
	  	}

	  	var yielder = { t: YIELDER };
	  	if (name) yielder.n = name;

	  	return yielder;
	  }

	  var handlebarsBlockCodes = {
	  	'each': SECTION_EACH,
	  	'if': SECTION_IF,
	  	'if-with': SECTION_IF_WITH,
	  	'with': SECTION_WITH,
	  	'unless': SECTION_UNLESS
	  };

	  function readClosing(parser, tag) {
	  	var start, remaining, index, closing;

	  	start = parser.pos;

	  	if (!parser.matchString(tag.open)) {
	  		return null;
	  	}

	  	parser.allowWhitespace();

	  	if (!parser.matchString('/')) {
	  		parser.pos = start;
	  		return null;
	  	}

	  	parser.allowWhitespace();

	  	remaining = parser.remaining();
	  	index = remaining.indexOf(tag.close);

	  	if (index !== -1) {
	  		closing = {
	  			t: CLOSING,
	  			r: remaining.substr(0, index).split(' ')[0]
	  		};

	  		parser.pos += index;

	  		if (!parser.matchString(tag.close)) {
	  			parser.error('Expected closing delimiter \'' + tag.close + '\'');
	  		}

	  		return closing;
	  	}

	  	parser.pos = start;
	  	return null;
	  }

	  var elsePattern = /^\s*else\s*/;
	  function readElse(parser, tag) {
	  	var start = parser.pos;

	  	if (!parser.matchString(tag.open)) {
	  		return null;
	  	}

	  	if (!parser.matchPattern(elsePattern)) {
	  		parser.pos = start;
	  		return null;
	  	}

	  	if (!parser.matchString(tag.close)) {
	  		parser.error("Expected closing delimiter '" + tag.close + "'");
	  	}

	  	return {
	  		t: ELSE
	  	};
	  }

	  var elsePattern$1 = /^\s*elseif\s+/;
	  function readElseIf(parser, tag) {
	  	var start = parser.pos;

	  	if (!parser.matchString(tag.open)) {
	  		return null;
	  	}

	  	if (!parser.matchPattern(elsePattern$1)) {
	  		parser.pos = start;
	  		return null;
	  	}

	  	var expression = readExpression(parser);

	  	if (!parser.matchString(tag.close)) {
	  		parser.error('Expected closing delimiter \'' + tag.close + '\'');
	  	}

	  	return {
	  		t: ELSEIF,
	  		x: expression
	  	};
	  }

	  var legalAlias = /^(?:[a-zA-Z$_0-9]|\\\.)+(?:(?:(?:[a-zA-Z$_0-9]|\\\.)+)|(?:\[[0-9]+\]))*/;
	  var asRE = /^as/i;

	  function readAliases(parser) {
	  	var aliases = [],
	  	    alias = undefined,
	  	    start = parser.pos;

	  	parser.allowWhitespace();

	  	alias = readAlias(parser);

	  	if (alias) {
	  		alias.x = refineExpression(alias.x, {});
	  		aliases.push(alias);

	  		parser.allowWhitespace();

	  		while (parser.matchString(',')) {
	  			alias = readAlias(parser);

	  			if (!alias) {
	  				parser.error('Expected another alias.');
	  			}

	  			alias.x = refineExpression(alias.x, {});
	  			aliases.push(alias);

	  			parser.allowWhitespace();
	  		}

	  		return aliases;
	  	}

	  	parser.pos = start;
	  	return null;
	  }

	  function readAlias(parser) {
	  	var expr = undefined,
	  	    alias = undefined,
	  	    start = parser.pos;

	  	parser.allowWhitespace();

	  	expr = readExpression(parser, []);

	  	if (!expr) {
	  		parser.pos = start;
	  		return null;
	  	}

	  	parser.allowWhitespace();

	  	if (!parser.matchPattern(asRE)) {
	  		parser.pos = start;
	  		return null;
	  	}

	  	parser.allowWhitespace();

	  	alias = parser.matchPattern(legalAlias);

	  	if (!alias) {
	  		parser.error('Expected a legal alias name.');
	  	}

	  	return { n: alias, x: expr };
	  }

	  var indexRefPattern = /^\s*:\s*([a-zA-Z_$][a-zA-Z_$0-9]*)/;
	  var keyIndexRefPattern = /^\s*,\s*([a-zA-Z_$][a-zA-Z_$0-9]*)/;
	  var handlebarsBlockPattern = new RegExp('^(' + Object.keys(handlebarsBlockCodes).join('|') + ')\\b');
	  function readSection(parser, tag) {
	  	var start,
	  	    expression,
	  	    section,
	  	    child,
	  	    children,
	  	    hasElse,
	  	    block,
	  	    unlessBlock,
	  	    conditions,
	  	    closed,
	  	    i,
	  	    expectedClose,
	  	    aliasOnly = false;

	  	start = parser.pos;

	  	if (parser.matchString('^')) {
	  		section = { t: SECTION, f: [], n: SECTION_UNLESS };
	  	} else if (parser.matchString('#')) {
	  		section = { t: SECTION, f: [] };

	  		if (parser.matchString('partial')) {
	  			parser.pos = start - parser.standardDelimiters[0].length;
	  			parser.error('Partial definitions can only be at the top level of the template, or immediately inside components');
	  		}

	  		if (block = parser.matchPattern(handlebarsBlockPattern)) {
	  			expectedClose = block;
	  			section.n = handlebarsBlockCodes[block];
	  		}
	  	} else {
	  		return null;
	  	}

	  	parser.allowWhitespace();

	  	if (block === 'with') {
	  		var aliases = readAliases(parser);
	  		if (aliases) {
	  			aliasOnly = true;
	  			section.z = aliases;
	  			section.t = ALIAS;
	  		}
	  	} else if (block === 'each') {
	  		var alias = readAlias(parser);
	  		if (alias) {
	  			section.z = [{ n: alias.n, x: { r: '.' } }];
	  			expression = alias.x;
	  		}
	  	}

	  	if (!aliasOnly) {
	  		if (!expression) expression = readExpression(parser);

	  		if (!expression) {
	  			parser.error('Expected expression');
	  		}

	  		// optional index and key references
	  		if (i = parser.matchPattern(indexRefPattern)) {
	  			var extra = undefined;

	  			if (extra = parser.matchPattern(keyIndexRefPattern)) {
	  				section.i = i + ',' + extra;
	  			} else {
	  				section.i = i;
	  			}
	  		}
	  	}

	  	parser.allowWhitespace();

	  	if (!parser.matchString(tag.close)) {
	  		parser.error('Expected closing delimiter \'' + tag.close + '\'');
	  	}

	  	parser.sectionDepth += 1;
	  	children = section.f;

	  	conditions = [];

	  	do {
	  		if (child = readClosing(parser, tag)) {
	  			if (expectedClose && child.r !== expectedClose) {
	  				parser.error('Expected ' + tag.open + '/' + expectedClose + tag.close);
	  			}

	  			parser.sectionDepth -= 1;
	  			closed = true;
	  		} else if (!aliasOnly && (child = readElseIf(parser, tag))) {
	  			if (section.n === SECTION_UNLESS) {
	  				parser.error('{{else}} not allowed in {{#unless}}');
	  			}

	  			if (hasElse) {
	  				parser.error('illegal {{elseif...}} after {{else}}');
	  			}

	  			if (!unlessBlock) {
	  				unlessBlock = createUnlessBlock(expression);
	  			}

	  			unlessBlock.f.push({
	  				t: SECTION,
	  				n: SECTION_IF,
	  				x: flattenExpression(combine$2(conditions.concat(child.x))),
	  				f: children = []
	  			});

	  			conditions.push(invert(child.x));
	  		} else if (!aliasOnly && (child = readElse(parser, tag))) {
	  			if (section.n === SECTION_UNLESS) {
	  				parser.error('{{else}} not allowed in {{#unless}}');
	  			}

	  			if (hasElse) {
	  				parser.error('there can only be one {{else}} block, at the end of a section');
	  			}

	  			hasElse = true;

	  			// use an unless block if there's no elseif
	  			if (!unlessBlock) {
	  				unlessBlock = createUnlessBlock(expression);
	  				children = unlessBlock.f;
	  			} else {
	  				unlessBlock.f.push({
	  					t: SECTION,
	  					n: SECTION_IF,
	  					x: flattenExpression(combine$2(conditions)),
	  					f: children = []
	  				});
	  			}
	  		} else {
	  			child = parser.read(READERS);

	  			if (!child) {
	  				break;
	  			}

	  			children.push(child);
	  		}
	  	} while (!closed);

	  	if (unlessBlock) {
	  		// special case - `with` should become `if-with` (TODO is this right?
	  		// seems to me that `with` ought to behave consistently, regardless
	  		// of the presence/absence of `else`. In other words should always
	  		// be `if-with`
	  		if (section.n === SECTION_WITH) {
	  			section.n = SECTION_IF_WITH;
	  		}

	  		section.l = unlessBlock;
	  	}

	  	if (!aliasOnly) {
	  		refineExpression(expression, section);
	  	}

	  	// TODO if a section is empty it should be discarded. Don't do
	  	// that here though - we need to clean everything up first, as
	  	// it may contain removeable whitespace. As a temporary measure,
	  	// to pass the existing tests, remove empty `f` arrays
	  	if (!section.f.length) {
	  		delete section.f;
	  	}

	  	return section;
	  }

	  function createUnlessBlock(expression) {
	  	var unlessBlock = {
	  		t: SECTION,
	  		n: SECTION_UNLESS,
	  		f: []
	  	};

	  	refineExpression(expression, unlessBlock);
	  	return unlessBlock;
	  }

	  function invert(expression) {
	  	if (expression.t === PREFIX_OPERATOR && expression.s === '!') {
	  		return expression.o;
	  	}

	  	return {
	  		t: PREFIX_OPERATOR,
	  		s: '!',
	  		o: parensIfNecessary(expression)
	  	};
	  }

	  function combine$2(expressions) {
	  	if (expressions.length === 1) {
	  		return expressions[0];
	  	}

	  	return {
	  		t: INFIX_OPERATOR,
	  		s: '&&',
	  		o: [parensIfNecessary(expressions[0]), parensIfNecessary(combine$2(expressions.slice(1)))]
	  	};
	  }

	  function parensIfNecessary(expression) {
	  	// TODO only wrap if necessary
	  	return {
	  		t: BRACKETED,
	  		x: expression
	  	};
	  }

	  function readUnescaped(parser, tag) {
	  	var expression, triple;

	  	if (!parser.matchString('&')) {
	  		return null;
	  	}

	  	parser.allowWhitespace();

	  	expression = readExpression(parser);

	  	if (!expression) {
	  		return null;
	  	}

	  	if (!parser.matchString(tag.close)) {
	  		parser.error('Expected closing delimiter \'' + tag.close + '\'');
	  	}

	  	triple = { t: TRIPLE };
	  	refineExpression(expression, triple); // TODO handle this differently - it's mysterious

	  	return triple;
	  }

	  function readPartial(parser, tag) {
	  	if (!parser.matchString('>')) return null;

	  	parser.allowWhitespace();

	  	// Partial names can include hyphens, so we can't use readExpression
	  	// blindly. Instead, we use the `relaxedNames` flag to indicate that
	  	// `foo-bar` should be read as a single name, rather than 'subtract
	  	// bar from foo'
	  	parser.relaxedNames = parser.strictRefinement = true;
	  	var expression = readExpression(parser);
	  	parser.relaxedNames = parser.strictRefinement = false;

	  	if (!expression) return null;

	  	var partial = { t: PARTIAL };
	  	refineExpression(expression, partial); // TODO...

	  	parser.allowWhitespace();

	  	// check for alias context e.g. `{{>foo bar as bat, bip as bop}}` then
	  	// turn it into `{{#with bar as bat, bip as bop}}{{>foo}}{{/with}}`
	  	var aliases = readAliases(parser);
	  	if (aliases) {
	  		partial = {
	  			t: ALIAS,
	  			z: aliases,
	  			f: [partial]
	  		};
	  	}

	  	// otherwise check for literal context e.g. `{{>foo bar}}` then
	  	// turn it into `{{#with bar}}{{>foo}}{{/with}}`
	  	else {
	  			var context = readExpression(parser);
	  			if (context) {
	  				partial = {
	  					t: SECTION,
	  					n: SECTION_WITH,
	  					f: [partial]
	  				};

	  				refineExpression(context, partial);
	  			}
	  		}

	  	parser.allowWhitespace();

	  	if (!parser.matchString(tag.close)) {
	  		parser.error('Expected closing delimiter \'' + tag.close + '\'');
	  	}

	  	return partial;
	  }

	  function readTriple(parser, tag) {
	  	var expression = readExpression(parser),
	  	    triple;

	  	if (!expression) {
	  		return null;
	  	}

	  	if (!parser.matchString(tag.close)) {
	  		parser.error('Expected closing delimiter \'' + tag.close + '\'');
	  	}

	  	triple = { t: TRIPLE };
	  	refineExpression(expression, triple); // TODO handle this differently - it's mysterious

	  	return triple;
	  }

	  var pattern$1 = /[-/\\^$*+?.()|[\]{}]/g;
	  function escapeRegExp(str) {
	  	return str.replace(pattern$1, '\\$&');
	  }

	  var regExpCache = {};

	  function getLowestIndex (haystack, needles) {
	  	return haystack.search(regExpCache[needles.join()] || (regExpCache[needles.join()] = new RegExp(needles.map(escapeRegExp).join('|'))));
	  }

	  // https://github.com/kangax/html-minifier/issues/63#issuecomment-37763316
	  var booleanAttributes = /^(allowFullscreen|async|autofocus|autoplay|checked|compact|controls|declare|default|defaultChecked|defaultMuted|defaultSelected|defer|disabled|enabled|formNoValidate|hidden|indeterminate|inert|isMap|itemScope|loop|multiple|muted|noHref|noResize|noShade|noValidate|noWrap|open|pauseOnExit|readOnly|required|reversed|scoped|seamless|selected|sortable|translate|trueSpeed|typeMustMatch|visible)$/i;
	  var voidElementNames = /^(?:area|base|br|col|command|doctype|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;

	  var htmlEntities = { quot: 34, amp: 38, apos: 39, lt: 60, gt: 62, nbsp: 160, iexcl: 161, cent: 162, pound: 163, curren: 164, yen: 165, brvbar: 166, sect: 167, uml: 168, copy: 169, ordf: 170, laquo: 171, not: 172, shy: 173, reg: 174, macr: 175, deg: 176, plusmn: 177, sup2: 178, sup3: 179, acute: 180, micro: 181, para: 182, middot: 183, cedil: 184, sup1: 185, ordm: 186, raquo: 187, frac14: 188, frac12: 189, frac34: 190, iquest: 191, Agrave: 192, Aacute: 193, Acirc: 194, Atilde: 195, Auml: 196, Aring: 197, AElig: 198, Ccedil: 199, Egrave: 200, Eacute: 201, Ecirc: 202, Euml: 203, Igrave: 204, Iacute: 205, Icirc: 206, Iuml: 207, ETH: 208, Ntilde: 209, Ograve: 210, Oacute: 211, Ocirc: 212, Otilde: 213, Ouml: 214, times: 215, Oslash: 216, Ugrave: 217, Uacute: 218, Ucirc: 219, Uuml: 220, Yacute: 221, THORN: 222, szlig: 223, agrave: 224, aacute: 225, acirc: 226, atilde: 227, auml: 228, aring: 229, aelig: 230, ccedil: 231, egrave: 232, eacute: 233, ecirc: 234, euml: 235, igrave: 236, iacute: 237, icirc: 238, iuml: 239, eth: 240, ntilde: 241, ograve: 242, oacute: 243, ocirc: 244, otilde: 245, ouml: 246, divide: 247, oslash: 248, ugrave: 249, uacute: 250, ucirc: 251, uuml: 252, yacute: 253, thorn: 254, yuml: 255, OElig: 338, oelig: 339, Scaron: 352, scaron: 353, Yuml: 376, fnof: 402, circ: 710, tilde: 732, Alpha: 913, Beta: 914, Gamma: 915, Delta: 916, Epsilon: 917, Zeta: 918, Eta: 919, Theta: 920, Iota: 921, Kappa: 922, Lambda: 923, Mu: 924, Nu: 925, Xi: 926, Omicron: 927, Pi: 928, Rho: 929, Sigma: 931, Tau: 932, Upsilon: 933, Phi: 934, Chi: 935, Psi: 936, Omega: 937, alpha: 945, beta: 946, gamma: 947, delta: 948, epsilon: 949, zeta: 950, eta: 951, theta: 952, iota: 953, kappa: 954, lambda: 955, mu: 956, nu: 957, xi: 958, omicron: 959, pi: 960, rho: 961, sigmaf: 962, sigma: 963, tau: 964, upsilon: 965, phi: 966, chi: 967, psi: 968, omega: 969, thetasym: 977, upsih: 978, piv: 982, ensp: 8194, emsp: 8195, thinsp: 8201, zwnj: 8204, zwj: 8205, lrm: 8206, rlm: 8207, ndash: 8211, mdash: 8212, lsquo: 8216, rsquo: 8217, sbquo: 8218, ldquo: 8220, rdquo: 8221, bdquo: 8222, dagger: 8224, Dagger: 8225, bull: 8226, hellip: 8230, permil: 8240, prime: 8242, Prime: 8243, lsaquo: 8249, rsaquo: 8250, oline: 8254, frasl: 8260, euro: 8364, image: 8465, weierp: 8472, real: 8476, trade: 8482, alefsym: 8501, larr: 8592, uarr: 8593, rarr: 8594, darr: 8595, harr: 8596, crarr: 8629, lArr: 8656, uArr: 8657, rArr: 8658, dArr: 8659, hArr: 8660, forall: 8704, part: 8706, exist: 8707, empty: 8709, nabla: 8711, isin: 8712, notin: 8713, ni: 8715, prod: 8719, sum: 8721, minus: 8722, lowast: 8727, radic: 8730, prop: 8733, infin: 8734, ang: 8736, and: 8743, or: 8744, cap: 8745, cup: 8746, 'int': 8747, there4: 8756, sim: 8764, cong: 8773, asymp: 8776, ne: 8800, equiv: 8801, le: 8804, ge: 8805, sub: 8834, sup: 8835, nsub: 8836, sube: 8838, supe: 8839, oplus: 8853, otimes: 8855, perp: 8869, sdot: 8901, lceil: 8968, rceil: 8969, lfloor: 8970, rfloor: 8971, lang: 9001, rang: 9002, loz: 9674, spades: 9824, clubs: 9827, hearts: 9829, diams: 9830 };
	  var controlCharacters = [8364, 129, 8218, 402, 8222, 8230, 8224, 8225, 710, 8240, 352, 8249, 338, 141, 381, 143, 144, 8216, 8217, 8220, 8221, 8226, 8211, 8212, 732, 8482, 353, 8250, 339, 157, 382, 376];
	  var entityPattern = new RegExp('&(#?(?:x[\\w\\d]+|\\d+|' + Object.keys(htmlEntities).join('|') + '));?', 'g');
	  var codePointSupport = typeof String.fromCodePoint === 'function';
	  var codeToChar = codePointSupport ? String.fromCodePoint : String.fromCharCode;

	  function decodeCharacterReferences(html) {
	  	return html.replace(entityPattern, function (match, entity) {
	  		var code;

	  		// Handle named entities
	  		if (entity[0] !== '#') {
	  			code = htmlEntities[entity];
	  		} else if (entity[1] === 'x') {
	  			code = parseInt(entity.substring(2), 16);
	  		} else {
	  			code = parseInt(entity.substring(1), 10);
	  		}

	  		if (!code) {
	  			return match;
	  		}

	  		return codeToChar(validateCode(code));
	  	});
	  }

	  var lessThan = /</g;
	  var greaterThan = />/g;
	  var amp = /&/g;
	  var invalid = 65533;

	  function escapeHtml(str) {
	  	return str.replace(amp, '&amp;').replace(lessThan, '&lt;').replace(greaterThan, '&gt;');
	  }

	  // some code points are verboten. If we were inserting HTML, the browser would replace the illegal
	  // code points with alternatives in some cases - since we're bypassing that mechanism, we need
	  // to replace them ourselves
	  //
	  // Source: http://en.wikipedia.org/wiki/Character_encodings_in_HTML#Illegal_characters
	  function validateCode(code) {
	  	if (!code) {
	  		return invalid;
	  	}

	  	// line feed becomes generic whitespace
	  	if (code === 10) {
	  		return 32;
	  	}

	  	// ASCII range. (Why someone would use HTML entities for ASCII characters I don't know, but...)
	  	if (code < 128) {
	  		return code;
	  	}

	  	// code points 128-159 are dealt with leniently by browsers, but they're incorrect. We need
	  	// to correct the mistake or we'll end up with missing € signs and so on
	  	if (code <= 159) {
	  		return controlCharacters[code - 128];
	  	}

	  	// basic multilingual plane
	  	if (code < 55296) {
	  		return code;
	  	}

	  	// UTF-16 surrogate halves
	  	if (code <= 57343) {
	  		return invalid;
	  	}

	  	// rest of the basic multilingual plane
	  	if (code <= 65535) {
	  		return code;
	  	} else if (!codePointSupport) {
	  		return invalid;
	  	}

	  	// supplementary multilingual plane 0x10000 - 0x1ffff
	  	if (code >= 65536 && code <= 131071) {
	  		return code;
	  	}

	  	// supplementary ideographic plane 0x20000 - 0x2ffff
	  	if (code >= 131072 && code <= 196607) {
	  		return code;
	  	}

	  	return invalid;
	  }

	  function readText(parser) {
	  	var index, remaining, disallowed, barrier;

	  	remaining = parser.remaining();

	  	if (parser.textOnlyMode) {
	  		disallowed = parser.tags.map(function (t) {
	  			return t.open;
	  		});
	  		disallowed = disallowed.concat(parser.tags.map(function (t) {
	  			return '\\' + t.open;
	  		}));

	  		index = getLowestIndex(remaining, disallowed);
	  	} else {
	  		barrier = parser.inside ? '</' + parser.inside : '<';

	  		if (parser.inside && !parser.interpolate[parser.inside]) {
	  			index = remaining.indexOf(barrier);
	  		} else {
	  			disallowed = parser.tags.map(function (t) {
	  				return t.open;
	  			});
	  			disallowed = disallowed.concat(parser.tags.map(function (t) {
	  				return '\\' + t.open;
	  			}));

	  			// http://developers.whatwg.org/syntax.html#syntax-attributes
	  			if (parser.inAttribute === true) {
	  				// we're inside an unquoted attribute value
	  				disallowed.push('"', '\'', '=', '<', '>', '`');
	  			} else if (parser.inAttribute) {
	  				// quoted attribute value
	  				disallowed.push(parser.inAttribute);
	  			} else {
	  				disallowed.push(barrier);
	  			}

	  			index = getLowestIndex(remaining, disallowed);
	  		}
	  	}

	  	if (!index) {
	  		return null;
	  	}

	  	if (index === -1) {
	  		index = remaining.length;
	  	}

	  	parser.pos += index;

	  	if (parser.inside && parser.inside !== 'textarea' || parser.textOnlyMode) {
	  		return remaining.substr(0, index);
	  	} else {
	  		return decodeCharacterReferences(remaining.substr(0, index));
	  	}
	  }

	  var leadingLinebreak = /^[ \t\f\r\n]*\r?\n/;
	  var trailingLinebreak = /\r?\n[ \t\f\r\n]*$/;
	  function stripStandalones (items) {
	  	var i, current, backOne, backTwo, lastSectionItem;

	  	for (i = 1; i < items.length; i += 1) {
	  		current = items[i];
	  		backOne = items[i - 1];
	  		backTwo = items[i - 2];

	  		// if we're at the end of a [text][comment][text] sequence...
	  		if (isString(current) && isComment(backOne) && isString(backTwo)) {

	  			// ... and the comment is a standalone (i.e. line breaks either side)...
	  			if (trailingLinebreak.test(backTwo) && leadingLinebreak.test(current)) {

	  				// ... then we want to remove the whitespace after the first line break
	  				items[i - 2] = backTwo.replace(trailingLinebreak, '\n');

	  				// and the leading line break of the second text token
	  				items[i] = current.replace(leadingLinebreak, '');
	  			}
	  		}

	  		// if the current item is a section, and it is preceded by a linebreak, and
	  		// its first item is a linebreak...
	  		if (isSection(current) && isString(backOne)) {
	  			if (trailingLinebreak.test(backOne) && isString(current.f[0]) && leadingLinebreak.test(current.f[0])) {
	  				items[i - 1] = backOne.replace(trailingLinebreak, '\n');
	  				current.f[0] = current.f[0].replace(leadingLinebreak, '');
	  			}
	  		}

	  		// if the last item was a section, and it is followed by a linebreak, and
	  		// its last item is a linebreak...
	  		if (isString(current) && isSection(backOne)) {
	  			lastSectionItem = lastItem(backOne.f);

	  			if (isString(lastSectionItem) && trailingLinebreak.test(lastSectionItem) && leadingLinebreak.test(current)) {
	  				backOne.f[backOne.f.length - 1] = lastSectionItem.replace(trailingLinebreak, '\n');
	  				items[i] = current.replace(leadingLinebreak, '');
	  			}
	  		}
	  	}

	  	return items;
	  }

	  function isString(item) {
	  	return typeof item === 'string';
	  }

	  function isComment(item) {
	  	return item.t === COMMENT || item.t === DELIMCHANGE;
	  }

	  function isSection(item) {
	  	return (item.t === SECTION || item.t === INVERTED) && item.f;
	  }

	  function trimWhitespace (items, leadingPattern, trailingPattern) {
	  	var item;

	  	if (leadingPattern) {
	  		item = items[0];
	  		if (typeof item === 'string') {
	  			item = item.replace(leadingPattern, '');

	  			if (!item) {
	  				items.shift();
	  			} else {
	  				items[0] = item;
	  			}
	  		}
	  	}

	  	if (trailingPattern) {
	  		item = lastItem(items);
	  		if (typeof item === 'string') {
	  			item = item.replace(trailingPattern, '');

	  			if (!item) {
	  				items.pop();
	  			} else {
	  				items[items.length - 1] = item;
	  			}
	  		}
	  	}
	  }

	  var contiguousWhitespace = /[ \t\f\r\n]+/g;
	  var preserveWhitespaceElements = /^(?:pre|script|style|textarea)$/i;
	  var leadingWhitespace$1 = /^[ \t\f\r\n]+/;
	  var trailingWhitespace = /[ \t\f\r\n]+$/;
	  var leadingNewLine = /^(?:\r\n|\r|\n)/;
	  var trailingNewLine = /(?:\r\n|\r|\n)$/;
	  function cleanup(items, stripComments, preserveWhitespace, removeLeadingWhitespace, removeTrailingWhitespace) {
	  	var i, item, previousItem, nextItem, preserveWhitespaceInsideFragment, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespaceInsideFragment, key;

	  	// First pass - remove standalones and comments etc
	  	stripStandalones(items);

	  	i = items.length;
	  	while (i--) {
	  		item = items[i];

	  		// Remove delimiter changes, unsafe elements etc
	  		if (item.exclude) {
	  			items.splice(i, 1);
	  		}

	  		// Remove comments, unless we want to keep them
	  		else if (stripComments && item.t === COMMENT) {
	  				items.splice(i, 1);
	  			}
	  	}

	  	// If necessary, remove leading and trailing whitespace
	  	trimWhitespace(items, removeLeadingWhitespace ? leadingWhitespace$1 : null, removeTrailingWhitespace ? trailingWhitespace : null);

	  	i = items.length;
	  	while (i--) {
	  		item = items[i];

	  		// Recurse
	  		if (item.f) {
	  			var isPreserveWhitespaceElement = item.t === ELEMENT && preserveWhitespaceElements.test(item.e);
	  			preserveWhitespaceInsideFragment = preserveWhitespace || isPreserveWhitespaceElement;

	  			if (!preserveWhitespace && isPreserveWhitespaceElement) {
	  				trimWhitespace(item.f, leadingNewLine, trailingNewLine);
	  			}

	  			if (!preserveWhitespaceInsideFragment) {
	  				previousItem = items[i - 1];
	  				nextItem = items[i + 1];

	  				// if the previous item was a text item with trailing whitespace,
	  				// remove leading whitespace inside the fragment
	  				if (!previousItem || typeof previousItem === 'string' && trailingWhitespace.test(previousItem)) {
	  					removeLeadingWhitespaceInsideFragment = true;
	  				}

	  				// and vice versa
	  				if (!nextItem || typeof nextItem === 'string' && leadingWhitespace$1.test(nextItem)) {
	  					removeTrailingWhitespaceInsideFragment = true;
	  				}
	  			}

	  			cleanup(item.f, stripComments, preserveWhitespaceInsideFragment, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespaceInsideFragment);
	  		}

	  		// Split if-else blocks into two (an if, and an unless)
	  		if (item.l) {
	  			cleanup(item.l.f, stripComments, preserveWhitespace, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespaceInsideFragment);

	  			items.splice(i + 1, 0, item.l);
	  			delete item.l; // TODO would be nice if there was a way around this
	  		}

	  		// Clean up element attributes
	  		if (item.a) {
	  			for (key in item.a) {
	  				if (item.a.hasOwnProperty(key) && typeof item.a[key] !== 'string') {
	  					cleanup(item.a[key], stripComments, preserveWhitespace, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespaceInsideFragment);
	  				}
	  			}
	  		}

	  		// Clean up conditional attributes
	  		if (item.m) {
	  			cleanup(item.m, stripComments, preserveWhitespace, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespaceInsideFragment);
	  		}

	  		// Clean up event handlers
	  		if (item.v) {
	  			for (key in item.v) {
	  				if (item.v.hasOwnProperty(key)) {
	  					// clean up names
	  					if (isArray(item.v[key].n)) {
	  						cleanup(item.v[key].n, stripComments, preserveWhitespace, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespaceInsideFragment);
	  					}

	  					// clean up params
	  					if (isArray(item.v[key].d)) {
	  						cleanup(item.v[key].d, stripComments, preserveWhitespace, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespaceInsideFragment);
	  					}
	  				}
	  			}
	  		}
	  	}

	  	// final pass - fuse text nodes together
	  	i = items.length;
	  	while (i--) {
	  		if (typeof items[i] === 'string') {
	  			if (typeof items[i + 1] === 'string') {
	  				items[i] = items[i] + items[i + 1];
	  				items.splice(i + 1, 1);
	  			}

	  			if (!preserveWhitespace) {
	  				items[i] = items[i].replace(contiguousWhitespace, ' ');
	  			}

	  			if (items[i] === '') {
	  				items.splice(i, 1);
	  			}
	  		}
	  	}
	  }

	  var delimiterChangePattern = /^[^\s=]+/;
	  var whitespacePattern = /^\s+/;
	  function readDelimiterChange(parser) {
	  	var start, opening, closing;

	  	if (!parser.matchString('=')) {
	  		return null;
	  	}

	  	start = parser.pos;

	  	// allow whitespace before new opening delimiter
	  	parser.allowWhitespace();

	  	opening = parser.matchPattern(delimiterChangePattern);
	  	if (!opening) {
	  		parser.pos = start;
	  		return null;
	  	}

	  	// allow whitespace (in fact, it's necessary...)
	  	if (!parser.matchPattern(whitespacePattern)) {
	  		return null;
	  	}

	  	closing = parser.matchPattern(delimiterChangePattern);
	  	if (!closing) {
	  		parser.pos = start;
	  		return null;
	  	}

	  	// allow whitespace before closing '='
	  	parser.allowWhitespace();

	  	if (!parser.matchString('=')) {
	  		parser.pos = start;
	  		return null;
	  	}

	  	return [opening, closing];
	  }

	  var delimiterChangeToken = { t: DELIMCHANGE, exclude: true };
	  function readMustache(parser) {
	  	var mustache, i;

	  	// If we're inside a <script> or <style> tag, and we're not
	  	// interpolating, bug out
	  	if (parser.interpolate[parser.inside] === false) {
	  		return null;
	  	}

	  	for (i = 0; i < parser.tags.length; i += 1) {
	  		if (mustache = readMustacheOfType(parser, parser.tags[i])) {
	  			return mustache;
	  		}
	  	}
	  }

	  function readMustacheOfType(parser, tag) {
	  	var start, mustache, reader, i;

	  	start = parser.pos;

	  	if (parser.matchString('\\' + tag.open)) {
	  		if (start === 0 || parser.str[start - 1] !== '\\') {
	  			return tag.open;
	  		}
	  	} else if (!parser.matchString(tag.open)) {
	  		return null;
	  	}

	  	// delimiter change?
	  	if (mustache = readDelimiterChange(parser)) {
	  		// find closing delimiter or abort...
	  		if (!parser.matchString(tag.close)) {
	  			return null;
	  		}

	  		// ...then make the switch
	  		tag.open = mustache[0];
	  		tag.close = mustache[1];
	  		parser.sortMustacheTags();

	  		return delimiterChangeToken;
	  	}

	  	parser.allowWhitespace();

	  	// illegal section closer
	  	if (parser.matchString('/')) {
	  		parser.pos -= 1;
	  		var rewind = parser.pos;
	  		if (!readNumberLiteral(parser)) {
	  			parser.pos = rewind - tag.close.length;
	  			parser.error('Attempted to close a section that wasn\'t open');
	  		} else {
	  			parser.pos = rewind;
	  		}
	  	}

	  	for (i = 0; i < tag.readers.length; i += 1) {
	  		reader = tag.readers[i];

	  		if (mustache = reader(parser, tag)) {
	  			if (tag.isStatic) {
	  				mustache.s = true; // TODO make this `1` instead - more compact
	  			}

	  			if (parser.includeLinePositions) {
	  				mustache.p = parser.getLinePos(start);
	  			}

	  			return mustache;
	  		}
	  	}

	  	parser.pos = start;
	  	return null;
	  }

	  var closingTagPattern = /^([a-zA-Z]{1,}:?[a-zA-Z0-9\-]*)\s*\>/;
	  function readClosingTag(parser) {
	  	var start, tag;

	  	start = parser.pos;

	  	// are we looking at a closing tag?
	  	if (!parser.matchString('</')) {
	  		return null;
	  	}

	  	if (tag = parser.matchPattern(closingTagPattern)) {
	  		if (parser.inside && tag !== parser.inside) {
	  			parser.pos = start;
	  			return null;
	  		}

	  		return {
	  			t: CLOSING_TAG,
	  			e: tag
	  		};
	  	}

	  	// We have an illegal closing tag, report it
	  	parser.pos -= 2;
	  	parser.error('Illegal closing tag');
	  }

	  var attributeNamePattern = /^[^\s"'>\/=]+/;
	  var unquotedAttributeValueTextPattern = /^[^\s"'=<>`]+/;
	  function readAttribute(parser) {
	  	var attr, name, value;

	  	parser.allowWhitespace();

	  	name = parser.matchPattern(attributeNamePattern);
	  	if (!name) {
	  		return null;
	  	}

	  	attr = { name: name };

	  	value = readAttributeValue(parser);
	  	if (value != null) {
	  		// not null/undefined
	  		attr.value = value;
	  	}

	  	return attr;
	  }

	  function readAttributeValue(parser) {
	  	var start, valueStart, startDepth, value;

	  	start = parser.pos;

	  	// next character must be `=`, `/`, `>` or whitespace
	  	if (!/[=\/>\s]/.test(parser.nextChar())) {
	  		parser.error('Expected `=`, `/`, `>` or whitespace');
	  	}

	  	parser.allowWhitespace();

	  	if (!parser.matchString('=')) {
	  		parser.pos = start;
	  		return null;
	  	}

	  	parser.allowWhitespace();

	  	valueStart = parser.pos;
	  	startDepth = parser.sectionDepth;

	  	value = readQuotedAttributeValue(parser, '\'') || readQuotedAttributeValue(parser, '"') || readUnquotedAttributeValue(parser);

	  	if (value === null) {
	  		parser.error('Expected valid attribute value');
	  	}

	  	if (parser.sectionDepth !== startDepth) {
	  		parser.pos = valueStart;
	  		parser.error('An attribute value must contain as many opening section tags as closing section tags');
	  	}

	  	if (!value.length) {
	  		return '';
	  	}

	  	if (value.length === 1 && typeof value[0] === 'string') {
	  		return decodeCharacterReferences(value[0]);
	  	}

	  	return value;
	  }

	  function readUnquotedAttributeValueToken(parser) {
	  	var start, text, haystack, needles, index;

	  	start = parser.pos;

	  	text = parser.matchPattern(unquotedAttributeValueTextPattern);

	  	if (!text) {
	  		return null;
	  	}

	  	haystack = text;
	  	needles = parser.tags.map(function (t) {
	  		return t.open;
	  	}); // TODO refactor... we do this in readText.js as well

	  	if ((index = getLowestIndex(haystack, needles)) !== -1) {
	  		text = text.substr(0, index);
	  		parser.pos = start + text.length;
	  	}

	  	return text;
	  }

	  function readUnquotedAttributeValue(parser) {
	  	var tokens, token;

	  	parser.inAttribute = true;

	  	tokens = [];

	  	token = readMustache(parser) || readUnquotedAttributeValueToken(parser);
	  	while (token !== null) {
	  		tokens.push(token);
	  		token = readMustache(parser) || readUnquotedAttributeValueToken(parser);
	  	}

	  	if (!tokens.length) {
	  		return null;
	  	}

	  	parser.inAttribute = false;
	  	return tokens;
	  }

	  function readQuotedAttributeValue(parser, quoteMark) {
	  	var start, tokens, token;

	  	start = parser.pos;

	  	if (!parser.matchString(quoteMark)) {
	  		return null;
	  	}

	  	parser.inAttribute = quoteMark;

	  	tokens = [];

	  	token = readMustache(parser) || readQuotedStringToken(parser, quoteMark);
	  	while (token !== null) {
	  		tokens.push(token);
	  		token = readMustache(parser) || readQuotedStringToken(parser, quoteMark);
	  	}

	  	if (!parser.matchString(quoteMark)) {
	  		parser.pos = start;
	  		return null;
	  	}

	  	parser.inAttribute = false;

	  	return tokens;
	  }

	  function readQuotedStringToken(parser, quoteMark) {
	  	var haystack = parser.remaining();

	  	var needles = parser.tags.map(function (t) {
	  		return t.open;
	  	}); // TODO refactor... we do this in readText.js as well
	  	needles.push(quoteMark);

	  	var index = getLowestIndex(haystack, needles);

	  	if (index === -1) {
	  		parser.error('Quoted attribute value must have a closing quote');
	  	}

	  	if (!index) {
	  		return null;
	  	}

	  	parser.pos += index;
	  	return haystack.substr(0, index);
	  }

	  var Parser;
	  var ParseError;
	  var leadingWhitespace = /^\s+/;
	  ParseError = function (message) {
	  	this.name = 'ParseError';
	  	this.message = message;
	  	try {
	  		throw new Error(message);
	  	} catch (e) {
	  		this.stack = e.stack;
	  	}
	  };

	  ParseError.prototype = Error.prototype;

	  Parser = function (str, options) {
	  	var items,
	  	    item,
	  	    lineStart = 0;

	  	this.str = str;
	  	this.options = options || {};
	  	this.pos = 0;

	  	this.lines = this.str.split('\n');
	  	this.lineEnds = this.lines.map(function (line) {
	  		var lineEnd = lineStart + line.length + 1; // +1 for the newline

	  		lineStart = lineEnd;
	  		return lineEnd;
	  	}, 0);

	  	// Custom init logic
	  	if (this.init) this.init(str, options);

	  	items = [];

	  	while (this.pos < this.str.length && (item = this.read())) {
	  		items.push(item);
	  	}

	  	this.leftover = this.remaining();
	  	this.result = this.postProcess ? this.postProcess(items, options) : items;
	  };

	  Parser.prototype = {
	  	read: function (converters) {
	  		var pos, i, len, item;

	  		if (!converters) converters = this.converters;

	  		pos = this.pos;

	  		len = converters.length;
	  		for (i = 0; i < len; i += 1) {
	  			this.pos = pos; // reset for each attempt

	  			if (item = converters[i](this)) {
	  				return item;
	  			}
	  		}

	  		return null;
	  	},

	  	getLinePos: function (char) {
	  		var lineNum = 0,
	  		    lineStart = 0,
	  		    columnNum;

	  		while (char >= this.lineEnds[lineNum]) {
	  			lineStart = this.lineEnds[lineNum];
	  			lineNum += 1;
	  		}

	  		columnNum = char - lineStart;
	  		return [lineNum + 1, columnNum + 1, char]; // line/col should be one-based, not zero-based!
	  	},

	  	error: function (message) {
	  		var pos = this.getLinePos(this.pos);
	  		var lineNum = pos[0];
	  		var columnNum = pos[1];

	  		var line = this.lines[pos[0] - 1];
	  		var numTabs = 0;
	  		var annotation = line.replace(/\t/g, function (match, char) {
	  			if (char < pos[1]) {
	  				numTabs += 1;
	  			}

	  			return '  ';
	  		}) + '\n' + new Array(pos[1] + numTabs).join(' ') + '^----';

	  		var error = new ParseError(message + ' at line ' + lineNum + ' character ' + columnNum + ':\n' + annotation);

	  		error.line = pos[0];
	  		error.character = pos[1];
	  		error.shortMessage = message;

	  		throw error;
	  	},

	  	matchString: function (string) {
	  		if (this.str.substr(this.pos, string.length) === string) {
	  			this.pos += string.length;
	  			return string;
	  		}
	  	},

	  	matchPattern: function (pattern) {
	  		var match;

	  		if (match = pattern.exec(this.remaining())) {
	  			this.pos += match[0].length;
	  			return match[1] || match[0];
	  		}
	  	},

	  	allowWhitespace: function () {
	  		this.matchPattern(leadingWhitespace);
	  	},

	  	remaining: function () {
	  		return this.str.substring(this.pos);
	  	},

	  	nextChar: function () {
	  		return this.str.charAt(this.pos);
	  	}
	  };

	  Parser.extend = function (proto) {
	  	var Parent = this,
	  	    Child,
	  	    key;

	  	Child = function (str, options) {
	  		Parser.call(this, str, options);
	  	};

	  	Child.prototype = create(Parent.prototype);

	  	for (key in proto) {
	  		if (hasOwn.call(proto, key)) {
	  			Child.prototype[key] = proto[key];
	  		}
	  	}

	  	Child.extend = Parser.extend;
	  	return Child;
	  };

	  var Parser$1 = Parser;

	  // simple JSON parser, without the restrictions of JSON parse
	  // (i.e. having to double-quote keys).
	  //
	  // If passed a hash of values as the second argument, ${placeholders}
	  // will be replaced with those values

	  var specials = {
	  	'true': true,
	  	'false': false,
	  	'null': null,
	  	undefined: undefined
	  };

	  var specialsPattern = new RegExp('^(?:' + Object.keys(specials).join('|') + ')');
	  var numberPattern = /^(?:[+-]?)(?:(?:(?:0|[1-9]\d*)?\.\d+)|(?:(?:0|[1-9]\d*)\.)|(?:0|[1-9]\d*))(?:[eE][+-]?\d+)?/;
	  var placeholderPattern = /\$\{([^\}]+)\}/g;
	  var placeholderAtStartPattern = /^\$\{([^\}]+)\}/;
	  var onlyWhitespace = /^\s*$/;

	  var JsonParser = Parser$1.extend({
	  	init: function (str, options) {
	  		this.values = options.values;
	  		this.allowWhitespace();
	  	},

	  	postProcess: function (result) {
	  		if (result.length !== 1 || !onlyWhitespace.test(this.leftover)) {
	  			return null;
	  		}

	  		return { value: result[0].v };
	  	},

	  	converters: [function getPlaceholder(parser) {
	  		if (!parser.values) return null;

	  		var placeholder = parser.matchPattern(placeholderAtStartPattern);

	  		if (placeholder && parser.values.hasOwnProperty(placeholder)) {
	  			return { v: parser.values[placeholder] };
	  		}
	  	}, function getSpecial(parser) {
	  		var special = parser.matchPattern(specialsPattern);
	  		if (special) return { v: specials[special] };
	  	}, function getNumber(parser) {
	  		var number = parser.matchPattern(numberPattern);
	  		if (number) return { v: +number };
	  	}, function getString(parser) {
	  		var stringLiteral = readStringLiteral(parser);
	  		var values = parser.values;

	  		if (stringLiteral && values) {
	  			return {
	  				v: stringLiteral.v.replace(placeholderPattern, function (match, $1) {
	  					return $1 in values ? values[$1] : $1;
	  				})
	  			};
	  		}

	  		return stringLiteral;
	  	}, function getObject(parser) {
	  		if (!parser.matchString('{')) return null;

	  		var result = {};

	  		parser.allowWhitespace();

	  		if (parser.matchString('}')) {
	  			return { v: result };
	  		}

	  		var pair = undefined;
	  		while (pair = getKeyValuePair(parser)) {
	  			result[pair.key] = pair.value;

	  			parser.allowWhitespace();

	  			if (parser.matchString('}')) {
	  				return { v: result };
	  			}

	  			if (!parser.matchString(',')) {
	  				return null;
	  			}
	  		}

	  		return null;
	  	}, function getArray(parser) {
	  		if (!parser.matchString('[')) return null;

	  		var result = [];

	  		parser.allowWhitespace();

	  		if (parser.matchString(']')) {
	  			return { v: result };
	  		}

	  		var valueToken = undefined;
	  		while (valueToken = parser.read()) {
	  			result.push(valueToken.v);

	  			parser.allowWhitespace();

	  			if (parser.matchString(']')) {
	  				return { v: result };
	  			}

	  			if (!parser.matchString(',')) {
	  				return null;
	  			}

	  			parser.allowWhitespace();
	  		}

	  		return null;
	  	}]
	  });

	  function getKeyValuePair(parser) {
	  	parser.allowWhitespace();

	  	var key = readKey(parser);

	  	if (!key) return null;

	  	var pair = { key: key };

	  	parser.allowWhitespace();
	  	if (!parser.matchString(':')) {
	  		return null;
	  	}
	  	parser.allowWhitespace();

	  	var valueToken = parser.read();

	  	if (!valueToken) return null;

	  	pair.value = valueToken.v;
	  	return pair;
	  }

	  function parseJSON (str, values) {
	  	var parser = new JsonParser(str, { values: values });
	  	return parser.result;
	  }

	  var methodCallPattern = /^([a-zA-Z_$][a-zA-Z_$0-9]*)\(/;
	  var methodCallExcessPattern = /\)\s*$/;
	  var spreadPattern = /(\s*,{0,1}\s*\.{3}arguments\s*)$/;
	  var ExpressionParser;
	  ExpressionParser = Parser$1.extend({
	  	converters: [readExpression]
	  });

	  // TODO clean this up, it's shocking

	  function processDirective(tokens, parentParser) {
	  	var result, match, token, colonIndex, directiveName, directiveArgs, parsed;

	  	if (typeof tokens === 'string') {
	  		if (match = methodCallPattern.exec(tokens)) {
	  			var end = tokens.lastIndexOf(')');

	  			// check for invalid method calls
	  			if (!methodCallExcessPattern.test(tokens)) {
	  				parentParser.error('Invalid input after method call expression \'' + tokens.slice(end + 1) + '\'');
	  			}

	  			result = { m: match[1] };
	  			var sliced = tokens.slice(result.m.length + 1, end);

	  			// does the method include spread of ...arguments?
	  			var args = sliced.replace(spreadPattern, '');

	  			// if so, other arguments should be appended to end of method arguments
	  			if (sliced !== args) {
	  				result.g = true;
	  			}

	  			if (args) {
	  				var parser = new ExpressionParser('[' + args + ']');
	  				result.a = flattenExpression(parser.result[0]);
	  			}

	  			return result;
	  		}

	  		if (tokens.indexOf(':') === -1) {
	  			return tokens.trim();
	  		}

	  		tokens = [tokens];
	  	}

	  	result = {};

	  	directiveName = [];
	  	directiveArgs = [];

	  	if (tokens) {
	  		while (tokens.length) {
	  			token = tokens.shift();

	  			if (typeof token === 'string') {
	  				colonIndex = token.indexOf(':');

	  				if (colonIndex === -1) {
	  					directiveName.push(token);
	  				} else {
	  					// is the colon the first character?
	  					if (colonIndex) {
	  						// no
	  						directiveName.push(token.substr(0, colonIndex));
	  					}

	  					// if there is anything after the colon in this token, treat
	  					// it as the first token of the directiveArgs fragment
	  					if (token.length > colonIndex + 1) {
	  						directiveArgs[0] = token.substring(colonIndex + 1);
	  					}

	  					break;
	  				}
	  			} else {
	  				directiveName.push(token);
	  			}
	  		}

	  		directiveArgs = directiveArgs.concat(tokens);
	  	}

	  	if (!directiveName.length) {
	  		result = '';
	  	} else if (directiveArgs.length || typeof directiveName !== 'string') {
	  		result = {
	  			// TODO is this really necessary? just use the array
	  			n: directiveName.length === 1 && typeof directiveName[0] === 'string' ? directiveName[0] : directiveName
	  		};

	  		if (directiveArgs.length === 1 && typeof directiveArgs[0] === 'string') {
	  			parsed = parseJSON('[' + directiveArgs[0] + ']');
	  			result.a = parsed ? parsed.value : [directiveArgs[0].trim()];
	  		} else {
	  			result.d = directiveArgs;
	  		}
	  	} else {
	  		result = directiveName;
	  	}

	  	return result;
	  }

	  var tagNamePattern = /^[a-zA-Z]{1,}:?[a-zA-Z0-9\-]*/;
	  var validTagNameFollower = /^[\s\n\/>]/;
	  var onPattern = /^on/;
	  var proxyEventPattern = /^on-([a-zA-Z\\*\\.$_][a-zA-Z\\*\\.$_0-9\-]+)$/;
	  var reservedEventNames = /^(?:change|reset|teardown|update|construct|config|init|render|unrender|detach|insert)$/;
	  var directives = { 'intro-outro': 't0', intro: 't1', outro: 't2', decorator: 'o' };
	  var exclude = { exclude: true };
	  var disallowedContents;
	  // based on http://developers.whatwg.org/syntax.html#syntax-tag-omission
	  disallowedContents = {
	  	li: ['li'],
	  	dt: ['dt', 'dd'],
	  	dd: ['dt', 'dd'],
	  	p: 'address article aside blockquote div dl fieldset footer form h1 h2 h3 h4 h5 h6 header hgroup hr main menu nav ol p pre section table ul'.split(' '),
	  	rt: ['rt', 'rp'],
	  	rp: ['rt', 'rp'],
	  	optgroup: ['optgroup'],
	  	option: ['option', 'optgroup'],
	  	thead: ['tbody', 'tfoot'],
	  	tbody: ['tbody', 'tfoot'],
	  	tfoot: ['tbody'],
	  	tr: ['tr', 'tbody'],
	  	td: ['td', 'th', 'tr'],
	  	th: ['td', 'th', 'tr']
	  };

	  function readElement(parser) {
	  	var start, element, directiveName, match, addProxyEvent, attribute, directive, selfClosing, children, partials, hasPartials, child, closed, pos, remaining, closingTag;

	  	start = parser.pos;

	  	if (parser.inside || parser.inAttribute) {
	  		return null;
	  	}

	  	if (!parser.matchString('<')) {
	  		return null;
	  	}

	  	// if this is a closing tag, abort straight away
	  	if (parser.nextChar() === '/') {
	  		return null;
	  	}

	  	element = {};
	  	if (parser.includeLinePositions) {
	  		element.p = parser.getLinePos(start);
	  	}

	  	if (parser.matchString('!')) {
	  		element.t = DOCTYPE;
	  		if (!parser.matchPattern(/^doctype/i)) {
	  			parser.error('Expected DOCTYPE declaration');
	  		}

	  		element.a = parser.matchPattern(/^(.+?)>/);
	  		return element;
	  	}

	  	element.t = ELEMENT;

	  	// element name
	  	element.e = parser.matchPattern(tagNamePattern);
	  	if (!element.e) {
	  		return null;
	  	}

	  	// next character must be whitespace, closing solidus or '>'
	  	if (!validTagNameFollower.test(parser.nextChar())) {
	  		parser.error('Illegal tag name');
	  	}

	  	addProxyEvent = function (name, directive) {
	  		var directiveName = directive.n || directive;

	  		if (reservedEventNames.test(directiveName)) {
	  			parser.pos -= directiveName.length;
	  			parser.error('Cannot use reserved event names (change, reset, teardown, update, construct, config, init, render, unrender, detach, insert)');
	  		}

	  		element.v[name] = directive;
	  	};

	  	parser.allowWhitespace();

	  	// directives and attributes
	  	while (attribute = readMustache(parser) || readAttribute(parser)) {
	  		// regular attributes
	  		if (attribute.name) {
	  			// intro, outro, decorator
	  			if (directiveName = directives[attribute.name]) {
	  				element[directiveName] = processDirective(attribute.value, parser);
	  			}

	  			// on-click etc
	  			else if (match = proxyEventPattern.exec(attribute.name)) {
	  					if (!element.v) element.v = {};
	  					directive = processDirective(attribute.value, parser);
	  					addProxyEvent(match[1], directive);
	  				} else {
	  					if (!parser.sanitizeEventAttributes || !onPattern.test(attribute.name)) {
	  						if (!element.a) element.a = {};
	  						element.a[attribute.name] = attribute.value || (attribute.value === '' ? '' : 0);
	  					}
	  				}
	  		}

	  		// {{#if foo}}class='foo'{{/if}}
	  		else {
	  				if (!element.m) element.m = [];
	  				element.m.push(attribute);
	  			}

	  		parser.allowWhitespace();
	  	}

	  	// allow whitespace before closing solidus
	  	parser.allowWhitespace();

	  	// self-closing solidus?
	  	if (parser.matchString('/')) {
	  		selfClosing = true;
	  	}

	  	// closing angle bracket
	  	if (!parser.matchString('>')) {
	  		return null;
	  	}

	  	var lowerCaseName = element.e.toLowerCase();
	  	var preserveWhitespace = parser.preserveWhitespace;

	  	if (!selfClosing && !voidElementNames.test(element.e)) {
	  		parser.elementStack.push(lowerCaseName);

	  		// Special case - if we open a script element, further tags should
	  		// be ignored unless they're a closing script element
	  		if (lowerCaseName === 'script' || lowerCaseName === 'style' || lowerCaseName === 'textarea') {
	  			parser.inside = lowerCaseName;
	  		}

	  		children = [];
	  		partials = create(null);

	  		do {
	  			pos = parser.pos;
	  			remaining = parser.remaining();

	  			if (!remaining) {
	  				parser.error('Missing end ' + (parser.elementStack.length > 1 ? 'tags' : 'tag') + ' (' + parser.elementStack.reverse().map(function (x) {
	  					return '</' + x + '>';
	  				}).join('') + ')');
	  			}

	  			// if for example we're in an <li> element, and we see another
	  			// <li> tag, close the first so they become siblings
	  			if (!canContain(lowerCaseName, remaining)) {
	  				closed = true;
	  			}

	  			// closing tag
	  			else if (closingTag = readClosingTag(parser)) {
	  					closed = true;

	  					var closingTagName = closingTag.e.toLowerCase();

	  					// if this *isn't* the closing tag for the current element...
	  					if (closingTagName !== lowerCaseName) {
	  						// rewind parser
	  						parser.pos = pos;

	  						// if it doesn't close a parent tag, error
	  						if (! ~parser.elementStack.indexOf(closingTagName)) {
	  							var errorMessage = 'Unexpected closing tag';

	  							// add additional help for void elements, since component names
	  							// might clash with them
	  							if (voidElementNames.test(closingTagName)) {
	  								errorMessage += ' (<' + closingTagName + '> is a void element - it cannot contain children)';
	  							}

	  							parser.error(errorMessage);
	  						}
	  					}
	  				}

	  				// implicit close by closing section tag. TODO clean this up
	  				else if (child = readClosing(parser, { open: parser.standardDelimiters[0], close: parser.standardDelimiters[1] })) {
	  						closed = true;
	  						parser.pos = pos;
	  					} else {
	  						if (child = parser.read(PARTIAL_READERS)) {
	  							if (partials[child.n]) {
	  								parser.pos = pos;
	  								parser.error('Duplicate partial definition');
	  							}

	  							cleanup(child.f, parser.stripComments, preserveWhitespace, !preserveWhitespace, !preserveWhitespace);

	  							partials[child.n] = child.f;
	  							hasPartials = true;
	  						} else {
	  							if (child = parser.read(READERS)) {
	  								children.push(child);
	  							} else {
	  								closed = true;
	  							}
	  						}
	  					}
	  		} while (!closed);

	  		if (children.length) {
	  			element.f = children;
	  		}

	  		if (hasPartials) {
	  			element.p = partials;
	  		}

	  		parser.elementStack.pop();
	  	}

	  	parser.inside = null;

	  	if (parser.sanitizeElements && parser.sanitizeElements.indexOf(lowerCaseName) !== -1) {
	  		return exclude;
	  	}

	  	return element;
	  }

	  function canContain(name, remaining) {
	  	var match, disallowed;

	  	match = /^<([a-zA-Z][a-zA-Z0-9]*)/.exec(remaining);
	  	disallowed = disallowedContents[name];

	  	if (!match || !disallowed) {
	  		return true;
	  	}

	  	return ! ~disallowed.indexOf(match[1].toLowerCase());
	  }

	  var OPEN_COMMENT = '<!--';
	  var CLOSE_COMMENT = '-->';
	  function readHtmlComment(parser) {
	  	var start, content, remaining, endIndex, comment;

	  	start = parser.pos;

	  	if (!parser.matchString(OPEN_COMMENT)) {
	  		return null;
	  	}

	  	remaining = parser.remaining();
	  	endIndex = remaining.indexOf(CLOSE_COMMENT);

	  	if (endIndex === -1) {
	  		parser.error('Illegal HTML - expected closing comment sequence (\'-->\')');
	  	}

	  	content = remaining.substr(0, endIndex);
	  	parser.pos += endIndex + 3;

	  	comment = {
	  		t: COMMENT,
	  		c: content
	  	};

	  	if (parser.includeLinePositions) {
	  		comment.p = parser.getLinePos(start);
	  	}

	  	return comment;
	  }

	  var partialDefinitionSectionPattern = /^#\s*partial\s+/;
	  function readPartialDefinitionSection(parser) {
	  	var start, name, content, child, closed;

	  	start = parser.pos;

	  	var delimiters = parser.standardDelimiters;

	  	if (!parser.matchString(delimiters[0])) {
	  		return null;
	  	}

	  	if (!parser.matchPattern(partialDefinitionSectionPattern)) {
	  		parser.pos = start;
	  		return null;
	  	}

	  	name = parser.matchPattern(/^[a-zA-Z_$][a-zA-Z_$0-9\-\/]*/);

	  	if (!name) {
	  		parser.error('expected legal partial name');
	  	}

	  	if (!parser.matchString(delimiters[1])) {
	  		parser.error('Expected closing delimiter \'' + delimiters[1] + '\'');
	  	}

	  	content = [];

	  	do {
	  		// TODO clean this up
	  		if (child = readClosing(parser, { open: parser.standardDelimiters[0], close: parser.standardDelimiters[1] })) {
	  			if (!child.r === 'partial') {
	  				parser.error('Expected ' + delimiters[0] + '/partial' + delimiters[1]);
	  			}

	  			closed = true;
	  		} else {
	  			child = parser.read(READERS);

	  			if (!child) {
	  				parser.error('Expected ' + delimiters[0] + '/partial' + delimiters[1]);
	  			}

	  			content.push(child);
	  		}
	  	} while (!closed);

	  	return {
	  		t: INLINE_PARTIAL,
	  		n: name,
	  		f: content
	  	};
	  }

	  var startPattern = /^<!--\s*/;
	  var namePattern = /s*>\s*([a-zA-Z_$][-a-zA-Z_$0-9]*)\s*/;
	  var finishPattern = /\s*-->/;

	  function readPartialDefinitionComment(parser) {
	  	var start = parser.pos;
	  	var open = parser.standardDelimiters[0];
	  	var close = parser.standardDelimiters[1];

	  	if (!parser.matchPattern(startPattern) || !parser.matchString(open)) {
	  		parser.pos = start;
	  		return null;
	  	}

	  	var name = parser.matchPattern(namePattern);

	  	warnOnceIfDebug('Inline partial comments are deprecated.\nUse this...\n  {{#partial ' + name + '}} ... {{/partial}}\n\n...instead of this:\n  <!-- {{>' + name + '}} --> ... <!-- {{/' + name + '}} -->\'');

	  	// make sure the rest of the comment is in the correct place
	  	if (!parser.matchString(close) || !parser.matchPattern(finishPattern)) {
	  		parser.pos = start;
	  		return null;
	  	}

	  	var content = [];
	  	var closed = undefined;

	  	var endPattern = new RegExp('^<!--\\s*' + escapeRegExp(open) + '\\s*\\/\\s*' + name + '\\s*' + escapeRegExp(close) + '\\s*-->');

	  	do {
	  		if (parser.matchPattern(endPattern)) {
	  			closed = true;
	  		} else {
	  			var child = parser.read(READERS);
	  			if (!child) {
	  				parser.error('expected closing comment (\'<!-- ' + open + '/' + name + close + ' -->\')');
	  			}

	  			content.push(child);
	  		}
	  	} while (!closed);

	  	return {
	  		t: INLINE_PARTIAL,
	  		f: content,
	  		n: name
	  	};
	  }

	  function readTemplate(parser) {
	  	var fragment = [];
	  	var partials = create(null);
	  	var hasPartials = false;

	  	var preserveWhitespace = parser.preserveWhitespace;

	  	while (parser.pos < parser.str.length) {
	  		var pos = parser.pos,
	  		    item = undefined,
	  		    partial = undefined;

	  		if (partial = parser.read(PARTIAL_READERS)) {
	  			if (partials[partial.n]) {
	  				parser.pos = pos;
	  				parser.error('Duplicated partial definition');
	  			}

	  			cleanup(partial.f, parser.stripComments, preserveWhitespace, !preserveWhitespace, !preserveWhitespace);

	  			partials[partial.n] = partial.f;
	  			hasPartials = true;
	  		} else if (item = parser.read(READERS)) {
	  			fragment.push(item);
	  		} else {
	  			parser.error('Unexpected template content');
	  		}
	  	}

	  	var result = {
	  		v: TEMPLATE_VERSION,
	  		t: fragment
	  	};

	  	if (hasPartials) {
	  		result.p = partials;
	  	}

	  	return result;
	  }

	  function insertExpressions(obj, expr) {

	  	Object.keys(obj).forEach(function (key) {
	  		if (isExpression(key, obj)) return addTo(obj, expr);

	  		var ref = obj[key];
	  		if (hasChildren(ref)) insertExpressions(ref, expr);
	  	});
	  }

	  function isExpression(key, obj) {
	  	return key === 's' && isArray(obj.r);
	  }

	  function addTo(obj, expr) {
	  	var s = obj.s;
	  	var r = obj.r;

	  	if (!expr[s]) expr[s] = fromExpression(s, r.length);
	  }

	  function hasChildren(ref) {
	  	return isArray(ref) || isObject(ref);
	  }

	  // See https://github.com/ractivejs/template-spec for information
	  // about the Ractive template specification

	  var STANDARD_READERS = [readPartial, readUnescaped, readSection, readYielder, readInterpolator, readComment];
	  var TRIPLE_READERS = [readTriple];
	  var STATIC_READERS = [readUnescaped, readSection, readInterpolator]; // TODO does it make sense to have a static section?

	  var StandardParser = undefined;
	  function parse(template, options) {
	  	return new StandardParser(template, options || {}).result;
	  }

	  parse.computedStrings = function (computed) {
	  	if (!computed) return [];

	  	Object.keys(computed).forEach(function (key) {
	  		var value = computed[key];
	  		if (typeof value === 'string') {
	  			computed[key] = fromComputationString(value);
	  		}
	  	});
	  };

	  var READERS = [readMustache, readHtmlComment, readElement, readText];
	  var PARTIAL_READERS = [readPartialDefinitionComment, readPartialDefinitionSection];

	  StandardParser = Parser$1.extend({
	  	init: function (str, options) {
	  		var tripleDelimiters = options.tripleDelimiters || ['{{{', '}}}'],
	  		    staticDelimiters = options.staticDelimiters || ['[[', ']]'],
	  		    staticTripleDelimiters = options.staticTripleDelimiters || ['[[[', ']]]'];

	  		this.standardDelimiters = options.delimiters || ['{{', '}}'];

	  		this.tags = [{ isStatic: false, isTriple: false, open: this.standardDelimiters[0], close: this.standardDelimiters[1], readers: STANDARD_READERS }, { isStatic: false, isTriple: true, open: tripleDelimiters[0], close: tripleDelimiters[1], readers: TRIPLE_READERS }, { isStatic: true, isTriple: false, open: staticDelimiters[0], close: staticDelimiters[1], readers: STATIC_READERS }, { isStatic: true, isTriple: true, open: staticTripleDelimiters[0], close: staticTripleDelimiters[1], readers: TRIPLE_READERS }];

	  		this.sortMustacheTags();

	  		this.sectionDepth = 0;
	  		this.elementStack = [];

	  		this.interpolate = {
	  			script: !options.interpolate || options.interpolate.script !== false,
	  			style: !options.interpolate || options.interpolate.style !== false,
	  			textarea: true
	  		};

	  		if (options.sanitize === true) {
	  			options.sanitize = {
	  				// blacklist from https://code.google.com/p/google-caja/source/browse/trunk/src/com/google/caja/lang/html/html4-elements-whitelist.json
	  				elements: 'applet base basefont body frame frameset head html isindex link meta noframes noscript object param script style title'.split(' '),
	  				eventAttributes: true
	  			};
	  		}

	  		this.stripComments = options.stripComments !== false;
	  		this.preserveWhitespace = options.preserveWhitespace;
	  		this.sanitizeElements = options.sanitize && options.sanitize.elements;
	  		this.sanitizeEventAttributes = options.sanitize && options.sanitize.eventAttributes;
	  		this.includeLinePositions = options.includeLinePositions;
	  		this.textOnlyMode = options.textOnlyMode;
	  		this.csp = options.csp;
	  	},

	  	postProcess: function (result) {
	  		// special case - empty string
	  		if (!result.length) {
	  			return { t: [], v: TEMPLATE_VERSION };
	  		}

	  		if (this.sectionDepth > 0) {
	  			this.error('A section was left open');
	  		}

	  		cleanup(result[0].t, this.stripComments, this.preserveWhitespace, !this.preserveWhitespace, !this.preserveWhitespace);

	  		if (this.csp !== false) {
	  			var expr = {};
	  			insertExpressions(result[0].t, expr);
	  			if (Object.keys(expr).length) result[0].e = expr;
	  		}

	  		return result[0];
	  	},

	  	converters: [readTemplate],

	  	sortMustacheTags: function () {
	  		// Sort in order of descending opening delimiter length (longer first),
	  		// to protect against opening delimiters being substrings of each other
	  		this.tags.sort(function (a, b) {
	  			return b.open.length - a.open.length;
	  		});
	  	}
	  });

	  var parseOptions = ['delimiters', 'tripleDelimiters', 'staticDelimiters', 'staticTripleDelimiters', 'csp', 'interpolate', 'preserveWhitespace', 'sanitize', 'stripComments'];

	  var TEMPLATE_INSTRUCTIONS = 'Either preparse or use a ractive runtime source that includes the parser. ';

	  var COMPUTATION_INSTRUCTIONS = 'Either use:\n\n\tRactive.parse.computedStrings( component.computed )\n\nat build time to pre-convert the strings to functions, or use functions instead of strings in computed properties.';

	  function throwNoParse(method, error, instructions) {
	  	if (!method) {
	  		fatal('Missing Ractive.parse - cannot parse ' + error + '. ' + instructions);
	  	}
	  }

	  function createFunction(body, length) {
	  	throwNoParse(fromExpression, 'new expression function', TEMPLATE_INSTRUCTIONS);
	  	return fromExpression(body, length);
	  }

	  function createFunctionFromString(str, bindTo) {
	  	throwNoParse(fromComputationString, 'compution string "${str}"', COMPUTATION_INSTRUCTIONS);
	  	return fromComputationString(str, bindTo);
	  }

	  var parser = {

	  	fromId: function (id, options) {
	  		if (!doc) {
	  			if (options && options.noThrow) {
	  				return;
	  			}
	  			throw new Error('Cannot retrieve template #' + id + ' as Ractive is not running in a browser.');
	  		}

	  		if (id) id = id.replace(/^#/, '');

	  		var template = undefined;

	  		if (!(template = doc.getElementById(id))) {
	  			if (options && options.noThrow) {
	  				return;
	  			}
	  			throw new Error('Could not find template element with id #' + id);
	  		}

	  		if (template.tagName.toUpperCase() !== 'SCRIPT') {
	  			if (options && options.noThrow) {
	  				return;
	  			}
	  			throw new Error('Template element with id #' + id + ', must be a <script> element');
	  		}

	  		return 'textContent' in template ? template.textContent : template.innerHTML;
	  	},

	  	isParsed: function (template) {
	  		return !(typeof template === 'string');
	  	},

	  	getParseOptions: function (ractive) {
	  		// Could be Ractive or a Component
	  		if (ractive.defaults) {
	  			ractive = ractive.defaults;
	  		}

	  		return parseOptions.reduce(function (val, key) {
	  			val[key] = ractive[key];
	  			return val;
	  		}, {});
	  	},

	  	parse: function (template, options) {
	  		throwNoParse(parse, 'template', TEMPLATE_INSTRUCTIONS);
	  		var parsed = parse(template, options);
	  		addFunctions(parsed);
	  		return parsed;
	  	},

	  	parseFor: function (template, ractive) {
	  		return this.parse(template, this.getParseOptions(ractive));
	  	}
	  };

	  var templateConfigurator = {
	  	name: 'template',

	  	extend: function (Parent, proto, options) {
	  		// only assign if exists
	  		if ('template' in options) {
	  			var template = options.template;

	  			if (typeof template === 'function') {
	  				proto.template = template;
	  			} else {
	  				proto.template = parseTemplate(template, proto);
	  			}
	  		}
	  	},

	  	init: function (Parent, ractive, options) {
	  		// TODO because of prototypal inheritance, we might just be able to use
	  		// ractive.template, and not bother passing through the Parent object.
	  		// At present that breaks the test mocks' expectations
	  		var template = 'template' in options ? options.template : Parent.prototype.template;
	  		template = template || { v: TEMPLATE_VERSION, t: [] };

	  		if (typeof template === 'function') {
	  			var fn = template;
	  			template = getDynamicTemplate(ractive, fn);

	  			ractive._config.template = {
	  				fn: fn,
	  				result: template
	  			};
	  		}

	  		template = parseTemplate(template, ractive);

	  		// TODO the naming of this is confusing - ractive.template refers to [...],
	  		// but Component.prototype.template refers to {v:1,t:[],p:[]}...
	  		// it's unnecessary, because the developer never needs to access
	  		// ractive.template
	  		ractive.template = template.t;

	  		if (template.p) {
	  			extendPartials(ractive.partials, template.p);
	  		}
	  	},

	  	reset: function (ractive) {
	  		var result = resetValue(ractive);

	  		if (result) {
	  			var parsed = parseTemplate(result, ractive);

	  			ractive.template = parsed.t;
	  			extendPartials(ractive.partials, parsed.p, true);

	  			return true;
	  		}
	  	}
	  };

	  function resetValue(ractive) {
	  	var initial = ractive._config.template;

	  	// If this isn't a dynamic template, there's nothing to do
	  	if (!initial || !initial.fn) {
	  		return;
	  	}

	  	var result = getDynamicTemplate(ractive, initial.fn);

	  	// TODO deep equality check to prevent unnecessary re-rendering
	  	// in the case of already-parsed templates
	  	if (result !== initial.result) {
	  		initial.result = result;
	  		return result;
	  	}
	  }

	  function getDynamicTemplate(ractive, fn) {
	  	return fn.call(ractive, {
	  		fromId: parser.fromId,
	  		isParsed: parser.isParsed,
	  		parse: function (template) {
	  			var options = arguments.length <= 1 || arguments[1] === undefined ? parser.getParseOptions(ractive) : arguments[1];

	  			return parser.parse(template, options);
	  		}
	  	});
	  }

	  function parseTemplate(template, ractive) {
	  	if (typeof template === 'string') {
	  		// parse will validate and add expression functions
	  		template = parseAsString(template, ractive);
	  	} else {
	  		// need to validate and add exp for already parsed template
	  		validate$1(template);
	  		addFunctions(template);
	  	}

	  	return template;
	  }

	  function parseAsString(template, ractive) {
	  	// ID of an element containing the template?
	  	if (template[0] === '#') {
	  		template = parser.fromId(template);
	  	}

	  	return parser.parseFor(template, ractive);
	  }

	  function validate$1(template) {

	  	// Check that the template even exists
	  	if (template == undefined) {
	  		throw new Error('The template cannot be ' + template + '.');
	  	}

	  	// Check the parsed template has a version at all
	  	else if (typeof template.v !== 'number') {
	  			throw new Error('The template parser was passed a non-string template, but the template doesn\'t have a version.  Make sure you\'re passing in the template you think you are.');
	  		}

	  		// Check we're using the correct version
	  		else if (template.v !== TEMPLATE_VERSION) {
	  				throw new Error('Mismatched template version (expected ' + TEMPLATE_VERSION + ', got ' + template.v + ') Please ensure you are using the latest version of Ractive.js in your build process as well as in your app');
	  			}
	  }

	  function extendPartials(existingPartials, newPartials, overwrite) {
	  	if (!newPartials) return;

	  	// TODO there's an ambiguity here - we need to overwrite in the `reset()`
	  	// case, but not initially...

	  	for (var key in newPartials) {
	  		if (overwrite || !existingPartials.hasOwnProperty(key)) {
	  			existingPartials[key] = newPartials[key];
	  		}
	  	}
	  }

	  var Item = (function () {
	  	function Item(options) {
	  		classCallCheck(this, Item);

	  		this.parentFragment = options.parentFragment;
	  		this.ractive = options.parentFragment.ractive;

	  		this.template = options.template;
	  		this.index = options.index;
	  		this.type = options.template.t;

	  		this.dirty = false;
	  	}

	  	Item.prototype.bubble = function bubble() {
	  		if (!this.dirty) {
	  			this.dirty = true;
	  			this.parentFragment.bubble();
	  		}
	  	};

	  	Item.prototype.find = function find() {
	  		return null;
	  	};

	  	Item.prototype.findAll = function findAll() {
	  		// noop
	  	};

	  	Item.prototype.findComponent = function findComponent() {
	  		return null;
	  	};

	  	Item.prototype.findAllComponents = function findAllComponents() {
	  		// noop;
	  	};

	  	Item.prototype.findNextNode = function findNextNode() {
	  		return this.parentFragment.findNextNode(this);
	  	};

	  	return Item;
	  })();

	  function badReference(key) {
	  	throw new Error('An index or key reference (' + key + ') cannot have child properties');
	  }
	  function resolveAmbiguousReference(fragment, ref) {
	  	var localViewmodel = fragment.findContext().root;
	  	var keys = splitKeypath(ref);
	  	var key = keys[0];

	  	var hasContextChain = undefined;
	  	var crossedComponentBoundary = undefined;
	  	var aliases = undefined;

	  	while (fragment) {
	  		// repeated fragments
	  		if (fragment.isIteration) {
	  			if (key === fragment.parent.keyRef) {
	  				if (keys.length > 1) badReference(key);
	  				return fragment.context.getKeyModel();
	  			}

	  			if (key === fragment.parent.indexRef) {
	  				if (keys.length > 1) badReference(key);
	  				return fragment.context.getIndexModel(fragment.index);
	  			}
	  		}

	  		// alias node or iteration
	  		if (((aliases = fragment.owner.aliases) || (aliases = fragment.aliases)) && aliases.hasOwnProperty(key)) {
	  			var model = aliases[key];

	  			if (keys.length === 1) return model;else if (typeof model.joinAll === 'function') {
	  				return model.joinAll(keys.slice(1));
	  			}
	  		}

	  		if (fragment.context) {
	  			// TODO better encapsulate the component check
	  			if (!fragment.isRoot || fragment.ractive.component) hasContextChain = true;

	  			if (fragment.context.has(key)) {
	  				if (crossedComponentBoundary) {
	  					localViewmodel.map(key, fragment.context.joinKey(key));
	  				}

	  				return fragment.context.joinAll(keys);
	  			}
	  		}

	  		if (fragment.componentParent && !fragment.ractive.isolated) {
	  			// ascend through component boundary
	  			fragment = fragment.componentParent;
	  			crossedComponentBoundary = true;
	  		} else {
	  			fragment = fragment.parent;
	  		}
	  	}

	  	if (!hasContextChain) {
	  		return localViewmodel.joinAll(keys);
	  	}
	  }

	  var stack = [];
	  var captureGroup = undefined;

	  function startCapturing() {
	  	stack.push(captureGroup = []);
	  }

	  function stopCapturing() {
	  	var dependencies = stack.pop();
	  	captureGroup = stack[stack.length - 1];
	  	return dependencies;
	  }

	  function capture(model) {
	  	if (captureGroup) {
	  		captureGroup.push(model);
	  	}
	  }

	  var requestAnimationFrame;

	  // If window doesn't exist, we don't need requestAnimationFrame
	  if (!win) {
	  	requestAnimationFrame = null;
	  } else {
	  	// https://gist.github.com/paulirish/1579671
	  	(function (vendors, lastTime, win) {

	  		var x, setTimeout;

	  		if (win.requestAnimationFrame) {
	  			return;
	  		}

	  		for (x = 0; x < vendors.length && !win.requestAnimationFrame; ++x) {
	  			win.requestAnimationFrame = win[vendors[x] + 'RequestAnimationFrame'];
	  		}

	  		if (!win.requestAnimationFrame) {
	  			setTimeout = win.setTimeout;

	  			win.requestAnimationFrame = function (callback) {
	  				var currTime, timeToCall, id;

	  				currTime = Date.now();
	  				timeToCall = Math.max(0, 16 - (currTime - lastTime));
	  				id = setTimeout(function () {
	  					callback(currTime + timeToCall);
	  				}, timeToCall);

	  				lastTime = currTime + timeToCall;
	  				return id;
	  			};
	  		}
	  	})(vendors, 0, win);

	  	requestAnimationFrame = win.requestAnimationFrame;
	  }

	  var rAF = requestAnimationFrame;

	  var getTime = win && win.performance && typeof win.performance.now === 'function' ? function () {
	  	return win.performance.now();
	  } : function () {
	  	return Date.now();
	  };

	  // TODO what happens if a transition is aborted?

	  var tickers = [];
	  var running = false;

	  function tick() {
	  	runloop.start();

	  	var now = getTime();

	  	var i = undefined;
	  	var ticker = undefined;

	  	for (i = 0; i < tickers.length; i += 1) {
	  		ticker = tickers[i];

	  		if (!ticker.tick(now)) {
	  			// ticker is complete, remove it from the stack, and decrement i so we don't miss one
	  			tickers.splice(i--, 1);
	  		}
	  	}

	  	runloop.end();

	  	if (tickers.length) {
	  		rAF(tick);
	  	} else {
	  		running = false;
	  	}
	  }

	  var Ticker = (function () {
	  	function Ticker(options) {
	  		classCallCheck(this, Ticker);

	  		this.duration = options.duration;
	  		this.step = options.step;
	  		this.complete = options.complete;
	  		this.easing = options.easing;

	  		this.start = getTime();
	  		this.end = this.start + this.duration;

	  		this.running = true;

	  		tickers.push(this);
	  		if (!running) rAF(tick);
	  	}

	  	Ticker.prototype.tick = function tick(now) {
	  		if (!this.running) return false;

	  		if (now > this.end) {
	  			if (this.step) this.step(1);
	  			if (this.complete) this.complete(1);

	  			return false;
	  		}

	  		var elapsed = now - this.start;
	  		var eased = this.easing(elapsed / this.duration);

	  		if (this.step) this.step(eased);

	  		return true;
	  	};

	  	Ticker.prototype.stop = function stop() {
	  		if (this.abort) this.abort();
	  		this.running = false;
	  	};

	  	return Ticker;
	  })();

	  var prefixers = {};

	  // TODO this is legacy. sooner we can replace the old adaptor API the better
	  function prefixKeypath(obj, prefix) {
	  	var prefixed = {},
	  	    key;

	  	if (!prefix) {
	  		return obj;
	  	}

	  	prefix += '.';

	  	for (key in obj) {
	  		if (obj.hasOwnProperty(key)) {
	  			prefixed[prefix + key] = obj[key];
	  		}
	  	}

	  	return prefixed;
	  }
	  function getPrefixer(rootKeypath) {
	  	var rootDot;

	  	if (!prefixers[rootKeypath]) {
	  		rootDot = rootKeypath ? rootKeypath + '.' : '';

	  		prefixers[rootKeypath] = function (relativeKeypath, value) {
	  			var obj;

	  			if (typeof relativeKeypath === 'string') {
	  				obj = {};
	  				obj[rootDot + relativeKeypath] = value;
	  				return obj;
	  			}

	  			if (typeof relativeKeypath === 'object') {
	  				// 'relativeKeypath' is in fact a hash, not a keypath
	  				return rootDot ? prefixKeypath(relativeKeypath, rootKeypath) : relativeKeypath;
	  			}
	  		};
	  	}

	  	return prefixers[rootKeypath];
	  }

	  var KeyModel = (function () {
	  	function KeyModel(key) {
	  		classCallCheck(this, KeyModel);

	  		this.value = key;
	  		this.isReadonly = true;
	  		this.dependants = [];
	  	}

	  	KeyModel.prototype.get = function get() {
	  		return this.value;
	  	};

	  	KeyModel.prototype.getKeypath = function getKeypath() {
	  		return this.value;
	  	};

	  	KeyModel.prototype.rebind = function rebind(key) {
	  		this.value = key;
	  		this.dependants.forEach(_handleChange);
	  	};

	  	KeyModel.prototype.register = function register(dependant) {
	  		this.dependants.push(dependant);
	  	};

	  	KeyModel.prototype.unregister = function unregister(dependant) {
	  		removeFromArray(this.dependants, dependant);
	  	};

	  	return KeyModel;
	  })();

	  var KeypathModel = (function () {
	  	function KeypathModel(parent, ractive) {
	  		classCallCheck(this, KeypathModel);

	  		this.parent = parent;
	  		this.ractive = ractive;
	  		this.value = ractive ? parent.getKeypath(ractive) : parent.getKeypath();
	  		this.dependants = [];
	  		this.children = [];
	  	}

	  	KeypathModel.prototype.addChild = function addChild(model) {
	  		this.children.push(model);
	  		model.owner = this;
	  	};

	  	KeypathModel.prototype.get = function get() {
	  		return this.value;
	  	};

	  	KeypathModel.prototype.getKeypath = function getKeypath() {
	  		return this.value;
	  	};

	  	KeypathModel.prototype.handleChange = function handleChange() {
	  		this.value = this.ractive ? this.parent.getKeypath(this.ractive) : this.parent.getKeypath();
	  		if (this.ractive && this.owner) {
	  			this.ractive.viewmodel.keypathModels[this.owner.value] = this;
	  		}
	  		this.children.forEach(_handleChange);
	  		this.dependants.forEach(_handleChange);
	  	};

	  	KeypathModel.prototype.register = function register(dependant) {
	  		this.dependants.push(dependant);
	  	};

	  	KeypathModel.prototype.removeChild = function removeChild(model) {
	  		removeFromArray(this.children, model);
	  	};

	  	KeypathModel.prototype.teardown = function teardown() {
	  		if (this.owner) this.owner.removeChild(this);
	  		this.children.forEach(_teardown);
	  	};

	  	KeypathModel.prototype.unregister = function unregister(dependant) {
	  		removeFromArray(this.dependants, dependant);
	  	};

	  	return KeypathModel;
	  })();

	  var hasProp$1 = Object.prototype.hasOwnProperty;

	  function _updateFromBindings(model) {
	  	model.updateFromBindings(true);
	  }

	  function _updateKeypathDependants(model) {
	  	model.updateKeypathDependants();
	  }

	  var originatingModel = null;

	  var Model = (function () {
	  	function Model(parent, key) {
	  		classCallCheck(this, Model);

	  		this.deps = [];

	  		this.children = [];
	  		this.childByKey = {};

	  		this.indexModels = [];

	  		this.unresolved = [];
	  		this.unresolvedByKey = {};

	  		this.bindings = [];

	  		this.value = undefined;

	  		this.ticker = null;

	  		if (parent) {
	  			this.parent = parent;
	  			this.root = parent.root;
	  			this.key = unescapeKey(key);
	  			this.isReadonly = parent.isReadonly;

	  			if (parent.value) {
	  				this.value = parent.value[this.key];
	  				this.adapt();
	  			}
	  		}
	  	}

	  	Model.prototype.adapt = function adapt() {
	  		var adaptors = this.root.adaptors;
	  		var len = adaptors.length;

	  		// Exit early if no adaptors
	  		if (len === 0) return;

	  		var value = this.value;

	  		// TODO remove this legacy nonsense
	  		var ractive = this.root.ractive;
	  		var keypath = this.getKeypath();

	  		var i = undefined;

	  		for (i = 0; i < len; i += 1) {
	  			var adaptor = adaptors[i];
	  			if (adaptor.filter(value, keypath, ractive)) {
	  				this.wrapper = adaptor.wrap(ractive, value, keypath, getPrefixer(keypath));
	  				this.wrapper.value = this.value;
	  				this.wrapper.__model = this; // massive temporary hack to enable array adaptor

	  				this.value = this.wrapper.get();

	  				break;
	  			}
	  		}
	  	};

	  	Model.prototype.addUnresolved = function addUnresolved(key, resolver) {
	  		if (!this.unresolvedByKey[key]) {
	  			this.unresolved.push(key);
	  			this.unresolvedByKey[key] = [];
	  		}

	  		this.unresolvedByKey[key].push(resolver);
	  	};

	  	Model.prototype.animate = function animate(from, to, options, interpolator) {
	  		var _this = this;

	  		if (this.ticker) this.ticker.stop();

	  		var fulfilPromise = undefined;
	  		var promise = new Promise$1(function (fulfil) {
	  			return fulfilPromise = fulfil;
	  		});

	  		this.ticker = new Ticker({
	  			duration: options.duration,
	  			easing: options.easing,
	  			step: function (t) {
	  				var value = interpolator(t);
	  				_this.applyValue(value);
	  				if (options.step) options.step(t, value);
	  			},
	  			complete: function () {
	  				_this.applyValue(to);
	  				if (options.complete) options.complete(to);

	  				_this.ticker = null;
	  				fulfilPromise();
	  			}
	  		});

	  		promise.stop = this.ticker.stop;
	  		return promise;
	  	};

	  	Model.prototype.applyValue = function applyValue(value) {
	  		if (isEqual(value, this.value)) return;

	  		// TODO deprecate this nonsense
	  		this.root.changes[this.getKeypath()] = value;

	  		if (this.parent.wrapper && this.parent.wrapper.set) {
	  			this.parent.wrapper.set(this.key, value);
	  			this.parent.value = this.parent.wrapper.get();

	  			this.value = this.parent.value[this.key];
	  			// TODO should this value be adapted? probably
	  		} else if (this.wrapper) {
	  				var shouldTeardown = !this.wrapper.reset || this.wrapper.reset(value) === false;

	  				if (shouldTeardown) {
	  					this.wrapper.teardown();
	  					this.wrapper = null;
	  					this.parent.value[this.key] = this.value = value;
	  					this.adapt();
	  				} else {
	  					this.value = this.wrapper.get();
	  				}
	  			} else {
	  				var parentValue = this.parent.value || this.parent.createBranch(this.key);
	  				parentValue[this.key] = value;

	  				this.value = value;
	  				this.adapt();
	  			}

	  		this.parent.clearUnresolveds();
	  		this.clearUnresolveds();

	  		// notify dependants
	  		var previousOriginatingModel = originatingModel; // for the array.length special case
	  		originatingModel = this;

	  		this.children.forEach(_mark);
	  		this.deps.forEach(_handleChange);

	  		var parent = this.parent;
	  		while (parent) {
	  			parent.deps.forEach(_handleChange);
	  			parent = parent.parent;
	  		}

	  		originatingModel = previousOriginatingModel;
	  	};

	  	Model.prototype.clearUnresolveds = function clearUnresolveds(specificKey) {
	  		var i = this.unresolved.length;

	  		while (i--) {
	  			var key = this.unresolved[i];

	  			if (specificKey && key !== specificKey) continue;

	  			var resolvers = this.unresolvedByKey[key];
	  			var hasKey = this.has(key);

	  			var j = resolvers.length;
	  			while (j--) {
	  				if (hasKey) resolvers[j].attemptResolution();
	  				if (resolvers[j].resolved) resolvers.splice(j, 1);
	  			}

	  			if (!resolvers.length) {
	  				this.unresolved.splice(i, 1);
	  				this.unresolvedByKey[key] = null;
	  			}
	  		}
	  	};

	  	Model.prototype.createBranch = function createBranch(key) {
	  		var branch = isNumeric(key) ? [] : {};
	  		this.set(branch);

	  		return branch;
	  	};

	  	Model.prototype.findMatches = function findMatches(keys) {
	  		var len = keys.length;

	  		var existingMatches = [this];
	  		var matches = undefined;
	  		var i = undefined;

	  		var _loop = function () {
	  			var key = keys[i];

	  			if (key === '*') {
	  				matches = [];
	  				existingMatches.forEach(function (model) {
	  					matches.push.apply(matches, model.getValueChildren(model.get()));
	  				});
	  			} else {
	  				matches = existingMatches.map(function (model) {
	  					return model.joinKey(key);
	  				});
	  			}

	  			existingMatches = matches;
	  		};

	  		for (i = 0; i < len; i += 1) {
	  			_loop();
	  		}

	  		return matches;
	  	};

	  	Model.prototype.get = function get(shouldCapture) {
	  		if (shouldCapture) capture(this);
	  		return this.value;
	  	};

	  	Model.prototype.getIndexModel = function getIndexModel(fragmentIndex) {
	  		var indexModels = this.parent.indexModels;

	  		// non-numeric keys are a special of a numeric index in a object iteration
	  		if (typeof this.key === 'string' && fragmentIndex !== undefined) {
	  			return new KeyModel(fragmentIndex);
	  		} else if (!indexModels[this.key]) {
	  			indexModels[this.key] = new KeyModel(this.key);
	  		}

	  		return indexModels[this.key];
	  	};

	  	Model.prototype.getKeyModel = function getKeyModel() {
	  		// TODO... different to IndexModel because key can never change
	  		return new KeyModel(escapeKey(this.key));
	  	};

	  	Model.prototype.getKeypathModel = function getKeypathModel(ractive) {
	  		var keypath = this.getKeypath(),
	  		    model = this.keypathModel || (this.keypathModel = new KeypathModel(this));

	  		if (ractive && ractive.component) {
	  			var mapped = this.getKeypath(ractive);
	  			if (mapped !== keypath) {
	  				var map = ractive.viewmodel.keypathModels || (ractive.viewmodel.keypathModels = {});
	  				var child = map[keypath] || (map[keypath] = new KeypathModel(this, ractive));
	  				model.addChild(child);
	  				return child;
	  			}
	  		}

	  		return model;
	  	};

	  	Model.prototype.getKeypath = function getKeypath(ractive) {
	  		var root = this.parent.isRoot ? escapeKey(this.key) : this.parent.getKeypath() + '.' + escapeKey(this.key);

	  		if (ractive && ractive.component) {
	  			var map = ractive.viewmodel.mappings;
	  			for (var k in map) {
	  				if (root.indexOf(map[k].getKeypath()) >= 0) {
	  					root = root.replace(map[k].getKeypath(), k);
	  					break;
	  				}
	  			}
	  		}

	  		return root;
	  	};

	  	Model.prototype.getValueChildren = function getValueChildren(value) {
	  		var _this2 = this;

	  		var children = undefined;
	  		if (isArray(value)) {
	  			children = [];
	  			// special case - array.length. This is a horrible kludge, but
	  			// it'll do for now. Alternatives welcome
	  			if (originatingModel && originatingModel.parent === this && originatingModel.key === 'length') {
	  				children.push(originatingModel);
	  			}
	  			value.forEach(function (m, i) {
	  				children.push(_this2.joinKey(i));
	  			});
	  		} else if (isObject(value) || typeof value === 'function') {
	  			children = Object.keys(value).map(function (key) {
	  				return _this2.joinKey(key);
	  			});
	  		} else if (value != null) {
	  			// TODO: this will return incorrect keypath if model is mapped
	  			throw new Error('Cannot get values of ' + this.getKeypath() + '.* as ' + this.getKeypath() + ' is not an array, object or function');
	  		}

	  		return children;
	  	};

	  	Model.prototype.has = function has(key) {
	  		var value = this.get();
	  		if (!value) return false;

	  		key = unescapeKey(key);
	  		if (hasProp$1.call(value, key)) return true;

	  		// We climb up the constructor chain to find if one of them contains the key
	  		var constructor = value.constructor;
	  		while (constructor !== Function && constructor !== Array && constructor !== Object) {
	  			if (hasProp$1.call(constructor.prototype, key)) return true;
	  			constructor = constructor.constructor;
	  		}

	  		return false;
	  	};

	  	Model.prototype.joinKey = function joinKey(key) {
	  		if (key === undefined || key === '') return this;

	  		if (!this.childByKey.hasOwnProperty(key)) {
	  			var child = new Model(this, key);
	  			this.children.push(child);
	  			this.childByKey[key] = child;
	  		}

	  		return this.childByKey[key];
	  	};

	  	Model.prototype.joinAll = function joinAll(keys) {
	  		var model = this;
	  		for (var i = 0; i < keys.length; i += 1) {
	  			model = model.joinKey(keys[i]);
	  		}

	  		return model;
	  	};

	  	Model.prototype.mark = function mark() {
	  		var value = this.retrieve();

	  		if (!isEqual(value, this.value)) {
	  			this.value = value;

	  			this.children.forEach(_mark);

	  			this.deps.forEach(_handleChange);
	  			this.clearUnresolveds();
	  		}
	  	};

	  	Model.prototype.merge = function merge(array, comparator) {
	  		var oldArray = comparator ? this.value.map(comparator) : this.value;
	  		var newArray = comparator ? array.map(comparator) : array;

	  		var oldLength = oldArray.length;

	  		var usedIndices = {};
	  		var firstUnusedIndex = 0;

	  		var newIndices = oldArray.map(function (item) {
	  			var index = undefined;
	  			var start = firstUnusedIndex;

	  			do {
	  				index = newArray.indexOf(item, start);

	  				if (index === -1) {
	  					return -1;
	  				}

	  				start = index + 1;
	  			} while (usedIndices[index] === true && start < oldLength);

	  			// keep track of the first unused index, so we don't search
	  			// the whole of newArray for each item in oldArray unnecessarily
	  			if (index === firstUnusedIndex) {
	  				firstUnusedIndex += 1;
	  			}
	  			// allow next instance of next "equal" to be found item
	  			usedIndices[index] = true;
	  			return index;
	  		});

	  		this.parent.value[this.key] = array;
	  		this._merged = true;
	  		this.shuffle(newIndices);
	  	};

	  	Model.prototype.register = function register(dep) {
	  		this.deps.push(dep);
	  	};

	  	Model.prototype.registerTwowayBinding = function registerTwowayBinding(binding) {
	  		this.bindings.push(binding);
	  	};

	  	Model.prototype.retrieve = function retrieve() {
	  		return this.parent.value ? this.parent.value[this.key] : undefined;
	  	};

	  	Model.prototype.set = function set(value) {
	  		if (this.ticker) this.ticker.stop();
	  		this.applyValue(value);
	  	};

	  	Model.prototype.shuffle = function shuffle(newIndices) {
	  		var _this3 = this;

	  		var indexModels = [];

	  		newIndices.forEach(function (newIndex, oldIndex) {
	  			if (! ~newIndex) return;

	  			var model = _this3.indexModels[oldIndex];

	  			if (!model) return;

	  			indexModels[newIndex] = model;

	  			if (newIndex !== oldIndex) {
	  				model.rebind(newIndex);
	  			}
	  		});

	  		this.indexModels = indexModels;

	  		// shuffles need to happen before marks...
	  		this.deps.forEach(function (dep) {
	  			if (dep.shuffle) dep.shuffle(newIndices);
	  		});

	  		this.updateKeypathDependants();
	  		this.mark();

	  		// ...but handleChange must happen after (TODO document why)
	  		this.deps.forEach(function (dep) {
	  			if (!dep.shuffle) dep.handleChange();
	  		});
	  	};

	  	Model.prototype.teardown = function teardown() {
	  		this.children.forEach(_teardown);
	  		if (this.wrapper) this.wrapper.teardown();
	  		if (this.keypathModels) {
	  			for (var k in this.keypathModels) {
	  				this.keypathModels[k].teardown();
	  			}
	  		}
	  	};

	  	Model.prototype.unregister = function unregister(dependant) {
	  		removeFromArray(this.deps, dependant);
	  	};

	  	Model.prototype.unregisterTwowayBinding = function unregisterTwowayBinding(binding) {
	  		removeFromArray(this.bindings, binding);
	  	};

	  	Model.prototype.updateFromBindings = function updateFromBindings(cascade) {
	  		var i = this.bindings.length;
	  		while (i--) {
	  			var value = this.bindings[i].getValue();
	  			if (value !== this.value) this.set(value);
	  		}

	  		if (cascade) {
	  			this.children.forEach(_updateFromBindings);
	  		}
	  	};

	  	Model.prototype.updateKeypathDependants = function updateKeypathDependants() {
	  		this.children.forEach(_updateKeypathDependants);
	  		if (this.keypathModel) this.keypathModel.handleChange();
	  	};

	  	return Model;
	  })();

	  var GlobalModel = (function (_Model) {
	  	inherits(GlobalModel, _Model);

	  	function GlobalModel() {
	  		classCallCheck(this, GlobalModel);

	  		_Model.call(this, null, '@global');
	  		this.value = typeof global !== 'undefined' ? global : window;
	  		this.isRoot = true;
	  		this.root = this;
	  		this.adaptors = [];
	  		this.changes = {};
	  	}

	  	GlobalModel.prototype.getKeypath = function getKeypath() {
	  		return '@global';
	  	};

	  	return GlobalModel;
	  })(Model);

	  var GlobalModel$1 = new GlobalModel();

	  function resolveReference(fragment, ref) {
	  	var context = fragment.findContext();

	  	// special references
	  	// TODO does `this` become `.` at parse time?
	  	if (ref === '.' || ref === 'this') return context;
	  	if (ref === '@keypath') return context.getKeypathModel(fragment.ractive);
	  	if (ref === '@rootpath') return context.getKeypathModel();
	  	if (ref === '@index') {
	  		var repeater = fragment.findRepeatingFragment();
	  		// make sure the found fragment is actually an iteration
	  		if (!repeater.isIteration) return;
	  		return repeater.context.getIndexModel(repeater.index);
	  	}
	  	if (ref === '@key') return fragment.findRepeatingFragment().context.getKeyModel();
	  	if (ref === '@ractive') {
	  		return fragment.ractive.viewmodel.getRactiveModel();
	  	}
	  	if (ref === '@global') {
	  		return GlobalModel$1;
	  	}

	  	// ancestor references
	  	if (ref[0] === '~') return fragment.ractive.viewmodel.joinAll(splitKeypath(ref.slice(2)));
	  	if (ref[0] === '.') {
	  		var parts = ref.split('/');

	  		while (parts[0] === '.' || parts[0] === '..') {
	  			var part = parts.shift();

	  			if (part === '..') {
	  				context = context.parent;
	  			}
	  		}

	  		ref = parts.join('/');

	  		// special case - `{{.foo}}` means the same as `{{./foo}}`
	  		if (ref[0] === '.') ref = ref.slice(1);
	  		return context.joinAll(splitKeypath(ref));
	  	}

	  	return resolveAmbiguousReference(fragment, ref);
	  }

	  var ComputationChild = (function (_Model) {
	  	inherits(ComputationChild, _Model);

	  	function ComputationChild() {
	  		classCallCheck(this, ComputationChild);

	  		_Model.apply(this, arguments);
	  	}

	  	ComputationChild.prototype.get = function get(shouldCapture) {
	  		if (shouldCapture) capture(this);

	  		var parentValue = this.parent.get();
	  		return parentValue ? parentValue[this.key] : undefined;
	  	};

	  	ComputationChild.prototype.handleChange = function handleChange() {
	  		this.dirty = true;

	  		this.deps.forEach(_handleChange);
	  		this.children.forEach(_handleChange);
	  		this.clearUnresolveds(); // TODO is this necessary?
	  	};

	  	ComputationChild.prototype.joinKey = function joinKey(key) {
	  		if (key === undefined || key === '') return this;

	  		if (!this.childByKey.hasOwnProperty(key)) {
	  			var child = new ComputationChild(this, key);
	  			this.children.push(child);
	  			this.childByKey[key] = child;
	  		}

	  		return this.childByKey[key];
	  	};

	  	// TODO this causes problems with inter-component mappings
	  	// set () {
	  	// 	throw new Error( `Cannot set read-only property of computed value (${this.getKeypath()})` );
	  	// }
	  	return ComputationChild;
	  })(Model);

	  function getValue(model) {
	  	return model ? model.get(true) : undefined;
	  }

	  var ExpressionProxy = (function (_Model) {
	  	inherits(ExpressionProxy, _Model);

	  	function ExpressionProxy(fragment, template) {
	  		var _this = this;

	  		classCallCheck(this, ExpressionProxy);

	  		_Model.call(this, fragment.ractive.viewmodel, null);

	  		this.fragment = fragment;
	  		this.template = template;

	  		this.isReadonly = true;

	  		this.fn = getFunction(template.s, template.r.length);
	  		this.computation = null;

	  		this.resolvers = [];
	  		this.models = this.template.r.map(function (ref, index) {
	  			var model = resolveReference(_this.fragment, ref);
	  			var resolver = undefined;

	  			if (!model) {
	  				resolver = _this.fragment.resolve(ref, function (model) {
	  					removeFromArray(_this.resolvers, resolver);
	  					_this.models[index] = model;
	  					_this.bubble();
	  				});

	  				_this.resolvers.push(resolver);
	  			}

	  			return model;
	  		});

	  		this.bubble();
	  	}

	  	ExpressionProxy.prototype.bubble = function bubble() {
	  		var _this2 = this;

	  		var ractive = this.fragment.ractive;

	  		// TODO the @ prevents computed props from shadowing keypaths, but the real
	  		// question is why it's a computed prop in the first place... (hint, it's
	  		// to do with {{else}} blocks)
	  		var key = '@' + this.template.s.replace(/_(\d+)/g, function (match, i) {
	  			if (i >= _this2.models.length) return match;

	  			var model = _this2.models[i];
	  			return model ? model.getKeypath() : '@undefined';
	  		});

	  		// TODO can/should we reuse computations?
	  		var signature = {
	  			getter: function () {
	  				var values = _this2.models.map(getValue);
	  				return _this2.fn.apply(ractive, values);
	  			},
	  			getterString: key
	  		};

	  		var computation = ractive.viewmodel.compute(key, signature);

	  		this.value = computation.get(); // TODO should not need this, eventually

	  		if (this.computation) {
	  			this.computation.unregister(this);
	  			// notify children...
	  		}

	  		this.computation = computation;
	  		computation.register(this);

	  		this.handleChange();
	  	};

	  	ExpressionProxy.prototype.get = function get(shouldCapture) {
	  		return this.computation.get(shouldCapture);
	  	};

	  	ExpressionProxy.prototype.getKeypath = function getKeypath() {
	  		return this.computation ? this.computation.getKeypath() : '@undefined';
	  	};

	  	ExpressionProxy.prototype.handleChange = function handleChange() {
	  		this.deps.forEach(_handleChange);
	  		this.children.forEach(_handleChange);

	  		this.clearUnresolveds();
	  	};

	  	ExpressionProxy.prototype.joinKey = function joinKey(key) {
	  		if (key === undefined || key === '') return this;

	  		if (!this.childByKey.hasOwnProperty(key)) {
	  			var child = new ComputationChild(this, key);
	  			this.children.push(child);
	  			this.childByKey[key] = child;
	  		}

	  		return this.childByKey[key];
	  	};

	  	ExpressionProxy.prototype.mark = function mark() {
	  		this.handleChange();
	  	};

	  	ExpressionProxy.prototype.retrieve = function retrieve() {
	  		return this.get();
	  	};

	  	ExpressionProxy.prototype.unbind = function unbind() {
	  		this.resolvers.forEach(_unbind);
	  	};

	  	return ExpressionProxy;
	  })(Model);

	  var ReferenceExpressionProxy = (function (_Model) {
	  	inherits(ReferenceExpressionProxy, _Model);

	  	function ReferenceExpressionProxy(fragment, template) {
	  		var _this = this;

	  		classCallCheck(this, ReferenceExpressionProxy);

	  		_Model.call(this, null, null);
	  		this.root = fragment.ractive.viewmodel;

	  		this.resolvers = [];

	  		this.base = resolve$1(fragment, template);
	  		var baseResolver = undefined;

	  		if (!this.base) {
	  			baseResolver = fragment.resolve(template.r, function (model) {
	  				_this.base = model;
	  				_this.bubble();

	  				removeFromArray(_this.resolvers, baseResolver);
	  			});

	  			this.resolvers.push(baseResolver);
	  		}

	  		var intermediary = {
	  			handleChange: function () {
	  				return _this.bubble();
	  			}
	  		};

	  		this.members = template.m.map(function (template, i) {
	  			if (typeof template === 'string') {
	  				return { get: function () {
	  						return template;
	  					} };
	  			}

	  			var model = undefined;
	  			var resolver = undefined;

	  			if (template.t === REFERENCE) {
	  				model = resolveReference(fragment, template.n);

	  				if (model) {
	  					model.register(intermediary);
	  				} else {
	  					resolver = fragment.resolve(template.n, function (model) {
	  						_this.members[i] = model;

	  						model.register(intermediary);
	  						_this.bubble();

	  						removeFromArray(_this.resolvers, resolver);
	  					});

	  					_this.resolvers.push(resolver);
	  				}

	  				return model;
	  			}

	  			model = new ExpressionProxy(fragment, template);
	  			model.register(intermediary);
	  			return model;
	  		});

	  		this.isUnresolved = true;
	  		this.bubble();
	  	}

	  	ReferenceExpressionProxy.prototype.bubble = function bubble() {
	  		if (!this.base) return;

	  		// if some members are not resolved, abort
	  		var i = this.members.length;
	  		while (i--) {
	  			if (!this.members[i]) return;
	  		}

	  		this.isUnresolved = false;

	  		var keys = this.members.map(function (model) {
	  			return escapeKey(String(model.get()));
	  		});
	  		var model = this.base.joinAll(keys);

	  		if (this.model) {
	  			this.model.unregister(this);
	  			this.model.unregisterTwowayBinding(this);
	  		}

	  		this.model = model;
	  		this.parent = model.parent;

	  		model.register(this);
	  		model.registerTwowayBinding(this);

	  		if (this.keypathModel) this.keypathModel.handleChange();

	  		this.mark();
	  	};

	  	ReferenceExpressionProxy.prototype.forceResolution = function forceResolution() {
	  		this.resolvers.forEach(function (resolver) {
	  			return resolver.forceResolution();
	  		});
	  		this.bubble();
	  	};

	  	ReferenceExpressionProxy.prototype.get = function get() {
	  		return this.model ? this.model.get() : undefined;
	  	};

	  	// indirect two-way bindings

	  	ReferenceExpressionProxy.prototype.getValue = function getValue() {
	  		var i = this.bindings.length;
	  		while (i--) {
	  			var value = this.bindings[i].getValue();
	  			if (value !== this.value) return value;
	  		}

	  		return this.value;
	  	};

	  	ReferenceExpressionProxy.prototype.getKeypath = function getKeypath() {
	  		return this.model ? this.model.getKeypath() : '@undefined';
	  	};

	  	ReferenceExpressionProxy.prototype.handleChange = function handleChange() {
	  		this.mark();
	  	};

	  	ReferenceExpressionProxy.prototype.retrieve = function retrieve() {
	  		return this.get();
	  	};

	  	ReferenceExpressionProxy.prototype.set = function set(value) {
	  		if (!this.model) throw new Error('Unresolved reference expression. This should not happen!');
	  		this.model.set(value);
	  	};

	  	ReferenceExpressionProxy.prototype.unbind = function unbind() {
	  		this.resolvers.forEach(_unbind);
	  	};

	  	return ReferenceExpressionProxy;
	  })(Model);

	  function resolve$1(fragment, template) {
	  	if (template.r) {
	  		return resolveReference(fragment, template.r);
	  	} else if (template.x) {
	  		return new ExpressionProxy(fragment, template.x);
	  	} else {
	  		return new ReferenceExpressionProxy(fragment, template.rx);
	  	}
	  }

	  function resolveAliases(section) {
	  	if (section.template.z) {
	  		section.aliases = {};

	  		var refs = section.template.z;
	  		for (var i = 0; i < refs.length; i++) {
	  			section.aliases[refs[i].n] = resolve$1(section.parentFragment, refs[i].x);
	  		}
	  	}
	  }

	  var Alias = (function (_Item) {
	  	inherits(Alias, _Item);

	  	function Alias(options) {
	  		classCallCheck(this, Alias);

	  		_Item.call(this, options);

	  		this.fragment = null;
	  	}

	  	Alias.prototype.bind = function bind() {
	  		resolveAliases(this);

	  		this.fragment = new Fragment({
	  			owner: this,
	  			template: this.template.f
	  		}).bind();
	  	};

	  	Alias.prototype.detach = function detach() {
	  		return this.fragment ? this.fragment.detach() : createDocumentFragment();
	  	};

	  	Alias.prototype.find = function find(selector) {
	  		if (this.fragment) {
	  			return this.fragment.find(selector);
	  		}
	  	};

	  	Alias.prototype.findAll = function findAll(selector, query) {
	  		if (this.fragment) {
	  			this.fragment.findAll(selector, query);
	  		}
	  	};

	  	Alias.prototype.findComponent = function findComponent(name) {
	  		if (this.fragment) {
	  			return this.fragment.findComponent(name);
	  		}
	  	};

	  	Alias.prototype.findAllComponents = function findAllComponents(name, query) {
	  		if (this.fragment) {
	  			this.fragment.findAllComponents(name, query);
	  		}
	  	};

	  	Alias.prototype.firstNode = function firstNode() {
	  		return this.fragment && this.fragment.firstNode();
	  	};

	  	Alias.prototype.rebind = function rebind() {
	  		resolveAliases(this);
	  		if (this.fragment) this.fragment.rebind();
	  	};

	  	Alias.prototype.render = function render(target) {
	  		this.rendered = true;
	  		if (this.fragment) this.fragment.render(target);
	  	};

	  	Alias.prototype.toString = function toString(escape) {
	  		return this.fragment ? this.fragment.toString(escape) : '';
	  	};

	  	Alias.prototype.unbind = function unbind() {
	  		this.aliases = {};
	  		if (this.fragment) this.fragment.unbind();
	  	};

	  	Alias.prototype.unrender = function unrender(shouldDestroy) {
	  		if (this.rendered && this.fragment) this.fragment.unrender(shouldDestroy);
	  		this.rendered = false;
	  	};

	  	Alias.prototype.update = function update() {
	  		if (!this.dirty) return;

	  		this.fragment.update();

	  		this.dirty = false;
	  	};

	  	return Alias;
	  })(Item);

	  var Doctype = (function (_Item) {
	  	inherits(Doctype, _Item);

	  	function Doctype() {
	  		classCallCheck(this, Doctype);

	  		_Item.apply(this, arguments);
	  	}

	  	Doctype.prototype.bind = function bind() {
	  		// noop
	  	};

	  	Doctype.prototype.render = function render() {
	  		// noop
	  	};

	  	Doctype.prototype.teardown = function teardown() {
	  		// noop
	  	};

	  	Doctype.prototype.toString = function toString() {
	  		return '<!DOCTYPE' + this.template.a + '>';
	  	};

	  	Doctype.prototype.unbind = function unbind() {
	  		// noop
	  	};

	  	Doctype.prototype.unrender = function unrender() {
	  		// noop
	  	};

	  	return Doctype;
	  })(Item);

	  var Mustache = (function (_Item) {
	  	inherits(Mustache, _Item);

	  	function Mustache(options) {
	  		classCallCheck(this, Mustache);

	  		_Item.call(this, options);

	  		this.parentFragment = options.parentFragment;
	  		this.template = options.template;
	  		this.index = options.index;

	  		this.isStatic = !!options.template.s;

	  		this.model = null;
	  		this.dirty = false;
	  	}

	  	Mustache.prototype.bind = function bind() {
	  		var _this = this;

	  		// try to find a model for this view
	  		var model = resolve$1(this.parentFragment, this.template);
	  		var value = model ? model.get() : undefined;

	  		if (this.isStatic) {
	  			this.model = { get: function () {
	  					return value;
	  				} };
	  			return;
	  		}

	  		if (model) {
	  			model.register(this);
	  			this.model = model;
	  		} else {
	  			this.resolver = this.parentFragment.resolve(this.template.r, function (model) {
	  				_this.model = model;
	  				model.register(_this);

	  				_this.handleChange();
	  				_this.resolver = null;
	  			});
	  		}
	  	};

	  	Mustache.prototype.handleChange = function handleChange() {
	  		this.bubble();
	  	};

	  	Mustache.prototype.rebind = function rebind() {
	  		if (this.isStatic || !this.model) return;

	  		var model = resolve$1(this.parentFragment, this.template);

	  		if (model === this.model) return;

	  		this.model.unregister(this);

	  		this.model = model;

	  		if (model) {
	  			model.register(this);
	  			this.handleChange();
	  		}
	  	};

	  	Mustache.prototype.unbind = function unbind() {
	  		if (!this.isStatic) {
	  			this.model && this.model.unregister(this);
	  			this.model = undefined;
	  			this.resolver && this.resolver.unbind();
	  		}
	  	};

	  	return Mustache;
	  })(Item);

	  var Interpolator = (function (_Mustache) {
	  	inherits(Interpolator, _Mustache);

	  	function Interpolator() {
	  		classCallCheck(this, Interpolator);

	  		_Mustache.apply(this, arguments);
	  	}

	  	Interpolator.prototype.detach = function detach() {
	  		return detachNode(this.node);
	  	};

	  	Interpolator.prototype.firstNode = function firstNode() {
	  		return this.node;
	  	};

	  	Interpolator.prototype.getString = function getString() {
	  		return this.model ? safeToStringValue(this.model.get()) : '';
	  	};

	  	Interpolator.prototype.render = function render(target, occupants) {
	  		var value = this.getString();

	  		this.rendered = true;

	  		if (occupants) {
	  			var n = occupants[0];
	  			if (n && n.nodeType === 3) {
	  				occupants.shift();
	  				if (n.nodeValue !== value) {
	  					n.nodeValue = value;
	  				}
	  			} else {
	  				n = this.node = doc.createTextNode(value);
	  				if (occupants[0]) {
	  					target.insertBefore(n, occupants[0]);
	  				} else {
	  					target.appendChild(n);
	  				}
	  			}

	  			this.node = n;
	  		} else {
	  			this.node = doc.createTextNode(value);
	  			target.appendChild(this.node);
	  		}
	  	};

	  	Interpolator.prototype.toString = function toString(escape) {
	  		var string = this.getString();
	  		return escape ? escapeHtml(string) : string;
	  	};

	  	Interpolator.prototype.unrender = function unrender(shouldDestroy) {
	  		if (shouldDestroy) this.detach();
	  		this.rendered = false;
	  	};

	  	Interpolator.prototype.update = function update() {
	  		if (this.dirty) {
	  			if (this.rendered) {
	  				this.node.data = this.getString();
	  			}

	  			this.dirty = false;
	  		}
	  	};

	  	Interpolator.prototype.valueOf = function valueOf() {
	  		return this.model ? this.model.get() : undefined;
	  	};

	  	return Interpolator;
	  })(Mustache);

	  function findInViewHierarchy(registryName, ractive, name) {
	  	var instance = findInstance(registryName, ractive, name);
	  	return instance ? instance[registryName][name] : null;
	  }

	  function findInstance(registryName, ractive, name) {
	  	while (ractive) {
	  		if (name in ractive[registryName]) {
	  			return ractive;
	  		}

	  		if (ractive.isolated) {
	  			return null;
	  		}

	  		ractive = ractive.parent;
	  	}
	  }

	  function getPartialTemplate(ractive, name, parentFragment) {
	  	// If the partial in instance or view heirarchy instances, great
	  	var partial = getPartialFromRegistry(ractive, name, parentFragment || {});
	  	if (partial) return partial;

	  	// Does it exist on the page as a script tag?
	  	partial = parser.fromId(name, { noThrow: true });
	  	if (partial) {
	  		// parse and register to this ractive instance
	  		var parsed = parser.parseFor(partial, ractive);

	  		// register extra partials on the ractive instance if they don't already exist
	  		if (parsed.p) fillGaps(ractive.partials, parsed.p);

	  		// register (and return main partial if there are others in the template)
	  		return ractive.partials[name] = parsed.t;
	  	}
	  }

	  function getPartialFromRegistry(ractive, name, parentFragment) {
	  	// if there was an instance up-hierarchy, cool
	  	var partial = findParentPartial(name, parentFragment.owner);
	  	if (partial) return partial;

	  	// find first instance in the ractive or view hierarchy that has this partial
	  	var instance = findInstance('partials', ractive, name);

	  	if (!instance) {
	  		return;
	  	}

	  	partial = instance.partials[name];

	  	// partial is a function?
	  	var fn = undefined;
	  	if (typeof partial === 'function') {
	  		fn = partial.bind(instance);
	  		fn.isOwner = instance.partials.hasOwnProperty(name);
	  		partial = fn.call(ractive, parser);
	  	}

	  	if (!partial && partial !== '') {
	  		warnIfDebug(noRegistryFunctionReturn, name, 'partial', 'partial', { ractive: ractive });
	  		return;
	  	}

	  	// If this was added manually to the registry,
	  	// but hasn't been parsed, parse it now
	  	if (!parser.isParsed(partial)) {
	  		// use the parseOptions of the ractive instance on which it was found
	  		var parsed = parser.parseFor(partial, instance);

	  		// Partials cannot contain nested partials!
	  		// TODO add a test for this
	  		if (parsed.p) {
	  			warnIfDebug('Partials ({{>%s}}) cannot contain nested inline partials', name, { ractive: ractive });
	  		}

	  		// if fn, use instance to store result, otherwise needs to go
	  		// in the correct point in prototype chain on instance or constructor
	  		var target = fn ? instance : findOwner(instance, name);

	  		// may be a template with partials, which need to be registered and main template extracted
	  		target.partials[name] = partial = parsed.t;
	  	}

	  	// store for reset
	  	if (fn) partial._fn = fn;

	  	return partial.v ? partial.t : partial;
	  }

	  function findOwner(ractive, key) {
	  	return ractive.partials.hasOwnProperty(key) ? ractive : findConstructor(ractive.constructor, key);
	  }

	  function findConstructor(constructor, key) {
	  	if (!constructor) {
	  		return;
	  	}
	  	return constructor.partials.hasOwnProperty(key) ? constructor : findConstructor(constructor._Parent, key);
	  }

	  function findParentPartial(name, parent) {
	  	if (parent) {
	  		if (parent.template && parent.template.p && parent.template.p[name]) {
	  			return parent.template.p[name];
	  		} else if (parent.parentFragment && parent.parentFragment.owner) {
	  			return findParentPartial(name, parent.parentFragment.owner);
	  		}
	  	}
	  }

	  var Partial = (function (_Mustache) {
	  	inherits(Partial, _Mustache);

	  	function Partial() {
	  		classCallCheck(this, Partial);

	  		_Mustache.apply(this, arguments);
	  	}

	  	Partial.prototype.bind = function bind() {
	  		// keep track of the reference name for future resets
	  		this.refName = this.template.r;

	  		// name matches take priority over expressions
	  		var template = this.refName ? getPartialTemplate(this.ractive, this.refName, this.parentFragment) || null : null;
	  		var templateObj = undefined;

	  		if (template) {
	  			this.named = true;
	  			this.setTemplate(this.template.r, template);
	  		}

	  		if (!template) {
	  			_Mustache.prototype.bind.call(this);
	  			if (this.model && (templateObj = this.model.get()) && typeof templateObj === 'object' && (typeof templateObj.template === 'string' || isArray(templateObj.t))) {
	  				if (templateObj.template) {
	  					templateObj = parsePartial(this.template.r, templateObj.template, this.ractive);
	  				}
	  				this.setTemplate(this.template.r, templateObj.t);
	  			} else if ((!this.model || typeof this.model.get() !== 'string') && this.refName) {
	  				this.setTemplate(this.refName, template);
	  			} else {
	  				this.setTemplate(this.model.get());
	  			}
	  		}

	  		this.fragment = new Fragment({
	  			owner: this,
	  			template: this.partialTemplate
	  		}).bind();
	  	};

	  	Partial.prototype.detach = function detach() {
	  		return this.fragment.detach();
	  	};

	  	Partial.prototype.find = function find(selector) {
	  		return this.fragment.find(selector);
	  	};

	  	Partial.prototype.findAll = function findAll(selector, query) {
	  		this.fragment.findAll(selector, query);
	  	};

	  	Partial.prototype.findComponent = function findComponent(name) {
	  		return this.fragment.findComponent(name);
	  	};

	  	Partial.prototype.findAllComponents = function findAllComponents(name, query) {
	  		this.fragment.findAllComponents(name, query);
	  	};

	  	Partial.prototype.firstNode = function firstNode() {
	  		return this.fragment.firstNode();
	  	};

	  	Partial.prototype.forceResetTemplate = function forceResetTemplate() {
	  		this.partialTemplate = undefined;

	  		// on reset, check for the reference name first
	  		if (this.refName) {
	  			this.partialTemplate = getPartialTemplate(this.ractive, this.refName, this.parentFragment);
	  		}

	  		// then look for the resolved name
	  		if (!this.partialTemplate) {
	  			this.partialTemplate = getPartialTemplate(this.ractive, this.name, this.parentFragment);
	  		}

	  		if (!this.partialTemplate) {
	  			warnOnceIfDebug('Could not find template for partial \'' + this.name + '\'');
	  			this.partialTemplate = [];
	  		}

	  		this.fragment.resetTemplate(this.partialTemplate);
	  		this.bubble();
	  	};

	  	Partial.prototype.rebind = function rebind() {
	  		_Mustache.prototype.unbind.call(this);
	  		_Mustache.prototype.bind.call(this);
	  		this.fragment.rebind();
	  	};

	  	Partial.prototype.render = function render(target, occupants) {
	  		this.fragment.render(target, occupants);
	  	};

	  	Partial.prototype.setTemplate = function setTemplate(name, template) {
	  		this.name = name;

	  		if (!template && template !== null) template = getPartialTemplate(this.ractive, name, this.parentFragment);

	  		if (!template) {
	  			warnOnceIfDebug('Could not find template for partial \'' + name + '\'');
	  		}

	  		this.partialTemplate = template || [];
	  	};

	  	Partial.prototype.toString = function toString(escape) {
	  		return this.fragment.toString(escape);
	  	};

	  	Partial.prototype.unbind = function unbind() {
	  		_Mustache.prototype.unbind.call(this);
	  		this.fragment.unbind();
	  	};

	  	Partial.prototype.unrender = function unrender(shouldDestroy) {
	  		this.fragment.unrender(shouldDestroy);
	  	};

	  	Partial.prototype.update = function update() {
	  		var template = undefined;

	  		if (this.dirty) {
	  			if (!this.named) {
	  				if (this.model) {
	  					template = this.model.get();
	  				}

	  				if (template && typeof template === 'string' && template !== this.name) {
	  					this.setTemplate(template);
	  					this.fragment.resetTemplate(this.partialTemplate);
	  				} else if (template && typeof template === 'object' && (typeof template.template === 'string' || isArray(template.t))) {
	  					if (template.template) {
	  						template = parsePartial(this.name, template.template, this.ractive);
	  					}
	  					this.setTemplate(this.name, template.t);
	  					this.fragment.resetTemplate(this.partialTemplate);
	  				}
	  			}

	  			this.fragment.update();
	  			this.dirty = false;
	  		}
	  	};

	  	return Partial;
	  })(Mustache);

	  function parsePartial(name, partial, ractive) {
	  	var parsed = undefined;

	  	try {
	  		parsed = parser.parse(partial, parser.getParseOptions(ractive));
	  	} catch (e) {
	  		warnIfDebug('Could not parse partial from expression \'' + name + '\'\n' + e.message);
	  	}

	  	return parsed || { t: [] };
	  }

	  function getRefs(ref, value, parent) {
	  	var refs = undefined;

	  	if (ref) {
	  		refs = {};
	  		Object.keys(parent).forEach(function (ref) {
	  			refs[ref] = parent[ref];
	  		});
	  		refs[ref] = value;
	  	} else {
	  		refs = parent;
	  	}

	  	return refs;
	  }

	  var RepeatedFragment = (function () {
	  	function RepeatedFragment(options) {
	  		classCallCheck(this, RepeatedFragment);

	  		this.parent = options.owner.parentFragment;

	  		// bit of a hack, so reference resolution works without another
	  		// layer of indirection
	  		this.parentFragment = this;
	  		this.owner = options.owner;
	  		this.ractive = this.parent.ractive;

	  		// encapsulated styles should be inherited until they get applied by an element
	  		this.cssIds = 'cssIds' in options ? options.cssIds : this.parent ? this.parent.cssIds : null;

	  		this.context = null;
	  		this.rendered = false;
	  		this.iterations = [];

	  		this.template = options.template;

	  		this.indexRef = options.indexRef;
	  		this.keyRef = options.keyRef;
	  		this.indexByKey = null; // for `{{#each object}}...`

	  		this.pendingNewIndices = null;
	  		this.previousIterations = null;

	  		// track array versus object so updates of type rest
	  		this.isArray = false;
	  	}

	  	RepeatedFragment.prototype.bind = function bind(context) {
	  		var _this = this;

	  		this.context = context;
	  		var value = context.get();

	  		// {{#each array}}...
	  		if (this.isArray = isArray(value)) {
	  			// we can't use map, because of sparse arrays
	  			this.iterations = [];
	  			for (var i = 0; i < value.length; i += 1) {
	  				this.iterations[i] = this.createIteration(i, i);
	  			}
	  		}

	  		// {{#each object}}...
	  		else if (isObject(value)) {
	  				this.isArray = false;

	  				// TODO this is a dreadful hack. There must be a neater way
	  				if (this.indexRef) {
	  					var refs = this.indexRef.split(',');
	  					this.keyRef = refs[0];
	  					this.indexRef = refs[1];
	  				}

	  				this.indexByKey = {};
	  				this.iterations = Object.keys(value).map(function (key, index) {
	  					_this.indexByKey[key] = index;
	  					return _this.createIteration(key, index);
	  				});
	  			}

	  		return this;
	  	};

	  	RepeatedFragment.prototype.bubble = function bubble() {
	  		this.owner.bubble();
	  	};

	  	RepeatedFragment.prototype.createIteration = function createIteration(key, index) {
	  		var parentFragment = this.owner.parentFragment;
	  		var keyRefs = getRefs(this.keyRef, key, parentFragment.keyRefs);
	  		var indexRefs = getRefs(this.indexRef, index, parentFragment.indexRefs);

	  		var fragment = new Fragment({
	  			owner: this,
	  			template: this.template,
	  			indexRefs: indexRefs,
	  			keyRefs: keyRefs
	  		});

	  		// TODO this is a bit hacky
	  		fragment.key = key;
	  		fragment.index = index;
	  		fragment.isIteration = true;

	  		var model = this.context.joinKey(key);

	  		// set up an iteration alias if there is one
	  		if (this.owner.template.z) {
	  			fragment.aliases = {};
	  			fragment.aliases[this.owner.template.z[0].n] = model;
	  		}

	  		return fragment.bind(model);
	  	};

	  	RepeatedFragment.prototype.detach = function detach() {
	  		var docFrag = createDocumentFragment();
	  		this.iterations.forEach(function (fragment) {
	  			return docFrag.appendChild(fragment.detach());
	  		});
	  		return docFrag;
	  	};

	  	RepeatedFragment.prototype.find = function find(selector) {
	  		var len = this.iterations.length;
	  		var i = undefined;

	  		for (i = 0; i < len; i += 1) {
	  			var found = this.iterations[i].find(selector);
	  			if (found) return found;
	  		}
	  	};

	  	RepeatedFragment.prototype.findAll = function findAll(selector, query) {
	  		var len = this.iterations.length;
	  		var i = undefined;

	  		for (i = 0; i < len; i += 1) {
	  			this.iterations[i].findAll(selector, query);
	  		}
	  	};

	  	RepeatedFragment.prototype.findComponent = function findComponent(name) {
	  		var len = this.iterations.length;
	  		var i = undefined;

	  		for (i = 0; i < len; i += 1) {
	  			var found = this.iterations[i].findComponent(name);
	  			if (found) return found;
	  		}
	  	};

	  	RepeatedFragment.prototype.findAllComponents = function findAllComponents(name, query) {
	  		var len = this.iterations.length;
	  		var i = undefined;

	  		for (i = 0; i < len; i += 1) {
	  			this.iterations[i].findAllComponents(name, query);
	  		}
	  	};

	  	RepeatedFragment.prototype.findNextNode = function findNextNode(iteration) {
	  		if (iteration.index < this.iterations.length - 1) {
	  			for (var i = iteration.index + 1; i < this.iterations.length; i++) {
	  				var node = this.iterations[i].firstNode();
	  				if (node) return node;
	  			}
	  		}

	  		return this.owner.findNextNode();
	  	};

	  	RepeatedFragment.prototype.firstNode = function firstNode() {
	  		return this.iterations[0] ? this.iterations[0].firstNode() : null;
	  	};

	  	RepeatedFragment.prototype.rebind = function rebind(context) {
	  		var _this2 = this;

	  		this.context = context;

	  		this.iterations.forEach(function (fragment) {
	  			var model = context.joinKey(fragment.key || fragment.index);
	  			if (_this2.owner.template.z) {
	  				fragment.aliases = {};
	  				fragment.aliases[_this2.owner.template.z[0].n] = model;
	  			}
	  			fragment.rebind(model);
	  		});
	  	};

	  	RepeatedFragment.prototype.render = function render(target, occupants) {
	  		// TODO use docFrag.cloneNode...

	  		if (this.iterations) {
	  			this.iterations.forEach(function (fragment) {
	  				return fragment.render(target, occupants);
	  			});
	  		}

	  		this.rendered = true;
	  	};

	  	RepeatedFragment.prototype.shuffle = function shuffle(newIndices) {
	  		var _this3 = this;

	  		if (!this.pendingNewIndices) this.previousIterations = this.iterations.slice();

	  		if (!this.pendingNewIndices) this.pendingNewIndices = [];

	  		this.pendingNewIndices.push(newIndices);

	  		var iterations = [];

	  		newIndices.forEach(function (newIndex, oldIndex) {
	  			if (newIndex === -1) return;

	  			var fragment = _this3.iterations[oldIndex];
	  			iterations[newIndex] = fragment;

	  			if (newIndex !== oldIndex && fragment) fragment.dirty = true;
	  		});

	  		this.iterations = iterations;

	  		this.bubble();
	  	};

	  	RepeatedFragment.prototype.toString = function toString(escape) {
	  		return this.iterations ? this.iterations.map(escape ? toEscapedString : _toString).join('') : '';
	  	};

	  	RepeatedFragment.prototype.unbind = function unbind() {
	  		this.iterations.forEach(_unbind);
	  		return this;
	  	};

	  	RepeatedFragment.prototype.unrender = function unrender(shouldDestroy) {
	  		this.iterations.forEach(shouldDestroy ? unrenderAndDestroy$1 : _unrender);
	  		if (this.pendingNewIndices && this.previousIterations) {
	  			this.previousIterations.forEach(function (fragment) {
	  				if (fragment.rendered) shouldDestroy ? unrenderAndDestroy$1(fragment) : _unrender(fragment);
	  			});
	  		}
	  		this.rendered = false;
	  	};

	  	// TODO smart update

	  	RepeatedFragment.prototype.update = function update() {
	  		var _this4 = this;

	  		// skip dirty check, since this is basically just a facade

	  		if (this.pendingNewIndices) {
	  			this.updatePostShuffle();
	  			return;
	  		}

	  		var value = this.context.get(),
	  		    wasArray = this.isArray;

	  		var toRemove = undefined;
	  		var oldKeys = undefined;
	  		var reset = true;
	  		var i = undefined;

	  		if (this.isArray = isArray(value)) {
	  			if (wasArray) {
	  				reset = false;
	  				if (this.iterations.length > value.length) {
	  					toRemove = this.iterations.splice(value.length);
	  				}
	  			}
	  		} else if (isObject(value) && !wasArray) {
	  			reset = false;
	  			toRemove = [];
	  			oldKeys = {};
	  			i = this.iterations.length;

	  			while (i--) {
	  				var _fragment = this.iterations[i];
	  				if (_fragment.key in value) {
	  					oldKeys[_fragment.key] = true;
	  				} else {
	  					this.iterations.splice(i, 1);
	  					toRemove.push(_fragment);
	  				}
	  			}
	  		}

	  		if (reset) {
	  			toRemove = this.iterations;
	  			this.iterations = [];
	  		}

	  		if (toRemove) {
	  			toRemove.forEach(function (fragment) {
	  				fragment.unbind();
	  				fragment.unrender(true);
	  			});
	  		}

	  		// update the remaining ones
	  		this.iterations.forEach(_update);

	  		// add new iterations
	  		var newLength = isArray(value) ? value.length : isObject(value) ? Object.keys(value).length : 0;

	  		var docFrag = undefined;
	  		var fragment = undefined;

	  		if (newLength > this.iterations.length) {
	  			docFrag = this.rendered ? createDocumentFragment() : null;
	  			i = this.iterations.length;

	  			if (isArray(value)) {
	  				while (i < value.length) {
	  					fragment = this.createIteration(i, i);

	  					this.iterations.push(fragment);
	  					if (this.rendered) fragment.render(docFrag);

	  					i += 1;
	  				}
	  			} else if (isObject(value)) {
	  				Object.keys(value).forEach(function (key) {
	  					if (!oldKeys || !(key in oldKeys)) {
	  						fragment = _this4.createIteration(key, i);

	  						_this4.iterations.push(fragment);
	  						if (_this4.rendered) fragment.render(docFrag);

	  						i += 1;
	  					}
	  				});
	  			}

	  			if (this.rendered) {
	  				var parentNode = this.parent.findParentNode();
	  				var anchor = this.parent.findNextNode(this.owner);

	  				parentNode.insertBefore(docFrag, anchor);
	  			}
	  		}
	  	};

	  	RepeatedFragment.prototype.updatePostShuffle = function updatePostShuffle() {
	  		var _this5 = this;

	  		var newIndices = this.pendingNewIndices[0];

	  		// map first shuffle through
	  		this.pendingNewIndices.slice(1).forEach(function (indices) {
	  			newIndices.forEach(function (newIndex, oldIndex) {
	  				newIndices[oldIndex] = indices[newIndex];
	  			});
	  		});

	  		// This algorithm (for detaching incorrectly-ordered fragments from the DOM and
	  		// storing them in a document fragment for later reinsertion) seems a bit hokey,
	  		// but it seems to work for now
	  		var previousNewIndex = -1;
	  		var reinsertFrom = null;

	  		newIndices.forEach(function (newIndex, oldIndex) {
	  			var fragment = _this5.previousIterations[oldIndex];

	  			if (newIndex === -1) {
	  				fragment.unbind().unrender(true);
	  			} else {
	  				fragment.index = newIndex;
	  				var model = _this5.context.joinKey(newIndex);
	  				if (_this5.owner.template.z) {
	  					fragment.aliases = {};
	  					fragment.aliases[_this5.owner.template.z[0].n] = model;
	  				}
	  				fragment.rebind(model);

	  				if (reinsertFrom === null && newIndex !== previousNewIndex + 1) {
	  					reinsertFrom = oldIndex;
	  				}
	  			}

	  			previousNewIndex = newIndex;
	  		});

	  		// create new iterations
	  		var docFrag = this.rendered ? createDocumentFragment() : null;
	  		var parentNode = this.rendered ? this.parent.findParentNode() : null;

	  		var len = this.context.get().length;
	  		var i = undefined;

	  		for (i = 0; i < len; i += 1) {
	  			var existingFragment = this.iterations[i];

	  			if (this.rendered) {
	  				if (existingFragment) {
	  					if (reinsertFrom !== null && i >= reinsertFrom) {
	  						docFrag.appendChild(existingFragment.detach());
	  					} else if (docFrag.childNodes.length) {
	  						parentNode.insertBefore(docFrag, existingFragment.firstNode());
	  					}
	  				} else {
	  					this.iterations[i] = this.createIteration(i, i);
	  					this.iterations[i].render(docFrag);
	  				}
	  			}

	  			if (!this.rendered) {
	  				if (!existingFragment) {
	  					this.iterations[i] = this.createIteration(i, i);
	  				}
	  			}
	  		}

	  		if (this.rendered && docFrag.childNodes.length) {
	  			parentNode.insertBefore(docFrag, this.owner.findNextNode());
	  		}

	  		this.iterations.forEach(_update);

	  		this.pendingNewIndices = null;
	  	};

	  	return RepeatedFragment;
	  })();

	  function isEmpty(value) {
	  	return !value || isArray(value) && value.length === 0 || isObject(value) && Object.keys(value).length === 0;
	  }

	  function getType(value, hasIndexRef) {
	  	if (hasIndexRef || isArray(value)) return SECTION_EACH;
	  	if (isObject(value) || typeof value === 'function') return SECTION_WITH;
	  	if (value === undefined) return null;
	  	return SECTION_IF;
	  }

	  var Section = (function (_Mustache) {
	  	inherits(Section, _Mustache);

	  	function Section(options) {
	  		classCallCheck(this, Section);

	  		_Mustache.call(this, options);

	  		this.sectionType = options.template.n || null;
	  		this.templateSectionType = this.sectionType;
	  		this.fragment = null;
	  	}

	  	Section.prototype.bind = function bind() {
	  		_Mustache.prototype.bind.call(this);

	  		// if we managed to bind, we need to create children
	  		if (this.model) {
	  			this.dirty = true;
	  			this.update();
	  		} else if (this.sectionType && this.sectionType === SECTION_UNLESS) {
	  			this.fragment = new Fragment({
	  				owner: this,
	  				template: this.template.f
	  			}).bind();
	  		}
	  	};

	  	Section.prototype.detach = function detach() {
	  		return this.fragment ? this.fragment.detach() : createDocumentFragment();
	  	};

	  	Section.prototype.find = function find(selector) {
	  		if (this.fragment) {
	  			return this.fragment.find(selector);
	  		}
	  	};

	  	Section.prototype.findAll = function findAll(selector, query) {
	  		if (this.fragment) {
	  			this.fragment.findAll(selector, query);
	  		}
	  	};

	  	Section.prototype.findComponent = function findComponent(name) {
	  		if (this.fragment) {
	  			return this.fragment.findComponent(name);
	  		}
	  	};

	  	Section.prototype.findAllComponents = function findAllComponents(name, query) {
	  		if (this.fragment) {
	  			this.fragment.findAllComponents(name, query);
	  		}
	  	};

	  	Section.prototype.firstNode = function firstNode() {
	  		return this.fragment && this.fragment.firstNode();
	  	};

	  	Section.prototype.rebind = function rebind() {
	  		_Mustache.prototype.rebind.call(this);

	  		if (this.fragment) {
	  			this.fragment.rebind(this.sectionType === SECTION_IF ? null : this.model);
	  		}
	  	};

	  	Section.prototype.render = function render(target, occupants) {
	  		this.rendered = true;
	  		if (this.fragment) this.fragment.render(target, occupants);
	  	};

	  	Section.prototype.shuffle = function shuffle(newIndices) {
	  		if (this.fragment && this.sectionType === SECTION_EACH) {
	  			this.fragment.shuffle(newIndices);
	  		}
	  	};

	  	Section.prototype.toString = function toString(escape) {
	  		return this.fragment ? this.fragment.toString(escape) : '';
	  	};

	  	Section.prototype.unbind = function unbind() {
	  		_Mustache.prototype.unbind.call(this);
	  		if (this.fragment) this.fragment.unbind();
	  	};

	  	Section.prototype.unrender = function unrender(shouldDestroy) {
	  		if (this.rendered && this.fragment) this.fragment.unrender(shouldDestroy);
	  		this.rendered = false;
	  	};

	  	Section.prototype.update = function update() {
	  		if (!this.dirty) return;
	  		if (!this.model && this.sectionType !== SECTION_UNLESS) return;

	  		var value = !this.model ? undefined : this.model.isRoot ? this.model.value : this.model.get();
	  		var lastType = this.sectionType;

	  		// watch for switching section types
	  		if (this.sectionType === null || this.templateSectionType === null) this.sectionType = getType(value, this.template.i);
	  		if (lastType && lastType !== this.sectionType && this.fragment) {
	  			if (this.rendered) {
	  				this.fragment.unbind().unrender(true);
	  			}

	  			this.fragment = null;
	  		}

	  		var newFragment = undefined;

	  		if (this.sectionType === SECTION_EACH) {
	  			if (this.fragment) {
	  				this.fragment.update();
	  			} else {
	  				// TODO can this happen?
	  				newFragment = new RepeatedFragment({
	  					owner: this,
	  					template: this.template.f,
	  					indexRef: this.template.i
	  				}).bind(this.model);
	  			}
	  		}

	  		// TODO same comment as before - WITH should be IF_WITH
	  		else if (this.sectionType === SECTION_WITH) {
	  				if (this.fragment) {
	  					this.fragment.update();
	  				} else {
	  					newFragment = new Fragment({
	  						owner: this,
	  						template: this.template.f
	  					}).bind(this.model);
	  				}
	  			} else if (this.sectionType === SECTION_IF_WITH) {
	  				if (this.fragment) {
	  					if (isEmpty(value)) {
	  						if (this.rendered) {
	  							this.fragment.unbind().unrender(true);
	  						}

	  						this.fragment = null;
	  					} else {
	  						this.fragment.update();
	  					}
	  				} else if (!isEmpty(value)) {
	  					newFragment = new Fragment({
	  						owner: this,
	  						template: this.template.f
	  					}).bind(this.model);
	  				}
	  			} else {
	  				var fragmentShouldExist = this.sectionType === SECTION_UNLESS ? isEmpty(value) : !!value && !isEmpty(value);

	  				if (this.fragment) {
	  					if (fragmentShouldExist) {
	  						this.fragment.update();
	  					} else {
	  						if (this.rendered) {
	  							this.fragment.unbind().unrender(true);
	  						}

	  						this.fragment = null;
	  					}
	  				} else if (fragmentShouldExist) {
	  					newFragment = new Fragment({
	  						owner: this,
	  						template: this.template.f
	  					}).bind(null);
	  				}
	  			}

	  		if (newFragment) {
	  			if (this.rendered) {
	  				var parentNode = this.parentFragment.findParentNode();
	  				var anchor = this.parentFragment.findNextNode(this);

	  				if (anchor) {
	  					var docFrag = createDocumentFragment();
	  					newFragment.render(docFrag);

	  					// we use anchor.parentNode, not parentNode, because the sibling
	  					// may be temporarily detached as a result of a shuffle
	  					anchor.parentNode.insertBefore(docFrag, anchor);
	  				} else {
	  					newFragment.render(parentNode);
	  				}
	  			}

	  			this.fragment = newFragment;
	  		}

	  		this.dirty = false;
	  	};

	  	return Section;
	  })(Mustache);

	  var elementCache = {};

	  var ieBug = undefined;
	  var ieBlacklist = undefined;

	  try {
	  	createElement('table').innerHTML = 'foo';
	  } catch (err) {
	  	ieBug = true;

	  	ieBlacklist = {
	  		TABLE: ['<table class="x">', '</table>'],
	  		THEAD: ['<table><thead class="x">', '</thead></table>'],
	  		TBODY: ['<table><tbody class="x">', '</tbody></table>'],
	  		TR: ['<table><tr class="x">', '</tr></table>'],
	  		SELECT: ['<select class="x">', '</select>']
	  	};
	  }

	  function insertHtml (html, node, docFrag) {
	  	var nodes = [];

	  	// render 0 and false
	  	if (html == null || html === '') return nodes;

	  	var container = undefined;
	  	var wrapper = undefined;
	  	var selectedOption = undefined;

	  	if (ieBug && (wrapper = ieBlacklist[node.tagName])) {
	  		container = element$1('DIV');
	  		container.innerHTML = wrapper[0] + html + wrapper[1];
	  		container = container.querySelector('.x');

	  		if (container.tagName === 'SELECT') {
	  			selectedOption = container.options[container.selectedIndex];
	  		}
	  	} else if (node.namespaceURI === svg$1) {
	  		container = element$1('DIV');
	  		container.innerHTML = '<svg class="x">' + html + '</svg>';
	  		container = container.querySelector('.x');
	  	} else {
	  		container = element$1(node.tagName);
	  		container.innerHTML = html;

	  		if (container.tagName === 'SELECT') {
	  			selectedOption = container.options[container.selectedIndex];
	  		}
	  	}

	  	var child = undefined;
	  	while (child = container.firstChild) {
	  		nodes.push(child);
	  		docFrag.appendChild(child);
	  	}

	  	// This is really annoying. Extracting <option> nodes from the
	  	// temporary container <select> causes the remaining ones to
	  	// become selected. So now we have to deselect them. IE8, you
	  	// amaze me. You really do
	  	// ...and now Chrome too
	  	var i = undefined;
	  	if (node.tagName === 'SELECT') {
	  		i = nodes.length;
	  		while (i--) {
	  			if (nodes[i] !== selectedOption) {
	  				nodes[i].selected = false;
	  			}
	  		}
	  	}

	  	return nodes;
	  }

	  function element$1(tagName) {
	  	return elementCache[tagName] || (elementCache[tagName] = createElement(tagName));
	  }

	  var Triple = (function (_Mustache) {
	  	inherits(Triple, _Mustache);

	  	function Triple(options) {
	  		classCallCheck(this, Triple);

	  		_Mustache.call(this, options);
	  	}

	  	Triple.prototype.detach = function detach() {
	  		var docFrag = createDocumentFragment();
	  		this.nodes.forEach(function (node) {
	  			return docFrag.appendChild(node);
	  		});
	  		return docFrag;
	  	};

	  	Triple.prototype.find = function find(selector) {
	  		var len = this.nodes.length;
	  		var i = undefined;

	  		for (i = 0; i < len; i += 1) {
	  			var node = this.nodes[i];

	  			if (node.nodeType !== 1) continue;

	  			if (matches(node, selector)) return node;

	  			var queryResult = node.querySelector(selector);
	  			if (queryResult) return queryResult;
	  		}

	  		return null;
	  	};

	  	Triple.prototype.findAll = function findAll(selector, query) {
	  		var len = this.nodes.length;
	  		var i = undefined;

	  		for (i = 0; i < len; i += 1) {
	  			var node = this.nodes[i];

	  			if (node.nodeType !== 1) continue;

	  			if (query.test(node)) query.add(node);

	  			var queryAllResult = node.querySelectorAll(selector);
	  			if (queryAllResult) {
	  				var numNodes = queryAllResult.length;
	  				var j = undefined;

	  				for (j = 0; j < numNodes; j += 1) {
	  					query.add(queryAllResult[j]);
	  				}
	  			}
	  		}
	  	};

	  	Triple.prototype.findComponent = function findComponent() {
	  		return null;
	  	};

	  	Triple.prototype.firstNode = function firstNode() {
	  		return this.nodes[0];
	  	};

	  	Triple.prototype.render = function render(target) {
	  		var html = this.model ? this.model.get() : '';
	  		this.nodes = insertHtml(html, this.parentFragment.findParentNode(), target);
	  		this.rendered = true;
	  	};

	  	Triple.prototype.toString = function toString() {
	  		return this.model && this.model.get() != null ? decodeCharacterReferences('' + this.model.get()) : '';
	  	};

	  	Triple.prototype.unrender = function unrender() {
	  		if (this.nodes) this.nodes.forEach(function (node) {
	  			return detachNode(node);
	  		});
	  		this.rendered = false;
	  	};

	  	Triple.prototype.update = function update() {
	  		if (this.rendered && this.dirty) {
	  			this.unrender();
	  			var docFrag = createDocumentFragment();
	  			this.render(docFrag);

	  			var parentNode = this.parentFragment.findParentNode();
	  			var anchor = this.parentFragment.findNextNode(this);

	  			parentNode.insertBefore(docFrag, anchor);

	  			this.dirty = false;
	  		}
	  	};

	  	return Triple;
	  })(Mustache);

	  var Yielder = (function (_Item) {
	  	inherits(Yielder, _Item);

	  	function Yielder(options) {
	  		classCallCheck(this, Yielder);

	  		_Item.call(this, options);

	  		this.container = options.parentFragment.ractive;
	  		this.component = this.container.component;

	  		this.containerFragment = options.parentFragment;
	  		this.parentFragment = this.component.parentFragment;

	  		// {{yield}} is equivalent to {{yield content}}
	  		this.name = options.template.n || '';
	  	}

	  	Yielder.prototype.bind = function bind() {
	  		var name = this.name;

	  		(this.component.yielders[name] || (this.component.yielders[name] = [])).push(this);

	  		// TODO don't parse here
	  		var template = this.container._inlinePartials[name || 'content'];

	  		if (typeof template === 'string') {
	  			template = parse(template).t;
	  		}

	  		if (!template) {
	  			warnIfDebug('Could not find template for partial "' + name + '"', { ractive: this.ractive });
	  			template = [];
	  		}

	  		this.fragment = new Fragment({
	  			owner: this,
	  			ractive: this.container.parent,
	  			template: template
	  		}).bind();
	  	};

	  	Yielder.prototype.bubble = function bubble() {
	  		if (!this.dirty) {
	  			this.containerFragment.bubble();
	  			this.dirty = true;
	  		}
	  	};

	  	Yielder.prototype.detach = function detach() {
	  		return this.fragment.detach();
	  	};

	  	Yielder.prototype.find = function find(selector) {
	  		return this.fragment.find(selector);
	  	};

	  	Yielder.prototype.findAll = function findAll(selector, queryResult) {
	  		this.fragment.find(selector, queryResult);
	  	};

	  	Yielder.prototype.findComponent = function findComponent(name) {
	  		return this.fragment.findComponent(name);
	  	};

	  	Yielder.prototype.findAllComponents = function findAllComponents(name, queryResult) {
	  		this.fragment.findAllComponents(name, queryResult);
	  	};

	  	Yielder.prototype.findNextNode = function findNextNode() {
	  		return this.containerFragment.findNextNode(this);
	  	};

	  	Yielder.prototype.firstNode = function firstNode() {
	  		return this.fragment.firstNode();
	  	};

	  	Yielder.prototype.rebind = function rebind() {
	  		this.fragment.rebind();
	  	};

	  	Yielder.prototype.render = function render(target, occupants) {
	  		return this.fragment.render(target, occupants);
	  	};

	  	Yielder.prototype.setTemplate = function setTemplate(name) {
	  		var template = this.parentFragment.ractive.partials[name];

	  		if (typeof template === 'string') {
	  			template = parse(template).t;
	  		}

	  		this.partialTemplate = template || []; // TODO warn on missing partial
	  	};

	  	Yielder.prototype.toString = function toString(escape) {
	  		return this.fragment.toString(escape);
	  	};

	  	Yielder.prototype.unbind = function unbind() {
	  		this.fragment.unbind();
	  		removeFromArray(this.component.yielders[this.name], this);
	  	};

	  	Yielder.prototype.unrender = function unrender(shouldDestroy) {
	  		this.fragment.unrender(shouldDestroy);
	  	};

	  	Yielder.prototype.update = function update() {
	  		this.fragment.update();
	  		this.dirty = false;
	  	};

	  	return Yielder;
	  })(Item);

	  var textTypes = [undefined, 'text', 'search', 'url', 'email', 'hidden', 'password', 'search', 'reset', 'submit'];
	  function getUpdateDelegate(attribute) {
	  	var element = attribute.element;
	  	var name = attribute.name;

	  	if (name === 'id') return updateId;

	  	if (name === 'value') {
	  		// special case - selects
	  		if (element.name === 'select' && name === 'value') {
	  			return element.getAttribute('multiple') ? updateMultipleSelectValue : updateSelectValue;
	  		}

	  		if (element.name === 'textarea') return updateStringValue;

	  		// special case - contenteditable
	  		if (element.getAttribute('contenteditable') != null) return updateContentEditableValue;

	  		// special case - <input>
	  		if (element.name === 'input') {
	  			var type = element.getAttribute('type');

	  			// type='file' value='{{fileList}}'>
	  			if (type === 'file') return noop; // read-only

	  			// type='radio' name='{{twoway}}'
	  			if (type === 'radio' && element.binding && element.binding.attribute.name === 'name') return updateRadioValue;

	  			if (~textTypes.indexOf(type)) return updateStringValue;
	  		}

	  		return updateValue;
	  	}

	  	var node = element.node;

	  	// special case - <input type='radio' name='{{twoway}}' value='foo'>
	  	if (attribute.isTwoway && name === 'name') {
	  		if (node.type === 'radio') return updateRadioName;
	  		if (node.type === 'checkbox') return updateCheckboxName;
	  	}

	  	// special case - style attributes in Internet Exploder
	  	if (name === 'style' && node.style.setAttribute) return updateIEStyleAttribute;

	  	// special case - class names. IE fucks things up, again
	  	if (name === 'class' && (!node.namespaceURI || node.namespaceURI === html)) return updateClassName;

	  	if (attribute.isBoolean) return updateBoolean;

	  	if (attribute.namespace && attribute.namespace !== attribute.node.namespaceURI) return updateNamespacedAttribute;

	  	return updateAttribute;
	  }

	  function updateId() {
	  	var node = this.node;

	  	var value = this.getValue();

	  	delete this.ractive.nodes[node.id];
	  	this.ractive.nodes[value] = node;

	  	node.id = value;
	  }

	  function updateMultipleSelectValue() {
	  	var value = this.getValue();

	  	if (!isArray(value)) value = [value];

	  	var options = this.node.options;
	  	var i = options.length;

	  	while (i--) {
	  		var option = options[i];
	  		var optionValue = option._ractive ? option._ractive.value : option.value; // options inserted via a triple don't have _ractive

	  		option.selected = arrayContains(value, optionValue);
	  	}
	  }

	  function updateSelectValue() {
	  	var value = this.getValue();

	  	if (!this.locked) {
	  		// TODO is locked still a thing?
	  		this.node._ractive.value = value;

	  		var options = this.node.options;
	  		var i = options.length;

	  		while (i--) {
	  			var option = options[i];
	  			var optionValue = option._ractive ? option._ractive.value : option.value; // options inserted via a triple don't have _ractive

	  			if (optionValue == value) {
	  				// double equals as we may be comparing numbers with strings
	  				option.selected = true;
	  				break;
	  			}
	  		}
	  	}

	  	// if we're still here, it means the new value didn't match any of the options...
	  	// TODO figure out what to do in this situation
	  }

	  function updateContentEditableValue() {
	  	var value = this.getValue();

	  	if (!this.locked) {
	  		this.node.innerHTML = value === undefined ? '' : value;
	  	}
	  }

	  function updateRadioValue() {
	  	var node = this.node;
	  	var wasChecked = node.checked;

	  	var value = this.getValue();

	  	//node.value = this.element.getAttribute( 'value' );
	  	node.value = this.node._ractive.value = value;
	  	node.checked = value === this.element.getAttribute('name');

	  	// This is a special case - if the input was checked, and the value
	  	// changed so that it's no longer checked, the twoway binding is
	  	// most likely out of date. To fix it we have to jump through some
	  	// hoops... this is a little kludgy but it works
	  	if (wasChecked && !node.checked && this.element.binding && this.element.binding.rendered) {
	  		this.element.binding.group.model.set(this.element.binding.group.getValue());
	  	}
	  }

	  function updateValue() {
	  	if (!this.locked) {
	  		var value = this.getValue();

	  		this.node.value = this.node._ractive.value = value;
	  		this.node.setAttribute('value', value);
	  	}
	  }

	  function updateStringValue() {
	  	if (!this.locked) {
	  		var value = this.getValue();

	  		this.node._ractive.value = value;

	  		this.node.value = safeToStringValue(value);
	  		this.node.setAttribute('value', safeToStringValue(value));
	  	}
	  }

	  function updateRadioName() {
	  	this.node.checked = this.getValue() == this.node._ractive.value;
	  }

	  function updateCheckboxName() {
	  	var element = this.element;
	  	var node = this.node;

	  	var binding = element.binding;

	  	var value = this.getValue();
	  	var valueAttribute = element.getAttribute('value');

	  	if (!isArray(value)) {
	  		binding.isChecked = node.checked = value == valueAttribute;
	  	} else {
	  		var i = value.length;
	  		while (i--) {
	  			if (valueAttribute == value[i]) {
	  				binding.isChecked = node.checked = true;
	  				return;
	  			}
	  		}
	  		binding.isChecked = node.checked = false;
	  	}
	  }

	  function updateIEStyleAttribute() {
	  	this.node.style.setAttribute('cssText', this.getValue() || '');
	  }

	  function updateClassName() {
	  	this.node.className = safeToStringValue(this.getValue());
	  }

	  function updateBoolean() {
	  	// with two-way binding, only update if the change wasn't initiated by the user
	  	// otherwise the cursor will often be sent to the wrong place
	  	if (!this.locked) {
	  		if (this.useProperty) {
	  			this.node[this.propertyName] = this.getValue();
	  		} else {
	  			if (this.getValue()) {
	  				this.node.setAttribute(this.propertyName, '');
	  			} else {
	  				this.node.removeAttribute(this.propertyName);
	  			}
	  		}
	  	}
	  }

	  function updateAttribute() {
	  	this.node.setAttribute(this.name, safeToStringValue(this.getString()));
	  }

	  function updateNamespacedAttribute() {
	  	this.node.setAttributeNS(this.namespace, this.name.slice(this.name.indexOf(':') + 1), safeToStringValue(this.getString()));
	  }

	  var propertyNames = {
	  	'accept-charset': 'acceptCharset',
	  	accesskey: 'accessKey',
	  	bgcolor: 'bgColor',
	  	'class': 'className',
	  	codebase: 'codeBase',
	  	colspan: 'colSpan',
	  	contenteditable: 'contentEditable',
	  	datetime: 'dateTime',
	  	dirname: 'dirName',
	  	'for': 'htmlFor',
	  	'http-equiv': 'httpEquiv',
	  	ismap: 'isMap',
	  	maxlength: 'maxLength',
	  	novalidate: 'noValidate',
	  	pubdate: 'pubDate',
	  	readonly: 'readOnly',
	  	rowspan: 'rowSpan',
	  	tabindex: 'tabIndex',
	  	usemap: 'useMap'
	  };

	  function lookupNamespace(node, prefix) {
	  	var qualified = 'xmlns:' + prefix;

	  	while (node) {
	  		if (node.hasAttribute(qualified)) return node.getAttribute(qualified);
	  		node = node.parentNode;
	  	}

	  	return namespaces[prefix];
	  }

	  var Attribute = (function (_Item) {
	  	inherits(Attribute, _Item);

	  	function Attribute(options) {
	  		classCallCheck(this, Attribute);

	  		_Item.call(this, options);

	  		this.name = options.name;
	  		this.namespace = null;
	  		this.element = options.element;
	  		this.parentFragment = options.element.parentFragment; // shared
	  		this.ractive = this.parentFragment.ractive;

	  		this.rendered = false;
	  		this.updateDelegate = null;
	  		this.fragment = null;
	  		this.value = null;

	  		if (!isArray(options.template)) {
	  			this.value = options.template;
	  			if (this.value === 0) {
	  				this.value = '';
	  			}
	  		} else {
	  			this.fragment = new Fragment({
	  				owner: this,
	  				template: options.template
	  			});
	  		}

	  		this.interpolator = this.fragment && this.fragment.items.length === 1 && this.fragment.items[0].type === INTERPOLATOR && this.fragment.items[0];
	  	}

	  	Attribute.prototype.bind = function bind() {
	  		if (this.fragment) {
	  			this.fragment.bind();
	  		}
	  	};

	  	Attribute.prototype.bubble = function bubble() {
	  		if (!this.dirty) {
	  			this.element.bubble();
	  			this.dirty = true;
	  		}
	  	};

	  	Attribute.prototype.getString = function getString() {
	  		return this.fragment ? this.fragment.toString() : this.value != null ? '' + this.value : '';
	  	};

	  	// TODO could getValue ever be called for a static attribute,
	  	// or can we assume that this.fragment exists?

	  	Attribute.prototype.getValue = function getValue() {
	  		return this.fragment ? this.fragment.valueOf() : booleanAttributes.test(this.name) ? true : this.value;
	  	};

	  	Attribute.prototype.rebind = function rebind() {
	  		this.unbind();
	  		this.bind();
	  	};

	  	Attribute.prototype.render = function render() {
	  		var node = this.element.node;
	  		this.node = node;

	  		// should we use direct property access, or setAttribute?
	  		if (!node.namespaceURI || node.namespaceURI === namespaces.html) {
	  			this.propertyName = propertyNames[this.name] || this.name;

	  			if (node[this.propertyName] !== undefined) {
	  				this.useProperty = true;
	  			}

	  			// is attribute a boolean attribute or 'value'? If so we're better off doing e.g.
	  			// node.selected = true rather than node.setAttribute( 'selected', '' )
	  			if (booleanAttributes.test(this.name) || this.isTwoway) {
	  				this.isBoolean = true;
	  			}

	  			if (this.propertyName === 'value') {
	  				node._ractive.value = this.value;
	  			}
	  		}

	  		if (node.namespaceURI) {
	  			var index = this.name.indexOf(':');
	  			if (index !== -1) {
	  				this.namespace = lookupNamespace(node, this.name.slice(0, index));
	  			} else {
	  				this.namespace = node.namespaceURI;
	  			}
	  		}

	  		this.rendered = true;
	  		this.updateDelegate = getUpdateDelegate(this);
	  		this.updateDelegate();
	  	};

	  	Attribute.prototype.toString = function toString() {
	  		var value = this.getValue();

	  		// Special case - select and textarea values (should not be stringified)
	  		if (this.name === 'value' && (this.element.getAttribute('contenteditable') !== undefined || this.element.name === 'select' || this.element.name === 'textarea')) {
	  			return;
	  		}

	  		// Special case – bound radio `name` attributes
	  		if (this.name === 'name' && this.element.name === 'input' && this.interpolator && this.element.getAttribute('type') === 'radio') {
	  			return 'name="{{' + this.interpolator.model.getKeypath() + '}}"';
	  		}

	  		if (booleanAttributes.test(this.name)) return value ? this.name : '';
	  		if (value == null) return '';

	  		var str = safeToStringValue(this.getString()).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

	  		return str ? this.name + '="' + str + '"' : this.name;
	  	};

	  	Attribute.prototype.unbind = function unbind() {
	  		if (this.fragment) this.fragment.unbind();
	  	};

	  	Attribute.prototype.update = function update() {
	  		if (this.dirty) {
	  			if (this.fragment) this.fragment.update();
	  			if (this.rendered) this.updateDelegate();
	  			this.dirty = false;
	  		}
	  	};

	  	return Attribute;
	  })(Item);

	  var div$1 = doc ? createElement('div') : null;

	  var ConditionalAttribute = (function (_Item) {
	  	inherits(ConditionalAttribute, _Item);

	  	function ConditionalAttribute(options) {
	  		classCallCheck(this, ConditionalAttribute);

	  		_Item.call(this, options);

	  		this.attributes = [];

	  		this.owner = options.owner;

	  		this.fragment = new Fragment({
	  			ractive: this.ractive,
	  			owner: this,
	  			template: [this.template]
	  		});

	  		this.dirty = false;
	  	}

	  	ConditionalAttribute.prototype.bind = function bind() {
	  		this.fragment.bind();
	  	};

	  	ConditionalAttribute.prototype.bubble = function bubble() {
	  		if (!this.dirty) {
	  			this.dirty = true;
	  			this.owner.bubble();
	  		}
	  	};

	  	ConditionalAttribute.prototype.rebind = function rebind() {
	  		this.fragment.rebind();
	  	};

	  	ConditionalAttribute.prototype.render = function render() {
	  		this.node = this.owner.node;
	  		this.isSvg = this.node.namespaceURI === svg$1;

	  		this.rendered = true;
	  		this.dirty = true; // TODO this seems hacky, but necessary for tests to pass in browser AND node.js
	  		this.update();
	  	};

	  	ConditionalAttribute.prototype.toString = function toString() {
	  		return this.fragment.toString();
	  	};

	  	ConditionalAttribute.prototype.unbind = function unbind() {
	  		this.fragment.unbind();
	  	};

	  	ConditionalAttribute.prototype.unrender = function unrender() {
	  		this.rendered = false;
	  	};

	  	ConditionalAttribute.prototype.update = function update() {
	  		var _this = this;

	  		var str = undefined;
	  		var attrs = undefined;

	  		if (this.dirty) {
	  			this.fragment.update();

	  			if (this.rendered) {
	  				str = this.fragment.toString();
	  				attrs = parseAttributes(str, this.isSvg);

	  				// any attributes that previously existed but no longer do
	  				// must be removed
	  				this.attributes.filter(function (a) {
	  					return notIn(attrs, a);
	  				}).forEach(function (a) {
	  					_this.node.removeAttribute(a.name);
	  				});

	  				attrs.forEach(function (a) {
	  					_this.node.setAttribute(a.name, a.value);
	  				});

	  				this.attributes = attrs;
	  			}

	  			this.dirty = false;
	  		}
	  	};

	  	return ConditionalAttribute;
	  })(Item);

	  function parseAttributes(str, isSvg) {
	  	var tagName = isSvg ? 'svg' : 'div';
	  	return str ? (div$1.innerHTML = '<' + tagName + ' ' + str + '></' + tagName + '>') && toArray(div$1.childNodes[0].attributes) : [];
	  }

	  function notIn(haystack, needle) {
	  	var i = haystack.length;

	  	while (i--) {
	  		if (haystack[i].name === needle.name) {
	  			return false;
	  		}
	  	}

	  	return true;
	  }

	  var missingDecorator = {
	  	update: noop,
	  	teardown: noop
	  };

	  var Decorator = (function () {
	  	function Decorator(owner, template) {
	  		classCallCheck(this, Decorator);

	  		this.owner = owner;
	  		this.template = template;

	  		this.parentFragment = owner.parentFragment;
	  		this.ractive = owner.ractive;

	  		this.dynamicName = typeof template.n === 'object';
	  		this.dynamicArgs = !!template.d;

	  		if (this.dynamicName) {
	  			this.nameFragment = new Fragment({
	  				owner: this,
	  				template: template.n
	  			});
	  		} else {
	  			this.name = template.n || template;
	  		}

	  		if (this.dynamicArgs) {
	  			this.argsFragment = new Fragment({
	  				owner: this,
	  				template: template.d
	  			});
	  		} else {
	  			this.args = template.a || [];
	  		}

	  		this.node = null;
	  		this.intermediary = null;
	  	}

	  	Decorator.prototype.bind = function bind() {
	  		if (this.dynamicName) {
	  			this.nameFragment.bind();
	  			this.name = this.nameFragment.toString();
	  		}

	  		if (this.dynamicArgs) this.argsFragment.bind();
	  	};

	  	Decorator.prototype.bubble = function bubble() {
	  		if (!this.dirty) {
	  			this.dirty = true;
	  			this.owner.bubble();
	  		}
	  	};

	  	Decorator.prototype.rebind = function rebind() {
	  		if (this.dynamicName) this.nameFragment.rebind();
	  		if (this.dynamicArgs) this.argsFragment.rebind();
	  	};

	  	Decorator.prototype.render = function render() {
	  		var fn = findInViewHierarchy('decorators', this.ractive, this.name);

	  		if (!fn) {
	  			warnOnce(missingPlugin(this.name, 'decorator'));
	  			this.intermediary = missingDecorator;
	  			return;
	  		}

	  		this.node = this.owner.node;

	  		var args = this.dynamicArgs ? this.argsFragment.getArgsList() : this.args;
	  		this.intermediary = fn.apply(this.ractive, [this.node].concat(args));

	  		if (!this.intermediary || !this.intermediary.teardown) {
	  			throw new Error('The \'' + this.name + '\' decorator must return an object with a teardown method');
	  		}
	  	};

	  	Decorator.prototype.unbind = function unbind() {
	  		if (this.dynamicName) this.nameFragment.unbind();
	  		if (this.dynamicArgs) this.argsFragment.unbind();
	  	};

	  	Decorator.prototype.unrender = function unrender() {
	  		if (this.intermediary) this.intermediary.teardown();
	  	};

	  	Decorator.prototype.update = function update() {
	  		if (!this.dirty) return;

	  		var nameChanged = false;

	  		if (this.dynamicName && this.nameFragment.dirty) {
	  			var _name = this.nameFragment.toString();
	  			nameChanged = _name !== this.name;
	  			this.name = _name;
	  		}

	  		if (this.intermediary) {
	  			if (nameChanged || !this.intermediary.update) {
	  				this.unrender();
	  				this.render();
	  			} else {
	  				if (this.dynamicArgs) {
	  					if (this.argsFragment.dirty) {
	  						var args = this.argsFragment.getArgsList();
	  						this.intermediary.update.apply(this.ractive, args);
	  					}
	  				} else {
	  					this.intermediary.update.apply(this.ractive, this.args);
	  				}
	  			}
	  		}

	  		// need to run these for unrender/render cases
	  		// so can't just be in conditional if above

	  		if (this.dynamicName && this.nameFragment.dirty) {
	  			this.nameFragment.update();
	  		}

	  		if (this.dynamicArgs && this.argsFragment.dirty) {
	  			this.argsFragment.update();
	  		}

	  		this.dirty = false;
	  	};

	  	return Decorator;
	  })();

	  function enqueue(ractive, event) {
	  	if (ractive.event) {
	  		ractive._eventQueue.push(ractive.event);
	  	}

	  	ractive.event = event;
	  }

	  function dequeue(ractive) {
	  	if (ractive._eventQueue.length) {
	  		ractive.event = ractive._eventQueue.pop();
	  	} else {
	  		ractive.event = null;
	  	}
	  }

	  var starMaps = {};

	  // This function takes a keypath such as 'foo.bar.baz', and returns
	  // all the variants of that keypath that include a wildcard in place
	  // of a key, such as 'foo.bar.*', 'foo.*.baz', 'foo.*.*' and so on.
	  // These are then checked against the dependants map (ractive.viewmodel.depsMap)
	  // to see if any pattern observers are downstream of one or more of
	  // these wildcard keypaths (e.g. 'foo.bar.*.status')

	  function getPotentialWildcardMatches(keypath) {
	  	var keys, starMap, mapper, i, result, wildcardKeypath;

	  	keys = splitKeypath(keypath);
	  	if (!(starMap = starMaps[keys.length])) {
	  		starMap = getStarMap(keys.length);
	  	}

	  	result = [];

	  	mapper = function (star, i) {
	  		return star ? '*' : keys[i];
	  	};

	  	i = starMap.length;
	  	while (i--) {
	  		wildcardKeypath = starMap[i].map(mapper).join('.');

	  		if (!result.hasOwnProperty(wildcardKeypath)) {
	  			result.push(wildcardKeypath);
	  			result[wildcardKeypath] = true;
	  		}
	  	}

	  	return result;
	  }

	  // This function returns all the possible true/false combinations for
	  // a given number - e.g. for two, the possible combinations are
	  // [ true, true ], [ true, false ], [ false, true ], [ false, false ].
	  // It does so by getting all the binary values between 0 and e.g. 11
	  function getStarMap(num) {
	  	var ones = '',
	  	    max,
	  	    binary,
	  	    starMap,
	  	    mapper,
	  	    i,
	  	    j,
	  	    l,
	  	    map;

	  	if (!starMaps[num]) {
	  		starMap = [];

	  		while (ones.length < num) {
	  			ones += 1;
	  		}

	  		max = parseInt(ones, 2);

	  		mapper = function (digit) {
	  			return digit === '1';
	  		};

	  		for (i = 0; i <= max; i += 1) {
	  			binary = i.toString(2);
	  			while (binary.length < num) {
	  				binary = '0' + binary;
	  			}

	  			map = [];
	  			l = binary.length;
	  			for (j = 0; j < l; j++) {
	  				map.push(mapper(binary[j]));
	  			}
	  			starMap[i] = map;
	  		}

	  		starMaps[num] = starMap;
	  	}

	  	return starMaps[num];
	  }

	  var wildcardCache = {};
	  function fireEvent(ractive, eventName) {
	  	var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  	if (!eventName) {
	  		return;
	  	}

	  	if (!options.event) {
	  		options.event = {
	  			name: eventName,
	  			// until event not included as argument default
	  			_noArg: true
	  		};
	  	} else {
	  		options.event.name = eventName;
	  	}

	  	var eventNames = getWildcardNames(eventName);

	  	fireEventAs(ractive, eventNames, options.event, options.args, true);
	  }

	  function getWildcardNames(eventName) {
	  	if (wildcardCache.hasOwnProperty(eventName)) {
	  		return wildcardCache[eventName];
	  	} else {
	  		return wildcardCache[eventName] = getPotentialWildcardMatches(eventName);
	  	}
	  }

	  function fireEventAs(ractive, eventNames, event, args) {
	  	var initialFire = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

	  	var subscribers,
	  	    i,
	  	    bubble = true;

	  	enqueue(ractive, event);

	  	for (i = eventNames.length; i >= 0; i--) {
	  		subscribers = ractive._subs[eventNames[i]];

	  		if (subscribers) {
	  			bubble = notifySubscribers(ractive, subscribers, event, args) && bubble;
	  		}
	  	}

	  	dequeue(ractive);

	  	if (ractive.parent && bubble) {

	  		if (initialFire && ractive.component) {
	  			var fullName = ractive.component.name + '.' + eventNames[eventNames.length - 1];
	  			eventNames = getWildcardNames(fullName);

	  			if (event && !event.component) {
	  				event.component = ractive;
	  			}
	  		}

	  		fireEventAs(ractive.parent, eventNames, event, args);
	  	}
	  }

	  function notifySubscribers(ractive, subscribers, event, args) {
	  	var originalEvent = null,
	  	    stopEvent = false;

	  	if (event && !event._noArg) {
	  		args = [event].concat(args);
	  	}

	  	// subscribers can be modified inflight, e.g. "once" functionality
	  	// so we need to copy to make sure everyone gets called
	  	subscribers = subscribers.slice();

	  	for (var i = 0, len = subscribers.length; i < len; i += 1) {
	  		if (subscribers[i].apply(ractive, args) === false) {
	  			stopEvent = true;
	  		}
	  	}

	  	if (event && !event._noArg && stopEvent && (originalEvent = event.original)) {
	  		originalEvent.preventDefault && originalEvent.preventDefault();
	  		originalEvent.stopPropagation && originalEvent.stopPropagation();
	  	}

	  	return !stopEvent;
	  }

	  var eventPattern = /^event(?:\.(.+))?$/;
	  var argumentsPattern = /^arguments\.(\d*)$/;
	  var dollarArgsPattern = /^\$(\d*)$/;

	  var EventDirective = (function () {
	  	function EventDirective(owner, event, template) {
	  		classCallCheck(this, EventDirective);

	  		this.owner = owner;
	  		this.event = event;
	  		this.template = template;

	  		this.ractive = owner.parentFragment.ractive;
	  		this.parentFragment = owner.parentFragment;

	  		this.context = null;
	  		this.passthru = false;

	  		// method calls
	  		this.method = null;
	  		this.resolvers = null;
	  		this.models = null;
	  		this.argsFn = null;

	  		// handler directive
	  		this.action = null;
	  		this.args = null;
	  	}

	  	EventDirective.prototype.bind = function bind() {
	  		var _this = this;

	  		this.context = this.parentFragment.findContext();

	  		var template = this.template;

	  		if (template.m) {
	  			this.method = template.m;

	  			// pass-thru "...arguments"
	  			this.passthru = !!template.g;

	  			if (template.a) {
	  				this.resolvers = [];
	  				this.models = template.a.r.map(function (ref, i) {

	  					if (eventPattern.test(ref)) {
	  						// on-click="foo(event.node)"
	  						return {
	  							event: true,
	  							keys: ref.length > 5 ? splitKeypath(ref.slice(6)) : [],
	  							unbind: noop
	  						};
	  					}

	  					var argMatch = argumentsPattern.exec(ref);
	  					if (argMatch) {
	  						// on-click="foo(arguments[0])"
	  						return {
	  							argument: true,
	  							index: argMatch[1]
	  						};
	  					}

	  					var dollarMatch = dollarArgsPattern.exec(ref);
	  					if (dollarMatch) {
	  						// on-click="foo($1)"
	  						return {
	  							argument: true,
	  							index: dollarMatch[1] - 1
	  						};
	  					}

	  					var resolver = undefined;

	  					var model = resolveReference(_this.parentFragment, ref);
	  					if (!model) {
	  						resolver = _this.parentFragment.resolve(ref, function (model) {
	  							_this.models[i] = model;
	  							removeFromArray(_this.resolvers, resolver);
	  						});

	  						_this.resolvers.push(resolver);
	  					}

	  					return model;
	  				});

	  				this.argsFn = getFunction(template.a.s, template.a.r.length);
	  			}
	  		} else {
	  			// TODO deprecate this style of directive
	  			this.action = typeof template === 'string' ? // on-click='foo'
	  			template : typeof template.n === 'string' ? // on-click='{{dynamic}}'
	  			template.n : new Fragment({
	  				owner: this,
	  				template: template.n
	  			});

	  			this.args = template.a ? // static arguments
	  			typeof template.a === 'string' ? [template.a] : template.a : template.d ? // dynamic arguments
	  			new Fragment({
	  				owner: this,
	  				template: template.d
	  			}) : []; // no arguments
	  		}

	  		if (this.template.n && typeof this.template.n !== 'string') this.action.bind();
	  		if (this.template.d) this.args.bind();
	  	};

	  	EventDirective.prototype.bubble = function bubble() {
	  		if (!this.dirty) {
	  			this.dirty = true;
	  			this.owner.bubble();
	  		}
	  	};

	  	EventDirective.prototype.fire = function fire(event) {
	  		var passedArgs = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

	  		// augment event object
	  		if (event) {
	  			event.keypath = this.context.getKeypath(this.ractive);
	  			event.rootpath = this.context.getKeypath();
	  			event.context = this.context.get();
	  			event.index = this.parentFragment.indexRefs;
	  		}

	  		if (this.method) {
	  			if (typeof this.ractive[this.method] !== 'function') {
	  				throw new Error('Attempted to call a non-existent method ("' + this.method + '")');
	  			}

	  			var args = undefined;

	  			if (event) passedArgs.unshift(event);

	  			if (this.models) {
	  				var values = this.models.map(function (model) {
	  					if (!model) return undefined;

	  					if (model.event) {
	  						var obj = event;
	  						var keys = model.keys.slice();

	  						while (keys.length) obj = obj[keys.shift()];
	  						return obj;
	  					}

	  					if (model.argument) {
	  						return passedArgs ? passedArgs[model.index] : void 0;
	  					}

	  					if (model.wrapper) {
	  						return model.wrapper.value;
	  					}

	  					return model.get();
	  				});

	  				args = this.argsFn.apply(null, values);
	  			}

	  			if (this.passthru) {
	  				args = args ? args.concat(passedArgs) : passedArgs;
	  			}

	  			// make event available as `this.event`
	  			var ractive = this.ractive;
	  			var oldEvent = ractive.event;

	  			ractive.event = event;
	  			var result = ractive[this.method].apply(ractive, args);

	  			// Auto prevent and stop if return is explicitly false
	  			var original = undefined;
	  			if (result === false && (original = event.original)) {
	  				original.preventDefault && original.preventDefault();
	  				original.stopPropagation && original.stopPropagation();
	  			}

	  			ractive.event = oldEvent;
	  		} else {
	  			var action = this.action.toString();
	  			var args = this.template.d ? this.args.getArgsList() : this.args;

	  			if (passedArgs.length) args = args.concat(passedArgs);

	  			if (event) event.name = action;

	  			fireEvent(this.ractive, action, {
	  				event: event,
	  				args: args
	  			});
	  		}
	  	};

	  	EventDirective.prototype.rebind = function rebind() {
	  		this.unbind();
	  		this.bind();
	  	};

	  	EventDirective.prototype.render = function render() {
	  		this.event.listen(this);
	  	};

	  	EventDirective.prototype.unbind = function unbind() {
	  		var template = this.template;

	  		if (template.m) {
	  			if (this.resolvers) this.resolvers.forEach(_unbind);
	  			this.resolvers = [];

	  			this.models = null;
	  		} else {
	  			// TODO this is brittle and non-explicit, fix it
	  			if (this.action.unbind) this.action.unbind();
	  			if (this.args.unbind) this.args.unbind();
	  		}
	  	};

	  	EventDirective.prototype.unrender = function unrender() {
	  		this.event.unlisten();
	  	};

	  	EventDirective.prototype.update = function update() {
	  		if (this.method) return; // nothing to do

	  		// ugh legacy
	  		if (this.action.update) this.action.update();
	  		if (this.template.d) this.args.update();

	  		this.dirty = false;
	  	};

	  	return EventDirective;
	  })();

	  var DOMEvent = (function () {
	  	function DOMEvent(name, owner) {
	  		classCallCheck(this, DOMEvent);

	  		if (name.indexOf('*') !== -1) {
	  			fatal('Only component proxy-events may contain "*" wildcards, <' + owner.name + ' on-' + name + '="..."/> is not valid');
	  		}

	  		this.name = name;
	  		this.owner = owner;
	  		this.node = null;
	  		this.handler = null;
	  	}

	  	DOMEvent.prototype.listen = function listen(directive) {
	  		var node = this.node = this.owner.node;
	  		var name = this.name;

	  		if (!('on' + name in node)) {
	  			warnOnce(missingPlugin(name, 'events'));
	  		}

	  		node.addEventListener(name, this.handler = function (event) {
	  			directive.fire({
	  				node: node,
	  				original: event
	  			});
	  		}, false);
	  	};

	  	DOMEvent.prototype.unlisten = function unlisten() {
	  		this.node.removeEventListener(this.name, this.handler, false);
	  	};

	  	return DOMEvent;
	  })();

	  var CustomEvent = (function () {
	  	function CustomEvent(eventPlugin, owner) {
	  		classCallCheck(this, CustomEvent);

	  		this.eventPlugin = eventPlugin;
	  		this.owner = owner;
	  		this.handler = null;
	  	}

	  	CustomEvent.prototype.listen = function listen(directive) {
	  		var node = this.owner.node;

	  		this.handler = this.eventPlugin(node, function () {
	  			var event = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  			event.node = event.node || node;
	  			directive.fire(event);
	  		});
	  	};

	  	CustomEvent.prototype.unlisten = function unlisten() {
	  		this.handler.teardown();
	  	};

	  	return CustomEvent;
	  })();

	  function camelCase (hyphenatedStr) {
	  	return hyphenatedStr.replace(/-([a-zA-Z])/g, function (match, $1) {
	  		return $1.toUpperCase();
	  	});
	  }

	  var prefix$1 = undefined;

	  if (!isClient) {
	  	prefix$1 = null;
	  } else {
	  	(function () {
	  		var prefixCache = {};
	  		var testStyle = createElement('div').style;

	  		prefix$1 = function (prop) {
	  			prop = camelCase(prop);

	  			if (!prefixCache[prop]) {
	  				if (testStyle[prop] !== undefined) {
	  					prefixCache[prop] = prop;
	  				} else {
	  					// test vendors...
	  					var capped = prop.charAt(0).toUpperCase() + prop.substring(1);

	  					var i = vendors.length;
	  					while (i--) {
	  						var vendor = vendors[i];
	  						if (testStyle[vendor + capped] !== undefined) {
	  							prefixCache[prop] = vendor + capped;
	  							break;
	  						}
	  					}
	  				}
	  			}

	  			return prefixCache[prop];
	  		};
	  	})();
	  }

	  var prefix$2 = prefix$1;

	  var visible = undefined;
	  var hidden = 'hidden';

	  if (doc) {
	  	var prefix$3 = undefined;

	  	if (hidden in doc) {
	  		prefix$3 = '';
	  	} else {
	  		var i$2 = vendors.length;
	  		while (i$2--) {
	  			var vendor = vendors[i$2];
	  			hidden = vendor + 'Hidden';

	  			if (hidden in doc) {
	  				prefix$3 = vendor;
	  				break;
	  			}
	  		}
	  	}

	  	if (prefix$3 !== undefined) {
	  		doc.addEventListener(prefix$3 + 'visibilitychange', onChange);
	  		onChange();
	  	} else {
	  		// gah, we're in an old browser
	  		if ('onfocusout' in doc) {
	  			doc.addEventListener('focusout', onHide);
	  			doc.addEventListener('focusin', onShow);
	  		} else {
	  			win.addEventListener('pagehide', onHide);
	  			win.addEventListener('blur', onHide);

	  			win.addEventListener('pageshow', onShow);
	  			win.addEventListener('focus', onShow);
	  		}

	  		visible = true; // until proven otherwise. Not ideal but hey
	  	}
	  }

	  function onChange() {
	  	visible = !doc[hidden];
	  }

	  function onHide() {
	  	visible = false;
	  }

	  function onShow() {
	  	visible = true;
	  }

	  function snap(to) {
	  	return function () {
	  		return to;
	  	};
	  }

	  var interpolators = {
	  	number: function (from, to) {
	  		var delta;

	  		if (!isNumeric(from) || !isNumeric(to)) {
	  			return null;
	  		}

	  		from = +from;
	  		to = +to;

	  		delta = to - from;

	  		if (!delta) {
	  			return function () {
	  				return from;
	  			};
	  		}

	  		return function (t) {
	  			return from + t * delta;
	  		};
	  	},

	  	array: function (from, to) {
	  		var intermediate, interpolators, len, i;

	  		if (!isArray(from) || !isArray(to)) {
	  			return null;
	  		}

	  		intermediate = [];
	  		interpolators = [];

	  		i = len = Math.min(from.length, to.length);
	  		while (i--) {
	  			interpolators[i] = interpolate(from[i], to[i]);
	  		}

	  		// surplus values - don't interpolate, but don't exclude them either
	  		for (i = len; i < from.length; i += 1) {
	  			intermediate[i] = from[i];
	  		}

	  		for (i = len; i < to.length; i += 1) {
	  			intermediate[i] = to[i];
	  		}

	  		return function (t) {
	  			var i = len;

	  			while (i--) {
	  				intermediate[i] = interpolators[i](t);
	  			}

	  			return intermediate;
	  		};
	  	},

	  	object: function (from, to) {
	  		var properties, len, interpolators, intermediate, prop;

	  		if (!isObject(from) || !isObject(to)) {
	  			return null;
	  		}

	  		properties = [];
	  		intermediate = {};
	  		interpolators = {};

	  		for (prop in from) {
	  			if (hasOwn.call(from, prop)) {
	  				if (hasOwn.call(to, prop)) {
	  					properties.push(prop);
	  					interpolators[prop] = interpolate(from[prop], to[prop]) || snap(to[prop]);
	  				} else {
	  					intermediate[prop] = from[prop];
	  				}
	  			}
	  		}

	  		for (prop in to) {
	  			if (hasOwn.call(to, prop) && !hasOwn.call(from, prop)) {
	  				intermediate[prop] = to[prop];
	  			}
	  		}

	  		len = properties.length;

	  		return function (t) {
	  			var i = len,
	  			    prop;

	  			while (i--) {
	  				prop = properties[i];

	  				intermediate[prop] = interpolators[prop](t);
	  			}

	  			return intermediate;
	  		};
	  	}
	  };

	  var interpolators$1 = interpolators;

	  function interpolate(from, to, ractive, type) {
	  	if (from === to) return null;

	  	if (type) {
	  		var interpol = findInViewHierarchy('interpolators', ractive, type);
	  		if (interpol) return interpol(from, to) || null;

	  		fatal(missingPlugin(type, 'interpolator'));
	  	}

	  	return interpolators$1.number(from, to) || interpolators$1.array(from, to) || interpolators$1.object(from, to) || null;
	  }

	  var unprefixPattern = new RegExp('^-(?:' + vendors.join('|') + ')-');

	  function unprefix (prop) {
	  	return prop.replace(unprefixPattern, '');
	  }

	  var vendorPattern = new RegExp('^(?:' + vendors.join('|') + ')([A-Z])');

	  function hyphenate (str) {
	  	if (!str) return ''; // edge case

	  	if (vendorPattern.test(str)) str = '-' + str;

	  	return str.replace(/[A-Z]/g, function (match) {
	  		return '-' + match.toLowerCase();
	  	});
	  }

	  var createTransitions = undefined;

	  if (!isClient) {
	  	createTransitions = null;
	  } else {
	  	(function () {
	  		var testStyle = createElement('div').style;
	  		var linear = function (x) {
	  			return x;
	  		};

	  		var canUseCssTransitions = {};
	  		var cannotUseCssTransitions = {};

	  		// determine some facts about our environment
	  		var TRANSITION = undefined;
	  		var TRANSITIONEND = undefined;
	  		var CSS_TRANSITIONS_ENABLED = undefined;
	  		var TRANSITION_DURATION = undefined;
	  		var TRANSITION_PROPERTY = undefined;
	  		var TRANSITION_TIMING_FUNCTION = undefined;

	  		if (testStyle.transition !== undefined) {
	  			TRANSITION = 'transition';
	  			TRANSITIONEND = 'transitionend';
	  			CSS_TRANSITIONS_ENABLED = true;
	  		} else if (testStyle.webkitTransition !== undefined) {
	  			TRANSITION = 'webkitTransition';
	  			TRANSITIONEND = 'webkitTransitionEnd';
	  			CSS_TRANSITIONS_ENABLED = true;
	  		} else {
	  			CSS_TRANSITIONS_ENABLED = false;
	  		}

	  		if (TRANSITION) {
	  			TRANSITION_DURATION = TRANSITION + 'Duration';
	  			TRANSITION_PROPERTY = TRANSITION + 'Property';
	  			TRANSITION_TIMING_FUNCTION = TRANSITION + 'TimingFunction';
	  		}

	  		createTransitions = function (t, to, options, changedProperties, resolve) {

	  			// Wait a beat (otherwise the target styles will be applied immediately)
	  			// TODO use a fastdom-style mechanism?
	  			setTimeout(function () {
	  				var jsTransitionsComplete = undefined;
	  				var cssTransitionsComplete = undefined;

	  				function checkComplete() {
	  					if (jsTransitionsComplete && cssTransitionsComplete) {
	  						// will changes to events and fire have an unexpected consequence here?
	  						t.ractive.fire(t.name + ':end', t.node, t.isIntro);
	  						resolve();
	  					}
	  				}

	  				// this is used to keep track of which elements can use CSS to animate
	  				// which properties
	  				var hashPrefix = (t.node.namespaceURI || '') + t.node.tagName;

	  				t.node.style[TRANSITION_PROPERTY] = changedProperties.map(prefix$2).map(hyphenate).join(',');
	  				t.node.style[TRANSITION_TIMING_FUNCTION] = hyphenate(options.easing || 'linear');
	  				t.node.style[TRANSITION_DURATION] = options.duration / 1000 + 's';

	  				function transitionEndHandler(event) {
	  					var index = changedProperties.indexOf(camelCase(unprefix(event.propertyName)));
	  					if (index !== -1) {
	  						changedProperties.splice(index, 1);
	  					}

	  					if (changedProperties.length) {
	  						// still transitioning...
	  						return;
	  					}

	  					t.node.removeEventListener(TRANSITIONEND, transitionEndHandler, false);

	  					cssTransitionsComplete = true;
	  					checkComplete();
	  				}

	  				t.node.addEventListener(TRANSITIONEND, transitionEndHandler, false);

	  				setTimeout(function () {
	  					var i = changedProperties.length;
	  					var hash = undefined;
	  					var originalValue = undefined;
	  					var index = undefined;
	  					var propertiesToTransitionInJs = [];
	  					var prop = undefined;
	  					var suffix = undefined;
	  					var interpolator = undefined;

	  					while (i--) {
	  						prop = changedProperties[i];
	  						hash = hashPrefix + prop;

	  						if (CSS_TRANSITIONS_ENABLED && !cannotUseCssTransitions[hash]) {
	  							t.node.style[prefix$2(prop)] = to[prop];

	  							// If we're not sure if CSS transitions are supported for
	  							// this tag/property combo, find out now
	  							if (!canUseCssTransitions[hash]) {
	  								originalValue = t.getStyle(prop);

	  								// if this property is transitionable in this browser,
	  								// the current style will be different from the target style
	  								canUseCssTransitions[hash] = t.getStyle(prop) != to[prop];
	  								cannotUseCssTransitions[hash] = !canUseCssTransitions[hash];

	  								// Reset, if we're going to use timers after all
	  								if (cannotUseCssTransitions[hash]) {
	  									t.node.style[prefix$2(prop)] = originalValue;
	  								}
	  							}
	  						}

	  						if (!CSS_TRANSITIONS_ENABLED || cannotUseCssTransitions[hash]) {
	  							// we need to fall back to timer-based stuff
	  							if (originalValue === undefined) {
	  								originalValue = t.getStyle(prop);
	  							}

	  							// need to remove this from changedProperties, otherwise transitionEndHandler
	  							// will get confused
	  							index = changedProperties.indexOf(prop);
	  							if (index === -1) {
	  								warnIfDebug('Something very strange happened with transitions. Please raise an issue at https://github.com/ractivejs/ractive/issues - thanks!', { node: t.node });
	  							} else {
	  								changedProperties.splice(index, 1);
	  							}

	  							// TODO Determine whether this property is animatable at all

	  							suffix = /[^\d]*$/.exec(to[prop])[0];
	  							interpolator = interpolate(parseFloat(originalValue), parseFloat(to[prop])) || function () {
	  								return to[prop];
	  							};

	  							// ...then kick off a timer-based transition
	  							propertiesToTransitionInJs.push({
	  								name: prefix$2(prop),
	  								interpolator: interpolator,
	  								suffix: suffix
	  							});
	  						}
	  					}

	  					// javascript transitions
	  					if (propertiesToTransitionInJs.length) {
	  						var easing = undefined;

	  						if (typeof options.easing === 'string') {
	  							easing = t.ractive.easing[options.easing];

	  							if (!easing) {
	  								warnOnceIfDebug(missingPlugin(options.easing, 'easing'));
	  								easing = linear;
	  							}
	  						} else if (typeof options.easing === 'function') {
	  							easing = options.easing;
	  						} else {
	  							easing = linear;
	  						}

	  						new Ticker({
	  							duration: options.duration,
	  							easing: easing,
	  							step: function (pos) {
	  								var i = propertiesToTransitionInJs.length;
	  								while (i--) {
	  									var _prop = propertiesToTransitionInJs[i];
	  									t.node.style[_prop.name] = _prop.interpolator(pos) + _prop.suffix;
	  								}
	  							},
	  							complete: function () {
	  								jsTransitionsComplete = true;
	  								checkComplete();
	  							}
	  						});
	  					} else {
	  						jsTransitionsComplete = true;
	  					}

	  					if (!changedProperties.length) {
	  						// We need to cancel the transitionEndHandler, and deal with
	  						// the fact that it will never fire
	  						t.node.removeEventListener(TRANSITIONEND, transitionEndHandler, false);
	  						cssTransitionsComplete = true;
	  						checkComplete();
	  					}
	  				}, 0);
	  			}, options.delay || 0);
	  		};
	  	})();
	  }

	  var createTransitions$1 = createTransitions;

	  function resetStyle(node, style) {
	  	if (style) {
	  		node.setAttribute('style', style);
	  	} else {
	  		// Next line is necessary, to remove empty style attribute!
	  		// See http://stackoverflow.com/a/7167553
	  		node.getAttribute('style');
	  		node.removeAttribute('style');
	  	}
	  }

	  var getComputedStyle = win && (win.getComputedStyle || legacy.getComputedStyle);
	  var resolved = Promise$1.resolve();

	  var Transition = (function () {
	  	function Transition(owner, template, isIntro) {
	  		classCallCheck(this, Transition);

	  		this.owner = owner;
	  		this.isIntro = isIntro;
	  		this.ractive = owner.ractive;

	  		var ractive = owner.ractive;

	  		var name = template.n || template;

	  		if (typeof name !== 'string') {
	  			var fragment = new Fragment({
	  				owner: owner,
	  				template: name
	  			}).bind(); // TODO need a way to capture values without bind()

	  			name = fragment.toString();
	  			fragment.unbind();

	  			if (name === '') {
	  				// empty string okay, just no transition
	  				return;
	  			}
	  		}

	  		this.name = name;

	  		if (template.a) {
	  			this.params = template.a;
	  		} else if (template.d) {
	  			// TODO is there a way to interpret dynamic arguments without all the
	  			// 'dependency thrashing'?
	  			var fragment = new Fragment({
	  				owner: owner,
	  				template: template.d
	  			}).bind();

	  			this.params = fragment.getArgsList();
	  			fragment.unbind();
	  		}

	  		this._fn = findInViewHierarchy('transitions', ractive, name);

	  		if (!this._fn) {
	  			warnOnceIfDebug(missingPlugin(name, 'transition'), { ractive: ractive });
	  		}
	  	}

	  	Transition.prototype.animateStyle = function animateStyle(style, value, options) {
	  		var _this = this;

	  		if (arguments.length === 4) {
	  			throw new Error('t.animateStyle() returns a promise - use .then() instead of passing a callback');
	  		}

	  		// Special case - page isn't visible. Don't animate anything, because
	  		// that way you'll never get CSS transitionend events
	  		if (!visible) {
	  			this.setStyle(style, value);
	  			return resolved;
	  		}

	  		var to = undefined;

	  		if (typeof style === 'string') {
	  			to = {};
	  			to[style] = value;
	  		} else {
	  			to = style;

	  			// shuffle arguments
	  			options = value;
	  		}

	  		// As of 0.3.9, transition authors should supply an `option` object with
	  		// `duration` and `easing` properties (and optional `delay`), plus a
	  		// callback function that gets called after the animation completes

	  		// TODO remove this check in a future version
	  		if (!options) {
	  			warnOnceIfDebug('The "%s" transition does not supply an options object to `t.animateStyle()`. This will break in a future version of Ractive. For more info see https://github.com/RactiveJS/Ractive/issues/340', this.name);
	  			options = this;
	  		}

	  		return new Promise$1(function (fulfil) {
	  			// Edge case - if duration is zero, set style synchronously and complete
	  			if (!options.duration) {
	  				_this.setStyle(to);
	  				fulfil();
	  				return;
	  			}

	  			// Get a list of the properties we're animating
	  			var propertyNames = Object.keys(to);
	  			var changedProperties = [];

	  			// Store the current styles
	  			var computedStyle = getComputedStyle(_this.node);

	  			var i = propertyNames.length;
	  			while (i--) {
	  				var prop = propertyNames[i];
	  				var current = computedStyle[prefix$2(prop)];

	  				if (current === '0px') current = 0;

	  				// we need to know if we're actually changing anything
	  				if (current != to[prop]) {
	  					// use != instead of !==, so we can compare strings with numbers
	  					changedProperties.push(prop);

	  					// make the computed style explicit, so we can animate where
	  					// e.g. height='auto'
	  					_this.node.style[prefix$2(prop)] = current;
	  				}
	  			}

	  			// If we're not actually changing anything, the transitionend event
	  			// will never fire! So we complete early
	  			if (!changedProperties.length) {
	  				fulfil();
	  				return;
	  			}

	  			createTransitions$1(_this, to, options, changedProperties, fulfil);
	  		});
	  	};

	  	Transition.prototype.getStyle = function getStyle(props) {
	  		var computedStyle = getComputedStyle(this.node);

	  		if (typeof props === 'string') {
	  			var value = computedStyle[prefix$2(props)];
	  			return value === '0px' ? 0 : value;
	  		}

	  		if (!isArray(props)) {
	  			throw new Error('Transition$getStyle must be passed a string, or an array of strings representing CSS properties');
	  		}

	  		var styles = {};

	  		var i = props.length;
	  		while (i--) {
	  			var prop = props[i];
	  			var value = computedStyle[prefix$2(prop)];

	  			if (value === '0px') value = 0;
	  			styles[prop] = value;
	  		}

	  		return styles;
	  	};

	  	Transition.prototype.processParams = function processParams(params, defaults) {
	  		if (typeof params === 'number') {
	  			params = { duration: params };
	  		} else if (typeof params === 'string') {
	  			if (params === 'slow') {
	  				params = { duration: 600 };
	  			} else if (params === 'fast') {
	  				params = { duration: 200 };
	  			} else {
	  				params = { duration: 400 };
	  			}
	  		} else if (!params) {
	  			params = {};
	  		}

	  		return extend({}, defaults, params);
	  	};

	  	Transition.prototype.setStyle = function setStyle(style, value) {
	  		if (typeof style === 'string') {
	  			this.node.style[prefix$2(style)] = value;
	  		} else {
	  			var prop = undefined;
	  			for (prop in style) {
	  				if (style.hasOwnProperty(prop)) {
	  					this.node.style[prefix$2(prop)] = style[prop];
	  				}
	  			}
	  		}

	  		return this;
	  	};

	  	Transition.prototype.start = function start() {
	  		var _this2 = this;

	  		var node = this.node = this.owner.node;
	  		var originalStyle = node.getAttribute('style');

	  		var completed = undefined;

	  		// create t.complete() - we don't want this on the prototype,
	  		// because we don't want `this` silliness when passing it as
	  		// an argument
	  		this.complete = function (noReset) {
	  			if (completed) {
	  				return;
	  			}

	  			if (!noReset && _this2.isIntro) {
	  				resetStyle(node, originalStyle);
	  			}

	  			_this2._manager.remove(_this2);

	  			completed = true;
	  		};

	  		// If the transition function doesn't exist, abort
	  		if (!this._fn) {
	  			this.complete();
	  			return;
	  		}

	  		this._fn.apply(this.ractive, [this].concat(this.params));
	  	};

	  	return Transition;
	  })();

	  function updateLiveQueries$1(element) {
	  	// Does this need to be added to any live queries?
	  	var node = element.node;
	  	var instance = element.ractive;

	  	do {
	  		var liveQueries = instance._liveQueries;

	  		var i = liveQueries.length;
	  		while (i--) {
	  			var selector = liveQueries[i];
	  			var query = liveQueries["_" + selector];

	  			if (query.test(node)) {
	  				query.add(node);
	  				// keep register of applicable selectors, for when we teardown
	  				element.liveQueries.push(query);
	  			}
	  		}
	  	} while (instance = instance.parent);
	  }

	  // TODO element.parent currently undefined
	  function findParentForm(element) {
	  	while (element = element.parent) {
	  		if (element.name === 'form') {
	  			return element;
	  		}
	  	}
	  }

	  function warnAboutAmbiguity(description, ractive) {
	  	warnOnceIfDebug('The ' + description + ' being used for two-way binding is ambiguous, and may cause unexpected results. Consider initialising your data to eliminate the ambiguity', { ractive: ractive });
	  }

	  var Binding = (function () {
	  	function Binding(element) {
	  		var name = arguments.length <= 1 || arguments[1] === undefined ? 'value' : arguments[1];
	  		classCallCheck(this, Binding);

	  		this.element = element;
	  		this.ractive = element.ractive;
	  		this.attribute = element.attributeByName[name];

	  		var interpolator = this.attribute.interpolator;
	  		interpolator.twowayBinding = this;

	  		var model = interpolator.model;

	  		// not bound?
	  		if (!model) {
	  			// try to force resolution
	  			interpolator.resolver.forceResolution();
	  			model = interpolator.model;

	  			warnAboutAmbiguity('\'' + interpolator.template.r + '\' reference', this.ractive);
	  		} else if (model.isUnresolved) {
	  			// reference expressions (e.g. foo[bar])
	  			model.forceResolution();
	  			warnAboutAmbiguity('expression', this.ractive);
	  		}

	  		// TODO include index/key/keypath refs as read-only
	  		else if (model.isReadonly) {
	  				var keypath = model.getKeypath().replace(/^@/, '');
	  				warnOnceIfDebug('Cannot use two-way binding on <' + element.name + '> element: ' + keypath + ' is read-only. To suppress this warning use <' + element.name + ' twoway=\'false\'...>', { ractive: this.ractive });
	  				return false;
	  			}

	  		this.attribute.isTwoway = true;
	  		this.model = model;

	  		// initialise value, if it's undefined
	  		var value = model.get();
	  		this.wasUndefined = value === undefined;

	  		if (value === undefined && this.getInitialValue) {
	  			value = this.getInitialValue();
	  			model.set(value);
	  		}

	  		var parentForm = findParentForm(element);
	  		if (parentForm) {
	  			this.resetValue = value;
	  			parentForm.formBindings.push(this);
	  		}
	  	}

	  	Binding.prototype.bind = function bind() {
	  		this.model.registerTwowayBinding(this);
	  	};

	  	Binding.prototype.handleChange = function handleChange() {
	  		var _this = this;

	  		runloop.start(this.root);
	  		this.attribute.locked = true;
	  		this.model.set(this.getValue());
	  		runloop.scheduleTask(function () {
	  			return _this.attribute.locked = false;
	  		});
	  		runloop.end();
	  	};

	  	Binding.prototype.rebind = function rebind() {
	  		// TODO what does this work with CheckboxNameBinding et al?
	  		this.unbind();
	  		this.model = this.attribute.interpolator.model;
	  		this.bind();
	  	};

	  	Binding.prototype.render = function render() {
	  		this.node = this.element.node;
	  		this.node._ractive.binding = this;
	  		this.rendered = true; // TODO is this used anywhere?
	  	};

	  	Binding.prototype.setFromNode = function setFromNode(node) {
	  		this.model.set(node.value);
	  	};

	  	Binding.prototype.unbind = function unbind() {
	  		this.model.unregisterTwowayBinding(this);
	  	};

	  	Binding.prototype.unrender = function unrender() {
	  		// noop?
	  	};

	  	return Binding;
	  })();

	  // This is the handler for DOM events that would lead to a change in the model
	  // (i.e. change, sometimes, input, and occasionally click and keyup)

	  function handleDomEvent() {
	  	this._ractive.binding.handleChange();
	  }

	  var CheckboxBinding = (function (_Binding) {
	  	inherits(CheckboxBinding, _Binding);

	  	function CheckboxBinding(element) {
	  		classCallCheck(this, CheckboxBinding);

	  		_Binding.call(this, element, 'checked');
	  	}

	  	CheckboxBinding.prototype.render = function render() {
	  		_Binding.prototype.render.call(this);

	  		this.node.addEventListener('change', handleDomEvent, false);

	  		if (this.node.attachEvent) {
	  			this.node.addEventListener('click', handleDomEvent, false);
	  		}
	  	};

	  	CheckboxBinding.prototype.unrender = function unrender() {
	  		this.node.removeEventListener('change', handleDomEvent, false);
	  		this.node.removeEventListener('click', handleDomEvent, false);
	  	};

	  	CheckboxBinding.prototype.getInitialValue = function getInitialValue() {
	  		return !!this.element.getAttribute('checked');
	  	};

	  	CheckboxBinding.prototype.getValue = function getValue() {
	  		return this.node.checked;
	  	};

	  	CheckboxBinding.prototype.setFromNode = function setFromNode(node) {
	  		this.model.set(node.checked);
	  	};

	  	return CheckboxBinding;
	  })(Binding);

	  function getBindingGroup(group, model, getValue) {
	  	var hash = group + "-bindingGroup";
	  	return model[hash] || (model[hash] = new BindingGroup(hash, model, getValue));
	  }

	  var BindingGroup = (function () {
	  	function BindingGroup(hash, model, getValue) {
	  		var _this = this;

	  		classCallCheck(this, BindingGroup);

	  		this.model = model;
	  		this.hash = hash;
	  		this.getValue = function () {
	  			_this.value = getValue.call(_this);
	  			return _this.value;
	  		};

	  		this.bindings = [];
	  	}

	  	BindingGroup.prototype.add = function add(binding) {
	  		this.bindings.push(binding);
	  	};

	  	BindingGroup.prototype.bind = function bind() {
	  		this.value = this.model.get();
	  		this.model.registerTwowayBinding(this);
	  		this.bound = true;
	  	};

	  	BindingGroup.prototype.remove = function remove(binding) {
	  		removeFromArray(this.bindings, binding);
	  		if (!this.bindings.length) {
	  			this.unbind();
	  		}
	  	};

	  	BindingGroup.prototype.unbind = function unbind() {
	  		this.model.unregisterTwowayBinding(this);
	  		this.bound = false;
	  		delete this.model[this.hash];
	  	};

	  	return BindingGroup;
	  })();

	  var push$1 = [].push;

	  function getValue$1() {
	  	var all = this.bindings.filter(function (b) {
	  		return b.node && b.node.checked;
	  	}).map(function (b) {
	  		return b.element.getAttribute('value');
	  	});
	  	var res = [];
	  	all.forEach(function (v) {
	  		if (!arrayContains(res, v)) res.push(v);
	  	});
	  	return res;
	  }

	  var CheckboxNameBinding = (function (_Binding) {
	  	inherits(CheckboxNameBinding, _Binding);

	  	function CheckboxNameBinding(element) {
	  		classCallCheck(this, CheckboxNameBinding);

	  		_Binding.call(this, element, 'name');

	  		this.checkboxName = true; // so that ractive.updateModel() knows what to do with this

	  		// Each input has a reference to an array containing it and its
	  		// group, as two-way binding depends on being able to ascertain
	  		// the status of all inputs within the group
	  		this.group = getBindingGroup('checkboxes', this.model, getValue$1);
	  		this.group.add(this);

	  		if (this.noInitialValue) {
	  			this.group.noInitialValue = true;
	  		}

	  		// If no initial value was set, and this input is checked, we
	  		// update the model
	  		if (this.group.noInitialValue && this.element.getAttribute('checked')) {
	  			var existingValue = this.model.get();
	  			var bindingValue = this.element.getAttribute('value');

	  			if (!arrayContains(existingValue, bindingValue)) {
	  				push$1.call(existingValue, bindingValue); // to avoid triggering runloop with array adaptor
	  			}
	  		}
	  	}

	  	CheckboxNameBinding.prototype.bind = function bind() {
	  		if (!this.group.bound) {
	  			this.group.bind();
	  		}
	  	};

	  	CheckboxNameBinding.prototype.changed = function changed() {
	  		var wasChecked = !!this.isChecked;
	  		this.isChecked = this.node.checked;
	  		return this.isChecked === wasChecked;
	  	};

	  	CheckboxNameBinding.prototype.getInitialValue = function getInitialValue() {
	  		// This only gets called once per group (of inputs that
	  		// share a name), because it only gets called if there
	  		// isn't an initial value. By the same token, we can make
	  		// a note of that fact that there was no initial value,
	  		// and populate it using any `checked` attributes that
	  		// exist (which users should avoid, but which we should
	  		// support anyway to avoid breaking expectations)
	  		this.noInitialValue = true; // TODO are noInitialValue and wasUndefined the same thing?
	  		return [];
	  	};

	  	CheckboxNameBinding.prototype.getValue = function getValue() {
	  		return this.group.value;
	  	};

	  	CheckboxNameBinding.prototype.handleChange = function handleChange() {
	  		this.isChecked = this.element.node.checked;
	  		this.group.value = this.model.get();
	  		var value = this.element.getAttribute('value');
	  		if (this.isChecked && !arrayContains(this.group.value, value)) {
	  			this.group.value.push(value);
	  		} else if (!this.isChecked && arrayContains(this.group.value, value)) {
	  			removeFromArray(this.group.value, value);
	  		}
	  		_Binding.prototype.handleChange.call(this);
	  	};

	  	CheckboxNameBinding.prototype.render = function render() {
	  		_Binding.prototype.render.call(this);

	  		var node = this.node;

	  		var existingValue = this.model.get();
	  		var bindingValue = this.element.getAttribute('value');

	  		if (isArray(existingValue)) {
	  			this.isChecked = arrayContains(existingValue, bindingValue);
	  		} else {
	  			this.isChecked = existingValue == bindingValue;
	  		}

	  		node.name = '{{' + this.model.getKeypath() + '}}';
	  		node.checked = this.isChecked;

	  		node.addEventListener('change', handleDomEvent, false);

	  		// in case of IE emergency, bind to click event as well
	  		if (node.attachEvent) {
	  			node.addEventListener('click', handleDomEvent, false);
	  		}
	  	};

	  	CheckboxNameBinding.prototype.setFromNode = function setFromNode(node) {
	  		this.group.bindings.forEach(function (binding) {
	  			return binding.wasUndefined = true;
	  		});

	  		if (node.checked) {
	  			var valueSoFar = this.group.getValue();
	  			valueSoFar.push(this.element.getAttribute('value'));

	  			this.group.model.set(valueSoFar);
	  		}
	  	};

	  	CheckboxNameBinding.prototype.unbind = function unbind() {
	  		this.group.remove(this);
	  	};

	  	CheckboxNameBinding.prototype.unrender = function unrender() {
	  		var node = this.element.node;

	  		node.removeEventListener('change', handleDomEvent, false);
	  		node.removeEventListener('click', handleDomEvent, false);
	  	};

	  	return CheckboxNameBinding;
	  })(Binding);

	  var ContentEditableBinding = (function (_Binding) {
	  	inherits(ContentEditableBinding, _Binding);

	  	function ContentEditableBinding() {
	  		classCallCheck(this, ContentEditableBinding);

	  		_Binding.apply(this, arguments);
	  	}

	  	ContentEditableBinding.prototype.getInitialValue = function getInitialValue() {
	  		return this.element.fragment ? this.element.fragment.toString() : '';
	  	};

	  	ContentEditableBinding.prototype.getValue = function getValue() {
	  		return this.element.node.innerHTML;
	  	};

	  	ContentEditableBinding.prototype.render = function render() {
	  		_Binding.prototype.render.call(this);

	  		var node = this.node;

	  		node.addEventListener('change', handleDomEvent, false);
	  		node.addEventListener('blur', handleDomEvent, false);

	  		if (!this.ractive.lazy) {
	  			node.addEventListener('input', handleDomEvent, false);

	  			if (node.attachEvent) {
	  				node.addEventListener('keyup', handleDomEvent, false);
	  			}
	  		}
	  	};

	  	ContentEditableBinding.prototype.setFromNode = function setFromNode(node) {
	  		this.model.set(node.innerHTML);
	  	};

	  	ContentEditableBinding.prototype.unrender = function unrender() {
	  		var node = this.node;

	  		node.removeEventListener('blur', handleDomEvent, false);
	  		node.removeEventListener('change', handleDomEvent, false);
	  		node.removeEventListener('input', handleDomEvent, false);
	  		node.removeEventListener('keyup', handleDomEvent, false);
	  	};

	  	return ContentEditableBinding;
	  })(Binding);

	  function handleBlur() {
	  	handleDomEvent.call(this);

	  	var value = this._ractive.binding.model.get();
	  	this.value = value == undefined ? '' : value;
	  }

	  function handleDelay(delay) {
	  	var timeout = undefined;

	  	return function () {
	  		var _this = this;

	  		if (timeout) clearTimeout(timeout);

	  		timeout = setTimeout(function () {
	  			var binding = _this._ractive.binding;
	  			if (binding.rendered) handleDomEvent.call(_this);
	  			timeout = null;
	  		}, delay);
	  	};
	  }

	  var GenericBinding = (function (_Binding) {
	  	inherits(GenericBinding, _Binding);

	  	function GenericBinding() {
	  		classCallCheck(this, GenericBinding);

	  		_Binding.apply(this, arguments);
	  	}

	  	GenericBinding.prototype.getInitialValue = function getInitialValue() {
	  		return '';
	  	};

	  	GenericBinding.prototype.getValue = function getValue() {
	  		return this.node.value;
	  	};

	  	GenericBinding.prototype.render = function render() {
	  		_Binding.prototype.render.call(this);

	  		// any lazy setting for this element overrides the root
	  		// if the value is a number, it's a timeout
	  		var lazy = this.ractive.lazy;
	  		var timeout = false;

	  		// TODO handle at parse time
	  		if (this.element.template.a && 'lazy' in this.element.template.a) {
	  			lazy = this.element.template.a.lazy;
	  			if (lazy === 0) lazy = true; // empty attribute
	  		}

	  		// TODO handle this at parse time as well?
	  		if (lazy === 'false') lazy = false;

	  		if (isNumeric(lazy)) {
	  			timeout = +lazy;
	  			lazy = false;
	  		}

	  		this.handler = timeout ? handleDelay(timeout) : handleDomEvent;

	  		var node = this.node;

	  		node.addEventListener('change', handleDomEvent, false);

	  		if (!lazy) {
	  			node.addEventListener('input', this.handler, false);

	  			if (node.attachEvent) {
	  				node.addEventListener('keyup', this.handler, false);
	  			}
	  		}

	  		node.addEventListener('blur', handleBlur, false);
	  	};

	  	GenericBinding.prototype.unrender = function unrender() {
	  		var node = this.element.node;
	  		this.rendered = false;

	  		node.removeEventListener('change', handleDomEvent, false);
	  		node.removeEventListener('input', this.handler, false);
	  		node.removeEventListener('keyup', this.handler, false);
	  		node.removeEventListener('blur', handleBlur, false);
	  	};

	  	return GenericBinding;
	  })(Binding);

	  var MultipleSelectBinding = (function (_Binding) {
	  	inherits(MultipleSelectBinding, _Binding);

	  	function MultipleSelectBinding() {
	  		classCallCheck(this, MultipleSelectBinding);

	  		_Binding.apply(this, arguments);
	  	}

	  	MultipleSelectBinding.prototype.forceUpdate = function forceUpdate() {
	  		var _this = this;

	  		var value = this.getValue();

	  		if (value !== undefined) {
	  			this.attribute.locked = true;
	  			runloop.scheduleTask(function () {
	  				return _this.attribute.locked = false;
	  			});
	  			this.model.set(value);
	  		}
	  	};

	  	MultipleSelectBinding.prototype.getInitialValue = function getInitialValue() {
	  		return this.element.options.filter(function (option) {
	  			return option.getAttribute('selected');
	  		}).map(function (option) {
	  			return option.getAttribute('value');
	  		});
	  	};

	  	MultipleSelectBinding.prototype.getValue = function getValue() {
	  		var options = this.element.node.options;
	  		var len = options.length;

	  		var selectedValues = [];

	  		for (var i = 0; i < len; i += 1) {
	  			var option = options[i];

	  			if (option.selected) {
	  				var optionValue = option._ractive ? option._ractive.value : option.value;
	  				selectedValues.push(optionValue);
	  			}
	  		}

	  		return selectedValues;
	  	};

	  	MultipleSelectBinding.prototype.handleChange = function handleChange() {
	  		var attribute = this.attribute;
	  		var previousValue = attribute.getValue();

	  		var value = this.getValue();

	  		if (previousValue === undefined || !arrayContentsMatch(value, previousValue)) {
	  			_Binding.prototype.handleChange.call(this);
	  		}

	  		return this;
	  	};

	  	MultipleSelectBinding.prototype.render = function render() {
	  		_Binding.prototype.render.call(this);

	  		this.node.addEventListener('change', handleDomEvent, false);

	  		if (this.model.get() === undefined) {
	  			// get value from DOM, if possible
	  			this.handleChange();
	  		}
	  	};

	  	MultipleSelectBinding.prototype.setFromNode = function setFromNode(node) {
	  		var i = node.selectedOptions.length;
	  		var result = new Array(i);

	  		while (i--) {
	  			var option = node.selectedOptions[i];
	  			result[i] = option._ractive ? option._ractive.value : option.value;
	  		}

	  		this.model.set(result);
	  	};

	  	MultipleSelectBinding.prototype.setValue = function setValue() {
	  		throw new Error('TODO not implemented yet');
	  	};

	  	MultipleSelectBinding.prototype.unrender = function unrender() {
	  		this.node.removeEventListener('change', handleDomEvent, false);
	  	};

	  	MultipleSelectBinding.prototype.updateModel = function updateModel() {
	  		if (this.attribute.value === undefined || !this.attribute.value.length) {
	  			this.keypath.set(this.initialValue);
	  		}
	  	};

	  	return MultipleSelectBinding;
	  })(Binding);

	  var NumericBinding = (function (_GenericBinding) {
	  	inherits(NumericBinding, _GenericBinding);

	  	function NumericBinding() {
	  		classCallCheck(this, NumericBinding);

	  		_GenericBinding.apply(this, arguments);
	  	}

	  	NumericBinding.prototype.getInitialValue = function getInitialValue() {
	  		return undefined;
	  	};

	  	NumericBinding.prototype.getValue = function getValue() {
	  		var value = parseFloat(this.node.value);
	  		return isNaN(value) ? undefined : value;
	  	};

	  	NumericBinding.prototype.setFromNode = function setFromNode(node) {
	  		var value = parseFloat(node.value);
	  		if (!isNaN(value)) this.model.set(value);
	  	};

	  	return NumericBinding;
	  })(GenericBinding);

	  var siblings = {};

	  function getSiblings(hash) {
	  	return siblings[hash] || (siblings[hash] = []);
	  }

	  var RadioBinding = (function (_Binding) {
	  	inherits(RadioBinding, _Binding);

	  	function RadioBinding(element) {
	  		classCallCheck(this, RadioBinding);

	  		_Binding.call(this, element, 'checked');

	  		this.siblings = getSiblings(this.ractive._guid + this.element.getAttribute('name'));
	  		this.siblings.push(this);
	  	}

	  	RadioBinding.prototype.getValue = function getValue() {
	  		return this.node.checked;
	  	};

	  	RadioBinding.prototype.handleChange = function handleChange() {
	  		runloop.start(this.root);

	  		this.siblings.forEach(function (binding) {
	  			binding.model.set(binding.getValue());
	  		});

	  		runloop.end();
	  	};

	  	RadioBinding.prototype.render = function render() {
	  		_Binding.prototype.render.call(this);

	  		this.node.addEventListener('change', handleDomEvent, false);

	  		if (this.node.attachEvent) {
	  			this.node.addEventListener('click', handleDomEvent, false);
	  		}
	  	};

	  	RadioBinding.prototype.setFromNode = function setFromNode(node) {
	  		this.model.set(node.checked);
	  	};

	  	RadioBinding.prototype.unbind = function unbind() {
	  		removeFromArray(this.siblings, this);
	  	};

	  	RadioBinding.prototype.unrender = function unrender() {
	  		this.node.removeEventListener('change', handleDomEvent, false);
	  		this.node.removeEventListener('click', handleDomEvent, false);
	  	};

	  	return RadioBinding;
	  })(Binding);

	  function getValue$2() {
	  	var checked = this.bindings.filter(function (b) {
	  		return b.node.checked;
	  	});
	  	if (checked.length > 0) {
	  		return checked[0].element.getAttribute('value');
	  	}
	  }

	  var RadioNameBinding = (function (_Binding) {
	  	inherits(RadioNameBinding, _Binding);

	  	function RadioNameBinding(element) {
	  		classCallCheck(this, RadioNameBinding);

	  		_Binding.call(this, element, 'name');

	  		this.group = getBindingGroup('radioname', this.model, getValue$2);
	  		this.group.add(this);

	  		if (element.checked) {
	  			this.group.value = this.getValue();
	  		}
	  	}

	  	RadioNameBinding.prototype.bind = function bind() {
	  		var _this = this;

	  		if (!this.group.bound) {
	  			this.group.bind();
	  		}

	  		// update name keypath when necessary
	  		this.nameAttributeBinding = {
	  			handleChange: function () {
	  				return _this.node.name = '{{' + _this.model.getKeypath() + '}}';
	  			}
	  		};

	  		this.model.getKeypathModel().register(this.nameAttributeBinding);
	  	};

	  	RadioNameBinding.prototype.getInitialValue = function getInitialValue() {
	  		if (this.element.getAttribute('checked')) {
	  			return this.element.getAttribute('value');
	  		}
	  	};

	  	RadioNameBinding.prototype.getValue = function getValue() {
	  		return this.element.getAttribute('value');
	  	};

	  	RadioNameBinding.prototype.handleChange = function handleChange() {
	  		// If this <input> is the one that's checked, then the value of its
	  		// `name` model gets set to its value
	  		if (this.node.checked) {
	  			this.group.value = this.getValue();
	  			_Binding.prototype.handleChange.call(this);
	  		}
	  	};

	  	RadioNameBinding.prototype.render = function render() {
	  		_Binding.prototype.render.call(this);

	  		var node = this.node;

	  		node.name = '{{' + this.model.getKeypath() + '}}';
	  		node.checked = this.model.get() == this.element.getAttribute('value');

	  		node.addEventListener('change', handleDomEvent, false);

	  		if (node.attachEvent) {
	  			node.addEventListener('click', handleDomEvent, false);
	  		}
	  	};

	  	RadioNameBinding.prototype.setFromNode = function setFromNode(node) {
	  		if (node.checked) {
	  			this.group.model.set(this.element.getAttribute('value'));
	  		}
	  	};

	  	RadioNameBinding.prototype.unbind = function unbind() {
	  		this.group.remove(this);

	  		this.model.getKeypathModel().unregister(this.nameAttributeBinding);
	  	};

	  	RadioNameBinding.prototype.unrender = function unrender() {
	  		var node = this.node;

	  		node.removeEventListener('change', handleDomEvent, false);
	  		node.removeEventListener('click', handleDomEvent, false);
	  	};

	  	return RadioNameBinding;
	  })(Binding);

	  var SingleSelectBinding = (function (_Binding) {
	  	inherits(SingleSelectBinding, _Binding);

	  	function SingleSelectBinding() {
	  		classCallCheck(this, SingleSelectBinding);

	  		_Binding.apply(this, arguments);
	  	}

	  	SingleSelectBinding.prototype.forceUpdate = function forceUpdate() {
	  		var _this = this;

	  		var value = this.getValue();

	  		if (value !== undefined) {
	  			this.attribute.locked = true;
	  			runloop.scheduleTask(function () {
	  				return _this.attribute.locked = false;
	  			});
	  			this.model.set(value);
	  		}
	  	};

	  	SingleSelectBinding.prototype.getInitialValue = function getInitialValue() {
	  		if (this.element.getAttribute('value') !== undefined) {
	  			return;
	  		}

	  		var options = this.element.options;
	  		var len = options.length;

	  		if (!len) return;

	  		var value = undefined;
	  		var optionWasSelected = undefined;
	  		var i = len;

	  		// take the final selected option...
	  		while (i--) {
	  			var option = options[i];

	  			if (option.getAttribute('selected')) {
	  				if (!option.getAttribute('disabled')) {
	  					value = option.getAttribute('value');
	  				}

	  				optionWasSelected = true;
	  				break;
	  			}
	  		}

	  		// or the first non-disabled option, if none are selected
	  		if (!optionWasSelected) {
	  			while (++i < len) {
	  				if (!options[i].getAttribute('disabled')) {
	  					value = options[i].getAttribute('value');
	  					break;
	  				}
	  			}
	  		}

	  		// This is an optimisation (aka hack) that allows us to forgo some
	  		// other more expensive work
	  		// TODO does it still work? seems at odds with new architecture
	  		if (value !== undefined) {
	  			this.element.attributeByName.value.value = value;
	  		}

	  		return value;
	  	};

	  	SingleSelectBinding.prototype.getValue = function getValue() {
	  		var options = this.node.options;
	  		var len = options.length;

	  		var i = undefined;
	  		for (i = 0; i < len; i += 1) {
	  			var option = options[i];

	  			if (options[i].selected && !options[i].disabled) {
	  				return option._ractive ? option._ractive.value : option.value;
	  			}
	  		}
	  	};

	  	SingleSelectBinding.prototype.render = function render() {
	  		_Binding.prototype.render.call(this);
	  		this.node.addEventListener('change', handleDomEvent, false);
	  	};

	  	SingleSelectBinding.prototype.setFromNode = function setFromNode(node) {
	  		var option = node.selectedOptions[0];
	  		this.model.set(option._ractive ? option._ractive.value : option.value);
	  	};

	  	// TODO this method is an anomaly... is it necessary?

	  	SingleSelectBinding.prototype.setValue = function setValue(value) {
	  		this.model.set(value);
	  	};

	  	SingleSelectBinding.prototype.unrender = function unrender() {
	  		this.node.removeEventListener('change', handleDomEvent, false);
	  	};

	  	return SingleSelectBinding;
	  })(Binding);

	  function isBindable(attribute) {
	  	return attribute && attribute.template.length === 1 && attribute.template[0].t === INTERPOLATOR && !attribute.template[0].s;
	  }

	  function selectBinding(element) {
	  	var attributes = element.attributeByName;

	  	// contenteditable - bind if the contenteditable attribute is true
	  	// or is bindable and may thus become true...
	  	if (element.getAttribute('contenteditable') || isBindable(attributes.contenteditable)) {
	  		// ...and this element also has a value attribute to bind
	  		return isBindable(attributes.value) ? ContentEditableBinding : null;
	  	}

	  	// <input>
	  	if (element.name === 'input') {
	  		var type = element.getAttribute('type');

	  		if (type === 'radio' || type === 'checkbox') {
	  			var bindName = isBindable(attributes.name);
	  			var bindChecked = isBindable(attributes.checked);

	  			// for radios we can either bind the name attribute, or the checked attribute - not both
	  			if (bindName && bindChecked) {
	  				if (type === 'radio') {
	  					warnIfDebug('A radio input can have two-way binding on its name attribute, or its checked attribute - not both', { ractive: element.root });
	  				} else {
	  					// A checkbox with bindings for both name and checked - see https://github.com/ractivejs/ractive/issues/1749
	  					return CheckboxBinding;
	  				}
	  			}

	  			if (bindName) {
	  				return type === 'radio' ? RadioNameBinding : CheckboxNameBinding;
	  			}

	  			if (bindChecked) {
	  				return type === 'radio' ? RadioBinding : CheckboxBinding;
	  			}
	  		}

	  		if (type === 'file' && isBindable(attributes.value)) {
	  			return Binding;
	  		}

	  		if (isBindable(attributes.value)) {
	  			return type === 'number' || type === 'range' ? NumericBinding : GenericBinding;
	  		}

	  		return null;
	  	}

	  	// <select>
	  	if (element.name === 'select' && isBindable(attributes.value)) {
	  		return element.getAttribute('multiple') ? MultipleSelectBinding : SingleSelectBinding;
	  	}

	  	// <textarea>
	  	if (element.name === 'textarea' && isBindable(attributes.value)) {
	  		return GenericBinding;
	  	}
	  }

	  function makeDirty$1(query) {
	  	query.makeDirty();
	  }

	  var Element = (function (_Item) {
	  	inherits(Element, _Item);

	  	function Element(options) {
	  		var _this = this;

	  		classCallCheck(this, Element);

	  		_Item.call(this, options);

	  		this.liveQueries = []; // TODO rare case. can we handle differently?

	  		this.name = options.template.e.toLowerCase();
	  		this.isVoid = voidElementNames.test(this.name);

	  		// find parent element
	  		var fragment = this.parentFragment;
	  		while (fragment) {
	  			if (fragment.owner.type === ELEMENT) {
	  				this.parent = fragment.owner;
	  				break;
	  			}
	  			fragment = fragment.parent;
	  		}

	  		if (this.parent && this.parent.name === 'option') {
	  			throw new Error('An <option> element cannot contain other elements (encountered <' + this.name + '>)');
	  		}

	  		// create attributes
	  		this.attributeByName = {};
	  		this.attributes = [];

	  		if (this.template.a) {
	  			Object.keys(this.template.a).forEach(function (name) {
	  				// TODO process this at parse time
	  				if (name === 'twoway' || name === 'lazy') return;

	  				var attribute = new Attribute({
	  					name: name,
	  					element: _this,
	  					parentFragment: _this.parentFragment,
	  					template: _this.template.a[name]
	  				});

	  				_this.attributeByName[name] = attribute;

	  				if (name !== 'value' && name !== 'type') _this.attributes.push(attribute);
	  			});

	  			if (this.attributeByName.type) this.attributes.unshift(this.attributeByName.type);
	  			if (this.attributeByName.value) this.attributes.push(this.attributeByName.value);
	  		}

	  		// create conditional attributes
	  		this.conditionalAttributes = (this.template.m || []).map(function (template) {
	  			return new ConditionalAttribute({
	  				owner: _this,
	  				parentFragment: _this.parentFragment,
	  				template: template
	  			});
	  		});

	  		// create decorator
	  		if (this.template.o) {
	  			this.decorator = new Decorator(this, this.template.o);
	  		}

	  		// attach event handlers
	  		this.eventHandlers = [];
	  		if (this.template.v) {
	  			Object.keys(this.template.v).forEach(function (key) {
	  				var eventNames = key.split('-');
	  				var template = _this.template.v[key];

	  				eventNames.forEach(function (eventName) {
	  					var fn = findInViewHierarchy('events', _this.ractive, eventName);
	  					// we need to pass in "this" in order to get
	  					// access to node when it is created.
	  					var event = fn ? new CustomEvent(fn, _this) : new DOMEvent(eventName, _this);
	  					_this.eventHandlers.push(new EventDirective(_this, event, template));
	  				});
	  			});
	  		}

	  		// create children
	  		if (options.template.f && !options.noContent) {
	  			this.fragment = new Fragment({
	  				template: options.template.f,
	  				owner: this,
	  				cssIds: null
	  			});
	  		}

	  		this.binding = null; // filled in later
	  	}

	  	Element.prototype.bind = function bind() {
	  		this.attributes.forEach(_bind);
	  		this.conditionalAttributes.forEach(_bind);
	  		this.eventHandlers.forEach(_bind);

	  		if (this.decorator) this.decorator.bind();
	  		if (this.fragment) this.fragment.bind();

	  		// create two-way binding if necessary
	  		if (this.binding = this.createTwowayBinding()) this.binding.bind();
	  	};

	  	Element.prototype.createTwowayBinding = function createTwowayBinding() {
	  		var attributes = this.template.a;

	  		if (!attributes) return null;

	  		var shouldBind = 'twoway' in attributes ? attributes.twoway === 0 || attributes.twoway === 'true' : // covers `twoway` and `twoway='true'`
	  		this.ractive.twoway;

	  		if (!shouldBind) return null;

	  		var Binding = selectBinding(this);

	  		if (!Binding) return null;

	  		var binding = new Binding(this);

	  		return binding && binding.model ? binding : null;
	  	};

	  	Element.prototype.detach = function detach() {
	  		if (this.decorator) this.decorator.unrender();
	  		return detachNode(this.node);
	  	};

	  	Element.prototype.find = function find(selector) {
	  		if (matches(this.node, selector)) return this.node;
	  		if (this.fragment) {
	  			return this.fragment.find(selector);
	  		}
	  	};

	  	Element.prototype.findAll = function findAll(selector, query) {
	  		// Add this node to the query, if applicable, and register the
	  		// query on this element
	  		var matches = query.test(this.node);
	  		if (matches) {
	  			query.add(this.node);
	  			if (query.live) this.liveQueries.push(query);
	  		}

	  		if (this.fragment) {
	  			this.fragment.findAll(selector, query);
	  		}
	  	};

	  	Element.prototype.findComponent = function findComponent(name) {
	  		if (this.fragment) {
	  			return this.fragment.findComponent(name);
	  		}
	  	};

	  	Element.prototype.findAllComponents = function findAllComponents(name, query) {
	  		if (this.fragment) {
	  			this.fragment.findAllComponents(name, query);
	  		}
	  	};

	  	Element.prototype.findNextNode = function findNextNode() {
	  		return null;
	  	};

	  	Element.prototype.firstNode = function firstNode() {
	  		return this.node;
	  	};

	  	Element.prototype.getAttribute = function getAttribute(name) {
	  		var attribute = this.attributeByName[name];
	  		return attribute ? attribute.getValue() : undefined;
	  	};

	  	Element.prototype.rebind = function rebind() {
	  		this.attributes.forEach(_rebind);
	  		this.conditionalAttributes.forEach(_rebind);
	  		this.eventHandlers.forEach(_rebind);
	  		if (this.decorator) this.decorator.rebind();
	  		if (this.fragment) this.fragment.rebind();
	  		if (this.binding) this.binding.rebind();

	  		this.liveQueries.forEach(makeDirty$1);
	  	};

	  	Element.prototype.render = function render(target, occupants) {
	  		var _this2 = this;

	  		// TODO determine correct namespace
	  		this.namespace = getNamespace(this);

	  		var node = undefined;
	  		var existing = false;

	  		if (occupants) {
	  			var n = undefined;
	  			while (n = occupants.shift()) {
	  				if (n.nodeName === this.template.e.toUpperCase() && n.namespaceURI === this.namespace) {
	  					this.node = node = n;
	  					existing = true;
	  					break;
	  				} else {
	  					detachNode(n);
	  				}
	  			}
	  		}

	  		if (!node) {
	  			node = createElement(this.template.e, this.namespace, this.getAttribute('is'));
	  			this.node = node;
	  		}

	  		var context = this.parentFragment.findContext();

	  		defineProperty(node, '_ractive', {
	  			value: {
	  				proxy: this,
	  				ractive: this.ractive,
	  				fragment: this.parentFragment,
	  				context: context,
	  				keypath: context.getKeypath(this.ractive),
	  				rootpath: context.getKeypath()
	  			}
	  		});

	  		// Is this a top-level node of a component? If so, we may need to add
	  		// a data-ractive-css attribute, for CSS encapsulation
	  		if (this.parentFragment.cssIds) {
	  			node.setAttribute('data-ractive-css', this.parentFragment.cssIds.map(function (x) {
	  				return '{' + x + '}';
	  			}).join(' '));
	  		}

	  		if (this.fragment) {
	  			var children = existing ? toArray(node.childNodes) : undefined;
	  			this.fragment.render(node, children);

	  			// clean up leftover children
	  			if (children) {
	  				children.forEach(detachNode);
	  			}
	  		}

	  		if (existing) {
	  			// store initial values for two-way binding
	  			if (this.binding && this.binding.wasUndefined) this.binding.setFromNode(node);

	  			// remove unused attributes
	  			var i = node.attributes.length;
	  			while (i--) {
	  				var _name = node.attributes[i].name;
	  				if (!this.template.a || !(_name in this.template.a)) node.removeAttribute(_name);
	  			}
	  		}

	  		this.attributes.forEach(_render);
	  		this.conditionalAttributes.forEach(_render);

	  		if (this.decorator) runloop.scheduleTask(function () {
	  			return _this2.decorator.render();
	  		}, true);
	  		if (this.binding) this.binding.render();

	  		this.eventHandlers.forEach(_render);

	  		updateLiveQueries$1(this);

	  		// transitions
	  		var transitionTemplate = this.template.t0 || this.template.t1;
	  		if (transitionTemplate && this.ractive.transitionsEnabled) {
	  			var transition = new Transition(this, transitionTemplate, true);
	  			runloop.registerTransition(transition);

	  			this._introTransition = transition; // so we can abort if it gets removed
	  		}

	  		if (!existing) {
	  			target.appendChild(node);
	  		}

	  		this.rendered = true;
	  	};

	  	Element.prototype.toString = function toString() {
	  		var tagName = this.template.e;

	  		var attrs = this.attributes.map(stringifyAttribute).join('') + this.conditionalAttributes.map(stringifyAttribute).join('');

	  		// Special case - selected options
	  		if (this.name === 'option' && this.isSelected()) {
	  			attrs += ' selected';
	  		}

	  		// Special case - two-way radio name bindings
	  		if (this.name === 'input' && inputIsCheckedRadio(this)) {
	  			attrs += ' checked';
	  		}

	  		var str = '<' + tagName + attrs + '>';

	  		if (this.isVoid) return str;

	  		// Special case - textarea
	  		if (this.name === 'textarea' && this.getAttribute('value') !== undefined) {
	  			str += escapeHtml(this.getAttribute('value'));
	  		}

	  		// Special case - contenteditable
	  		else if (this.getAttribute('contenteditable') !== undefined) {
	  				str += this.getAttribute('value') || '';
	  			}

	  		if (this.fragment) {
	  			str += this.fragment.toString(!/^(?:script|style)$/i.test(this.template.e)); // escape text unless script/style
	  		}

	  		str += '</' + tagName + '>';
	  		return str;
	  	};

	  	Element.prototype.unbind = function unbind() {
	  		this.attributes.forEach(_unbind);
	  		this.conditionalAttributes.forEach(_unbind);

	  		if (this.decorator) this.decorator.unbind();
	  		if (this.fragment) this.fragment.unbind();
	  	};

	  	Element.prototype.unrender = function unrender(shouldDestroy) {
	  		if (!this.rendered) return;
	  		this.rendered = false;

	  		// unrendering before intro completed? complete it now
	  		// TODO should be an API for aborting transitions
	  		var transition = this._introTransition;
	  		if (transition) transition.complete();

	  		// Detach as soon as we can
	  		if (this.name === 'option') {
	  			// <option> elements detach immediately, so that
	  			// their parent <select> element syncs correctly, and
	  			// since option elements can't have transitions anyway
	  			this.detach();
	  		} else if (shouldDestroy) {
	  			runloop.detachWhenReady(this);
	  		}

	  		if (this.fragment) this.fragment.unrender();

	  		this.eventHandlers.forEach(_unrender);

	  		if (this.binding) this.binding.unrender();
	  		if (!shouldDestroy && this.decorator) this.decorator.unrender();

	  		// outro transition
	  		var transitionTemplate = this.template.t0 || this.template.t2;
	  		if (transitionTemplate && this.ractive.transitionsEnabled) {
	  			var _transition = new Transition(this, transitionTemplate, false);
	  			runloop.registerTransition(_transition);
	  		}

	  		// special case
	  		var id = this.attributeByName.id;
	  		if (id) {
	  			delete this.ractive.nodes[id.getValue()];
	  		}

	  		removeFromLiveQueries(this);
	  		// TODO forms are a special case
	  	};

	  	Element.prototype.update = function update() {
	  		if (this.dirty) {
	  			this.attributes.forEach(_update);
	  			this.conditionalAttributes.forEach(_update);
	  			this.eventHandlers.forEach(_update);

	  			if (this.decorator) this.decorator.update();
	  			if (this.fragment) this.fragment.update();

	  			this.dirty = false;
	  		}
	  	};

	  	return Element;
	  })(Item);

	  function inputIsCheckedRadio(element) {
	  	var attributes = element.attributeByName;

	  	var typeAttribute = attributes.type;
	  	var valueAttribute = attributes.value;
	  	var nameAttribute = attributes.name;

	  	if (!typeAttribute || typeAttribute.value !== 'radio' || !valueAttribute || !nameAttribute.interpolator) {
	  		return;
	  	}

	  	if (valueAttribute.getValue() === nameAttribute.interpolator.model.get()) {
	  		return true;
	  	}
	  }

	  function stringifyAttribute(attribute) {
	  	var str = attribute.toString();
	  	return str ? ' ' + str : '';
	  }

	  function removeFromLiveQueries(element) {
	  	var i = element.liveQueries.length;
	  	while (i--) {
	  		var query = element.liveQueries[i];
	  		query.remove(element.node);
	  	}
	  }

	  function getNamespace(element) {
	  	// Use specified namespace...
	  	var xmlns = element.getAttribute('xmlns');
	  	if (xmlns) return xmlns;

	  	// ...or SVG namespace, if this is an <svg> element
	  	if (element.name === 'svg') return svg$1;

	  	var parent = element.parent;

	  	if (parent) {
	  		// ...or HTML, if the parent is a <foreignObject>
	  		if (parent.name === 'foreignobject') return html;

	  		// ...or inherit from the parent node
	  		return parent.node.namespaceURI;
	  	}

	  	return element.ractive.el.namespaceURI;
	  }

	  var Input = (function (_Element) {
	  	inherits(Input, _Element);

	  	function Input() {
	  		classCallCheck(this, Input);

	  		_Element.apply(this, arguments);
	  	}

	  	Input.prototype.render = function render(target, occupants) {
	  		_Element.prototype.render.call(this, target, occupants);
	  		this.node.defaultValue = this.node.value;
	  	};

	  	return Input;
	  })(Element);

	  var Textarea = (function (_Input) {
	  	inherits(Textarea, _Input);

	  	function Textarea(options) {
	  		classCallCheck(this, Textarea);

	  		var template = options.template;

	  		// if there is a bindable value, there should be no body
	  		if (template.a && template.a.value && isBindable({ template: template.a.value })) {
	  			options.noContent = true;
	  		}

	  		// otherwise, if there is a single bindable interpolator as content, move it to the value attr
	  		else if (template.f && (!template.a || !template.a.value) && isBindable({ template: template.f })) {
	  				if (!template.a) template.a = {};
	  				template.a.value = template.f;
	  				options.noContent = true;
	  			}

	  		_Input.call(this, options);
	  	}

	  	Textarea.prototype.bubble = function bubble() {
	  		var _this = this;

	  		if (!this.dirty) {
	  			this.dirty = true;

	  			if (this.rendered && !this.binding && this.fragment) {
	  				runloop.scheduleTask(function () {
	  					_this.dirty = false;
	  					_this.node.value = _this.fragment.toString();
	  				});
	  			}

	  			this.parentFragment.bubble(); // default behaviour
	  		}
	  	};

	  	return Textarea;
	  })(Input);

	  function valueContains(selectValue, optionValue) {
	  	var i = selectValue.length;
	  	while (i--) {
	  		if (selectValue[i] == optionValue) return true;
	  	}
	  }

	  var Select = (function (_Element) {
	  	inherits(Select, _Element);

	  	function Select(options) {
	  		classCallCheck(this, Select);

	  		_Element.call(this, options);
	  		this.options = [];
	  	}

	  	Select.prototype.bubble = function bubble() {
	  		var _this = this;

	  		if (!this.dirty) {
	  			this.dirty = true;

	  			if (this.rendered) {
	  				runloop.scheduleTask(function () {
	  					_this.sync();
	  					_this.dirty = false;
	  				});
	  			}

	  			this.parentFragment.bubble(); // default behaviour
	  		}
	  	};

	  	Select.prototype.render = function render(target, occupants) {
	  		_Element.prototype.render.call(this, target, occupants);
	  		this.sync();

	  		var node = this.node;

	  		var i = node.options.length;
	  		while (i--) {
	  			node.options[i].defaultSelected = node.options[i].selected;
	  		}

	  		this.rendered = true;
	  	};

	  	Select.prototype.sync = function sync() {
	  		var selectNode = this.node;

	  		if (!selectNode) return;

	  		var options = toArray(selectNode.options);

	  		var selectValue = this.getAttribute('value');
	  		var isMultiple = this.getAttribute('multiple');

	  		// If the <select> has a specified value, that should override
	  		// these options
	  		if (selectValue !== undefined) {
	  			var optionWasSelected = undefined;

	  			options.forEach(function (o) {
	  				var optionValue = o._ractive ? o._ractive.value : o.value;
	  				var shouldSelect = isMultiple ? valueContains(selectValue, optionValue) : selectValue == optionValue;

	  				if (shouldSelect) {
	  					optionWasSelected = true;
	  				}

	  				o.selected = shouldSelect;
	  			});

	  			if (!optionWasSelected && !isMultiple) {
	  				if (options[0]) {
	  					options[0].selected = true;
	  				}

	  				if (this.binding) {
	  					this.binding.forceUpdate();
	  				}
	  			}
	  		}

	  		// Otherwise the value should be initialised according to which
	  		// <option> element is selected, if twoway binding is in effect
	  		else if (this.binding) {
	  				this.binding.forceUpdate();
	  			}
	  	};

	  	Select.prototype.update = function update() {
	  		_Element.prototype.update.call(this);
	  		this.sync();
	  	};

	  	return Select;
	  })(Element);

	  function findParentSelect(element) {
	  	while (element) {
	  		if (element.name === 'select') return element;
	  		element = element.parent;
	  	}
	  }

	  var Option = (function (_Element) {
	  	inherits(Option, _Element);

	  	function Option(options) {
	  		classCallCheck(this, Option);

	  		var template = options.template;
	  		if (!template.a) template.a = {};

	  		// If the value attribute is missing, use the element's content,
	  		// as long as it isn't disabled
	  		if (template.a.value === undefined && !('disabled' in template)) {
	  			template.a.value = template.f || '';
	  		}

	  		_Element.call(this, options);

	  		this.select = findParentSelect(this.parent);
	  	}

	  	Option.prototype.bind = function bind() {
	  		if (!this.select) {
	  			_Element.prototype.bind.call(this);
	  			return;
	  		}

	  		// If the select has a value, it overrides the `selected` attribute on
	  		// this option - so we delete the attribute
	  		var selectedAttribute = this.attributeByName.selected;
	  		if (selectedAttribute && this.select.getAttribute('value') !== undefined) {
	  			var index = this.attributes.indexOf(selectedAttribute);
	  			this.attributes.splice(index, 1);
	  			delete this.attributeByName.selected;
	  		}

	  		_Element.prototype.bind.call(this);
	  		this.select.options.push(this);
	  	};

	  	Option.prototype.isSelected = function isSelected() {
	  		var optionValue = this.getAttribute('value');

	  		if (optionValue === undefined || !this.select) {
	  			return false;
	  		}

	  		var selectValue = this.select.getAttribute('value');

	  		if (selectValue == optionValue) {
	  			return true;
	  		}

	  		if (this.select.getAttribute('multiple') && isArray(selectValue)) {
	  			var i = selectValue.length;
	  			while (i--) {
	  				if (selectValue[i] == optionValue) {
	  					return true;
	  				}
	  			}
	  		}
	  	};

	  	Option.prototype.unbind = function unbind() {
	  		_Element.prototype.unbind.call(this);

	  		if (this.select) {
	  			removeFromArray(this.select.options, this);
	  		}
	  	};

	  	return Option;
	  })(Element);

	  var Form = (function (_Element) {
	  	inherits(Form, _Element);

	  	function Form(options) {
	  		classCallCheck(this, Form);

	  		_Element.call(this, options);
	  		this.formBindings = [];
	  	}

	  	Form.prototype.render = function render(target, occupants) {
	  		_Element.prototype.render.call(this, target, occupants);
	  		this.node.addEventListener('reset', handleReset, false);
	  	};

	  	Form.prototype.unrender = function unrender(shouldDestroy) {
	  		this.node.removeEventListener('reset', handleReset, false);
	  		_Element.prototype.unrender.call(this, shouldDestroy);
	  	};

	  	return Form;
	  })(Element);

	  function handleReset() {
	  	var element = this._ractive.proxy;

	  	runloop.start();
	  	element.formBindings.forEach(updateModel);
	  	runloop.end();
	  }

	  function updateModel(binding) {
	  	binding.model.set(binding.resetValue);
	  }

	  function processWrapper (wrapper, array, methodName, newIndices) {
	  	var __model = wrapper.__model;

	  	if (newIndices) {
	  		__model.shuffle(newIndices);
	  	} else {
	  		// If this is a sort or reverse, we just do root.set()...
	  		// TODO use merge logic?
	  		//root.viewmodel.mark( keypath );
	  	}
	  }

	  var mutatorMethods = ['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'];
	  var patchedArrayProto = [];

	  mutatorMethods.forEach(function (methodName) {
	  	var method = function () {
	  		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	  			args[_key] = arguments[_key];
	  		}

	  		var newIndices = getNewIndices(this.length, methodName, args);

	  		// apply the underlying method
	  		var result = Array.prototype[methodName].apply(this, arguments);

	  		// trigger changes
	  		runloop.start();

	  		this._ractive.setting = true;
	  		var i = this._ractive.wrappers.length;
	  		while (i--) {
	  			processWrapper(this._ractive.wrappers[i], this, methodName, newIndices);
	  		}

	  		runloop.end();

	  		this._ractive.setting = false;
	  		return result;
	  	};

	  	defineProperty(patchedArrayProto, methodName, {
	  		value: method
	  	});
	  });

	  var patchArrayMethods = undefined;
	  var unpatchArrayMethods = undefined;

	  // can we use prototype chain injection?
	  // http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/#wrappers_prototype_chain_injection
	  if (({}).__proto__) {
	  	// yes, we can
	  	patchArrayMethods = function (array) {
	  		return array.__proto__ = patchedArrayProto;
	  	};
	  	unpatchArrayMethods = function (array) {
	  		return array.__proto__ = Array.prototype;
	  	};
	  } else {
	  	// no, we can't
	  	patchArrayMethods = function (array) {
	  		var i = mutatorMethods.length;
	  		while (i--) {
	  			var methodName = mutatorMethods[i];
	  			defineProperty(array, methodName, {
	  				value: patchedArrayProto[methodName],
	  				configurable: true
	  			});
	  		}
	  	};

	  	unpatchArrayMethods = function (array) {
	  		var i = mutatorMethods.length;
	  		while (i--) {
	  			delete array[mutatorMethods[i]];
	  		}
	  	};
	  }

	  patchArrayMethods.unpatch = unpatchArrayMethods; // TODO export separately?
	  var patch = patchArrayMethods;

	  var errorMessage = 'Something went wrong in a rather interesting way';

	  var arrayAdaptor = {
	  	filter: function (object) {
	  		// wrap the array if a) b) it's an array, and b) either it hasn't been wrapped already,
	  		// or the array didn't trigger the get() itself
	  		return isArray(object) && (!object._ractive || !object._ractive.setting);
	  	},
	  	wrap: function (ractive, array, keypath) {
	  		return new ArrayWrapper(ractive, array, keypath);
	  	}
	  };

	  var ArrayWrapper = (function () {
	  	function ArrayWrapper(ractive, array) {
	  		classCallCheck(this, ArrayWrapper);

	  		this.root = ractive;
	  		this.value = array;
	  		this.__model = null; // filled in later

	  		// if this array hasn't already been ractified, ractify it
	  		if (!array._ractive) {
	  			// define a non-enumerable _ractive property to store the wrappers
	  			defineProperty(array, '_ractive', {
	  				value: {
	  					wrappers: [],
	  					instances: [],
	  					setting: false
	  				},
	  				configurable: true
	  			});

	  			patch(array);
	  		}

	  		// store the ractive instance, so we can handle transitions later
	  		if (!array._ractive.instances[ractive._guid]) {
	  			array._ractive.instances[ractive._guid] = 0;
	  			array._ractive.instances.push(ractive);
	  		}

	  		array._ractive.instances[ractive._guid] += 1;
	  		array._ractive.wrappers.push(this);
	  	}

	  	ArrayWrapper.prototype.get = function get() {
	  		return this.value;
	  	};

	  	ArrayWrapper.prototype.teardown = function teardown() {
	  		var array, storage, wrappers, instances, index;

	  		array = this.value;
	  		storage = array._ractive;
	  		wrappers = storage.wrappers;
	  		instances = storage.instances;

	  		// if teardown() was invoked because we're clearing the cache as a result of
	  		// a change that the array itself triggered, we can save ourselves the teardown
	  		// and immediate setup
	  		if (storage.setting) {
	  			return false; // so that we don't remove it from cached wrappers
	  		}

	  		index = wrappers.indexOf(this);
	  		if (index === -1) {
	  			throw new Error(errorMessage);
	  		}

	  		wrappers.splice(index, 1);

	  		// if nothing else depends on this array, we can revert it to its
	  		// natural state
	  		if (!wrappers.length) {
	  			delete array._ractive;
	  			patch.unpatch(this.value);
	  		} else {
	  			// remove ractive instance if possible
	  			instances[this.root._guid] -= 1;
	  			if (!instances[this.root._guid]) {
	  				index = instances.indexOf(this.root);

	  				if (index === -1) {
	  					throw new Error(errorMessage);
	  				}

	  				instances.splice(index, 1);
	  			}
	  		}
	  	};

	  	return ArrayWrapper;
	  })();

	  var magicAdaptor = undefined;

	  try {
	  	Object.defineProperty({}, 'test', { value: 0 });

	  	magicAdaptor = {
	  		filter: function (value) {
	  			return value && typeof value === 'object';
	  		},
	  		wrap: function (ractive, value, keypath) {
	  			return new MagicWrapper(ractive, value, keypath);
	  		}
	  	};
	  } catch (err) {
	  	magicAdaptor = false;
	  }

	  var magicAdaptor$1 = magicAdaptor;

	  function createOrWrapDescriptor(originalDescriptor, ractive, keypath) {
	  	if (originalDescriptor.set && originalDescriptor.set.__magic) {
	  		originalDescriptor.set.__magic.dependants.push({ ractive: ractive, keypath: keypath });
	  		return originalDescriptor;
	  	}

	  	var setting = undefined;

	  	var dependants = [{ ractive: ractive, keypath: keypath }];

	  	var descriptor = {
	  		get: function () {
	  			return 'value' in originalDescriptor ? originalDescriptor.value : originalDescriptor.get();
	  		},
	  		set: function (value) {
	  			if (setting) return;

	  			if ('value' in originalDescriptor) {
	  				originalDescriptor.value = value;
	  			} else {
	  				originalDescriptor.set(value);
	  			}

	  			setting = true;
	  			dependants.forEach(function (_ref) {
	  				var ractive = _ref.ractive;
	  				var keypath = _ref.keypath;

	  				ractive.set(keypath, value);
	  			});
	  			setting = false;
	  		},
	  		enumerable: true
	  	};

	  	descriptor.set.__magic = { dependants: dependants, originalDescriptor: originalDescriptor };

	  	return descriptor;
	  }

	  function revert(descriptor, ractive, keypath) {
	  	if (!descriptor.set || !descriptor.set.__magic) return true;

	  	var dependants = descriptor.set.__magic;
	  	var i = dependants.length;
	  	while (i--) {
	  		var dependant = dependants[i];
	  		if (dependant.ractive === ractive && dependant.keypath === keypath) {
	  			dependants.splice(i, 1);
	  			return false;
	  		}
	  	}
	  }

	  var MagicWrapper = (function () {
	  	function MagicWrapper(ractive, value, keypath) {
	  		var _this = this;

	  		classCallCheck(this, MagicWrapper);

	  		this.ractive = ractive;
	  		this.value = value;
	  		this.keypath = keypath;

	  		this.originalDescriptors = {};

	  		// wrap all properties with getters
	  		Object.keys(value).forEach(function (key) {
	  			var originalDescriptor = Object.getOwnPropertyDescriptor(_this.value, key);
	  			_this.originalDescriptors[key] = originalDescriptor;

	  			var childKeypath = keypath ? keypath + '.' + escapeKey(key) : escapeKey(key);

	  			var descriptor = createOrWrapDescriptor(originalDescriptor, ractive, childKeypath);

	  			Object.defineProperty(_this.value, key, descriptor);
	  		});
	  	}

	  	MagicWrapper.prototype.get = function get() {
	  		return this.value;
	  	};

	  	MagicWrapper.prototype.reset = function reset() {
	  		throw new Error('TODO magic adaptor reset'); // does this ever happen?
	  	};

	  	MagicWrapper.prototype.set = function set(key, value) {
	  		this.value[key] = value;
	  	};

	  	MagicWrapper.prototype.teardown = function teardown() {
	  		var _this2 = this;

	  		Object.keys(this.value).forEach(function (key) {
	  			var descriptor = Object.getOwnPropertyDescriptor(_this2.value, key);
	  			if (!descriptor.set || !descriptor.set.__magic) return;

	  			revert(descriptor);

	  			if (descriptor.set.__magic.dependants.length === 1) {
	  				Object.defineProperty(_this2.value, key, descriptor.set.__magic.originalDescriptor);
	  			}
	  		});
	  	};

	  	return MagicWrapper;
	  })();

	  var MagicArrayWrapper = (function () {
	  	function MagicArrayWrapper(ractive, array, keypath) {
	  		classCallCheck(this, MagicArrayWrapper);

	  		this.value = array;

	  		this.magic = true;

	  		this.magicWrapper = magicAdaptor$1.wrap(ractive, array, keypath);
	  		this.arrayWrapper = arrayAdaptor.wrap(ractive, array, keypath);

	  		// ugh, this really is a terrible hack
	  		Object.defineProperty(this, '__model', {
	  			get: function () {
	  				return this.arrayWrapper.__model;
	  			},
	  			set: function (model) {
	  				this.arrayWrapper.__model = model;
	  			}
	  		});
	  	}

	  	MagicArrayWrapper.prototype.get = function get() {
	  		return this.value;
	  	};

	  	MagicArrayWrapper.prototype.teardown = function teardown() {
	  		this.arrayWrapper.teardown();
	  		this.magicWrapper.teardown();
	  	};

	  	MagicArrayWrapper.prototype.reset = function reset(value) {
	  		return this.magicWrapper.reset(value);
	  	};

	  	return MagicArrayWrapper;
	  })();

	  var magicArrayAdaptor = {
	  	filter: function (object, keypath, ractive) {
	  		return magicAdaptor$1.filter(object, keypath, ractive) && arrayAdaptor.filter(object);
	  	},

	  	wrap: function (ractive, array, keypath) {
	  		return new MagicArrayWrapper(ractive, array, keypath);
	  	}
	  };

	  function validate(data) {
	  	// Warn if userOptions.data is a non-POJO
	  	if (data && data.constructor !== Object) {
	  		if (typeof data === 'function') {
	  			// TODO do we need to support this in the new Ractive() case?
	  		} else if (typeof data !== 'object') {
	  				fatal('data option must be an object or a function, `' + data + '` is not valid');
	  			} else {
	  				warnIfDebug('If supplied, options.data should be a plain JavaScript object - using a non-POJO as the root object may work, but is discouraged');
	  			}
	  	}
	  }

	  var dataConfigurator = {
	  	name: 'data',

	  	extend: function (Parent, proto, options) {
	  		var key = undefined;
	  		var value = undefined;

	  		// check for non-primitives, which could cause mutation-related bugs
	  		if (options.data && isObject(options.data)) {
	  			for (key in options.data) {
	  				value = options.data[key];

	  				if (value && typeof value === 'object') {
	  					if (isObject(value) || isArray(value)) {
	  						warnIfDebug('Passing a `data` option with object and array properties to Ractive.extend() is discouraged, as mutating them is likely to cause bugs. Consider using a data function instead:\n\n  // this...\n  data: function () {\n    return {\n      myObject: {}\n    };\n  })\n\n  // instead of this:\n  data: {\n    myObject: {}\n  }');
	  					}
	  				}
	  			}
	  		}

	  		proto.data = combine$1(proto.data, options.data);
	  	},

	  	init: function (Parent, ractive, options) {
	  		var result = combine$1(Parent.prototype.data, options.data);

	  		if (typeof result === 'function') result = result.call(ractive);

	  		// bind functions to the ractive instance at the top level,
	  		// unless it's a non-POJO (in which case alarm bells should ring)
	  		if (result && result.constructor === Object) {
	  			for (var prop in result) {
	  				if (typeof result[prop] === 'function') result[prop] = bind(result[prop], ractive);
	  			}
	  		}

	  		return result || {};
	  	},

	  	reset: function (ractive) {
	  		var result = this.init(ractive.constructor, ractive, ractive.viewmodel);
	  		ractive.viewmodel.root.set(result);
	  		return true;
	  	}
	  };

	  function combine$1(parentValue, childValue) {
	  	validate(childValue);

	  	var parentIsFn = typeof parentValue === 'function';
	  	var childIsFn = typeof childValue === 'function';

	  	// Very important, otherwise child instance can become
	  	// the default data object on Ractive or a component.
	  	// then ractive.set() ends up setting on the prototype!
	  	if (!childValue && !parentIsFn) {
	  		childValue = {};
	  	}

	  	// Fast path, where we just need to copy properties from
	  	// parent to child
	  	if (!parentIsFn && !childIsFn) {
	  		return fromProperties(childValue, parentValue);
	  	}

	  	return function () {
	  		var child = childIsFn ? callDataFunction(childValue, this) : childValue;
	  		var parent = parentIsFn ? callDataFunction(parentValue, this) : parentValue;

	  		return fromProperties(child, parent);
	  	};
	  }

	  function callDataFunction(fn, context) {
	  	var data = fn.call(context);

	  	if (!data) return;

	  	if (typeof data !== 'object') {
	  		fatal('Data function must return an object');
	  	}

	  	if (data.constructor !== Object) {
	  		warnOnceIfDebug('Data function returned something other than a plain JavaScript object. This might work, but is strongly discouraged');
	  	}

	  	return data;
	  }

	  function fromProperties(primary, secondary) {
	  	if (primary && secondary) {
	  		for (var key in secondary) {
	  			if (!(key in primary)) {
	  				primary[key] = secondary[key];
	  			}
	  		}

	  		return primary;
	  	}

	  	return primary || secondary;
	  }

	  // TODO this is probably a bit anal, maybe we should leave it out
	  function prettify(fnBody) {
	  	var lines = fnBody.replace(/^\t+/gm, function (tabs) {
	  		return tabs.split('\t').join('  ');
	  	}).split('\n');

	  	var minIndent = lines.length < 2 ? 0 : lines.slice(1).reduce(function (prev, line) {
	  		return Math.min(prev, /^\s*/.exec(line)[0].length);
	  	}, Infinity);

	  	return lines.map(function (line, i) {
	  		return '    ' + (i ? line.substring(minIndent) : line);
	  	}).join('\n');
	  }

	  // Ditto. This function truncates the stack to only include app code
	  function truncateStack(stack) {
	  	if (!stack) return '';

	  	var lines = stack.split('\n');
	  	var name = Computation.name + '.getValue';

	  	var truncated = [];

	  	var len = lines.length;
	  	for (var i = 1; i < len; i += 1) {
	  		var line = lines[i];

	  		if (~line.indexOf(name)) {
	  			return truncated.join('\n');
	  		} else {
	  			truncated.push(line);
	  		}
	  	}
	  }

	  var Computation = (function (_Model) {
	  	inherits(Computation, _Model);

	  	function Computation(viewmodel, signature, key) {
	  		classCallCheck(this, Computation);

	  		_Model.call(this, null, null);

	  		this.root = this.parent = viewmodel;
	  		this.signature = signature;

	  		this.key = key; // not actually used, but helps with debugging
	  		this.isExpression = key && key[0] === '@';

	  		this.isReadonly = !this.signature.setter;

	  		this.context = viewmodel.computationContext;

	  		this.dependencies = [];

	  		this.children = [];
	  		this.childByKey = {};

	  		this.deps = [];

	  		this.boundsSensitive = true;
	  		this.dirty = true;

	  		// TODO: is there a less hackish way to do this?
	  		this.shuffle = undefined;
	  	}

	  	Computation.prototype.get = function get(shouldCapture) {
	  		if (shouldCapture) capture(this);

	  		if (this.dirty) {
	  			this.value = this.getValue();
	  			this.adapt();
	  			this.dirty = false;
	  		}

	  		return this.value;
	  	};

	  	Computation.prototype.getValue = function getValue() {
	  		startCapturing();
	  		var result = undefined;

	  		try {
	  			result = this.signature.getter.call(this.context);
	  		} catch (err) {
	  			warnIfDebug('Failed to compute ' + this.getKeypath() + ': ' + (err.message || err));

	  			// TODO this is all well and good in Chrome, but...
	  			// ...also, should encapsulate this stuff better, and only
	  			// show it if Ractive.DEBUG
	  			if (console.groupCollapsed) console.groupCollapsed('%cshow details', 'color: rgb(82, 140, 224); font-weight: normal; text-decoration: underline;');
	  			var functionBody = prettify(this.signature.getterString);
	  			var stack = this.signature.getterUseStack ? '\n\n' + truncateStack(err.stack) : '';
	  			console.error(err.name + ': ' + err.message + '\n\n' + functionBody + stack);
	  			if (console.groupCollapsed) console.groupEnd();
	  		}

	  		var dependencies = stopCapturing();
	  		this.setDependencies(dependencies);

	  		return result;
	  	};

	  	Computation.prototype.handleChange = function handleChange() {
	  		this.dirty = true;

	  		this.deps.forEach(_handleChange);
	  		this.children.forEach(_handleChange);
	  		this.clearUnresolveds(); // TODO same question as on Model - necessary for primitives?
	  	};

	  	Computation.prototype.joinKey = function joinKey(key) {
	  		if (key === undefined || key === '') return this;

	  		if (!this.childByKey.hasOwnProperty(key)) {
	  			var child = new ComputationChild(this, key);
	  			this.children.push(child);
	  			this.childByKey[key] = child;
	  		}

	  		return this.childByKey[key];
	  	};

	  	Computation.prototype.mark = function mark() {
	  		this.handleChange();
	  	};

	  	Computation.prototype.set = function set(value) {
	  		if (!this.signature.setter) {
	  			throw new Error('Cannot set read-only computed value \'' + this.key + '\'');
	  		}

	  		this.signature.setter(value);
	  	};

	  	Computation.prototype.setDependencies = function setDependencies(dependencies) {
	  		// unregister any soft dependencies we no longer have
	  		var i = this.dependencies.length;
	  		while (i--) {
	  			var model = this.dependencies[i];
	  			if (! ~dependencies.indexOf(model)) model.unregister(this);
	  		}

	  		// and add any new ones
	  		i = dependencies.length;
	  		while (i--) {
	  			var model = dependencies[i];
	  			if (! ~this.dependencies.indexOf(model)) model.register(this);
	  		}

	  		this.dependencies = dependencies;
	  	};

	  	return Computation;
	  })(Model);

	  var RactiveModel = (function (_Model) {
	  	inherits(RactiveModel, _Model);

	  	function RactiveModel(ractive) {
	  		classCallCheck(this, RactiveModel);

	  		_Model.call(this, null, '');
	  		this.value = ractive;
	  		this.isRoot = true;
	  		this.root = this;
	  		this.adaptors = [];
	  		this.ractive = ractive;
	  		this.changes = {};
	  	}

	  	RactiveModel.prototype.getKeypath = function getKeypath() {
	  		return '@ractive';
	  	};

	  	return RactiveModel;
	  })(Model);

	  var hasProp = Object.prototype.hasOwnProperty;

	  var RootModel = (function (_Model) {
	  	inherits(RootModel, _Model);

	  	function RootModel(options) {
	  		classCallCheck(this, RootModel);

	  		_Model.call(this, null, null);

	  		// TODO deprecate this
	  		this.changes = {};

	  		this.isRoot = true;
	  		this.root = this;
	  		this.ractive = options.ractive; // TODO sever this link

	  		this.value = options.data;
	  		this.adaptors = options.adapt;
	  		this.adapt();

	  		this.mappings = {};

	  		this.computationContext = options.ractive;
	  		this.computations = {};
	  	}

	  	RootModel.prototype.applyChanges = function applyChanges() {
	  		this._changeHash = {};
	  		this.flush();

	  		return this._changeHash;
	  	};

	  	RootModel.prototype.compute = function compute(key, signature) {
	  		var computation = new Computation(this, signature, key);
	  		this.computations[key] = computation;

	  		return computation;
	  	};

	  	RootModel.prototype.extendChildren = function extendChildren(fn) {
	  		var mappings = this.mappings;
	  		Object.keys(mappings).forEach(function (key) {
	  			fn(key, mappings[key]);
	  		});

	  		var computations = this.computations;
	  		Object.keys(computations).forEach(function (key) {
	  			var computation = computations[key];
	  			// exclude template expressions
	  			if (!computation.isExpression) {
	  				fn(key, computation);
	  			}
	  		});
	  	};

	  	RootModel.prototype.get = function get(shouldCapture) {
	  		if (shouldCapture) capture(this);
	  		var result = extend({}, this.value);

	  		this.extendChildren(function (key, model) {
	  			result[key] = model.value;
	  		});

	  		return result;
	  	};

	  	RootModel.prototype.getKeypath = function getKeypath() {
	  		return '';
	  	};

	  	RootModel.prototype.getRactiveModel = function getRactiveModel() {
	  		return this.ractiveModel || (this.ractiveModel = new RactiveModel(this.ractive));
	  	};

	  	RootModel.prototype.getValueChildren = function getValueChildren() {
	  		var children = _Model.prototype.getValueChildren.call(this, this.value);

	  		this.extendChildren(function (key, model) {
	  			children.push(model);
	  		});

	  		return children;
	  	};

	  	RootModel.prototype.handleChange = function handleChange() {
	  		this.deps.forEach(_handleChange);
	  	};

	  	RootModel.prototype.has = function has(key) {
	  		if (key in this.mappings || key in this.computations) return true;

	  		var value = this.value;

	  		key = unescapeKey(key);
	  		if (hasProp.call(value, key)) return true;

	  		// We climb up the constructor chain to find if one of them contains the key
	  		var constructor = value.constructor;
	  		while (constructor !== Function && constructor !== Array && constructor !== Object) {
	  			if (hasProp.call(constructor.prototype, key)) return true;
	  			constructor = constructor.constructor;
	  		}

	  		return false;
	  	};

	  	RootModel.prototype.joinKey = function joinKey(key) {
	  		if (key === '@global') return GlobalModel$1;
	  		if (key === '@ractive') return this.getRactiveModel();

	  		return this.mappings.hasOwnProperty(key) ? this.mappings[key] : this.computations.hasOwnProperty(key) ? this.computations[key] : _Model.prototype.joinKey.call(this, key);
	  	};

	  	RootModel.prototype.map = function map(localKey, origin) {
	  		// TODO remapping
	  		this.mappings[localKey] = origin;
	  		origin.register(this);
	  	};

	  	RootModel.prototype.set = function set(value) {
	  		// TODO wrapping root node is a baaaad idea. We should prevent this
	  		var wrapper = this.wrapper;
	  		if (wrapper) {
	  			var shouldTeardown = !wrapper.reset || wrapper.reset(value) === false;

	  			if (shouldTeardown) {
	  				wrapper.teardown();
	  				this.wrapper = null;
	  				this.value = value;
	  				this.adapt();
	  			}
	  		} else {
	  			this.value = value;
	  			this.adapt();
	  		}

	  		this.deps.forEach(_handleChange);
	  		this.children.forEach(_mark);
	  		this.clearUnresolveds(); // TODO do we need to do this with primitive values? if not, what about e.g. unresolved `length` property of null -> string?
	  	};

	  	RootModel.prototype.retrieve = function retrieve() {
	  		return this.value;
	  	};

	  	RootModel.prototype.update = function update() {
	  		// noop
	  	};

	  	RootModel.prototype.updateFromBindings = function updateFromBindings(cascade) {
	  		var _this = this;

	  		_Model.prototype.updateFromBindings.call(this, cascade);

	  		if (cascade) {
	  			// TODO computations as well?
	  			Object.keys(this.mappings).forEach(function (key) {
	  				var model = _this.mappings[key];
	  				model.updateFromBindings(cascade);
	  			});
	  		}
	  	};

	  	return RootModel;
	  })(Model);

	  function getComputationSignature(ractive, key, signature) {
	  	var getter = undefined;
	  	var setter = undefined;

	  	// useful for debugging
	  	var getterString = undefined;
	  	var getterUseStack = undefined;
	  	var setterString = undefined;

	  	if (typeof signature === 'function') {
	  		getter = bind(signature, ractive);
	  		getterString = signature.toString();
	  		getterUseStack = true;
	  	}

	  	if (typeof signature === 'string') {
	  		getter = createFunctionFromString(signature, ractive);
	  		getterString = signature;
	  	}

	  	if (typeof signature === 'object') {
	  		if (typeof signature.get === 'string') {
	  			getter = createFunctionFromString(signature.get, ractive);
	  			getterString = signature.get;
	  		} else if (typeof signature.get === 'function') {
	  			getter = bind(signature.get, ractive);
	  			getterString = signature.get.toString();
	  			getterUseStack = true;
	  		} else {
	  			fatal('`%s` computation must have a `get()` method', key);
	  		}

	  		if (typeof signature.set === 'function') {
	  			setter = bind(signature.set, ractive);
	  			setterString = signature.set.toString();
	  		}
	  	}

	  	return {
	  		getter: getter,
	  		setter: setter,
	  		getterString: getterString,
	  		setterString: setterString,
	  		getterUseStack: getterUseStack
	  	};
	  }

	  var constructHook = new Hook('construct');

	  var registryNames = ['adaptors', 'components', 'decorators', 'easing', 'events', 'interpolators', 'partials', 'transitions'];

	  var uid = 0;
	  function construct(ractive, options) {
	  	if (Ractive.DEBUG) welcome();

	  	initialiseProperties(ractive);

	  	// TODO remove this, eventually
	  	defineProperty(ractive, 'data', { get: deprecateRactiveData });

	  	// TODO don't allow `onconstruct` with `new Ractive()`, there's no need for it
	  	constructHook.fire(ractive, options);

	  	// Add registries
	  	registryNames.forEach(function (name) {
	  		ractive[name] = extend(create(ractive.constructor[name] || null), options[name]);
	  	});

	  	// Create a viewmodel
	  	var viewmodel = new RootModel({
	  		adapt: getAdaptors(ractive, ractive.adapt, options),
	  		data: dataConfigurator.init(ractive.constructor, ractive, options),
	  		ractive: ractive
	  	});

	  	ractive.viewmodel = viewmodel;

	  	// Add computed properties
	  	var computed = extend(create(ractive.constructor.prototype.computed), options.computed);

	  	for (var key in computed) {
	  		var signature = getComputationSignature(ractive, key, computed[key]);
	  		viewmodel.compute(key, signature);
	  	}
	  }

	  function combine(a, b) {
	  	var c = a.slice();
	  	var i = b.length;

	  	while (i--) {
	  		if (! ~c.indexOf(b[i])) {
	  			c.push(b[i]);
	  		}
	  	}

	  	return c;
	  }

	  function getAdaptors(ractive, protoAdapt, options) {
	  	protoAdapt = protoAdapt.map(lookup);
	  	var adapt = ensureArray(options.adapt).map(lookup);

	  	adapt = combine(protoAdapt, adapt);

	  	var magic = 'magic' in options ? options.magic : ractive.magic;
	  	var modifyArrays = 'modifyArrays' in options ? options.modifyArrays : ractive.modifyArrays;

	  	if (magic) {
	  		if (!magicSupported) {
	  			throw new Error('Getters and setters (magic mode) are not supported in this browser');
	  		}

	  		if (modifyArrays) {
	  			adapt.push(magicArrayAdaptor);
	  		}

	  		adapt.push(magicAdaptor$1);
	  	}

	  	if (modifyArrays) {
	  		adapt.push(arrayAdaptor);
	  	}

	  	return adapt;

	  	function lookup(adaptor) {
	  		if (typeof adaptor === 'string') {
	  			adaptor = findInViewHierarchy('adaptors', ractive, adaptor);

	  			if (!adaptor) {
	  				fatal(missingPlugin(adaptor, 'adaptor'));
	  			}
	  		}

	  		return adaptor;
	  	}
	  }

	  function initialiseProperties(ractive) {
	  	// Generate a unique identifier, for places where you'd use a weak map if it
	  	// existed
	  	ractive._guid = 'r-' + uid++;

	  	// events
	  	ractive._subs = create(null);

	  	// storage for item configuration from instantiation to reset,
	  	// like dynamic functions or original values
	  	ractive._config = {};

	  	// nodes registry
	  	ractive.nodes = {};

	  	// events
	  	ractive.event = null;
	  	ractive._eventQueue = [];

	  	// live queries
	  	ractive._liveQueries = [];
	  	ractive._liveComponentQueries = [];

	  	// observers
	  	ractive._observers = [];

	  	// links
	  	ractive._links = {};

	  	if (!ractive.component) {
	  		ractive.root = ractive;
	  		ractive.parent = ractive.container = null; // TODO container still applicable?
	  	}
	  }

	  function deprecateRactiveData() {
	  	throw new Error('Using `ractive.data` is no longer supported - you must use the `ractive.get()` API instead');
	  }

	  function getChildQueue(queue, ractive) {
	  	return queue[ractive._guid] || (queue[ractive._guid] = []);
	  }

	  function fire(hookQueue, ractive) {
	  	var childQueue = getChildQueue(hookQueue.queue, ractive);

	  	hookQueue.hook.fire(ractive);

	  	// queue is "live" because components can end up being
	  	// added while hooks fire on parents that modify data values.
	  	while (childQueue.length) {
	  		fire(hookQueue, childQueue.shift());
	  	}

	  	delete hookQueue.queue[ractive._guid];
	  }

	  var HookQueue = (function () {
	  	function HookQueue(event) {
	  		classCallCheck(this, HookQueue);

	  		this.hook = new Hook(event);
	  		this.inProcess = {};
	  		this.queue = {};
	  	}

	  	HookQueue.prototype.begin = function begin(ractive) {
	  		this.inProcess[ractive._guid] = true;
	  	};

	  	HookQueue.prototype.end = function end(ractive) {
	  		var parent = ractive.parent;

	  		// If this is *isn't* a child of a component that's in process,
	  		// it should call methods or fire at this point
	  		if (!parent || !this.inProcess[parent._guid]) {
	  			fire(this, ractive);
	  		}
	  		// elsewise, handoff to parent to fire when ready
	  		else {
	  				getChildQueue(this.queue, parent).push(ractive);
	  			}

	  		delete this.inProcess[ractive._guid];
	  	};

	  	return HookQueue;
	  })();

	  var selectorsPattern = /(?:^|\})?\s*([^\{\}]+)\s*\{/g;
	  var commentsPattern = /\/\*.*?\*\//g;
	  var selectorUnitPattern = /((?:(?:\[[^\]+]\])|(?:[^\s\+\>~:]))+)((?:::?[^\s\+\>\~\(:]+(?:\([^\)]+\))?)*\s*[\s\+\>\~]?)\s*/g;
	  var excludePattern = /^(?:@|\d+%)/;
	  var dataRvcGuidPattern = /\[data-ractive-css~="\{[a-z0-9-]+\}"]/g;

	  function trim$1(str) {
	  	return str.trim();
	  }

	  function extractString(unit) {
	  	return unit.str;
	  }

	  function transformSelector(selector, parent) {
	  	var selectorUnits = [];
	  	var match = undefined;

	  	while (match = selectorUnitPattern.exec(selector)) {
	  		selectorUnits.push({
	  			str: match[0],
	  			base: match[1],
	  			modifiers: match[2]
	  		});
	  	}

	  	// For each simple selector within the selector, we need to create a version
	  	// that a) combines with the id, and b) is inside the id
	  	var base = selectorUnits.map(extractString);

	  	var transformed = [];
	  	var i = selectorUnits.length;

	  	while (i--) {
	  		var appended = base.slice();

	  		// Pseudo-selectors should go after the attribute selector
	  		var unit = selectorUnits[i];
	  		appended[i] = unit.base + parent + unit.modifiers || '';

	  		var prepended = base.slice();
	  		prepended[i] = parent + ' ' + prepended[i];

	  		transformed.push(appended.join(' '), prepended.join(' '));
	  	}

	  	return transformed.join(', ');
	  }
	  function transformCss(css, id) {
	  	var dataAttr = '[data-ractive-css~="{' + id + '}"]';

	  	var transformed = undefined;

	  	if (dataRvcGuidPattern.test(css)) {
	  		transformed = css.replace(dataRvcGuidPattern, dataAttr);
	  	} else {
	  		transformed = css.replace(commentsPattern, '').replace(selectorsPattern, function (match, $1) {
	  			// don't transform at-rules and keyframe declarations
	  			if (excludePattern.test($1)) return match;

	  			var selectors = $1.split(',').map(trim$1);
	  			var transformed = selectors.map(function (selector) {
	  				return transformSelector(selector, dataAttr);
	  			}).join(', ') + ' ';

	  			return match.replace($1, transformed);
	  		});
	  	}

	  	return transformed;
	  }

	  function s4() {
	  	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	  }

	  function uuid() {
	  	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	  }

	  var cssConfigurator = {
	  	name: 'css',

	  	// Called when creating a new component definition
	  	extend: function (Parent, proto, options) {
	  		if (!options.css) return;

	  		var id = uuid();
	  		var styles = options.noCssTransform ? options.css : transformCss(options.css, id);

	  		proto.cssId = id;

	  		addCSS({ id: id, styles: styles });
	  	},

	  	// Called when creating a new component instance
	  	init: function (Parent, target, options) {
	  		if (!options.css) return;

	  		warnIfDebug('\nThe css option is currently not supported on a per-instance basis and will be discarded. Instead, we recommend instantiating from a component definition with a css option.\n\nconst Component = Ractive.extend({\n\t...\n\tcss: \'/* your css */\',\n\t...\n});\n\nconst componentInstance = new Component({ ... })\n\t\t');
	  	}

	  };

	  var adaptConfigurator = {
	  	extend: function (Parent, proto, options) {
	  		proto.adapt = combine$3(proto.adapt, ensureArray(options.adapt));
	  	},

	  	init: function () {}
	  };

	  function combine$3(a, b) {
	  	var c = a.slice();
	  	var i = b.length;

	  	while (i--) {
	  		if (! ~c.indexOf(b[i])) {
	  			c.push(b[i]);
	  		}
	  	}

	  	return c;
	  }

	  var registryNames$1 = ['adaptors', 'components', 'computed', 'decorators', 'easing', 'events', 'interpolators', 'partials', 'transitions'];

	  var Registry = (function () {
	  	function Registry(name, useDefaults) {
	  		classCallCheck(this, Registry);

	  		this.name = name;
	  		this.useDefaults = useDefaults;
	  	}

	  	Registry.prototype.extend = function extend(Parent, proto, options) {
	  		this.configure(this.useDefaults ? Parent.defaults : Parent, this.useDefaults ? proto : proto.constructor, options);
	  	};

	  	Registry.prototype.init = function init() {
	  		// noop
	  	};

	  	Registry.prototype.configure = function configure(Parent, target, options) {
	  		var name = this.name;
	  		var option = options[name];

	  		var registry = create(Parent[name]);

	  		for (var key in option) {
	  			registry[key] = option[key];
	  		}

	  		target[name] = registry;
	  	};

	  	Registry.prototype.reset = function reset(ractive) {
	  		var registry = ractive[this.name];
	  		var changed = false;

	  		Object.keys(registry).forEach(function (key) {
	  			var item = registry[key];

	  			if (item._fn) {
	  				if (item._fn.isOwner) {
	  					registry[key] = item._fn;
	  				} else {
	  					delete registry[key];
	  				}
	  				changed = true;
	  			}
	  		});

	  		return changed;
	  	};

	  	return Registry;
	  })();

	  var registries = registryNames$1.map(function (name) {
	  	return new Registry(name, name === 'computed');
	  });

	  function wrap(parent, name, method) {
	  	if (!/_super/.test(method)) return method;

	  	function wrapper() {
	  		var superMethod = getSuperMethod(wrapper._parent, name);
	  		var hasSuper = ('_super' in this);
	  		var oldSuper = this._super;

	  		this._super = superMethod;

	  		var result = method.apply(this, arguments);

	  		if (hasSuper) {
	  			this._super = oldSuper;
	  		} else {
	  			delete this._super;
	  		}

	  		return result;
	  	}

	  	wrapper._parent = parent;
	  	wrapper._method = method;

	  	return wrapper;
	  }

	  function getSuperMethod(parent, name) {
	  	if (name in parent) {
	  		var _ret = (function () {
	  			var value = parent[name];

	  			return {
	  				v: typeof value === 'function' ? value : function () {
	  					return value;
	  				}
	  			};
	  		})();

	  		if (typeof _ret === 'object') return _ret.v;
	  	}

	  	return noop;
	  }

	  function getMessage(deprecated, correct, isError) {
	  	return 'options.' + deprecated + ' has been deprecated in favour of options.' + correct + '.' + (isError ? ' You cannot specify both options, please use options.' + correct + '.' : '');
	  }

	  function deprecateOption(options, deprecatedOption, correct) {
	  	if (deprecatedOption in options) {
	  		if (!(correct in options)) {
	  			warnIfDebug(getMessage(deprecatedOption, correct));
	  			options[correct] = options[deprecatedOption];
	  		} else {
	  			throw new Error(getMessage(deprecatedOption, correct, true));
	  		}
	  	}
	  }
	  function deprecate(options) {
	  	deprecateOption(options, 'beforeInit', 'onconstruct');
	  	deprecateOption(options, 'init', 'onrender');
	  	deprecateOption(options, 'complete', 'oncomplete');
	  	deprecateOption(options, 'eventDefinitions', 'events');

	  	// Using extend with Component instead of options,
	  	// like Human.extend( Spider ) means adaptors as a registry
	  	// gets copied to options. So we have to check if actually an array
	  	if (isArray(options.adaptors)) {
	  		deprecateOption(options, 'adaptors', 'adapt');
	  	}
	  }

	  var custom = {
	  	adapt: adaptConfigurator,
	  	css: cssConfigurator,
	  	data: dataConfigurator,
	  	template: templateConfigurator
	  };

	  var defaultKeys = Object.keys(defaults);

	  var isStandardKey = makeObj(defaultKeys.filter(function (key) {
	  	return !custom[key];
	  }));

	  // blacklisted keys that we don't double extend
	  var isBlacklisted = makeObj(defaultKeys.concat(registries.map(function (r) {
	  	return r.name;
	  })));

	  var order = [].concat(defaultKeys.filter(function (key) {
	  	return !registries[key] && !custom[key];
	  }), registries,
	  //custom.data,
	  custom.template, custom.css);

	  var config = {
	  	extend: function (Parent, proto, options) {
	  		return configure('extend', Parent, proto, options);
	  	},

	  	init: function (Parent, ractive, options) {
	  		return configure('init', Parent, ractive, options);
	  	},

	  	reset: function (ractive) {
	  		return order.filter(function (c) {
	  			return c.reset && c.reset(ractive);
	  		}).map(function (c) {
	  			return c.name;
	  		});
	  	},

	  	// this defines the order. TODO this isn't used anywhere in the codebase,
	  	// only in the test suite - should get rid of it
	  	order: order
	  };

	  function configure(method, Parent, target, options) {
	  	deprecate(options);

	  	for (var key in options) {
	  		if (isStandardKey.hasOwnProperty(key)) {
	  			var value = options[key];

	  			// warn the developer if they passed a function and ignore its value

	  			// NOTE: we allow some functions on "el" because we duck type element lists
	  			// and some libraries or ef'ed-up virtual browsers (phantomJS) return a
	  			// function object as the result of querySelector methods
	  			if (key !== 'el' && typeof value === 'function') {
	  				warnIfDebug(key + ' is a Ractive option that does not expect a function and will be ignored', method === 'init' ? target : null);
	  			} else {
	  				target[key] = value;
	  			}
	  		}
	  	}

	  	// disallow combination of `append` and `enhance`
	  	if (options.append && options.enhance) {
	  		throw new Error('Cannot use append and enhance at the same time');
	  	}

	  	registries.forEach(function (registry) {
	  		registry[method](Parent, target, options);
	  	});

	  	adaptConfigurator[method](Parent, target, options);
	  	templateConfigurator[method](Parent, target, options);
	  	cssConfigurator[method](Parent, target, options);

	  	extendOtherMethods(Parent.prototype, target, options);
	  }

	  function extendOtherMethods(parent, target, options) {
	  	for (var key in options) {
	  		if (!isBlacklisted[key] && options.hasOwnProperty(key)) {
	  			var member = options[key];

	  			// if this is a method that overwrites a method, wrap it:
	  			if (typeof member === 'function') {
	  				member = wrap(parent, key, member);
	  			}

	  			target[key] = member;
	  		}
	  	}
	  }

	  function makeObj(array) {
	  	var obj = {};
	  	array.forEach(function (x) {
	  		return obj[x] = true;
	  	});
	  	return obj;
	  }

	  var configHook = new Hook('config');
	  var initHook = new HookQueue('init');
	  function initialise(ractive, userOptions, options) {
	  	Object.keys(ractive.viewmodel.computations).forEach(function (key) {
	  		var computation = ractive.viewmodel.computations[key];

	  		if (ractive.viewmodel.value.hasOwnProperty(key)) {
	  			computation.set(ractive.viewmodel.value[key]);
	  		}
	  	});

	  	// init config from Parent and options
	  	config.init(ractive.constructor, ractive, userOptions);

	  	configHook.fire(ractive);
	  	initHook.begin(ractive);

	  	var fragment = undefined;

	  	// Render virtual DOM
	  	if (ractive.template) {
	  		var cssIds = undefined;

	  		if (options.cssIds || ractive.cssId) {
	  			cssIds = options.cssIds ? options.cssIds.slice() : [];

	  			if (ractive.cssId) {
	  				cssIds.push(ractive.cssId);
	  			}
	  		}

	  		ractive.fragment = fragment = new Fragment({
	  			owner: ractive,
	  			template: ractive.template,
	  			cssIds: cssIds,
	  			indexRefs: options.indexRefs || {},
	  			keyRefs: options.keyRefs || {}
	  		}).bind(ractive.viewmodel);
	  	}

	  	initHook.end(ractive);

	  	if (fragment) {
	  		// render automatically ( if `el` is specified )
	  		var el = getElement(ractive.el);
	  		if (el) {
	  			var promise = ractive.render(el, ractive.append);

	  			if (Ractive.DEBUG_PROMISES) {
	  				promise['catch'](function (err) {
	  					warnOnceIfDebug('Promise debugging is enabled, to help solve errors that happen asynchronously. Some browsers will log unhandled promise rejections, in which case you can safely disable promise debugging:\n  Ractive.DEBUG_PROMISES = false;');
	  					warnIfDebug('An error happened during rendering', { ractive: ractive });
	  					err.stack && logIfDebug(err.stack);

	  					throw err;
	  				});
	  			}
	  		}
	  	}
	  }

	  var renderHook$1 = new Hook('render');
	  var completeHook$1 = new Hook('complete');
	  function render(ractive, target, anchor, occupants) {
	  	// if `noIntro` is `true`, temporarily disable transitions
	  	var transitionsEnabled = ractive.transitionsEnabled;
	  	if (ractive.noIntro) ractive.transitionsEnabled = false;

	  	var promise = runloop.start(ractive, true);
	  	runloop.scheduleTask(function () {
	  		return renderHook$1.fire(ractive);
	  	}, true);

	  	if (ractive.fragment.rendered) {
	  		throw new Error('You cannot call ractive.render() on an already rendered instance! Call ractive.unrender() first');
	  	}

	  	anchor = getElement(anchor) || ractive.anchor;

	  	ractive.el = target;
	  	ractive.anchor = anchor;

	  	// ensure encapsulated CSS is up-to-date
	  	if (ractive.cssId) applyCSS();

	  	if (target) {
	  		(target.__ractive_instances__ || (target.__ractive_instances__ = [])).push(ractive);

	  		if (anchor) {
	  			var docFrag = doc.createDocumentFragment();
	  			ractive.fragment.render(docFrag);
	  			target.insertBefore(docFrag, anchor);
	  		} else {
	  			ractive.fragment.render(target, occupants);
	  		}
	  	}

	  	runloop.end();
	  	ractive.transitionsEnabled = transitionsEnabled;

	  	return promise.then(function () {
	  		return completeHook$1.fire(ractive);
	  	});
	  }

	  var RactiveEvent = (function () {
	  	function RactiveEvent(ractive, name) {
	  		classCallCheck(this, RactiveEvent);

	  		this.ractive = ractive;
	  		this.name = name;
	  		this.handler = null;
	  	}

	  	RactiveEvent.prototype.listen = function listen(directive) {
	  		var ractive = this.ractive;

	  		this.handler = ractive.on(this.name, function () {
	  			var event = undefined;

	  			// semi-weak test, but what else? tag the event obj ._isEvent ?
	  			if (arguments.length && arguments[0] && arguments[0].node) {
	  				event = Array.prototype.shift.call(arguments);
	  				event.component = ractive;
	  			}

	  			var args = Array.prototype.slice.call(arguments);
	  			directive.fire(event, args);

	  			// cancel bubbling
	  			return false;
	  		});
	  	};

	  	RactiveEvent.prototype.unlisten = function unlisten() {
	  		this.handler.cancel();
	  	};

	  	return RactiveEvent;
	  })();

	  // TODO it's unfortunate that this has to run every time a
	  // component is rendered... is there a better way?

	  function updateLiveQueries(component) {
	  	// Does this need to be added to any live queries?
	  	var instance = component.ractive;

	  	do {
	  		var liveQueries = instance._liveComponentQueries;

	  		var i = liveQueries.length;
	  		while (i--) {
	  			var _name = liveQueries[i];
	  			var query = liveQueries["_" + _name];

	  			if (query.test(component)) {
	  				query.add(component.instance);
	  				// keep register of applicable selectors, for when we teardown
	  				component.liveQueries.push(query);
	  			}
	  		}
	  	} while (instance = instance.parent);
	  }

	  function removeFromLiveComponentQueries(component) {
	  	var instance = component.ractive;

	  	while (instance) {
	  		var query = instance._liveComponentQueries['_' + component.name];
	  		if (query) query.remove(component);

	  		instance = instance.parent;
	  	}
	  }

	  function makeDirty(query) {
	  	query.makeDirty();
	  }

	  var teardownHook$1 = new Hook('teardown');

	  var Component = (function (_Item) {
	  	inherits(Component, _Item);

	  	function Component(options, ComponentConstructor) {
	  		classCallCheck(this, Component);

	  		_Item.call(this, options);
	  		this.type = COMPONENT; // override ELEMENT from super

	  		var instance = create(ComponentConstructor.prototype);

	  		this.instance = instance;
	  		this.name = options.template.e;
	  		this.parentFragment = options.parentFragment;
	  		this.complexMappings = [];

	  		this.liveQueries = [];

	  		if (instance.el) {
	  			warnIfDebug('The <' + this.name + '> component has a default \'el\' property; it has been disregarded');
	  		}

	  		var partials = options.template.p || {};
	  		if (!('content' in partials)) partials.content = options.template.f || [];
	  		this._partials = partials; // TEMP

	  		this.yielders = {};

	  		// find container
	  		var fragment = options.parentFragment;
	  		var container = undefined;
	  		while (fragment) {
	  			if (fragment.owner.type === YIELDER) {
	  				container = fragment.owner.container;
	  				break;
	  			}

	  			fragment = fragment.parent;
	  		}

	  		// add component-instance-specific properties
	  		instance.parent = this.parentFragment.ractive;
	  		instance.container = container || null;
	  		instance.root = instance.parent.root;
	  		instance.component = this;

	  		construct(this.instance, { partials: partials });

	  		// for hackability, this could be an open option
	  		// for any ractive instance, but for now, just
	  		// for components and just for ractive...
	  		instance._inlinePartials = partials;

	  		this.eventHandlers = [];
	  		if (this.template.v) this.setupEvents();
	  	}

	  	Component.prototype.bind = function bind() {
	  		var _this = this;

	  		var viewmodel = this.instance.viewmodel;
	  		var childData = viewmodel.value;

	  		// determine mappings
	  		if (this.template.a) {
	  			Object.keys(this.template.a).forEach(function (localKey) {
	  				var template = _this.template.a[localKey];
	  				var model = undefined;
	  				var fragment = undefined;

	  				if (template === 0) {
	  					// empty attributes are `true`
	  					viewmodel.joinKey(localKey).set(true);
	  				} else if (typeof template === 'string') {
	  					var parsed = parseJSON(template);
	  					viewmodel.joinKey(localKey).set(parsed ? parsed.value : template);
	  				} else if (isArray(template)) {
	  					if (template.length === 1 && template[0].t === INTERPOLATOR) {
	  						model = resolve$1(_this.parentFragment, template[0]);

	  						if (!model) {
	  							warnOnceIfDebug('The ' + localKey + '=\'{{' + template[0].r + '}}\' mapping is ambiguous, and may cause unexpected results. Consider initialising your data to eliminate the ambiguity', { ractive: _this.instance }); // TODO add docs page explaining this
	  							_this.parentFragment.ractive.get(localKey); // side-effect: create mappings as necessary
	  							model = _this.parentFragment.findContext().joinKey(localKey);
	  						}

	  						viewmodel.map(localKey, model);

	  						if (model.get() === undefined && localKey in childData) {
	  							model.set(childData[localKey]);
	  						}
	  					} else {
	  						fragment = new Fragment({
	  							owner: _this,
	  							template: template
	  						}).bind();

	  						model = viewmodel.joinKey(localKey);
	  						model.set(fragment.valueOf());

	  						// this is a *bit* of a hack
	  						fragment.bubble = function () {
	  							Fragment.prototype.bubble.call(fragment);
	  							model.set(fragment.valueOf());
	  						};

	  						_this.complexMappings.push(fragment);
	  					}
	  				}
	  			});
	  		}

	  		initialise(this.instance, {
	  			partials: this._partials
	  		}, {
	  			indexRefs: this.instance.isolated ? {} : this.parentFragment.indexRefs,
	  			keyRefs: this.instance.isolated ? {} : this.parentFragment.keyRefs,
	  			cssIds: this.parentFragment.cssIds
	  		});

	  		this.eventHandlers.forEach(_bind);
	  	};

	  	Component.prototype.bubble = function bubble() {
	  		if (!this.dirty) {
	  			this.dirty = true;
	  			this.parentFragment.bubble();
	  		}
	  	};

	  	Component.prototype.checkYielders = function checkYielders() {
	  		var _this2 = this;

	  		Object.keys(this.yielders).forEach(function (name) {
	  			if (_this2.yielders[name].length > 1) {
	  				runloop.end();
	  				throw new Error('A component template can only have one {{yield' + (name ? ' ' + name : '') + '}} declaration at a time');
	  			}
	  		});
	  	};

	  	Component.prototype.detach = function detach() {
	  		return this.instance.fragment.detach();
	  	};

	  	Component.prototype.find = function find(selector) {
	  		return this.instance.fragment.find(selector);
	  	};

	  	Component.prototype.findAll = function findAll(selector, query) {
	  		this.instance.fragment.findAll(selector, query);
	  	};

	  	Component.prototype.findComponent = function findComponent(name) {
	  		if (!name || this.name === name) return this.instance;

	  		if (this.instance.fragment) {
	  			return this.instance.fragment.findComponent(name);
	  		}
	  	};

	  	Component.prototype.findAllComponents = function findAllComponents(name, query) {
	  		if (query.test(this)) {
	  			query.add(this.instance);

	  			if (query.live) {
	  				this.liveQueries.push(query);
	  			}
	  		}

	  		this.instance.fragment.findAllComponents(name, query);
	  	};

	  	Component.prototype.firstNode = function firstNode() {
	  		return this.instance.fragment.firstNode();
	  	};

	  	Component.prototype.rebind = function rebind() {
	  		var _this3 = this;

	  		this.complexMappings.forEach(_rebind);

	  		this.liveQueries.forEach(makeDirty);

	  		// update relevant mappings
	  		var viewmodel = this.instance.viewmodel;
	  		viewmodel.mappings = {};

	  		if (this.template.a) {
	  			Object.keys(this.template.a).forEach(function (localKey) {
	  				var template = _this3.template.a[localKey];
	  				var model = undefined;

	  				if (isArray(template) && template.length === 1 && template[0].t === INTERPOLATOR) {
	  					model = resolve$1(_this3.parentFragment, template[0]);

	  					if (!model) {
	  						// TODO is this even possible?
	  						warnOnceIfDebug('The ' + localKey + '=\'{{' + template[0].r + '}}\' mapping is ambiguous, and may cause unexpected results. Consider initialising your data to eliminate the ambiguity', { ractive: _this3.instance });
	  						_this3.parentFragment.ractive.get(localKey); // side-effect: create mappings as necessary
	  						model = _this3.parentFragment.findContext().joinKey(localKey);
	  					}

	  					viewmodel.map(localKey, model);
	  				}
	  			});
	  		}

	  		this.instance.fragment.rebind(viewmodel);
	  	};

	  	Component.prototype.render = function render$$(target, occupants) {
	  		render(this.instance, target, null, occupants);

	  		this.checkYielders();
	  		this.eventHandlers.forEach(_render);
	  		updateLiveQueries(this);

	  		this.rendered = true;
	  	};

	  	Component.prototype.setupEvents = function setupEvents() {
	  		var _this4 = this;

	  		var handlers = this.eventHandlers;

	  		Object.keys(this.template.v).forEach(function (key) {
	  			var eventNames = key.split('-');
	  			var template = _this4.template.v[key];

	  			eventNames.forEach(function (eventName) {
	  				var event = new RactiveEvent(_this4.instance, eventName);
	  				handlers.push(new EventDirective(_this4, event, template));
	  			});
	  		});
	  	};

	  	Component.prototype.toString = function toString() {
	  		return this.instance.toHTML();
	  	};

	  	Component.prototype.unbind = function unbind() {
	  		this.complexMappings.forEach(_unbind);

	  		var instance = this.instance;
	  		instance.viewmodel.teardown();
	  		instance.fragment.unbind();
	  		instance._observers.forEach(cancel);

	  		removeFromLiveComponentQueries(this);

	  		if (instance.fragment.rendered && instance.el.__ractive_instances__) {
	  			removeFromArray(instance.el.__ractive_instances__, instance);
	  		}

	  		Object.keys(instance._links).forEach(function (k) {
	  			return instance._links[k].unlink();
	  		});

	  		teardownHook$1.fire(instance);
	  	};

	  	Component.prototype.unrender = function unrender(shouldDestroy) {
	  		var _this5 = this;

	  		this.shouldDestroy = shouldDestroy;
	  		this.instance.unrender();
	  		this.eventHandlers.forEach(_unrender);
	  		this.liveQueries.forEach(function (query) {
	  			return query.remove(_this5.instance);
	  		});
	  	};

	  	Component.prototype.update = function update() {
	  		this.instance.fragment.update();
	  		this.checkYielders();
	  		this.eventHandlers.forEach(_update);
	  		this.dirty = false;
	  	};

	  	return Component;
	  })(Item);

	  var Text = (function (_Item) {
	  	inherits(Text, _Item);

	  	function Text(options) {
	  		classCallCheck(this, Text);

	  		_Item.call(this, options);
	  		this.type = TEXT;
	  	}

	  	Text.prototype.bind = function bind() {
	  		// noop
	  	};

	  	Text.prototype.detach = function detach() {
	  		return detachNode(this.node);
	  	};

	  	Text.prototype.firstNode = function firstNode() {
	  		return this.node;
	  	};

	  	Text.prototype.rebind = function rebind() {
	  		// noop
	  	};

	  	Text.prototype.render = function render(target, occupants) {
	  		this.rendered = true;

	  		if (occupants) {
	  			var n = occupants[0];
	  			if (n && n.nodeType === 3) {
	  				occupants.shift();
	  				if (n.nodeValue !== this.template) {
	  					n.nodeValue = this.template;
	  				}
	  			} else {
	  				n = this.node = doc.createTextNode(this.template);
	  				if (occupants[0]) {
	  					target.insertBefore(n, occupants[0]);
	  				} else {
	  					target.appendChild(n);
	  				}
	  			}

	  			this.node = n;
	  		} else {
	  			this.node = doc.createTextNode(this.template);
	  			target.appendChild(this.node);
	  		}
	  	};

	  	Text.prototype.toString = function toString(escape) {
	  		return escape ? escapeHtml(this.template) : this.template;
	  	};

	  	Text.prototype.unbind = function unbind() {
	  		// noop
	  	};

	  	Text.prototype.unrender = function unrender(shouldDestroy) {
	  		if (this.rendered && shouldDestroy) this.detach();
	  		this.rendered = false;
	  	};

	  	Text.prototype.update = function update() {
	  		// noop
	  	};

	  	Text.prototype.valueOf = function valueOf() {
	  		return this.template;
	  	};

	  	return Text;
	  })(Item);

	  // finds the component constructor in the registry or view hierarchy registries

	  function getComponentConstructor(ractive, name) {
	  	var instance = findInstance('components', ractive, name);
	  	var Component = undefined;

	  	if (instance) {
	  		Component = instance.components[name];

	  		// best test we have for not Ractive.extend
	  		if (!Component._Parent) {
	  			// function option, execute and store for reset
	  			var fn = Component.bind(instance);
	  			fn.isOwner = instance.components.hasOwnProperty(name);
	  			Component = fn();

	  			if (!Component) {
	  				warnIfDebug(noRegistryFunctionReturn, name, 'component', 'component', { ractive: ractive });
	  				return;
	  			}

	  			if (typeof Component === 'string') {
	  				// allow string lookup
	  				Component = getComponentConstructor(ractive, Component);
	  			}

	  			Component._fn = fn;
	  			instance.components[name] = Component;
	  		}
	  	}

	  	return Component;
	  }

	  var constructors = {};
	  constructors[ALIAS] = Alias;
	  constructors[DOCTYPE] = Doctype;
	  constructors[INTERPOLATOR] = Interpolator;
	  constructors[PARTIAL] = Partial;
	  constructors[SECTION] = Section;
	  constructors[TRIPLE] = Triple;
	  constructors[YIELDER] = Yielder;

	  var specialElements = {
	  	doctype: Doctype,
	  	form: Form,
	  	input: Input,
	  	option: Option,
	  	select: Select,
	  	textarea: Textarea
	  };
	  function createItem(options) {
	  	if (typeof options.template === 'string') {
	  		return new Text(options);
	  	}

	  	if (options.template.t === ELEMENT) {
	  		// could be component or element
	  		var ComponentConstructor = getComponentConstructor(options.parentFragment.ractive, options.template.e);
	  		if (ComponentConstructor) {
	  			return new Component(options, ComponentConstructor);
	  		}

	  		var tagName = options.template.e.toLowerCase();

	  		var ElementConstructor = specialElements[tagName] || Element;
	  		return new ElementConstructor(options);
	  	}

	  	var Item = constructors[options.template.t];

	  	if (!Item) throw new Error('Unrecognised item type ' + options.template.t);

	  	return new Item(options);
	  }

	  var ReferenceResolver = (function () {
	  	function ReferenceResolver(fragment, reference, callback) {
	  		classCallCheck(this, ReferenceResolver);

	  		this.fragment = fragment;
	  		this.reference = normalise(reference);
	  		this.callback = callback;

	  		this.keys = splitKeypath(reference);
	  		this.resolved = false;

	  		// TODO the consumer should take care of addUnresolved
	  		// we attach to all the contexts between here and the root
	  		// - whenever their values change, they can quickly
	  		// check to see if we can resolve
	  		while (fragment) {
	  			if (fragment.context) {
	  				fragment.context.addUnresolved(this.keys[0], this);
	  			}

	  			fragment = fragment.componentParent || fragment.parent;
	  		}
	  	}

	  	ReferenceResolver.prototype.attemptResolution = function attemptResolution() {
	  		if (this.resolved) return;

	  		var model = resolveAmbiguousReference(this.fragment, this.reference);

	  		if (model) {
	  			this.resolved = true;
	  			this.callback(model);
	  		}
	  	};

	  	ReferenceResolver.prototype.forceResolution = function forceResolution() {
	  		if (this.resolved) return;

	  		var model = this.fragment.findContext().joinAll(this.keys);
	  		this.callback(model);
	  		this.resolved = true;
	  	};

	  	ReferenceResolver.prototype.unbind = function unbind() {
	  		removeFromArray(this.fragment.unresolved, this);
	  	};

	  	return ReferenceResolver;
	  })();

	  // TODO all this code needs to die

	  function processItems(items, values, guid) {
	  	var counter = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

	  	return items.map(function (item) {
	  		if (item.type === TEXT) {
	  			return item.template;
	  		}

	  		if (item.fragment) {
	  			if (item.fragment.iterations) {
	  				return item.fragment.iterations.map(function (fragment) {
	  					return processItems(fragment.items, values, guid, counter);
	  				}).join('');
	  			} else {
	  				return processItems(item.fragment.items, values, guid, counter);
	  			}
	  		}

	  		var placeholderId = guid + '-' + counter++;

	  		values[placeholderId] = item.model ? item.model.wrapper ? item.model.wrapper.value : item.model.get() : undefined;

	  		return '${' + placeholderId + '}';
	  	}).join('');
	  }

	  function unrenderAndDestroy(item) {
	  	item.unrender(true);
	  }

	  var Fragment = (function () {
	  	function Fragment(options) {
	  		classCallCheck(this, Fragment);

	  		this.owner = options.owner; // The item that owns this fragment - an element, section, partial, or attribute

	  		this.isRoot = !options.owner.parentFragment;
	  		this.parent = this.isRoot ? null : this.owner.parentFragment;
	  		this.ractive = options.ractive || (this.isRoot ? options.owner : this.parent.ractive);

	  		this.componentParent = this.isRoot && this.ractive.component ? this.ractive.component.parentFragment : null;

	  		this.context = null;
	  		this.rendered = false;
	  		this.indexRefs = options.indexRefs || (this.parent ? this.parent.indexRefs : []);
	  		this.keyRefs = options.keyRefs || (this.parent ? this.parent.keyRefs : {});

	  		// encapsulated styles should be inherited until they get applied by an element
	  		this.cssIds = 'cssIds' in options ? options.cssIds : this.parent ? this.parent.cssIds : null;

	  		this.resolvers = [];

	  		this.dirty = false;
	  		this.dirtyArgs = this.dirtyValue = true; // TODO getArgsList is nonsense - should deprecate legacy directives style

	  		this.template = options.template || [];
	  		this.createItems();
	  	}

	  	Fragment.prototype.bind = function bind(context) {
	  		this.context = context;
	  		this.items.forEach(_bind);
	  		this.bound = true;

	  		// in rare cases, a forced resolution (or similar) will cause the
	  		// fragment to be dirty before it's even finished binding. In those
	  		// cases we update immediately
	  		if (this.dirty) this.update();

	  		return this;
	  	};

	  	Fragment.prototype.bubble = function bubble() {
	  		this.dirtyArgs = this.dirtyValue = true;

	  		if (!this.dirty) {
	  			this.dirty = true;

	  			if (this.isRoot) {
	  				// TODO encapsulate 'is component root, but not overall root' check?
	  				if (this.ractive.component) {
	  					this.ractive.component.bubble();
	  				} else if (this.bound) {
	  					runloop.addFragment(this);
	  				}
	  			} else {
	  				this.owner.bubble();
	  			}
	  		}
	  	};

	  	Fragment.prototype.createItems = function createItems() {
	  		var _this = this;

	  		this.items = this.template.map(function (template, index) {
	  			return createItem({ parentFragment: _this, template: template, index: index });
	  		});
	  	};

	  	Fragment.prototype.detach = function detach() {
	  		var docFrag = createDocumentFragment();
	  		this.items.forEach(function (item) {
	  			return docFrag.appendChild(item.detach());
	  		});
	  		return docFrag;
	  	};

	  	Fragment.prototype.find = function find(selector) {
	  		var len = this.items.length;
	  		var i = undefined;

	  		for (i = 0; i < len; i += 1) {
	  			var found = this.items[i].find(selector);
	  			if (found) return found;
	  		}
	  	};

	  	Fragment.prototype.findAll = function findAll(selector, query) {
	  		if (this.items) {
	  			var len = this.items.length;
	  			var i = undefined;

	  			for (i = 0; i < len; i += 1) {
	  				var item = this.items[i];

	  				if (item.findAll) {
	  					item.findAll(selector, query);
	  				}
	  			}
	  		}

	  		return query;
	  	};

	  	Fragment.prototype.findComponent = function findComponent(name) {
	  		var len = this.items.length;
	  		var i = undefined;

	  		for (i = 0; i < len; i += 1) {
	  			var found = this.items[i].findComponent(name);
	  			if (found) return found;
	  		}
	  	};

	  	Fragment.prototype.findAllComponents = function findAllComponents(name, query) {
	  		if (this.items) {
	  			var len = this.items.length;
	  			var i = undefined;

	  			for (i = 0; i < len; i += 1) {
	  				var item = this.items[i];

	  				if (item.findAllComponents) {
	  					item.findAllComponents(name, query);
	  				}
	  			}
	  		}

	  		return query;
	  	};

	  	Fragment.prototype.findContext = function findContext() {
	  		var fragment = this;
	  		while (!fragment.context) fragment = fragment.parent;
	  		return fragment.context;
	  	};

	  	Fragment.prototype.findNextNode = function findNextNode(item) {
	  		// search for the next node going forward
	  		for (var i = item.index + 1; i < this.items.length; i++) {
	  			if (!this.items[i]) continue;

	  			var node = this.items[i].firstNode();
	  			if (node) return node;
	  		}

	  		// if this is the root fragment, and there are no more items,
	  		// it means we're at the end...
	  		if (this.isRoot) {
	  			if (this.ractive.component) {
	  				return this.ractive.component.parentFragment.findNextNode(this.ractive.component);
	  			}

	  			// TODO possible edge case with other content
	  			// appended to this.ractive.el?
	  			return null;
	  		}

	  		return this.owner.findNextNode(this); // the argument is in case the parent is a RepeatedFragment
	  	};

	  	Fragment.prototype.findParentNode = function findParentNode() {
	  		var fragment = this;

	  		do {
	  			if (fragment.owner.type === ELEMENT) {
	  				return fragment.owner.node;
	  			}

	  			if (fragment.isRoot && !fragment.ractive.component) {
	  				// TODO encapsulate check
	  				return fragment.ractive.el;
	  			}

	  			if (fragment.owner.type === YIELDER) {
	  				fragment = fragment.owner.containerFragment;
	  			} else {
	  				fragment = fragment.componentParent || fragment.parent; // TODO ugh
	  			}
	  		} while (fragment);

	  		throw new Error('Could not find parent node'); // TODO link to issue tracker
	  	};

	  	Fragment.prototype.findRepeatingFragment = function findRepeatingFragment() {
	  		var fragment = this;
	  		// TODO better check than fragment.parent.iterations
	  		while (fragment.parent && !fragment.isIteration) {
	  			fragment = fragment.parent || fragment.componentParent;
	  		}

	  		return fragment;
	  	};

	  	Fragment.prototype.firstNode = function firstNode() {
	  		var node = undefined;
	  		for (var i = 0; i < this.items.length; i++) {
	  			node = this.items[i].firstNode();

	  			if (node) {
	  				return node;
	  			}
	  		}
	  		return this.parent.findNextNode(this.owner);
	  	};

	  	// TODO ideally, this would be deprecated in favour of an
	  	// expression-like approach

	  	Fragment.prototype.getArgsList = function getArgsList() {
	  		if (this.dirtyArgs) {
	  			var values = {};
	  			var source = processItems(this.items, values, this.ractive._guid);
	  			var parsed = parseJSON('[' + source + ']', values);

	  			this.argsList = parsed ? parsed.value : [this.toString()];

	  			this.dirtyArgs = false;
	  		}

	  		return this.argsList;
	  	};

	  	Fragment.prototype.rebind = function rebind(context) {
	  		this.context = context;

	  		this.items.forEach(_rebind);
	  	};

	  	Fragment.prototype.render = function render(target, occupants) {
	  		if (this.rendered) throw new Error('Fragment is already rendered!');
	  		this.rendered = true;

	  		this.items.forEach(function (item) {
	  			return item.render(target, occupants);
	  		});
	  	};

	  	Fragment.prototype.resetTemplate = function resetTemplate(template) {
	  		var wasBound = this.bound;
	  		var wasRendered = this.rendered;

	  		// TODO ensure transitions are disabled globally during reset

	  		if (wasBound) {
	  			if (wasRendered) this.unrender(true);
	  			this.unbind();
	  		}

	  		this.template = template;
	  		this.createItems();

	  		if (wasBound) {
	  			this.bind(this.context);

	  			if (wasRendered) {
	  				var parentNode = this.findParentNode();
	  				var anchor = this.parent ? this.parent.findNextNode(this.owner) : null;

	  				if (anchor) {
	  					var docFrag = createDocumentFragment();
	  					this.render(docFrag);
	  					parentNode.insertBefore(docFrag, anchor);
	  				} else {
	  					this.render(parentNode);
	  				}
	  			}
	  		}
	  	};

	  	Fragment.prototype.resolve = function resolve(template, callback) {
	  		if (!this.context) {
	  			return this.parent.resolve(template, callback);
	  		}

	  		var resolver = new ReferenceResolver(this, template, callback);
	  		this.resolvers.push(resolver);

	  		return resolver; // so we can e.g. force resolution
	  	};

	  	Fragment.prototype.toHtml = function toHtml() {
	  		return this.toString();
	  	};

	  	Fragment.prototype.toString = function toString(escape) {
	  		return this.items.map(escape ? toEscapedString : _toString).join('');
	  	};

	  	Fragment.prototype.unbind = function unbind() {
	  		this.items.forEach(_unbind);
	  		this.bound = false;

	  		return this;
	  	};

	  	Fragment.prototype.unrender = function unrender(shouldDestroy) {
	  		this.items.forEach(shouldDestroy ? unrenderAndDestroy : _unrender);
	  		this.rendered = false;
	  	};

	  	Fragment.prototype.update = function update() {
	  		if (this.dirty) {
	  			this.items.forEach(_update);
	  			this.dirty = false;
	  		}
	  	};

	  	Fragment.prototype.valueOf = function valueOf() {
	  		if (this.items.length === 1) {
	  			return this.items[0].valueOf();
	  		}

	  		if (this.dirtyValue) {
	  			var values = {};
	  			var source = processItems(this.items, values, this.ractive._guid);
	  			var parsed = parseJSON(source, values);

	  			this.value = parsed ? parsed.value : this.toString();

	  			this.dirtyValue = false;
	  		}

	  		return this.value;
	  	};

	  	return Fragment;
	  })();

	  // TODO should resetTemplate be asynchronous? i.e. should it be a case
	  // of outro, update template, intro? I reckon probably not, since that
	  // could be achieved with unrender-resetTemplate-render. Also, it should
	  // conceptually be similar to resetPartial, which couldn't be async

	  function Ractive$resetTemplate(template) {
	  	templateConfigurator.init(null, this, { template: template });

	  	var transitionsEnabled = this.transitionsEnabled;
	  	this.transitionsEnabled = false;

	  	// Is this is a component, we need to set the `shouldDestroy`
	  	// flag, otherwise it will assume by default that a parent node
	  	// will be detached, and therefore it doesn't need to bother
	  	// detaching its own nodes
	  	var component = this.component;
	  	if (component) component.shouldDestroy = true;
	  	this.unrender();
	  	if (component) component.shouldDestroy = false;

	  	// remove existing fragment and create new one
	  	this.fragment.unbind().unrender(true);

	  	this.fragment = new Fragment({
	  		template: this.template,
	  		root: this,
	  		owner: this
	  	});

	  	var docFrag = createDocumentFragment();
	  	this.fragment.bind(this.viewmodel).render(docFrag);
	  	this.el.insertBefore(docFrag, this.anchor);

	  	this.transitionsEnabled = transitionsEnabled;
	  }

	  function collect(source, name, dest) {
	  	source.forEach(function (item) {
	  		// queue to rerender if the item is a partial and the current name matches
	  		if (item.type === PARTIAL && (item.refName === name || item.name === name)) {
	  			dest.push(item);
	  			return; // go no further
	  		}

	  		// if it has a fragment, process its items
	  		if (item.fragment) {
	  			collect(item.fragment.iterations || item.fragment.items, name, dest);
	  		}

	  		// or if it is itself a fragment, process its items
	  		else if (isArray(item.items)) {
	  				collect(item.items, name, dest);
	  			}

	  			// or if it is a component, step in and process its items
	  			else if (item.type === COMPONENT && item.instance) {
	  					// ...unless the partial is shadowed
	  					if (item.instance.partials[name]) return;
	  					collect(item.instance.fragment.items, name, dest);
	  				}

	  		// if the item is an element, process its attributes too
	  		if (item.type === ELEMENT) {
	  			if (isArray(item.attributes)) {
	  				collect(item.attributes, name, dest);
	  			}

	  			if (isArray(item.conditionalAttributes)) {
	  				collect(item.conditionalAttributes, name, dest);
	  			}
	  		}
	  	});
	  }

	  function forceResetTemplate(partial) {
	  	partial.forceResetTemplate();
	  }

	  function resetPartial (name, partial) {
	  	var collection = [];
	  	collect(this.fragment.items, name, collection);

	  	var promise = runloop.start(this, true);

	  	this.partials[name] = partial;
	  	collection.forEach(forceResetTemplate);

	  	runloop.end();

	  	return promise;
	  }

	  var shouldRerender = ['template', 'partials', 'components', 'decorators', 'events'];

	  var completeHook = new Hook('complete');
	  var resetHook = new Hook('reset');
	  var renderHook = new Hook('render');
	  var unrenderHook = new Hook('unrender');
	  function Ractive$reset(data) {
	  	data = data || {};

	  	if (typeof data !== 'object') {
	  		throw new Error('The reset method takes either no arguments, or an object containing new data');
	  	}

	  	// TEMP need to tidy this up
	  	data = dataConfigurator.init(this.constructor, this, { data: data });

	  	var promise = runloop.start(this, true);

	  	// If the root object is wrapped, try and use the wrapper's reset value
	  	var wrapper = this.viewmodel.wrapper;
	  	if (wrapper && wrapper.reset) {
	  		if (wrapper.reset(data) === false) {
	  			// reset was rejected, we need to replace the object
	  			this.viewmodel.set(data);
	  		}
	  	} else {
	  		this.viewmodel.set(data);
	  	}

	  	// reset config items and track if need to rerender
	  	var changes = config.reset(this);
	  	var rerender = undefined;

	  	var i = changes.length;
	  	while (i--) {
	  		if (shouldRerender.indexOf(changes[i]) > -1) {
	  			rerender = true;
	  			break;
	  		}
	  	}

	  	if (rerender) {
	  		unrenderHook.fire(this);
	  		this.fragment.resetTemplate(this.template);
	  		renderHook.fire(this);
	  		completeHook.fire(this);
	  	}

	  	runloop.end();

	  	resetHook.fire(this, data);

	  	return promise;
	  }

	  function Ractive$render(target, anchor) {
	  	target = getElement(target) || this.el;

	  	if (!this.append && target) {
	  		// Teardown any existing instances *before* trying to set up the new one -
	  		// avoids certain weird bugs
	  		var others = target.__ractive_instances__;
	  		if (others) others.forEach(_teardown);

	  		// make sure we are the only occupants
	  		if (!this.enhance) {
	  			target.innerHTML = ''; // TODO is this quicker than removeChild? Initial research inconclusive
	  		}
	  	}

	  	var occupants = this.enhance ? toArray(target.childNodes) : null;
	  	var promise = render(this, target, anchor, occupants);

	  	if (occupants) {
	  		while (occupants.length) target.removeChild(occupants.pop());
	  	}

	  	return promise;
	  }

	  var push = makeArrayMethod('push');

	  var pop = makeArrayMethod('pop');

	  function Ractive$once(eventName, handler) {
	  	var listener = this.on(eventName, function () {
	  		handler.apply(this, arguments);
	  		listener.cancel();
	  	});

	  	// so we can still do listener.cancel() manually
	  	return listener;
	  }

	  function trim (str) {
	    return str.trim();
	  }

	  function notEmptyString (str) {
	    return str !== '';
	  }

	  function Ractive$on(eventName, callback) {
	  	var _this = this;

	  	// allow mutliple listeners to be bound in one go
	  	if (typeof eventName === 'object') {
	  		var _ret = (function () {
	  			var listeners = [];
	  			var n = undefined;

	  			for (n in eventName) {
	  				if (eventName.hasOwnProperty(n)) {
	  					listeners.push(_this.on(n, eventName[n]));
	  				}
	  			}

	  			return {
	  				v: {
	  					cancel: function () {
	  						var listener = undefined;
	  						while (listener = listeners.pop()) listener.cancel();
	  					}
	  				}
	  			};
	  		})();

	  		if (typeof _ret === 'object') return _ret.v;
	  	}

	  	// Handle multiple space-separated event names
	  	var eventNames = eventName.split(' ').map(trim).filter(notEmptyString);

	  	eventNames.forEach(function (eventName) {
	  		(_this._subs[eventName] || (_this._subs[eventName] = [])).push(callback);
	  	});

	  	return {
	  		cancel: function () {
	  			return _this.off(eventName, callback);
	  		}
	  	};
	  }

	  function Ractive$off(eventName, callback) {
	  	var _this = this;

	  	// if no arguments specified, remove all callbacks
	  	if (!eventName) {
	  		// TODO use this code instead, once the following issue has been resolved
	  		// in PhantomJS (tests are unpassable otherwise!)
	  		// https://github.com/ariya/phantomjs/issues/11856
	  		// defineProperty( this, '_subs', { value: create( null ), configurable: true });
	  		for (eventName in this._subs) {
	  			delete this._subs[eventName];
	  		}
	  	} else {
	  		// Handle multiple space-separated event names
	  		var eventNames = eventName.split(' ').map(trim).filter(notEmptyString);

	  		eventNames.forEach(function (eventName) {
	  			var subscribers = _this._subs[eventName];

	  			// If we have subscribers for this event...
	  			if (subscribers) {
	  				// ...if a callback was specified, only remove that
	  				if (callback) {
	  					var index = subscribers.indexOf(callback);
	  					if (index !== -1) {
	  						subscribers.splice(index, 1);
	  					}
	  				}

	  				// ...otherwise remove all callbacks
	  				else {
	  						_this._subs[eventName] = [];
	  					}
	  			}
	  		});
	  	}

	  	return this;
	  }

	  var onceOptions = { init: false, once: true };
	  function observeOnce(keypath, callback, options) {
	  	if (isObject(keypath) || typeof keypath === 'function') {
	  		options = extend(callback || {}, onceOptions);
	  		return this.observe(keypath, options);
	  	}

	  	options = extend(options || {}, onceOptions);
	  	return this.observe(keypath, callback, options);
	  }

	  function observeList(keypath, callback, options) {
	  	if (typeof keypath !== 'string') {
	  		throw new Error('ractive.observeList() must be passed a string as its first argument');
	  	}

	  	var model = this.viewmodel.joinAll(splitKeypath(keypath));
	  	var observer = new ListObserver(this, model, callback, options || {});

	  	// add observer to the Ractive instance, so it can be
	  	// cancelled on ractive.teardown()
	  	this._observers.push(observer);

	  	return {
	  		cancel: function () {
	  			observer.cancel();
	  		}
	  	};
	  }

	  function negativeOne() {
	  	return -1;
	  }

	  var ListObserver = (function () {
	  	function ListObserver(context, model, callback, options) {
	  		classCallCheck(this, ListObserver);

	  		this.context = context;
	  		this.model = model;
	  		this.keypath = model.getKeypath();
	  		this.callback = callback;

	  		this.pending = null;

	  		model.register(this);

	  		if (options.init !== false) {
	  			this.sliced = [];
	  			this.shuffle([]);
	  			this.handleChange();
	  		} else {
	  			this.sliced = this.slice();
	  		}
	  	}

	  	ListObserver.prototype.handleChange = function handleChange() {
	  		if (this.pending) {
	  			// post-shuffle
	  			this.callback(this.pending);
	  			this.pending = null;
	  		} else {
	  			// entire array changed
	  			this.shuffle(this.sliced.map(negativeOne));
	  			this.handleChange();
	  		}
	  	};

	  	ListObserver.prototype.shuffle = function shuffle(newIndices) {
	  		var _this = this;

	  		var newValue = this.slice();

	  		var inserted = [];
	  		var deleted = [];
	  		var start = undefined;

	  		var hadIndex = {};

	  		newIndices.forEach(function (newIndex, oldIndex) {
	  			hadIndex[newIndex] = true;

	  			if (newIndex !== oldIndex && start === undefined) {
	  				start = oldIndex;
	  			}

	  			if (newIndex === -1) {
	  				deleted.push(_this.sliced[oldIndex]);
	  			}
	  		});

	  		if (start === undefined) start = newIndices.length;

	  		var len = newValue.length;
	  		for (var i = 0; i < len; i += 1) {
	  			if (!hadIndex[i]) inserted.push(newValue[i]);
	  		}

	  		this.pending = { inserted: inserted, deleted: deleted, start: start };
	  		this.sliced = newValue;
	  	};

	  	ListObserver.prototype.slice = function slice() {
	  		var value = this.model.get();
	  		return isArray(value) ? value.slice() : [];
	  	};

	  	return ListObserver;
	  })();

	  function observe(keypath, callback, options) {
	  	var _this = this;

	  	var observers = [];
	  	var map = undefined;

	  	if (isObject(keypath)) {
	  		map = keypath;
	  		options = callback || {};

	  		Object.keys(map).forEach(function (keypath) {
	  			var callback = map[keypath];

	  			keypath.split(' ').forEach(function (keypath) {
	  				observers.push(createObserver(_this, keypath, callback, options));
	  			});
	  		});
	  	} else {
	  		var keypaths = undefined;

	  		if (typeof keypath === 'function') {
	  			options = callback;
	  			callback = keypath;
	  			keypaths = [''];
	  		} else {
	  			keypaths = keypath.split(' ');
	  		}

	  		keypaths.forEach(function (keypath) {
	  			observers.push(createObserver(_this, keypath, callback, options || {}));
	  		});
	  	}

	  	// add observers to the Ractive instance, so they can be
	  	// cancelled on ractive.teardown()
	  	this._observers.push.apply(this._observers, observers);

	  	return {
	  		cancel: function () {
	  			observers.forEach(cancel);
	  		}
	  	};
	  }

	  function createObserver(ractive, keypath, callback, options) {
	  	var viewmodel = ractive.viewmodel;

	  	var keys = splitKeypath(keypath);
	  	var wildcardIndex = keys.indexOf('*');

	  	// normal keypath - no wildcards
	  	if (! ~wildcardIndex) {
	  		var key = keys[0];

	  		// if not the root model itself, check if viewmodel has key.
	  		if (key !== '' && !viewmodel.has(key)) {
	  			// if this is an inline component, we may need to create an implicit mapping
	  			if (ractive.component) {
	  				var _model = resolveReference(ractive.component.parentFragment, key);
	  				if (_model) viewmodel.map(key, _model);
	  			}
	  		}

	  		var model = viewmodel.joinAll(keys);
	  		return new Observer(ractive, model, callback, options);
	  	}

	  	// pattern observers - more complex case
	  	var baseModel = wildcardIndex === 0 ? viewmodel : viewmodel.joinAll(keys.slice(0, wildcardIndex));

	  	return new PatternObserver(ractive, baseModel, keys.splice(wildcardIndex), callback, options);
	  }

	  var Observer = (function () {
	  	function Observer(ractive, model, callback, options) {
	  		classCallCheck(this, Observer);

	  		this.context = options.context || ractive;
	  		this.model = model;
	  		this.keypath = model.getKeypath(ractive);
	  		this.callback = callback;

	  		this.oldValue = undefined;
	  		this.newValue = model.get();

	  		this.defer = options.defer;
	  		this.once = options.once;
	  		this.strict = options.strict;

	  		this.dirty = false;

	  		if (options.init !== false) {
	  			this.dispatch();
	  		} else {
	  			this.oldValue = this.newValue;
	  		}

	  		model.register(this);
	  	}

	  	Observer.prototype.cancel = function cancel() {
	  		this.model.unregister(this);
	  	};

	  	Observer.prototype.dispatch = function dispatch() {
	  		this.callback.call(this.context, this.newValue, this.oldValue, this.keypath);
	  		this.oldValue = this.newValue;
	  		this.dirty = false;
	  	};

	  	Observer.prototype.handleChange = function handleChange() {
	  		if (!this.dirty) {
	  			this.newValue = this.model.get();

	  			if (this.strict && this.newValue === this.oldValue) return;

	  			runloop.addObserver(this, this.defer);
	  			this.dirty = true;

	  			if (this.once) this.cancel();
	  		}
	  	};

	  	return Observer;
	  })();

	  var PatternObserver = (function () {
	  	function PatternObserver(ractive, baseModel, keys, callback, options) {
	  		var _this2 = this;

	  		classCallCheck(this, PatternObserver);

	  		this.context = options.context || ractive;
	  		this.ractive = ractive;
	  		this.baseModel = baseModel;
	  		this.keys = keys;
	  		this.callback = callback;

	  		var pattern = keys.join('\\.').replace(/\*/g, '(.+)');
	  		var baseKeypath = baseModel.getKeypath(ractive);
	  		this.pattern = new RegExp('^' + (baseKeypath ? baseKeypath + '\\.' : '') + pattern + '$');

	  		this.oldValues = {};
	  		this.newValues = {};

	  		this.defer = options.defer;
	  		this.once = options.once;
	  		this.strict = options.strict;

	  		this.dirty = false;

	  		var models = baseModel.findMatches(this.keys);

	  		models.forEach(function (model) {
	  			_this2.newValues[model.getKeypath(_this2.ractive)] = model.get();
	  		});

	  		if (options.init !== false) {
	  			this.dispatch();
	  		} else {
	  			this.oldValues = this.newValues;
	  		}

	  		baseModel.register(this);
	  	}

	  	PatternObserver.prototype.cancel = function cancel() {
	  		this.baseModel.unregister(this);
	  	};

	  	PatternObserver.prototype.dispatch = function dispatch() {
	  		var _this3 = this;

	  		Object.keys(this.newValues).forEach(function (keypath) {
	  			if (_this3.newKeys && !_this3.newKeys[keypath]) return;

	  			var newValue = _this3.newValues[keypath];
	  			var oldValue = _this3.oldValues[keypath];

	  			if (_this3.strict && newValue === oldValue) return;
	  			if (isEqual(newValue, oldValue)) return;

	  			var args = [newValue, oldValue, keypath];
	  			if (keypath) {
	  				var wildcards = _this3.pattern.exec(keypath).slice(1);
	  				args = args.concat(wildcards);
	  			}

	  			_this3.callback.apply(_this3.context, args);
	  		});

	  		this.oldValues = this.newValues;
	  		this.newKeys = null;
	  		this.dirty = false;
	  	};

	  	PatternObserver.prototype.shuffle = function shuffle(newIndices) {
	  		if (!isArray(this.baseModel.value)) return;

	  		var base = this.baseModel.getKeypath(this.ractive);
	  		var max = this.baseModel.value.length;
	  		var suffix = this.keys.length > 1 ? '.' + this.keys.slice(1).join('.') : '';

	  		this.newKeys = {};
	  		for (var i = 0; i < newIndices.length; i++) {
	  			if (newIndices[i] === -1 || newIndices[i] === i) continue;
	  			this.newKeys[base + '.' + i + suffix] = true;
	  		}

	  		for (var i = newIndices.touchedFrom; i < max; i++) {
	  			this.newKeys[base + '.' + i + suffix] = true;
	  		}
	  	};

	  	PatternObserver.prototype.handleChange = function handleChange() {
	  		var _this4 = this;

	  		if (!this.dirty) {
	  			this.newValues = {};

	  			// handle case where previously extant keypath no longer exists -
	  			// observer should still fire, with undefined as new value
	  			// TODO huh. according to the test suite that's not the case...
	  			// Object.keys( this.oldValues ).forEach( keypath => {
	  			// 	this.newValues[ keypath ] = undefined;
	  			// });

	  			this.baseModel.findMatches(this.keys).forEach(function (model) {
	  				var keypath = model.getKeypath(_this4.ractive);
	  				_this4.newValues[keypath] = model.get();
	  			});

	  			runloop.addObserver(this, this.defer);
	  			this.dirty = true;

	  			if (this.once) this.cancel();
	  		}
	  	};

	  	return PatternObserver;
	  })();

	  var comparators = {};

	  function getComparator(option) {
	  	if (!option) return null; // use existing arrays
	  	if (option === true) return JSON.stringify;
	  	if (typeof option === 'function') return option;

	  	if (typeof option === 'string') {
	  		return comparators[option] || (comparators[option] = function (thing) {
	  			return thing[option];
	  		});
	  	}

	  	throw new Error('If supplied, options.compare must be a string, function, or `true`'); // TODO link to docs
	  }
	  function Ractive$merge(keypath, array, options) {
	  	var model = this.viewmodel.joinAll(splitKeypath(keypath));
	  	var promise = runloop.start(this, true);
	  	var value = model.get();

	  	if (array === value) {
	  		throw new Error('You cannot merge an array with itself'); // TODO link to docs
	  	} else if (!isArray(value) || !isArray(array)) {
	  			throw new Error('You cannot merge an array with a non-array');
	  		}

	  	var comparator = getComparator(options && options.compare);
	  	model.merge(array, comparator);

	  	runloop.end();
	  	return promise;
	  }

	  function link(there, here) {
	  	if (here === there || (there + '.').indexOf(here + '.') === 0 || (here + '.').indexOf(there + '.') === 0) {
	  		throw new Error('A keypath cannot be linked to itself.');
	  	}

	  	var unlink = undefined,
	  	    run = undefined,
	  	    model = undefined;

	  	var ln = this._links[here];

	  	if (ln) {
	  		if (ln.source.model.str !== there || ln.dest.model.str !== here) {
	  			unlink = this.unlink(here);
	  		} else {
	  			return Promise$1.resolve(true);
	  		}
	  	}

	  	run = runloop.start();

	  	// may need to allow a mapping to resolve implicitly
	  	var sourcePath = splitKeypath(there);
	  	if (!this.viewmodel.has(sourcePath[0]) && this.component) {
	  		model = resolveReference(this.component.parentFragment, sourcePath[0]);

	  		if (model) {
	  			this.viewmodel.map(sourcePath[0], model);
	  		}
	  	}

	  	ln = new Link(this.viewmodel.joinAll(sourcePath), this.viewmodel.joinAll(splitKeypath(here)), this);
	  	this._links[here] = ln;
	  	ln.source.handleChange();

	  	runloop.end();

	  	return Promise$1.all([unlink, run]);
	  }

	  var Link = (function () {
	  	function Link(source, dest, ractive) {
	  		classCallCheck(this, Link);

	  		this.source = new LinkSide(source, this);
	  		this.dest = new LinkSide(dest, this);
	  		this.ractive = ractive;
	  		this.locked = false;
	  		this.initialValue = dest.get();
	  	}

	  	Link.prototype.sync = function sync(side) {
	  		if (!this.locked) {
	  			this.locked = true;

	  			if (side === this.dest) {
	  				this.source.model.set(this.dest.model.get());
	  			} else {
	  				this.dest.model.set(this.source.model.get());
	  			}

	  			this.locked = false;
	  		}
	  	};

	  	Link.prototype.unlink = function unlink() {
	  		this.source.model.unregister(this.source);
	  		this.dest.model.unregister(this.dest);
	  	};

	  	return Link;
	  })();

	  var LinkSide = (function () {
	  	function LinkSide(model, owner) {
	  		classCallCheck(this, LinkSide);

	  		this.model = model;
	  		this.owner = owner;
	  		model.register(this);
	  	}

	  	LinkSide.prototype.handleChange = function handleChange() {
	  		this.owner.sync(this);
	  	};

	  	return LinkSide;
	  })();

	  var insertHook = new Hook('insert');
	  function Ractive$insert(target, anchor) {
	  	if (!this.fragment.rendered) {
	  		// TODO create, and link to, documentation explaining this
	  		throw new Error('The API has changed - you must call `ractive.render(target[, anchor])` to render your Ractive instance. Once rendered you can use `ractive.insert()`.');
	  	}

	  	target = getElement(target);
	  	anchor = getElement(anchor) || null;

	  	if (!target) {
	  		throw new Error('You must specify a valid target to insert into');
	  	}

	  	target.insertBefore(this.detach(), anchor);
	  	this.el = target;

	  	(target.__ractive_instances__ || (target.__ractive_instances__ = [])).push(this);
	  	this.isDetached = false;

	  	fireInsertHook(this);
	  }

	  function fireInsertHook(ractive) {
	  	insertHook.fire(ractive);

	  	ractive.findAllComponents('*').forEach(function (child) {
	  		fireInsertHook(child.instance);
	  	});
	  }

	  function Ractive$get(keypath) {
	  	if (!keypath) return this.viewmodel.get(true);

	  	var keys = splitKeypath(keypath);
	  	var key = keys[0];

	  	var model = undefined;

	  	if (!this.viewmodel.has(key)) {
	  		// if this is an inline component, we may need to create
	  		// an implicit mapping
	  		if (this.component && !this.isolated) {
	  			model = resolveReference(this.component.parentFragment, key);

	  			if (model) {
	  				this.viewmodel.map(key, model);
	  			}
	  		}
	  	}

	  	model = this.viewmodel.joinAll(keys);
	  	return model.get(true);
	  }

	  function Ractive$fire(eventName) {
	  	for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	  		args[_key - 1] = arguments[_key];
	  	}

	  	fireEvent(this, eventName, { args: args });
	  }

	  function Ractive$findParent(selector) {

	  	if (this.parent) {
	  		if (this.parent.component && this.parent.component.name === selector) {
	  			return this.parent;
	  		} else {
	  			return this.parent.findParent(selector);
	  		}
	  	}

	  	return null;
	  }

	  function Ractive$findContainer(selector) {
	  	if (this.container) {
	  		if (this.container.component && this.container.component.name === selector) {
	  			return this.container;
	  		} else {
	  			return this.container.findContainer(selector);
	  		}
	  	}

	  	return null;
	  }

	  function Ractive$findComponent(selector) {
	  	return this.fragment.findComponent(selector);
	  }

	  function sortByDocumentPosition(node, otherNode) {
	  	if (node.compareDocumentPosition) {
	  		var bitmask = node.compareDocumentPosition(otherNode);
	  		return bitmask & 2 ? 1 : -1;
	  	}

	  	// In old IE, we can piggy back on the mechanism for
	  	// comparing component positions
	  	return sortByItemPosition(node, otherNode);
	  }

	  function sortByItemPosition(a, b) {
	  	var ancestryA = getAncestry(a.component || a._ractive.proxy);
	  	var ancestryB = getAncestry(b.component || b._ractive.proxy);

	  	var oldestA = lastItem(ancestryA);
	  	var oldestB = lastItem(ancestryB);
	  	var mutualAncestor = undefined;

	  	// remove items from the end of both ancestries as long as they are identical
	  	// - the final one removed is the closest mutual ancestor
	  	while (oldestA && oldestA === oldestB) {
	  		ancestryA.pop();
	  		ancestryB.pop();

	  		mutualAncestor = oldestA;

	  		oldestA = lastItem(ancestryA);
	  		oldestB = lastItem(ancestryB);
	  	}

	  	// now that we have the mutual ancestor, we can find which is earliest
	  	oldestA = oldestA.component || oldestA;
	  	oldestB = oldestB.component || oldestB;

	  	var fragmentA = oldestA.parentFragment;
	  	var fragmentB = oldestB.parentFragment;

	  	// if both items share a parent fragment, our job is easy
	  	if (fragmentA === fragmentB) {
	  		var indexA = fragmentA.items.indexOf(oldestA);
	  		var indexB = fragmentB.items.indexOf(oldestB);

	  		// if it's the same index, it means one contains the other,
	  		// so we see which has the longest ancestry
	  		return indexA - indexB || ancestryA.length - ancestryB.length;
	  	}

	  	// if mutual ancestor is a section, we first test to see which section
	  	// fragment comes first
	  	var fragments = mutualAncestor.iterations;
	  	if (fragments) {
	  		var indexA = fragments.indexOf(fragmentA);
	  		var indexB = fragments.indexOf(fragmentB);

	  		return indexA - indexB || ancestryA.length - ancestryB.length;
	  	}

	  	throw new Error('An unexpected condition was met while comparing the position of two components. Please file an issue at https://github.com/ractivejs/ractive/issues - thanks!');
	  }

	  function getParent(item) {
	  	var parentFragment = item.parentFragment;

	  	if (parentFragment) return parentFragment.owner;

	  	if (item.component && (parentFragment = item.component.parentFragment)) {
	  		return parentFragment.owner;
	  	}
	  }

	  function getAncestry(item) {
	  	var ancestry = [item];
	  	var ancestor = getParent(item);

	  	while (ancestor) {
	  		ancestry.push(ancestor);
	  		ancestor = getParent(ancestor);
	  	}

	  	return ancestry;
	  }

	  var Query = (function () {
	  	function Query(ractive, selector, live, isComponentQuery) {
	  		classCallCheck(this, Query);

	  		this.ractive = ractive;
	  		this.selector = selector;
	  		this.live = live;
	  		this.isComponentQuery = isComponentQuery;

	  		this.result = [];

	  		this.dirty = true;
	  	}

	  	Query.prototype.add = function add(item) {
	  		this.result.push(item);
	  		this.makeDirty();
	  	};

	  	Query.prototype.cancel = function cancel() {
	  		var liveQueries = this._root[this.isComponentQuery ? 'liveComponentQueries' : 'liveQueries'];
	  		var selector = this.selector;

	  		var index = liveQueries.indexOf(selector);

	  		if (index !== -1) {
	  			liveQueries.splice(index, 1);
	  			liveQueries[selector] = null;
	  		}
	  	};

	  	Query.prototype.init = function init() {
	  		this.dirty = false;
	  	};

	  	Query.prototype.makeDirty = function makeDirty() {
	  		var _this = this;

	  		if (!this.dirty) {
	  			this.dirty = true;

	  			// Once the DOM has been updated, ensure the query
	  			// is correctly ordered
	  			runloop.scheduleTask(function () {
	  				return _this.update();
	  			});
	  		}
	  	};

	  	Query.prototype.remove = function remove(nodeOrComponent) {
	  		var index = this.result.indexOf(this.isComponentQuery ? nodeOrComponent.instance : nodeOrComponent);
	  		if (index !== -1) this.result.splice(index, 1);
	  	};

	  	Query.prototype.update = function update() {
	  		this.result.sort(this.isComponentQuery ? sortByItemPosition : sortByDocumentPosition);
	  		this.dirty = false;
	  	};

	  	Query.prototype.test = function test(item) {
	  		return this.isComponentQuery ? !this.selector || item.name === this.selector : item ? matches(item, this.selector) : null;
	  	};

	  	return Query;
	  })();

	  function Ractive$findAllComponents(selector, options) {
	  	options = options || {};
	  	var liveQueries = this._liveComponentQueries;

	  	// Shortcut: if we're maintaining a live query with this
	  	// selector, we don't need to traverse the parallel DOM
	  	var query = liveQueries[selector];
	  	if (query) {
	  		// Either return the exact same query, or (if not live) a snapshot
	  		return options && options.live ? query : query.slice();
	  	}

	  	query = new Query(this, selector, !!options.live, true);

	  	// Add this to the list of live queries Ractive needs to maintain,
	  	// if applicable
	  	if (query.live) {
	  		liveQueries.push(selector);
	  		liveQueries['_' + selector] = query;
	  	}

	  	this.fragment.findAllComponents(selector, query);

	  	query.init();
	  	return query.result;
	  }

	  function Ractive$findAll(selector, options) {
	  	if (!this.el) throw new Error('Cannot call ractive.findAll(\'' + selector + '\', ...) unless instance is rendered to the DOM');

	  	options = options || {};
	  	var liveQueries = this._liveQueries;

	  	// Shortcut: if we're maintaining a live query with this
	  	// selector, we don't need to traverse the parallel DOM
	  	var query = liveQueries[selector];
	  	if (query) {
	  		// Either return the exact same query, or (if not live) a snapshot
	  		return options && options.live ? query : query.slice();
	  	}

	  	query = new Query(this, selector, !!options.live, false);

	  	// Add this to the list of live queries Ractive needs to maintain,
	  	// if applicable
	  	if (query.live) {
	  		liveQueries.push(selector);
	  		liveQueries['_' + selector] = query;
	  	}

	  	this.fragment.findAll(selector, query);

	  	query.init();
	  	return query.result;
	  }

	  function Ractive$find(selector) {
	  	if (!this.el) throw new Error("Cannot call ractive.find('" + selector + "') unless instance is rendered to the DOM");

	  	return this.fragment.find(selector);
	  }

	  var detachHook = new Hook('detach');
	  function Ractive$detach() {
	  	if (this.isDetached) {
	  		return this.el;
	  	}

	  	if (this.el) {
	  		removeFromArray(this.el.__ractive_instances__, this);
	  	}

	  	this.el = this.fragment.detach();
	  	this.isDetached = true;

	  	detachHook.fire(this);
	  	return this.el;
	  }

	  // These are a subset of the easing equations found at
	  // https://raw.github.com/danro/easing-js - license info
	  // follows:

	  // --------------------------------------------------
	  // easing.js v0.5.4
	  // Generic set of easing functions with AMD support
	  // https://github.com/danro/easing-js
	  // This code may be freely distributed under the MIT license
	  // http://danro.mit-license.org/
	  // --------------------------------------------------
	  // All functions adapted from Thomas Fuchs & Jeremy Kahn
	  // Easing Equations (c) 2003 Robert Penner, BSD license
	  // https://raw.github.com/danro/easing-js/master/LICENSE
	  // --------------------------------------------------

	  // In that library, the functions named easeIn, easeOut, and
	  // easeInOut below are named easeInCubic, easeOutCubic, and
	  // (you guessed it) easeInOutCubic.
	  //
	  // You can add additional easing functions to this list, and they
	  // will be globally available.

	  var easing = {
	  	linear: function (pos) {
	  		return pos;
	  	},
	  	easeIn: function (pos) {
	  		return Math.pow(pos, 3);
	  	},
	  	easeOut: function (pos) {
	  		return Math.pow(pos - 1, 3) + 1;
	  	},
	  	easeInOut: function (pos) {
	  		if ((pos /= 0.5) < 1) {
	  			return 0.5 * Math.pow(pos, 3);
	  		}
	  		return 0.5 * (Math.pow(pos - 2, 3) + 2);
	  	}
	  };

	  var noAnimation = { stop: noop };
	  var linear = easing.linear;

	  function getOptions(options, instance) {
	  	options = options || {};

	  	var easing = undefined;
	  	if (options.easing) {
	  		easing = typeof options.easing === 'function' ? options.easing : instance.easing[options.easing];
	  	}

	  	return {
	  		easing: easing || linear,
	  		duration: 'duration' in options ? options.duration : 400,
	  		complete: options.complete || noop,
	  		step: options.step || noop
	  	};
	  }
	  function Ractive$animate(keypath, to, options) {
	  	if (typeof keypath === 'object') {
	  		var keys = Object.keys(keypath);

	  		throw new Error('ractive.animate(...) no longer supports objects. Instead of ractive.animate({\n  ' + keys.map(function (key) {
	  			return '\'' + key + '\': ' + keypath[key];
	  		}).join('\n  ') + '\n}, {...}), do\n\n' + keys.map(function (key) {
	  			return 'ractive.animate(\'' + key + '\', ' + keypath[key] + ', {...});';
	  		}).join('\n') + '\n');
	  	}

	  	options = getOptions(options, this);

	  	var model = this.viewmodel.joinAll(splitKeypath(keypath));
	  	var from = model.get();

	  	// don't bother animating values that stay the same
	  	if (isEqual(from, to)) {
	  		options.complete(options.to);
	  		return noAnimation; // TODO should this have .then and .catch methods?
	  	}

	  	var interpolator = interpolate(from, to, this, options.interpolator);

	  	// if we can't interpolate the value, set it immediately
	  	if (!interpolator) {
	  		runloop.start();
	  		model.set(to);
	  		runloop.end();

	  		return noAnimation;
	  	}

	  	return model.animate(from, to, options, interpolator);
	  }

	  function Ractive$add(keypath, d) {
	  	return add(this, keypath, d === undefined ? 1 : +d);
	  }

	  var proto$1 = {
	  	add: Ractive$add,
	  	animate: Ractive$animate,
	  	detach: Ractive$detach,
	  	find: Ractive$find,
	  	findAll: Ractive$findAll,
	  	findAllComponents: Ractive$findAllComponents,
	  	findComponent: Ractive$findComponent,
	  	findContainer: Ractive$findContainer,
	  	findParent: Ractive$findParent,
	  	fire: Ractive$fire,
	  	get: Ractive$get,
	  	insert: Ractive$insert,
	  	link: link,
	  	merge: Ractive$merge,
	  	observe: observe,
	  	observeList: observeList,
	  	observeOnce: observeOnce,
	  	// TODO reinstate these
	  	// observeListOnce,
	  	off: Ractive$off,
	  	on: Ractive$on,
	  	once: Ractive$once,
	  	pop: pop,
	  	push: push,
	  	render: Ractive$render,
	  	reset: Ractive$reset,
	  	resetPartial: resetPartial,
	  	resetTemplate: Ractive$resetTemplate,
	  	reverse: reverse,
	  	set: Ractive$set,
	  	shift: shift,
	  	sort: sort,
	  	splice: splice,
	  	subtract: Ractive$subtract,
	  	teardown: Ractive$teardown,
	  	toggle: Ractive$toggle,
	  	toCSS: Ractive$toCSS,
	  	toCss: Ractive$toCSS,
	  	toHTML: Ractive$toHTML,
	  	toHtml: Ractive$toHTML,
	  	unlink: unlink,
	  	unrender: Ractive$unrender,
	  	unshift: unshift,
	  	update: Ractive$update,
	  	updateModel: Ractive$updateModel
	  };

	  function getNodeInfo (node) {
	  	if (!node || !node._ractive) return {};

	  	var storage = node._ractive;

	  	return {
	  		ractive: storage.ractive,
	  		keypath: storage.keypath,
	  		rootpath: storage.rootpath,
	  		index: extend({}, storage.fragment.indexRefs),
	  		key: extend({}, storage.fragment.keyRefs)
	  	};
	  }

	  function wrap$1 (method, superMethod, force) {

	  	if (force || needsSuper$1(method, superMethod)) {

	  		return function () {

	  			var hasSuper = ('_super' in this),
	  			    _super = this._super,
	  			    result;

	  			this._super = superMethod;

	  			result = method.apply(this, arguments);

	  			if (hasSuper) {
	  				this._super = _super;
	  			}

	  			return result;
	  		};
	  	} else {
	  		return method;
	  	}
	  }

	  function needsSuper$1(method, superMethod) {
	  	return typeof superMethod === 'function' && /_super/.test(method);
	  }

	  function unwrap(Child) {
	  	var options = {};

	  	while (Child) {
	  		addRegistries(Child, options);
	  		addOtherOptions(Child, options);

	  		if (Child._Parent !== Ractive) {
	  			Child = Child._Parent;
	  		} else {
	  			Child = false;
	  		}
	  	}

	  	return options;
	  }

	  function addRegistries(Child, options) {
	  	registries.forEach(function (r) {
	  		addRegistry(r.useDefaults ? Child.prototype : Child, options, r.name);
	  	});
	  }

	  function addRegistry(target, options, name) {
	  	var registry,
	  	    keys = Object.keys(target[name]);

	  	if (!keys.length) {
	  		return;
	  	}

	  	if (!(registry = options[name])) {
	  		registry = options[name] = {};
	  	}

	  	keys.filter(function (key) {
	  		return !(key in registry);
	  	}).forEach(function (key) {
	  		return registry[key] = target[name][key];
	  	});
	  }

	  function addOtherOptions(Child, options) {
	  	Object.keys(Child.prototype).forEach(function (key) {
	  		if (key === 'computed') {
	  			return;
	  		}

	  		var value = Child.prototype[key];

	  		if (!(key in options)) {
	  			options[key] = value._method ? value._method : value;
	  		}

	  		// is it a wrapped function?
	  		else if (typeof options[key] === 'function' && typeof value === 'function' && options[key]._method) {

	  				var result = undefined,
	  				    needsSuper = value._method;

	  				if (needsSuper) {
	  					value = value._method;
	  				}

	  				// rewrap bound directly to parent fn
	  				result = wrap$1(options[key]._method, value);

	  				if (needsSuper) {
	  					result._method = result;
	  				}

	  				options[key] = result;
	  			}
	  	});
	  }

	  function extend$1() {
	  	for (var _len = arguments.length, options = Array(_len), _key = 0; _key < _len; _key++) {
	  		options[_key] = arguments[_key];
	  	}

	  	if (!options.length) {
	  		return extendOne(this);
	  	} else {
	  		return options.reduce(extendOne, this);
	  	}
	  }

	  function extendOne(Parent) {
	  	var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  	var Child, proto;

	  	// if we're extending with another Ractive instance...
	  	//
	  	//   var Human = Ractive.extend(...), Spider = Ractive.extend(...);
	  	//   var Spiderman = Human.extend( Spider );
	  	//
	  	// ...inherit prototype methods and default options as well
	  	if (options.prototype instanceof Ractive) {
	  		options = unwrap(options);
	  	}

	  	Child = function (options) {
	  		if (!(this instanceof Child)) return new Child(options);

	  		construct(this, options || {});
	  		initialise(this, options || {}, {});
	  	};

	  	proto = create(Parent.prototype);
	  	proto.constructor = Child;

	  	// Static properties
	  	defineProperties(Child, {
	  		// alias prototype as defaults
	  		defaults: { value: proto },

	  		// extendable
	  		extend: { value: extend$1, writable: true, configurable: true },

	  		// Parent - for IE8, can't use Object.getPrototypeOf
	  		_Parent: { value: Parent }
	  	});

	  	// extend configuration
	  	config.extend(Parent, proto, options);

	  	dataConfigurator.extend(Parent, proto, options);

	  	if (options.computed) {
	  		proto.computed = extend(create(Parent.prototype.computed), options.computed);
	  	}

	  	Child.prototype = proto;

	  	return Child;
	  }

	  // Ractive.js makes liberal use of things like Array.prototype.indexOf. In
	  // older browsers, these are made available via a shim - here, we do a quick
	  // pre-flight check to make sure that either a) we're not in a shit browser,
	  // or b) we're using a Ractive-legacy.js build
	  var FUNCTION = 'function';

	  if (typeof Date.now !== FUNCTION || typeof String.prototype.trim !== FUNCTION || typeof Object.keys !== FUNCTION || typeof Array.prototype.indexOf !== FUNCTION || typeof Array.prototype.forEach !== FUNCTION || typeof Array.prototype.map !== FUNCTION || typeof Array.prototype.filter !== FUNCTION || win && typeof win.addEventListener !== FUNCTION) {
	  	throw new Error('It looks like you\'re attempting to use Ractive.js in an older browser. You\'ll need to use one of the \'legacy builds\' in order to continue - see http://docs.ractivejs.org/latest/legacy-builds for more information.');
	  }
	  function Ractive(options) {
	  	if (!(this instanceof Ractive)) return new Ractive(options);

	  	construct(this, options || {});
	  	initialise(this, options || {}, {});
	  }

	  extend(Ractive.prototype, proto$1, defaults);
	  Ractive.prototype.constructor = Ractive;

	  // alias prototype as `defaults`
	  Ractive.defaults = Ractive.prototype;

	  // static properties
	  defineProperties(Ractive, {

	  	// debug flag
	  	DEBUG: { writable: true, value: true },
	  	DEBUG_PROMISES: { writable: true, value: true },

	  	// static methods:
	  	extend: { value: extend$1 },
	  	getNodeInfo: { value: getNodeInfo },
	  	parse: { value: parse },
	  	getCSS: { value: getCSS },

	  	// namespaced constructors
	  	Promise: { value: Promise$1 },

	  	// support
	  	enhance: { writable: true, value: false },
	  	svg: { value: svg },
	  	magic: { value: magicSupported },

	  	// version
	  	VERSION: { value: '0.8.0-edge' },

	  	// plugins
	  	adaptors: { writable: true, value: {} },
	  	components: { writable: true, value: {} },
	  	decorators: { writable: true, value: {} },
	  	easing: { writable: true, value: easing },
	  	events: { writable: true, value: {} },
	  	interpolators: { writable: true, value: interpolators$1 },
	  	partials: { writable: true, value: {} },
	  	transitions: { writable: true, value: {} }
	  });

	  return Ractive;

	}));
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {


	/**
	 * Module dependencies.
	 */

	var url = __webpack_require__(57);
	var parser = __webpack_require__(10);
	var Manager = __webpack_require__(16);
	var debug = __webpack_require__(0)('socket.io-client');

	/**
	 * Module exports.
	 */

	module.e = exports = lookup;

	/**
	 * Managers cache.
	 */

	var cache = exports.managers = {};

	/**
	 * Looks up an existing `Manager` for multiplexing.
	 * If the user summons:
	 *
	 *   `io('http://localhost/a');`
	 *   `io('http://localhost/b');`
	 *
	 * We reuse the existing instance based on same scheme/port/host,
	 * and we initialize sockets for each namespace.
	 *
	 * @api public
	 */

	function lookup(uri, opts) {
	  if (typeof uri == 'object') {
	    opts = uri;
	    uri = undefined;
	  }

	  opts = opts || {};

	  var parsed = url(uri);
	  var source = parsed.source;
	  var id = parsed.id;
	  var path = parsed.path;
	  var sameNamespace = cache[id] && path in cache[id].nsps;
	  var newConnection = opts.forceNew || opts['force new connection'] ||
	                      false === opts.multiplex || sameNamespace;

	  var io;

	  if (newConnection) {
	    debug('ignoring socket cache for %s', source);
	    io = Manager(source, opts);
	  } else {
	    if (!cache[id]) {
	      debug('new io instance for %s', source);
	      cache[id] = Manager(source, opts);
	    }
	    io = cache[id];
	  }

	  return io.socket(parsed.path);
	}

	/**
	 * Protocol version.
	 *
	 * @api public
	 */

	exports.protocol = parser.protocol;

	/**
	 * `connect`.
	 *
	 * @param {String} uri
	 * @api public
	 */

	exports.connect = lookup;

	/**
	 * Expose constructors for standalone build.
	 *
	 * @api public
	 */

	exports.Manager = __webpack_require__(16);
	exports.Socket = __webpack_require__(18);


/***/ },
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, node: true*/
	/*global ractiveData*/

	var Ractive = __webpack_require__(25);
	var config = __webpack_require__(22);
	var on = __webpack_require__(6);

	var ractive = function (data, el) {

	    return new Ractive({

	        el: el,

	        template: __webpack_require__(24),

	        components: {

	        },

	        partials: {

	        },

	        data: data,

	        onrender: function () {

	            var io = __webpack_require__(26);

	            this.socket = io("http://" + window.location.hostname + ":" + config.websocket.port);

	            var req = __webpack_require__(23)(this.socket);

	            req("/test", { ok: 1 }).then(function (res) {
	                console.log(res);
	            });
	        }

	    });

	};

	if (on.client) {

	    window.App = ractive(ractiveData, "#app");
	}

	module.e = ractive;



/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	module.e = {

	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	module.e = {

	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	module.e = {
	    websocket: {
	        port: 5000
	    }
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	module.e = after

	function after(count, callback, err_cb) {
	    var bail = false
	    err_cb = err_cb || noop
	    proxy.count = count

	    return (count === 0) ? callback() : proxy

	    function proxy(err, result) {
	        if (proxy.count <= 0) {
	            throw new Error('after called too many times')
	        }
	        --proxy.count

	        // after first error, rest are passed to err_cb
	        if (err) {
	            bail = true
	            callback(err)
	            // future error callbacks will go to error handler
	            callback = err_cb
	        } else if (proxy.count === 0 && !bail) {
	            callback(null, result)
	        }
	    }
	}

	function noop() {}


/***/ },
/* 37 */,
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * An abstraction for slicing an arraybuffer even when
	 * ArrayBuffer.prototype.slice is not supported
	 *
	 * @api public
	 */

	module.e = function(arraybuffer, start, end) {
	  var bytes = arraybuffer.byteLength;
	  start = start || 0;
	  end = end || bytes;

	  if (arraybuffer.slice) { return arraybuffer.slice(start, end); }

	  if (start < 0) { start += bytes; }
	  if (end < 0) { end += bytes; }
	  if (end > bytes) { end = bytes; }

	  if (start >= bytes || start >= end || bytes === 0) {
	    return new ArrayBuffer(0);
	  }

	  var abv = new Uint8Array(arraybuffer);
	  var result = new Uint8Array(end - start);
	  for (var i = start, ii = 0; i < end; i++, ii++) {
	    result[ii] = abv[i];
	  }
	  return result.buffer;
	};


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {


	/**
	 * Expose `Backoff`.
	 */

	module.e = Backoff;

	/**
	 * Initialize backoff timer with `opts`.
	 *
	 * - `min` initial timeout in milliseconds [100]
	 * - `max` max timeout [10000]
	 * - `jitter` [0]
	 * - `factor` [2]
	 *
	 * @param {Object} opts
	 * @api public
	 */

	function Backoff(opts) {
	  opts = opts || {};
	  this.ms = opts.min || 100;
	  this.max = opts.max || 10000;
	  this.factor = opts.factor || 2;
	  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
	  this.attempts = 0;
	}

	/**
	 * Return the backoff duration.
	 *
	 * @return {Number}
	 * @api public
	 */

	Backoff.prototype.duration = function(){
	  var ms = this.ms * Math.pow(this.factor, this.attempts++);
	  if (this.jitter) {
	    var rand =  Math.random();
	    var deviation = Math.floor(rand * this.jitter * ms);
	    ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
	  }
	  return Math.min(ms, this.max) | 0;
	};

	/**
	 * Reset the number of attempts.
	 *
	 * @api public
	 */

	Backoff.prototype.reset = function(){
	  this.attempts = 0;
	};

	/**
	 * Set the minimum duration
	 *
	 * @api public
	 */

	Backoff.prototype.setMin = function(min){
	  this.ms = min;
	};

	/**
	 * Set the maximum duration
	 *
	 * @api public
	 */

	Backoff.prototype.setMax = function(max){
	  this.max = max;
	};

	/**
	 * Set the jitter
	 *
	 * @api public
	 */

	Backoff.prototype.setJitter = function(jitter){
	  this.jitter = jitter;
	};



/***/ },
/* 40 */
/***/ function(module, exports) {

	/*
	 * base64-arraybuffer
	 * https://github.com/niklasvh/base64-arraybuffer
	 *
	 * Copyright (c) 2012 Niklas von Hertzen
	 * Licensed under the MIT license.
	 */
	(function(chars){
	  "use strict";

	  exports.encode = function(arraybuffer) {
	    var bytes = new Uint8Array(arraybuffer),
	    i, len = bytes.length, base64 = "";

	    for (i = 0; i < len; i+=3) {
	      base64 += chars[bytes[i] >> 2];
	      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
	      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
	      base64 += chars[bytes[i + 2] & 63];
	    }

	    if ((len % 3) === 2) {
	      base64 = base64.substring(0, base64.length - 1) + "=";
	    } else if (len % 3 === 1) {
	      base64 = base64.substring(0, base64.length - 2) + "==";
	    }

	    return base64;
	  };

	  exports.decode =  function(base64) {
	    var bufferLength = base64.length * 0.75,
	    len = base64.length, i, p = 0,
	    encoded1, encoded2, encoded3, encoded4;

	    if (base64[base64.length - 1] === "=") {
	      bufferLength--;
	      if (base64[base64.length - 2] === "=") {
	        bufferLength--;
	      }
	    }

	    var arraybuffer = new ArrayBuffer(bufferLength),
	    bytes = new Uint8Array(arraybuffer);

	    for (i = 0; i < len; i+=4) {
	      encoded1 = chars.indexOf(base64[i]);
	      encoded2 = chars.indexOf(base64[i+1]);
	      encoded3 = chars.indexOf(base64[i+2]);
	      encoded4 = chars.indexOf(base64[i+3]);

	      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
	      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
	      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
	    }

	    return arraybuffer;
	  };
	})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Create a blob builder even when vendor prefixes exist
	 */

	var BlobBuilder = global.BlobBuilder
	  || global.WebKitBlobBuilder
	  || global.MSBlobBuilder
	  || global.MozBlobBuilder;

	/**
	 * Check if Blob constructor is supported
	 */

	var blobSupported = (function() {
	  try {
	    var a = new Blob(['hi']);
	    return a.size === 2;
	  } catch(e) {
	    return false;
	  }
	})();

	/**
	 * Check if Blob constructor supports ArrayBufferViews
	 * Fails in Safari 6, so we need to map to ArrayBuffers there.
	 */

	var blobSupportsArrayBufferView = blobSupported && (function() {
	  try {
	    var b = new Blob([new Uint8Array([1,2])]);
	    return b.size === 2;
	  } catch(e) {
	    return false;
	  }
	})();

	/**
	 * Check if BlobBuilder is supported
	 */

	var blobBuilderSupported = BlobBuilder
	  && BlobBuilder.prototype.append
	  && BlobBuilder.prototype.getBlob;

	/**
	 * Helper function that maps ArrayBufferViews to ArrayBuffers
	 * Used by BlobBuilder constructor and old browsers that didn't
	 * support it in the Blob constructor.
	 */

	function mapArrayBufferViews(ary) {
	  for (var i = 0; i < ary.length; i++) {
	    var chunk = ary[i];
	    if (chunk.buffer instanceof ArrayBuffer) {
	      var buf = chunk.buffer;

	      // if this is a subarray, make a copy so we only
	      // include the subarray region from the underlying buffer
	      if (chunk.byteLength !== buf.byteLength) {
	        var copy = new Uint8Array(chunk.byteLength);
	        copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
	        buf = copy.buffer;
	      }

	      ary[i] = buf;
	    }
	  }
	}

	function BlobBuilderConstructor(ary, options) {
	  options = options || {};

	  var bb = new BlobBuilder();
	  mapArrayBufferViews(ary);

	  for (var i = 0; i < ary.length; i++) {
	    bb.append(ary[i]);
	  }

	  return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
	};

	function BlobConstructor(ary, options) {
	  mapArrayBufferViews(ary);
	  return new Blob(ary, options || {});
	};

	module.e = (function() {
	  if (blobSupported) {
	    return blobSupportsArrayBufferView ? global.Blob : BlobConstructor;
	  } else if (blobBuilderSupported) {
	    return BlobBuilderConstructor;
	  } else {
	    return undefined;
	  }
	})();

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {


	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.e = debug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(55);

	/**
	 * The currently active debug mode names, and names to skip.
	 */

	exports.names = [];
	exports.skips = [];

	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lowercased letter, i.e. "n".
	 */

	exports.formatters = {};

	/**
	 * Previously assigned color.
	 */

	var prevColor = 0;

	/**
	 * Previous log timestamp.
	 */

	var prevTime;

	/**
	 * Select a color.
	 *
	 * @return {Number}
	 * @api private
	 */

	function selectColor() {
	  return exports.colors[prevColor++ % exports.colors.length];
	}

	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */

	function debug(namespace) {

	  // define the `disabled` version
	  function disabled() {
	  }
	  disabled.enabled = false;

	  // define the `enabled` version
	  function enabled() {

	    var self = enabled;

	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;

	    // add the `color` if not set
	    if (null == self.useColors) self.useColors = exports.useColors();
	    if (null == self.color && self.useColors) self.color = selectColor();

	    var args = Array.prototype.slice.call(arguments);

	    args[0] = exports.coerce(args[0]);

	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %o
	      args = ['%o'].concat(args);
	    }

	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);

	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });

	    if ('function' === typeof exports.formatArgs) {
	      args = exports.formatArgs.apply(self, args);
	    }
	    var logFn = enabled.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	  enabled.enabled = true;

	  var fn = exports.enabled(namespace) ? enabled : disabled;

	  fn.namespace = namespace;

	  return fn;
	}

	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */

	function enable(namespaces) {
	  exports.save(namespaces);

	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;

	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}

	/**
	 * Disable debug output.
	 *
	 * @api public
	 */

	function disable() {
	  exports.enable('');
	}

	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */

	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}

	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */

	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {


	module.e =  __webpack_require__(44);


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {


	module.e = __webpack_require__(45);

	/**
	 * Exports parser
	 *
	 * @api public
	 *
	 */
	module.e.parser = __webpack_require__(1);


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies.
	 */

	var transports = __webpack_require__(12);
	var Emitter = __webpack_require__(3);
	var debug = __webpack_require__(0)('engine.io-client:socket');
	var index = __webpack_require__(14);
	var parser = __webpack_require__(1);
	var parseuri = __webpack_require__(15);
	var parsejson = __webpack_require__(56);
	var parseqs = __webpack_require__(9);

	/**
	 * Module exports.
	 */

	module.e = Socket;

	/**
	 * Noop function.
	 *
	 * @api private
	 */

	function noop(){}

	/**
	 * Socket constructor.
	 *
	 * @param {String|Object} uri or options
	 * @param {Object} options
	 * @api public
	 */

	function Socket(uri, opts){
	  if (!(this instanceof Socket)) return new Socket(uri, opts);

	  opts = opts || {};

	  if (uri && 'object' == typeof uri) {
	    opts = uri;
	    uri = null;
	  }

	  if (uri) {
	    uri = parseuri(uri);
	    opts.hostname = uri.host;
	    opts.secure = uri.protocol == 'https' || uri.protocol == 'wss';
	    opts.port = uri.port;
	    if (uri.query) opts.query = uri.query;
	  } else if (opts.host) {
	    opts.hostname = parseuri(opts.host).host;
	  }

	  this.secure = null != opts.secure ? opts.secure :
	    (global.location && 'https:' == location.protocol);

	  if (opts.hostname && !opts.port) {
	    // if no port is specified manually, use the protocol default
	    opts.port = this.secure ? '443' : '80';
	  }

	  this.agent = opts.agent || false;
	  this.hostname = opts.hostname ||
	    (global.location ? location.hostname : 'localhost');
	  this.port = opts.port || (global.location && location.port ?
	       location.port :
	       (this.secure ? 443 : 80));
	  this.query = opts.query || {};
	  if ('string' == typeof this.query) this.query = parseqs.decode(this.query);
	  this.upgrade = false !== opts.upgrade;
	  this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
	  this.forceJSONP = !!opts.forceJSONP;
	  this.jsonp = false !== opts.jsonp;
	  this.forceBase64 = !!opts.forceBase64;
	  this.enablesXDR = !!opts.enablesXDR;
	  this.timestampParam = opts.timestampParam || 't';
	  this.timestampRequests = opts.timestampRequests;
	  this.transports = opts.transports || ['polling', 'websocket'];
	  this.readyState = '';
	  this.writeBuffer = [];
	  this.policyPort = opts.policyPort || 843;
	  this.rememberUpgrade = opts.rememberUpgrade || false;
	  this.binaryType = null;
	  this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
	  this.perMessageDeflate = false !== opts.perMessageDeflate ? (opts.perMessageDeflate || {}) : false;

	  if (true === this.perMessageDeflate) this.perMessageDeflate = {};
	  if (this.perMessageDeflate && null == this.perMessageDeflate.threshold) {
	    this.perMessageDeflate.threshold = 1024;
	  }

	  // SSL options for Node.js client
	  this.pfx = opts.pfx || null;
	  this.key = opts.key || null;
	  this.passphrase = opts.passphrase || null;
	  this.cert = opts.cert || null;
	  this.ca = opts.ca || null;
	  this.ciphers = opts.ciphers || null;
	  this.rejectUnauthorized = opts.rejectUnauthorized === undefined ? null : opts.rejectUnauthorized;

	  // other options for Node.js client
	  var freeGlobal = typeof global == 'object' && global;
	  if (freeGlobal.global === freeGlobal) {
	    if (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0) {
	      this.extraHeaders = opts.extraHeaders;
	    }
	  }

	  this.open();
	}

	Socket.priorWebsocketSuccess = false;

	/**
	 * Mix in `Emitter`.
	 */

	Emitter(Socket.prototype);

	/**
	 * Protocol version.
	 *
	 * @api public
	 */

	Socket.protocol = parser.protocol; // this is an int

	/**
	 * Expose deps for legacy compatibility
	 * and standalone browser access.
	 */

	Socket.Socket = Socket;
	Socket.Transport = __webpack_require__(7);
	Socket.transports = __webpack_require__(12);
	Socket.parser = __webpack_require__(1);

	/**
	 * Creates transport of the given type.
	 *
	 * @param {String} transport name
	 * @return {Transport}
	 * @api private
	 */

	Socket.prototype.createTransport = function (name) {
	  debug('creating transport "%s"', name);
	  var query = clone(this.query);

	  // append engine.io protocol identifier
	  query.EIO = parser.protocol;

	  // transport name
	  query.transport = name;

	  // session id if we already have one
	  if (this.id) query.sid = this.id;

	  var transport = new transports[name]({
	    agent: this.agent,
	    hostname: this.hostname,
	    port: this.port,
	    secure: this.secure,
	    path: this.path,
	    query: query,
	    forceJSONP: this.forceJSONP,
	    jsonp: this.jsonp,
	    forceBase64: this.forceBase64,
	    enablesXDR: this.enablesXDR,
	    timestampRequests: this.timestampRequests,
	    timestampParam: this.timestampParam,
	    policyPort: this.policyPort,
	    socket: this,
	    pfx: this.pfx,
	    key: this.key,
	    passphrase: this.passphrase,
	    cert: this.cert,
	    ca: this.ca,
	    ciphers: this.ciphers,
	    rejectUnauthorized: this.rejectUnauthorized,
	    perMessageDeflate: this.perMessageDeflate,
	    extraHeaders: this.extraHeaders
	  });

	  return transport;
	};

	function clone (obj) {
	  var o = {};
	  for (var i in obj) {
	    if (obj.hasOwnProperty(i)) {
	      o[i] = obj[i];
	    }
	  }
	  return o;
	}

	/**
	 * Initializes transport to use and starts probe.
	 *
	 * @api private
	 */
	Socket.prototype.open = function () {
	  var transport;
	  if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') != -1) {
	    transport = 'websocket';
	  } else if (0 === this.transports.length) {
	    // Emit error on next tick so it can be listened to
	    var self = this;
	    setTimeout(function() {
	      self.emit('error', 'No transports available');
	    }, 0);
	    return;
	  } else {
	    transport = this.transports[0];
	  }
	  this.readyState = 'opening';

	  // Retry with the next transport if the transport is disabled (jsonp: false)
	  try {
	    transport = this.createTransport(transport);
	  } catch (e) {
	    this.transports.shift();
	    this.open();
	    return;
	  }

	  transport.open();
	  this.setTransport(transport);
	};

	/**
	 * Sets the current transport. Disables the existing one (if any).
	 *
	 * @api private
	 */

	Socket.prototype.setTransport = function(transport){
	  debug('setting transport %s', transport.name);
	  var self = this;

	  if (this.transport) {
	    debug('clearing existing transport %s', this.transport.name);
	    this.transport.removeAllListeners();
	  }

	  // set up transport
	  this.transport = transport;

	  // set up transport listeners
	  transport
	  .on('drain', function(){
	    self.onDrain();
	  })
	  .on('packet', function(packet){
	    self.onPacket(packet);
	  })
	  .on('error', function(e){
	    self.onError(e);
	  })
	  .on('close', function(){
	    self.onClose('transport close');
	  });
	};

	/**
	 * Probes a transport.
	 *
	 * @param {String} transport name
	 * @api private
	 */

	Socket.prototype.probe = function (name) {
	  debug('probing transport "%s"', name);
	  var transport = this.createTransport(name, { probe: 1 })
	    , failed = false
	    , self = this;

	  Socket.priorWebsocketSuccess = false;

	  function onTransportOpen(){
	    if (self.onlyBinaryUpgrades) {
	      var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
	      failed = failed || upgradeLosesBinary;
	    }
	    if (failed) return;

	    debug('probe transport "%s" opened', name);
	    transport.send([{ type: 'ping', data: 'probe' }]);
	    transport.once('packet', function (msg) {
	      if (failed) return;
	      if ('pong' == msg.type && 'probe' == msg.data) {
	        debug('probe transport "%s" pong', name);
	        self.upgrading = true;
	        self.emit('upgrading', transport);
	        if (!transport) return;
	        Socket.priorWebsocketSuccess = 'websocket' == transport.name;

	        debug('pausing current transport "%s"', self.transport.name);
	        self.transport.pause(function () {
	          if (failed) return;
	          if ('closed' == self.readyState) return;
	          debug('changing transport and sending upgrade packet');

	          cleanup();

	          self.setTransport(transport);
	          transport.send([{ type: 'upgrade' }]);
	          self.emit('upgrade', transport);
	          transport = null;
	          self.upgrading = false;
	          self.flush();
	        });
	      } else {
	        debug('probe transport "%s" failed', name);
	        var err = new Error('probe error');
	        err.transport = transport.name;
	        self.emit('upgradeError', err);
	      }
	    });
	  }

	  function freezeTransport() {
	    if (failed) return;

	    // Any callback called by transport should be ignored since now
	    failed = true;

	    cleanup();

	    transport.close();
	    transport = null;
	  }

	  //Handle any error that happens while probing
	  function onerror(err) {
	    var error = new Error('probe error: ' + err);
	    error.transport = transport.name;

	    freezeTransport();

	    debug('probe transport "%s" failed because of error: %s', name, err);

	    self.emit('upgradeError', error);
	  }

	  function onTransportClose(){
	    onerror("transport closed");
	  }

	  //When the socket is closed while we're probing
	  function onclose(){
	    onerror("socket closed");
	  }

	  //When the socket is upgraded while we're probing
	  function onupgrade(to){
	    if (transport && to.name != transport.name) {
	      debug('"%s" works - aborting "%s"', to.name, transport.name);
	      freezeTransport();
	    }
	  }

	  //Remove all listeners on the transport and on self
	  function cleanup(){
	    transport.removeListener('open', onTransportOpen);
	    transport.removeListener('error', onerror);
	    transport.removeListener('close', onTransportClose);
	    self.removeListener('close', onclose);
	    self.removeListener('upgrading', onupgrade);
	  }

	  transport.once('open', onTransportOpen);
	  transport.once('error', onerror);
	  transport.once('close', onTransportClose);

	  this.once('close', onclose);
	  this.once('upgrading', onupgrade);

	  transport.open();

	};

	/**
	 * Called when connection is deemed open.
	 *
	 * @api public
	 */

	Socket.prototype.onOpen = function () {
	  debug('socket open');
	  this.readyState = 'open';
	  Socket.priorWebsocketSuccess = 'websocket' == this.transport.name;
	  this.emit('open');
	  this.flush();

	  // we check for `readyState` in case an `open`
	  // listener already closed the socket
	  if ('open' == this.readyState && this.upgrade && this.transport.pause) {
	    debug('starting upgrade probes');
	    for (var i = 0, l = this.upgrades.length; i < l; i++) {
	      this.probe(this.upgrades[i]);
	    }
	  }
	};

	/**
	 * Handles a packet.
	 *
	 * @api private
	 */

	Socket.prototype.onPacket = function (packet) {
	  if ('opening' == this.readyState || 'open' == this.readyState) {
	    debug('socket receive: type "%s", data "%s"', packet.type, packet.data);

	    this.emit('packet', packet);

	    // Socket is live - any packet counts
	    this.emit('heartbeat');

	    switch (packet.type) {
	      case 'open':
	        this.onHandshake(parsejson(packet.data));
	        break;

	      case 'pong':
	        this.setPing();
	        this.emit('pong');
	        break;

	      case 'error':
	        var err = new Error('server error');
	        err.code = packet.data;
	        this.onError(err);
	        break;

	      case 'message':
	        this.emit('data', packet.data);
	        this.emit('message', packet.data);
	        break;
	    }
	  } else {
	    debug('packet received with socket readyState "%s"', this.readyState);
	  }
	};

	/**
	 * Called upon handshake completion.
	 *
	 * @param {Object} handshake obj
	 * @api private
	 */

	Socket.prototype.onHandshake = function (data) {
	  this.emit('handshake', data);
	  this.id = data.sid;
	  this.transport.query.sid = data.sid;
	  this.upgrades = this.filterUpgrades(data.upgrades);
	  this.pingInterval = data.pingInterval;
	  this.pingTimeout = data.pingTimeout;
	  this.onOpen();
	  // In case open handler closes socket
	  if  ('closed' == this.readyState) return;
	  this.setPing();

	  // Prolong liveness of socket on heartbeat
	  this.removeListener('heartbeat', this.onHeartbeat);
	  this.on('heartbeat', this.onHeartbeat);
	};

	/**
	 * Resets ping timeout.
	 *
	 * @api private
	 */

	Socket.prototype.onHeartbeat = function (timeout) {
	  clearTimeout(this.pingTimeoutTimer);
	  var self = this;
	  self.pingTimeoutTimer = setTimeout(function () {
	    if ('closed' == self.readyState) return;
	    self.onClose('ping timeout');
	  }, timeout || (self.pingInterval + self.pingTimeout));
	};

	/**
	 * Pings server every `this.pingInterval` and expects response
	 * within `this.pingTimeout` or closes connection.
	 *
	 * @api private
	 */

	Socket.prototype.setPing = function () {
	  var self = this;
	  clearTimeout(self.pingIntervalTimer);
	  self.pingIntervalTimer = setTimeout(function () {
	    debug('writing ping packet - expecting pong within %sms', self.pingTimeout);
	    self.ping();
	    self.onHeartbeat(self.pingTimeout);
	  }, self.pingInterval);
	};

	/**
	* Sends a ping packet.
	*
	* @api private
	*/

	Socket.prototype.ping = function () {
	  var self = this;
	  this.sendPacket('ping', function(){
	    self.emit('ping');
	  });
	};

	/**
	 * Called on `drain` event
	 *
	 * @api private
	 */

	Socket.prototype.onDrain = function() {
	  this.writeBuffer.splice(0, this.prevBufferLen);

	  // setting prevBufferLen = 0 is very important
	  // for example, when upgrading, upgrade packet is sent over,
	  // and a nonzero prevBufferLen could cause problems on `drain`
	  this.prevBufferLen = 0;

	  if (0 === this.writeBuffer.length) {
	    this.emit('drain');
	  } else {
	    this.flush();
	  }
	};

	/**
	 * Flush write buffers.
	 *
	 * @api private
	 */

	Socket.prototype.flush = function () {
	  if ('closed' != this.readyState && this.transport.writable &&
	    !this.upgrading && this.writeBuffer.length) {
	    debug('flushing %d packets in socket', this.writeBuffer.length);
	    this.transport.send(this.writeBuffer);
	    // keep track of current length of writeBuffer
	    // splice writeBuffer and callbackBuffer on `drain`
	    this.prevBufferLen = this.writeBuffer.length;
	    this.emit('flush');
	  }
	};

	/**
	 * Sends a message.
	 *
	 * @param {String} message.
	 * @param {Function} callback function.
	 * @param {Object} options.
	 * @return {Socket} for chaining.
	 * @api public
	 */

	Socket.prototype.write =
	Socket.prototype.send = function (msg, options, fn) {
	  this.sendPacket('message', msg, options, fn);
	  return this;
	};

	/**
	 * Sends a packet.
	 *
	 * @param {String} packet type.
	 * @param {String} data.
	 * @param {Object} options.
	 * @param {Function} callback function.
	 * @api private
	 */

	Socket.prototype.sendPacket = function (type, data, options, fn) {
	  if('function' == typeof data) {
	    fn = data;
	    data = undefined;
	  }

	  if ('function' == typeof options) {
	    fn = options;
	    options = null;
	  }

	  if ('closing' == this.readyState || 'closed' == this.readyState) {
	    return;
	  }

	  options = options || {};
	  options.compress = false !== options.compress;

	  var packet = {
	    type: type,
	    data: data,
	    options: options
	  };
	  this.emit('packetCreate', packet);
	  this.writeBuffer.push(packet);
	  if (fn) this.once('flush', fn);
	  this.flush();
	};

	/**
	 * Closes the connection.
	 *
	 * @api private
	 */

	Socket.prototype.close = function () {
	  if ('opening' == this.readyState || 'open' == this.readyState) {
	    this.readyState = 'closing';

	    var self = this;

	    if (this.writeBuffer.length) {
	      this.once('drain', function() {
	        if (this.upgrading) {
	          waitForUpgrade();
	        } else {
	          close();
	        }
	      });
	    } else if (this.upgrading) {
	      waitForUpgrade();
	    } else {
	      close();
	    }
	  }

	  function close() {
	    self.onClose('forced close');
	    debug('socket closing - telling transport to close');
	    self.transport.close();
	  }

	  function cleanupAndClose() {
	    self.removeListener('upgrade', cleanupAndClose);
	    self.removeListener('upgradeError', cleanupAndClose);
	    close();
	  }

	  function waitForUpgrade() {
	    // wait for upgrade to finish since we can't send packets while pausing a transport
	    self.once('upgrade', cleanupAndClose);
	    self.once('upgradeError', cleanupAndClose);
	  }

	  return this;
	};

	/**
	 * Called upon transport error
	 *
	 * @api private
	 */

	Socket.prototype.onError = function (err) {
	  debug('socket error %j', err);
	  Socket.priorWebsocketSuccess = false;
	  this.emit('error', err);
	  this.onClose('transport error', err);
	};

	/**
	 * Called upon transport close.
	 *
	 * @api private
	 */

	Socket.prototype.onClose = function (reason, desc) {
	  if ('opening' == this.readyState || 'open' == this.readyState || 'closing' == this.readyState) {
	    debug('socket close with reason: "%s"', reason);
	    var self = this;

	    // clear timers
	    clearTimeout(this.pingIntervalTimer);
	    clearTimeout(this.pingTimeoutTimer);

	    // stop event from firing again for transport
	    this.transport.removeAllListeners('close');

	    // ensure transport won't stay open
	    this.transport.close();

	    // ignore further transport communication
	    this.transport.removeAllListeners();

	    // set ready state
	    this.readyState = 'closed';

	    // clear session id
	    this.id = null;

	    // emit close event
	    this.emit('close', reason, desc);

	    // clean buffers after, so users can still
	    // grab the buffers on `close` event
	    self.writeBuffer = [];
	    self.prevBufferLen = 0;
	  }
	};

	/**
	 * Filters upgrades, returning only those matching client transports.
	 *
	 * @param {Array} server upgrades
	 * @api private
	 *
	 */

	Socket.prototype.filterUpgrades = function (upgrades) {
	  var filteredUpgrades = [];
	  for (var i = 0, j = upgrades.length; i<j; i++) {
	    if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
	  }
	  return filteredUpgrades;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/**
	 * Module requirements.
	 */

	var Polling = __webpack_require__(13);
	var inherit = __webpack_require__(4);

	/**
	 * Module exports.
	 */

	module.e = JSONPPolling;

	/**
	 * Cached regular expressions.
	 */

	var rNewline = /\n/g;
	var rEscapedNewline = /\\n/g;

	/**
	 * Global JSONP callbacks.
	 */

	var callbacks;

	/**
	 * Callbacks count.
	 */

	var index = 0;

	/**
	 * Noop.
	 */

	function empty () { }

	/**
	 * JSONP Polling constructor.
	 *
	 * @param {Object} opts.
	 * @api public
	 */

	function JSONPPolling (opts) {
	  Polling.call(this, opts);

	  this.query = this.query || {};

	  // define global callbacks array if not present
	  // we do this here (lazily) to avoid unneeded global pollution
	  if (!callbacks) {
	    // we need to consider multiple engines in the same page
	    if (!global.___eio) global.___eio = [];
	    callbacks = global.___eio;
	  }

	  // callback identifier
	  this.index = callbacks.length;

	  // add callback to jsonp global
	  var self = this;
	  callbacks.push(function (msg) {
	    self.onData(msg);
	  });

	  // append to query string
	  this.query.j = this.index;

	  // prevent spurious errors from being emitted when the window is unloaded
	  if (global.document && global.addEventListener) {
	    global.addEventListener('beforeunload', function () {
	      if (self.script) self.script.onerror = empty;
	    }, false);
	  }
	}

	/**
	 * Inherits from Polling.
	 */

	inherit(JSONPPolling, Polling);

	/*
	 * JSONP only supports binary as base64 encoded strings
	 */

	JSONPPolling.prototype.supportsBinary = false;

	/**
	 * Closes the socket.
	 *
	 * @api private
	 */

	JSONPPolling.prototype.doClose = function () {
	  if (this.script) {
	    this.script.parentNode.removeChild(this.script);
	    this.script = null;
	  }

	  if (this.form) {
	    this.form.parentNode.removeChild(this.form);
	    this.form = null;
	    this.iframe = null;
	  }

	  Polling.prototype.doClose.call(this);
	};

	/**
	 * Starts a poll cycle.
	 *
	 * @api private
	 */

	JSONPPolling.prototype.doPoll = function () {
	  var self = this;
	  var script = document.createElement('script');

	  if (this.script) {
	    this.script.parentNode.removeChild(this.script);
	    this.script = null;
	  }

	  script.async = true;
	  script.src = this.uri();
	  script.onerror = function(e){
	    self.onError('jsonp poll error',e);
	  };

	  var insertAt = document.getElementsByTagName('script')[0];
	  if (insertAt) {
	    insertAt.parentNode.insertBefore(script, insertAt);
	  }
	  else {
	    (document.head || document.body).appendChild(script);
	  }
	  this.script = script;

	  var isUAgecko = 'undefined' != typeof navigator && /gecko/i.test(navigator.userAgent);

	  if (isUAgecko) {
	    setTimeout(function () {
	      var iframe = document.createElement('iframe');
	      document.body.appendChild(iframe);
	      document.body.removeChild(iframe);
	    }, 100);
	  }
	};

	/**
	 * Writes with a hidden iframe.
	 *
	 * @param {String} data to send
	 * @param {Function} called upon flush.
	 * @api private
	 */

	JSONPPolling.prototype.doWrite = function (data, fn) {
	  var self = this;

	  if (!this.form) {
	    var form = document.createElement('form');
	    var area = document.createElement('textarea');
	    var id = this.iframeId = 'eio_iframe_' + this.index;
	    var iframe;

	    form.className = 'socketio';
	    form.style.position = 'absolute';
	    form.style.top = '-1000px';
	    form.style.left = '-1000px';
	    form.target = id;
	    form.method = 'POST';
	    form.setAttribute('accept-charset', 'utf-8');
	    area.name = 'd';
	    form.appendChild(area);
	    document.body.appendChild(form);

	    this.form = form;
	    this.area = area;
	  }

	  this.form.action = this.uri();

	  function complete () {
	    initIframe();
	    fn();
	  }

	  function initIframe () {
	    if (self.iframe) {
	      try {
	        self.form.removeChild(self.iframe);
	      } catch (e) {
	        self.onError('jsonp polling iframe removal error', e);
	      }
	    }

	    try {
	      // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
	      var html = '<iframe src="javascript:0" name="'+ self.iframeId +'">';
	      iframe = document.createElement(html);
	    } catch (e) {
	      iframe = document.createElement('iframe');
	      iframe.name = self.iframeId;
	      iframe.src = 'javascript:0';
	    }

	    iframe.id = self.iframeId;

	    self.form.appendChild(iframe);
	    self.iframe = iframe;
	  }

	  initIframe();

	  // escape \n to prevent it from being converted into \r\n by some UAs
	  // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
	  data = data.replace(rEscapedNewline, '\\\n');
	  this.area.value = data.replace(rNewline, '\\n');

	  try {
	    this.form.submit();
	  } catch(e) {}

	  if (this.iframe.attachEvent) {
	    this.iframe.onreadystatechange = function(){
	      if (self.iframe.readyState == 'complete') {
	        complete();
	      }
	    };
	  } else {
	    this.iframe.onload = complete;
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module requirements.
	 */

	var XMLHttpRequest = __webpack_require__(8);
	var Polling = __webpack_require__(13);
	var Emitter = __webpack_require__(3);
	var inherit = __webpack_require__(4);
	var debug = __webpack_require__(0)('engine.io-client:polling-xhr');

	/**
	 * Module exports.
	 */

	module.e = XHR;
	module.e.Request = Request;

	/**
	 * Empty function
	 */

	function empty(){}

	/**
	 * XHR Polling constructor.
	 *
	 * @param {Object} opts
	 * @api public
	 */

	function XHR(opts){
	  Polling.call(this, opts);

	  if (global.location) {
	    var isSSL = 'https:' == location.protocol;
	    var port = location.port;

	    // some user agents have empty `location.port`
	    if (!port) {
	      port = isSSL ? 443 : 80;
	    }

	    this.xd = opts.hostname != global.location.hostname ||
	      port != opts.port;
	    this.xs = opts.secure != isSSL;
	  } else {
	    this.extraHeaders = opts.extraHeaders;
	  }
	}

	/**
	 * Inherits from Polling.
	 */

	inherit(XHR, Polling);

	/**
	 * XHR supports binary
	 */

	XHR.prototype.supportsBinary = true;

	/**
	 * Creates a request.
	 *
	 * @param {String} method
	 * @api private
	 */

	XHR.prototype.request = function(opts){
	  opts = opts || {};
	  opts.uri = this.uri();
	  opts.xd = this.xd;
	  opts.xs = this.xs;
	  opts.agent = this.agent || false;
	  opts.supportsBinary = this.supportsBinary;
	  opts.enablesXDR = this.enablesXDR;

	  // SSL options for Node.js client
	  opts.pfx = this.pfx;
	  opts.key = this.key;
	  opts.passphrase = this.passphrase;
	  opts.cert = this.cert;
	  opts.ca = this.ca;
	  opts.ciphers = this.ciphers;
	  opts.rejectUnauthorized = this.rejectUnauthorized;

	  // other options for Node.js client
	  opts.extraHeaders = this.extraHeaders;

	  return new Request(opts);
	};

	/**
	 * Sends data.
	 *
	 * @param {String} data to send.
	 * @param {Function} called upon flush.
	 * @api private
	 */

	XHR.prototype.doWrite = function(data, fn){
	  var isBinary = typeof data !== 'string' && data !== undefined;
	  var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
	  var self = this;
	  req.on('success', fn);
	  req.on('error', function(err){
	    self.onError('xhr post error', err);
	  });
	  this.sendXhr = req;
	};

	/**
	 * Starts a poll cycle.
	 *
	 * @api private
	 */

	XHR.prototype.doPoll = function(){
	  debug('xhr poll');
	  var req = this.request();
	  var self = this;
	  req.on('data', function(data){
	    self.onData(data);
	  });
	  req.on('error', function(err){
	    self.onError('xhr poll error', err);
	  });
	  this.pollXhr = req;
	};

	/**
	 * Request constructor
	 *
	 * @param {Object} options
	 * @api public
	 */

	function Request(opts){
	  this.method = opts.method || 'GET';
	  this.uri = opts.uri;
	  this.xd = !!opts.xd;
	  this.xs = !!opts.xs;
	  this.async = false !== opts.async;
	  this.data = undefined != opts.data ? opts.data : null;
	  this.agent = opts.agent;
	  this.isBinary = opts.isBinary;
	  this.supportsBinary = opts.supportsBinary;
	  this.enablesXDR = opts.enablesXDR;

	  // SSL options for Node.js client
	  this.pfx = opts.pfx;
	  this.key = opts.key;
	  this.passphrase = opts.passphrase;
	  this.cert = opts.cert;
	  this.ca = opts.ca;
	  this.ciphers = opts.ciphers;
	  this.rejectUnauthorized = opts.rejectUnauthorized;

	  // other options for Node.js client
	  this.extraHeaders = opts.extraHeaders;

	  this.create();
	}

	/**
	 * Mix in `Emitter`.
	 */

	Emitter(Request.prototype);

	/**
	 * Creates the XHR object and sends the request.
	 *
	 * @api private
	 */

	Request.prototype.create = function(){
	  var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };

	  // SSL options for Node.js client
	  opts.pfx = this.pfx;
	  opts.key = this.key;
	  opts.passphrase = this.passphrase;
	  opts.cert = this.cert;
	  opts.ca = this.ca;
	  opts.ciphers = this.ciphers;
	  opts.rejectUnauthorized = this.rejectUnauthorized;

	  var xhr = this.xhr = new XMLHttpRequest(opts);
	  var self = this;

	  try {
	    debug('xhr open %s: %s', this.method, this.uri);
	    xhr.open(this.method, this.uri, this.async);
	    try {
	      if (this.extraHeaders) {
	        xhr.setDisableHeaderCheck(true);
	        for (var i in this.extraHeaders) {
	          if (this.extraHeaders.hasOwnProperty(i)) {
	            xhr.setRequestHeader(i, this.extraHeaders[i]);
	          }
	        }
	      }
	    } catch (e) {}
	    if (this.supportsBinary) {
	      // This has to be done after open because Firefox is stupid
	      // http://stackoverflow.com/questions/13216903/get-binary-data-with-xmlhttprequest-in-a-firefox-extension
	      xhr.responseType = 'arraybuffer';
	    }

	    if ('POST' == this.method) {
	      try {
	        if (this.isBinary) {
	          xhr.setRequestHeader('Content-type', 'application/octet-stream');
	        } else {
	          xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
	        }
	      } catch (e) {}
	    }

	    // ie6 check
	    if ('withCredentials' in xhr) {
	      xhr.withCredentials = true;
	    }

	    if (this.hasXDR()) {
	      xhr.onload = function(){
	        self.onLoad();
	      };
	      xhr.onerror = function(){
	        self.onError(xhr.responseText);
	      };
	    } else {
	      xhr.onreadystatechange = function(){
	        if (4 != xhr.readyState) return;
	        if (200 == xhr.status || 1223 == xhr.status) {
	          self.onLoad();
	        } else {
	          // make sure the `error` event handler that's user-set
	          // does not throw in the same tick and gets caught here
	          setTimeout(function(){
	            self.onError(xhr.status);
	          }, 0);
	        }
	      };
	    }

	    debug('xhr data %s', this.data);
	    xhr.send(this.data);
	  } catch (e) {
	    // Need to defer since .create() is called directly fhrom the constructor
	    // and thus the 'error' event can only be only bound *after* this exception
	    // occurs.  Therefore, also, we cannot throw here at all.
	    setTimeout(function() {
	      self.onError(e);
	    }, 0);
	    return;
	  }

	  if (global.document) {
	    this.index = Request.requestsCount++;
	    Request.requests[this.index] = this;
	  }
	};

	/**
	 * Called upon successful response.
	 *
	 * @api private
	 */

	Request.prototype.onSuccess = function(){
	  this.emit('success');
	  this.cleanup();
	};

	/**
	 * Called if we have data.
	 *
	 * @api private
	 */

	Request.prototype.onData = function(data){
	  this.emit('data', data);
	  this.onSuccess();
	};

	/**
	 * Called upon error.
	 *
	 * @api private
	 */

	Request.prototype.onError = function(err){
	  this.emit('error', err);
	  this.cleanup(true);
	};

	/**
	 * Cleans up house.
	 *
	 * @api private
	 */

	Request.prototype.cleanup = function(fromError){
	  if ('undefined' == typeof this.xhr || null === this.xhr) {
	    return;
	  }
	  // xmlhttprequest
	  if (this.hasXDR()) {
	    this.xhr.onload = this.xhr.onerror = empty;
	  } else {
	    this.xhr.onreadystatechange = empty;
	  }

	  if (fromError) {
	    try {
	      this.xhr.abort();
	    } catch(e) {}
	  }

	  if (global.document) {
	    delete Request.requests[this.index];
	  }

	  this.xhr = null;
	};

	/**
	 * Called upon load.
	 *
	 * @api private
	 */

	Request.prototype.onLoad = function(){
	  var data;
	  try {
	    var contentType;
	    try {
	      contentType = this.xhr.getResponseHeader('Content-Type').split(';')[0];
	    } catch (e) {}
	    if (contentType === 'application/octet-stream') {
	      data = this.xhr.response;
	    } else {
	      if (!this.supportsBinary) {
	        data = this.xhr.responseText;
	      } else {
	        try {
	          data = String.fromCharCode.apply(null, new Uint8Array(this.xhr.response));
	        } catch (e) {
	          var ui8Arr = new Uint8Array(this.xhr.response);
	          var dataArray = [];
	          for (var idx = 0, length = ui8Arr.length; idx < length; idx++) {
	            dataArray.push(ui8Arr[idx]);
	          }

	          data = String.fromCharCode.apply(null, dataArray);
	        }
	      }
	    }
	  } catch (e) {
	    this.onError(e);
	  }
	  if (null != data) {
	    this.onData(data);
	  }
	};

	/**
	 * Check if it has XDomainRequest.
	 *
	 * @api private
	 */

	Request.prototype.hasXDR = function(){
	  return 'undefined' !== typeof global.XDomainRequest && !this.xs && this.enablesXDR;
	};

	/**
	 * Aborts the request.
	 *
	 * @api public
	 */

	Request.prototype.abort = function(){
	  this.cleanup();
	};

	/**
	 * Aborts pending requests when unloading the window. This is needed to prevent
	 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
	 * emitted.
	 */

	if (global.document) {
	  Request.requestsCount = 0;
	  Request.requests = {};
	  if (global.attachEvent) {
	    global.attachEvent('onunload', unloadHandler);
	  } else if (global.addEventListener) {
	    global.addEventListener('beforeunload', unloadHandler, false);
	  }
	}

	function unloadHandler() {
	  for (var i in Request.requests) {
	    if (Request.requests.hasOwnProperty(i)) {
	      Request.requests[i].abort();
	    }
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies.
	 */

	var Transport = __webpack_require__(7);
	var parser = __webpack_require__(1);
	var parseqs = __webpack_require__(9);
	var inherit = __webpack_require__(4);
	var yeast = __webpack_require__(21);
	var debug = __webpack_require__(0)('engine.io-client:websocket');
	var BrowserWebSocket = global.WebSocket || global.MozWebSocket;

	/**
	 * Get either the `WebSocket` or `MozWebSocket` globals
	 * in the browser or try to resolve WebSocket-compatible
	 * interface exposed by `ws` for Node-like environment.
	 */

	var WebSocket = BrowserWebSocket;
	if (!WebSocket && typeof window === 'undefined') {
	  try {
	    WebSocket = __webpack_require__(65);
	  } catch (e) { }
	}

	/**
	 * Module exports.
	 */

	module.e = WS;

	/**
	 * WebSocket transport constructor.
	 *
	 * @api {Object} connection options
	 * @api public
	 */

	function WS(opts){
	  var forceBase64 = (opts && opts.forceBase64);
	  if (forceBase64) {
	    this.supportsBinary = false;
	  }
	  this.perMessageDeflate = opts.perMessageDeflate;
	  Transport.call(this, opts);
	}

	/**
	 * Inherits from Transport.
	 */

	inherit(WS, Transport);

	/**
	 * Transport name.
	 *
	 * @api public
	 */

	WS.prototype.name = 'websocket';

	/*
	 * WebSockets support binary
	 */

	WS.prototype.supportsBinary = true;

	/**
	 * Opens socket.
	 *
	 * @api private
	 */

	WS.prototype.doOpen = function(){
	  if (!this.check()) {
	    // let probe timeout
	    return;
	  }

	  var self = this;
	  var uri = this.uri();
	  var protocols = void(0);
	  var opts = {
	    agent: this.agent,
	    perMessageDeflate: this.perMessageDeflate
	  };

	  // SSL options for Node.js client
	  opts.pfx = this.pfx;
	  opts.key = this.key;
	  opts.passphrase = this.passphrase;
	  opts.cert = this.cert;
	  opts.ca = this.ca;
	  opts.ciphers = this.ciphers;
	  opts.rejectUnauthorized = this.rejectUnauthorized;
	  if (this.extraHeaders) {
	    opts.headers = this.extraHeaders;
	  }

	  this.ws = BrowserWebSocket ? new WebSocket(uri) : new WebSocket(uri, protocols, opts);

	  if (this.ws.binaryType === undefined) {
	    this.supportsBinary = false;
	  }

	  if (this.ws.supports && this.ws.supports.binary) {
	    this.supportsBinary = true;
	    this.ws.binaryType = 'buffer';
	  } else {
	    this.ws.binaryType = 'arraybuffer';
	  }

	  this.addEventListeners();
	};

	/**
	 * Adds event listeners to the socket
	 *
	 * @api private
	 */

	WS.prototype.addEventListeners = function(){
	  var self = this;

	  this.ws.onopen = function(){
	    self.onOpen();
	  };
	  this.ws.onclose = function(){
	    self.onClose();
	  };
	  this.ws.onmessage = function(ev){
	    self.onData(ev.data);
	  };
	  this.ws.onerror = function(e){
	    self.onError('websocket error', e);
	  };
	};

	/**
	 * Override `onData` to use a timer on iOS.
	 * See: https://gist.github.com/mloughran/2052006
	 *
	 * @api private
	 */

	if ('undefined' != typeof navigator
	  && /iPad|iPhone|iPod/i.test(navigator.userAgent)) {
	  WS.prototype.onData = function(data){
	    var self = this;
	    setTimeout(function(){
	      Transport.prototype.onData.call(self, data);
	    }, 0);
	  };
	}

	/**
	 * Writes data to socket.
	 *
	 * @param {Array} array of packets.
	 * @api private
	 */

	WS.prototype.write = function(packets){
	  var self = this;
	  this.writable = false;

	  // encodePacket efficient as it uses WS framing
	  // no need for encodePayload
	  var total = packets.length;
	  for (var i = 0, l = total; i < l; i++) {
	    (function(packet) {
	      parser.encodePacket(packet, self.supportsBinary, function(data) {
	        if (!BrowserWebSocket) {
	          // always create a new object (GH-437)
	          var opts = {};
	          if (packet.options) {
	            opts.compress = packet.options.compress;
	          }

	          if (self.perMessageDeflate) {
	            var len = 'string' == typeof data ? global.Buffer.byteLength(data) : data.length;
	            if (len < self.perMessageDeflate.threshold) {
	              opts.compress = false;
	            }
	          }
	        }

	        //Sometimes the websocket has already been closed but the browser didn't
	        //have a chance of informing us about it yet, in that case send will
	        //throw an error
	        try {
	          if (BrowserWebSocket) {
	            // TypeError is thrown when passing the second argument on Safari
	            self.ws.send(data);
	          } else {
	            self.ws.send(data, opts);
	          }
	        } catch (e){
	          debug('websocket closed before onclose event');
	        }

	        --total || done();
	      });
	    })(packets[i]);
	  }

	  function done(){
	    self.emit('flush');

	    // fake drain
	    // defer to next tick to allow Socket to clear writeBuffer
	    setTimeout(function(){
	      self.writable = true;
	      self.emit('drain');
	    }, 0);
	  }
	};

	/**
	 * Called upon close
	 *
	 * @api private
	 */

	WS.prototype.onClose = function(){
	  Transport.prototype.onClose.call(this);
	};

	/**
	 * Closes socket.
	 *
	 * @api private
	 */

	WS.prototype.doClose = function(){
	  if (typeof this.ws !== 'undefined') {
	    this.ws.close();
	  }
	};

	/**
	 * Generates uri for connection.
	 *
	 * @api private
	 */

	WS.prototype.uri = function(){
	  var query = this.query || {};
	  var schema = this.secure ? 'wss' : 'ws';
	  var port = '';

	  // avoid port if default for schema
	  if (this.port && (('wss' == schema && this.port != 443)
	    || ('ws' == schema && this.port != 80))) {
	    port = ':' + this.port;
	  }

	  // append timestamp to URI
	  if (this.timestampRequests) {
	    query[this.timestampParam] = yeast();
	  }

	  // communicate binary support capabilities
	  if (!this.supportsBinary) {
	    query.b64 = 1;
	  }

	  query = parseqs.encode(query);

	  // prepend ? to query
	  if (query.length) {
	    query = '?' + query;
	  }

	  var ipv6 = this.hostname.indexOf(':') !== -1;
	  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
	};

	/**
	 * Feature detection for WebSocket.
	 *
	 * @return {Boolean} whether this transport is available.
	 * @api public
	 */

	WS.prototype.check = function(){
	  return !!WebSocket && !('__initialize' in WebSocket && this.name === WS.prototype.name);
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {


	/**
	 * Gets the keys for an object.
	 *
	 * @return {Array} keys
	 * @api private
	 */

	module.e = Object.keys || function keys (obj){
	  var arr = [];
	  var has = Object.prototype.hasOwnProperty;

	  for (var i in obj) {
	    if (has.call(obj, i)) {
	      arr.push(i);
	    }
	  }
	  return arr;
	};


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/*
	 * Module requirements.
	 */

	var isArray = __webpack_require__(5);

	/**
	 * Module exports.
	 */

	module.e = hasBinary;

	/**
	 * Checks for binary data.
	 *
	 * Right now only Buffer and ArrayBuffer are supported..
	 *
	 * @param {Object} anything
	 * @api public
	 */

	function hasBinary(data) {

	  function _hasBinary(obj) {
	    if (!obj) return false;

	    if ( (global.Buffer && global.Buffer.isBuffer(obj)) ||
	         (global.ArrayBuffer && obj instanceof ArrayBuffer) ||
	         (global.Blob && obj instanceof Blob) ||
	         (global.File && obj instanceof File)
	        ) {
	      return true;
	    }

	    if (isArray(obj)) {
	      for (var i = 0; i < obj.length; i++) {
	          if (_hasBinary(obj[i])) {
	              return true;
	          }
	      }
	    } else if (obj && 'object' == typeof obj) {
	      if (obj.toJSON) {
	        obj = obj.toJSON();
	      }

	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
	          return true;
	        }
	      }
	    }

	    return false;
	  }

	  return _hasBinary(data);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 51 */,
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var hasOwn = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;

	var isArray = function isArray(arr) {
		if (typeof Array.isArray === 'function') {
			return Array.isArray(arr);
		}

		return toStr.call(arr) === '[object Array]';
	};

	var isPlainObject = function isPlainObject(obj) {
		if (!obj || toStr.call(obj) !== '[object Object]') {
			return false;
		}

		var hasOwnConstructor = hasOwn.call(obj, 'constructor');
		var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
		// Not own constructor property must be Object
		if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		var key;
		for (key in obj) {/**/}

		return typeof key === 'undefined' || hasOwn.call(obj, key);
	};

	module.e = function extend() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0],
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if (typeof target === 'boolean') {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
			target = {};
		}

		for (; i < length; ++i) {
			options = arguments[i];
			// Only deal with non-null/undefined values
			if (options != null) {
				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target !== copy) {
						// Recurse if we're merging plain objects or arrays
						if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
							if (copyIsArray) {
								copyIsArray = false;
								clone = src && isArray(src) ? src : [];
							} else {
								clone = src && isPlainObject(src) ? src : {};
							}

							// Never move original objects, clone them
							target[name] = extend(deep, clone, copy);

						// Don't bring in undefined values
						} else if (typeof copy !== 'undefined') {
							target[name] = copy;
						}
					}
				}
			}
		}

		// Return the modified object
		return target;
	};



/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/*
	 * Module requirements.
	 */

	var isArray = __webpack_require__(5);

	/**
	 * Module exports.
	 */

	module.e = hasBinary;

	/**
	 * Checks for binary data.
	 *
	 * Right now only Buffer and ArrayBuffer are supported..
	 *
	 * @param {Object} anything
	 * @api public
	 */

	function hasBinary(data) {

	  function _hasBinary(obj) {
	    if (!obj) return false;

	    if ( (global.Buffer && global.Buffer.isBuffer && global.Buffer.isBuffer(obj)) ||
	         (global.ArrayBuffer && obj instanceof ArrayBuffer) ||
	         (global.Blob && obj instanceof Blob) ||
	         (global.File && obj instanceof File)
	        ) {
	      return true;
	    }

	    if (isArray(obj)) {
	      for (var i = 0; i < obj.length; i++) {
	          if (_hasBinary(obj[i])) {
	              return true;
	          }
	      }
	    } else if (obj && 'object' == typeof obj) {
	      // see: https://github.com/Automattic/has-binary/pull/4
	      if (obj.toJSON && 'function' == typeof obj.toJSON) {
	        obj = obj.toJSON();
	      }

	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
	          return true;
	        }
	      }
	    }

	    return false;
	  }

	  return _hasBinary(data);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {


	/**
	 * Module exports.
	 *
	 * Logic borrowed from Modernizr:
	 *
	 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
	 */

	try {
	  module.e = typeof XMLHttpRequest !== 'undefined' &&
	    'withCredentials' in new XMLHttpRequest();
	} catch (err) {
	  // if XMLHttp support is disabled in IE then it will throw
	  // when trying to create
	  module.e = false;
	}


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Helpers.
	 */

	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @return {String|Number}
	 * @api public
	 */

	module.e = function(val, options){
	  options = options || {};
	  if ('string' == typeof val) return parse(val);
	  return options.long
	    ? long(val)
	    : short(val);
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = '' + str;
	  if (str.length > 10000) return;
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
	  if (!match) return;
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function short(ms) {
	  if (ms >= d) return Math.round(ms / d) + 'd';
	  if (ms >= h) return Math.round(ms / h) + 'h';
	  if (ms >= m) return Math.round(ms / m) + 'm';
	  if (ms >= s) return Math.round(ms / s) + 's';
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function long(ms) {
	  return plural(ms, d, 'day')
	    || plural(ms, h, 'hour')
	    || plural(ms, m, 'minute')
	    || plural(ms, s, 'second')
	    || ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, n, name) {
	  if (ms < n) return;
	  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * JSON parse.
	 *
	 * @see Based on jQuery#parseJSON (MIT) and JSON2
	 * @api private
	 */

	var rvalidchars = /^[\],:{}\s]*$/;
	var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
	var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
	var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
	var rtrimLeft = /^\s+/;
	var rtrimRight = /\s+$/;

	module.e = function parsejson(data) {
	  if ('string' != typeof data || !data) {
	    return null;
	  }

	  data = data.replace(rtrimLeft, '').replace(rtrimRight, '');

	  // Attempt to parse using the native JSON parser first
	  if (global.JSON && JSON.parse) {
	    return JSON.parse(data);
	  }

	  if (rvalidchars.test(data.replace(rvalidescape, '@')
	      .replace(rvalidtokens, ']')
	      .replace(rvalidbraces, ''))) {
	    return (new Function('return ' + data))();
	  }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/**
	 * Module dependencies.
	 */

	var parseuri = __webpack_require__(15);
	var debug = __webpack_require__(0)('socket.io-client:url');

	/**
	 * Module exports.
	 */

	module.e = url;

	/**
	 * URL parser.
	 *
	 * @param {String} url
	 * @param {Object} An object meant to mimic window.location.
	 *                 Defaults to window.location.
	 * @api public
	 */

	function url(uri, loc){
	  var obj = uri;

	  // default to window.location
	  var loc = loc || global.location;
	  if (null == uri) uri = loc.protocol + '//' + loc.host;

	  // relative path support
	  if ('string' == typeof uri) {
	    if ('/' == uri.charAt(0)) {
	      if ('/' == uri.charAt(1)) {
	        uri = loc.protocol + uri;
	      } else {
	        uri = loc.host + uri;
	      }
	    }

	    if (!/^(https?|wss?):\/\//.test(uri)) {
	      debug('protocol-less url %s', uri);
	      if ('undefined' != typeof loc) {
	        uri = loc.protocol + '//' + uri;
	      } else {
	        uri = 'https://' + uri;
	      }
	    }

	    // parse
	    debug('parse %s', uri);
	    obj = parseuri(uri);
	  }

	  // make sure we treat `localhost:80` and `localhost` equally
	  if (!obj.port) {
	    if (/^(http|ws)$/.test(obj.protocol)) {
	      obj.port = '80';
	    }
	    else if (/^(http|ws)s$/.test(obj.protocol)) {
	      obj.port = '443';
	    }
	  }

	  obj.path = obj.path || '/';

	  var ipv6 = obj.host.indexOf(':') !== -1;
	  var host = ipv6 ? '[' + obj.host + ']' : obj.host;

	  // define unique id
	  obj.id = obj.protocol + '://' + host + ':' + obj.port;
	  // define href
	  obj.href = obj.protocol + '://' + host + (loc && loc.port == obj.port ? '' : (':' + obj.port));

	  return obj;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*global Blob,File*/

	/**
	 * Module requirements
	 */

	var isArray = __webpack_require__(5);
	var isBuf = __webpack_require__(20);

	/**
	 * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
	 * Anything with blobs or files should be fed through removeBlobs before coming
	 * here.
	 *
	 * @param {Object} packet - socket.io event packet
	 * @return {Object} with deconstructed packet and list of buffers
	 * @api public
	 */

	exports.deconstructPacket = function(packet){
	  var buffers = [];
	  var packetData = packet.data;

	  function _deconstructPacket(data) {
	    if (!data) return data;

	    if (isBuf(data)) {
	      var placeholder = { _placeholder: true, num: buffers.length };
	      buffers.push(data);
	      return placeholder;
	    } else if (isArray(data)) {
	      var newData = new Array(data.length);
	      for (var i = 0; i < data.length; i++) {
	        newData[i] = _deconstructPacket(data[i]);
	      }
	      return newData;
	    } else if ('object' == typeof data && !(data instanceof Date)) {
	      var newData = {};
	      for (var key in data) {
	        newData[key] = _deconstructPacket(data[key]);
	      }
	      return newData;
	    }
	    return data;
	  }

	  var pack = packet;
	  pack.data = _deconstructPacket(packetData);
	  pack.attachments = buffers.length; // number of binary 'attachments'
	  return {packet: pack, buffers: buffers};
	};

	/**
	 * Reconstructs a binary packet from its placeholder packet and buffers
	 *
	 * @param {Object} packet - event packet with placeholders
	 * @param {Array} buffers - binary buffers to put in placeholder positions
	 * @return {Object} reconstructed packet
	 * @api public
	 */

	exports.reconstructPacket = function(packet, buffers) {
	  var curPlaceHolder = 0;

	  function _reconstructPacket(data) {
	    if (data && data._placeholder) {
	      var buf = buffers[data.num]; // appropriate buffer (should be natural order anyway)
	      return buf;
	    } else if (isArray(data)) {
	      for (var i = 0; i < data.length; i++) {
	        data[i] = _reconstructPacket(data[i]);
	      }
	      return data;
	    } else if (data && 'object' == typeof data) {
	      for (var key in data) {
	        data[key] = _reconstructPacket(data[key]);
	      }
	      return data;
	    }
	    return data;
	  }

	  packet.data = _reconstructPacket(packet.data);
	  packet.attachments = undefined; // no longer useful
	  return packet;
	};

	/**
	 * Asynchronously removes Blobs or Files from data via
	 * FileReader's readAsArrayBuffer method. Used before encoding
	 * data as msgpack. Calls callback with the blobless data.
	 *
	 * @param {Object} data
	 * @param {Function} callback
	 * @api private
	 */

	exports.removeBlobs = function(data, callback) {
	  function _removeBlobs(obj, curKey, containingObject) {
	    if (!obj) return obj;

	    // convert any blob
	    if ((global.Blob && obj instanceof Blob) ||
	        (global.File && obj instanceof File)) {
	      pendingBlobs++;

	      // async filereader
	      var fileReader = new FileReader();
	      fileReader.onload = function() { // this.result == arraybuffer
	        if (containingObject) {
	          containingObject[curKey] = this.result;
	        }
	        else {
	          bloblessData = this.result;
	        }

	        // if nothing pending its callback time
	        if(! --pendingBlobs) {
	          callback(bloblessData);
	        }
	      };

	      fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
	    } else if (isArray(obj)) { // handle array
	      for (var i = 0; i < obj.length; i++) {
	        _removeBlobs(obj[i], i, obj);
	      }
	    } else if (obj && 'object' == typeof obj && !isBuf(obj)) { // and object
	      for (var key in obj) {
	        _removeBlobs(obj[key], key, obj);
	      }
	    }
	  }

	  var pendingBlobs = 0;
	  var bloblessData = data;
	  _removeBlobs(bloblessData);
	  if (!pendingBlobs) {
	    callback(bloblessData);
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
	;(function () {
	  // Detect the `define` function exposed by asynchronous module loaders. The
	  // strict `define` check is necessary for compatibility with `r.js`.
	  var isLoader = "function" === "function" && __webpack_require__(63);

	  // A set of types used to distinguish objects from primitives.
	  var objectTypes = {
	    "function": true,
	    "object": true
	  };

	  // Detect the `exports` object exposed by CommonJS implementations.
	  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

	  // Use the `global` object exposed by Node (including Browserify via
	  // `insert-module-globals`), Narwhal, and Ringo as the default context,
	  // and the `window` object in browsers. Rhino exports a `global` function
	  // instead.
	  var root = objectTypes[typeof window] && window || this,
	      freeGlobal = freeExports && objectTypes[typeof module] && module && !module.nodeType && typeof global == "object" && global;

	  if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal || freeGlobal["self"] === freeGlobal)) {
	    root = freeGlobal;
	  }

	  // Public: Initializes JSON 3 using the given `context` object, attaching the
	  // `stringify` and `parse` functions to the specified `exports` object.
	  function runInContext(context, exports) {
	    context || (context = root["Object"]());
	    exports || (exports = root["Object"]());

	    // Native constructor aliases.
	    var Number = context["Number"] || root["Number"],
	        String = context["String"] || root["String"],
	        Object = context["Object"] || root["Object"],
	        Date = context["Date"] || root["Date"],
	        SyntaxError = context["SyntaxError"] || root["SyntaxError"],
	        TypeError = context["TypeError"] || root["TypeError"],
	        Math = context["Math"] || root["Math"],
	        nativeJSON = context["JSON"] || root["JSON"];

	    // Delegate to the native `stringify` and `parse` implementations.
	    if (typeof nativeJSON == "object" && nativeJSON) {
	      exports.stringify = nativeJSON.stringify;
	      exports.parse = nativeJSON.parse;
	    }

	    // Convenience aliases.
	    var objectProto = Object.prototype,
	        getClass = objectProto.toString,
	        isProperty, forEach, undef;

	    // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
	    var isExtended = new Date(-3509827334573292);
	    try {
	      // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
	      // results for certain dates in Opera >= 10.53.
	      isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
	        // Safari < 2.0.2 stores the internal millisecond time value correctly,
	        // but clips the values returned by the date methods to the range of
	        // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
	        isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
	    } catch (exception) {}

	    // Internal: Determines whether the native `JSON.stringify` and `parse`
	    // implementations are spec-compliant. Based on work by Ken Snyder.
	    function has(name) {
	      if (has[name] !== undef) {
	        // Return cached feature test result.
	        return has[name];
	      }
	      var isSupported;
	      if (name == "bug-string-char-index") {
	        // IE <= 7 doesn't support accessing string characters using square
	        // bracket notation. IE 8 only supports this for primitives.
	        isSupported = "a"[0] != "a";
	      } else if (name == "json") {
	        // Indicates whether both `JSON.stringify` and `JSON.parse` are
	        // supported.
	        isSupported = has("json-stringify") && has("json-parse");
	      } else {
	        var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
	        // Test `JSON.stringify`.
	        if (name == "json-stringify") {
	          var stringify = exports.stringify, stringifySupported = typeof stringify == "function" && isExtended;
	          if (stringifySupported) {
	            // A test function object with a custom `toJSON` method.
	            (value = function () {
	              return 1;
	            }).toJSON = value;
	            try {
	              stringifySupported =
	                // Firefox 3.1b1 and b2 serialize string, number, and boolean
	                // primitives as object literals.
	                stringify(0) === "0" &&
	                // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
	                // literals.
	                stringify(new Number()) === "0" &&
	                stringify(new String()) == '""' &&
	                // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
	                // does not define a canonical JSON representation (this applies to
	                // objects with `toJSON` properties as well, *unless* they are nested
	                // within an object or array).
	                stringify(getClass) === undef &&
	                // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
	                // FF 3.1b3 pass this test.
	                stringify(undef) === undef &&
	                // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
	                // respectively, if the value is omitted entirely.
	                stringify() === undef &&
	                // FF 3.1b1, 2 throw an error if the given value is not a number,
	                // string, array, object, Boolean, or `null` literal. This applies to
	                // objects with custom `toJSON` methods as well, unless they are nested
	                // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
	                // methods entirely.
	                stringify(value) === "1" &&
	                stringify([value]) == "[1]" &&
	                // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
	                // `"[null]"`.
	                stringify([undef]) == "[null]" &&
	                // YUI 3.0.0b1 fails to serialize `null` literals.
	                stringify(null) == "null" &&
	                // FF 3.1b1, 2 halts serialization if an array contains a function:
	                // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
	                // elides non-JSON values from objects and arrays, unless they
	                // define custom `toJSON` methods.
	                stringify([undef, getClass, null]) == "[null,null,null]" &&
	                // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
	                // where character escape codes are expected (e.g., `\b` => `\u0008`).
	                stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
	                // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
	                stringify(null, value) === "1" &&
	                stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
	                // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
	                // serialize extended years.
	                stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
	                // The milliseconds are optional in ES 5, but required in 5.1.
	                stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
	                // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
	                // four-digit years instead of six-digit years. Credits: @Yaffle.
	                stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
	                // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
	                // values less than 1000. Credits: @Yaffle.
	                stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
	            } catch (exception) {
	              stringifySupported = false;
	            }
	          }
	          isSupported = stringifySupported;
	        }
	        // Test `JSON.parse`.
	        if (name == "json-parse") {
	          var parse = exports.parse;
	          if (typeof parse == "function") {
	            try {
	              // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
	              // Conforming implementations should also coerce the initial argument to
	              // a string prior to parsing.
	              if (parse("0") === 0 && !parse(false)) {
	                // Simple parsing test.
	                value = parse(serialized);
	                var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
	                if (parseSupported) {
	                  try {
	                    // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
	                    parseSupported = !parse('"\t"');
	                  } catch (exception) {}
	                  if (parseSupported) {
	                    try {
	                      // FF 4.0 and 4.0.1 allow leading `+` signs and leading
	                      // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
	                      // certain octal literals.
	                      parseSupported = parse("01") !== 1;
	                    } catch (exception) {}
	                  }
	                  if (parseSupported) {
	                    try {
	                      // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
	                      // points. These environments, along with FF 3.1b1 and 2,
	                      // also allow trailing commas in JSON objects and arrays.
	                      parseSupported = parse("1.") !== 1;
	                    } catch (exception) {}
	                  }
	                }
	              }
	            } catch (exception) {
	              parseSupported = false;
	            }
	          }
	          isSupported = parseSupported;
	        }
	      }
	      return has[name] = !!isSupported;
	    }

	    if (!has("json")) {
	      // Common `[[Class]]` name aliases.
	      var functionClass = "[object Function]",
	          dateClass = "[object Date]",
	          numberClass = "[object Number]",
	          stringClass = "[object String]",
	          arrayClass = "[object Array]",
	          booleanClass = "[object Boolean]";

	      // Detect incomplete support for accessing string characters by index.
	      var charIndexBuggy = has("bug-string-char-index");

	      // Define additional utility methods if the `Date` methods are buggy.
	      if (!isExtended) {
	        var floor = Math.floor;
	        // A mapping between the months of the year and the number of days between
	        // January 1st and the first of the respective month.
	        var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
	        // Internal: Calculates the number of days between the Unix epoch and the
	        // first day of the given month.
	        var getDay = function (year, month) {
	          return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
	        };
	      }

	      // Internal: Determines if a property is a direct property of the given
	      // object. Delegates to the native `Object#hasOwnProperty` method.
	      if (!(isProperty = objectProto.hasOwnProperty)) {
	        isProperty = function (property) {
	          var members = {}, constructor;
	          if ((members.__proto__ = null, members.__proto__ = {
	            // The *proto* property cannot be set multiple times in recent
	            // versions of Firefox and SeaMonkey.
	            "toString": 1
	          }, members).toString != getClass) {
	            // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
	            // supports the mutable *proto* property.
	            isProperty = function (property) {
	              // Capture and break the object's prototype chain (see section 8.6.2
	              // of the ES 5.1 spec). The parenthesized expression prevents an
	              // unsafe transformation by the Closure Compiler.
	              var original = this.__proto__, result = property in (this.__proto__ = null, this);
	              // Restore the original prototype chain.
	              this.__proto__ = original;
	              return result;
	            };
	          } else {
	            // Capture a reference to the top-level `Object` constructor.
	            constructor = members.constructor;
	            // Use the `constructor` property to simulate `Object#hasOwnProperty` in
	            // other environments.
	            isProperty = function (property) {
	              var parent = (this.constructor || constructor).prototype;
	              return property in this && !(property in parent && this[property] === parent[property]);
	            };
	          }
	          members = null;
	          return isProperty.call(this, property);
	        };
	      }

	      // Internal: Normalizes the `for...in` iteration algorithm across
	      // environments. Each enumerated key is yielded to a `callback` function.
	      forEach = function (object, callback) {
	        var size = 0, Properties, members, property;

	        // Tests for bugs in the current environment's `for...in` algorithm. The
	        // `valueOf` property inherits the non-enumerable flag from
	        // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
	        (Properties = function () {
	          this.valueOf = 0;
	        }).prototype.valueOf = 0;

	        // Iterate over a new instance of the `Properties` class.
	        members = new Properties();
	        for (property in members) {
	          // Ignore all properties inherited from `Object.prototype`.
	          if (isProperty.call(members, property)) {
	            size++;
	          }
	        }
	        Properties = members = null;

	        // Normalize the iteration algorithm.
	        if (!size) {
	          // A list of non-enumerable properties inherited from `Object.prototype`.
	          members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
	          // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
	          // properties.
	          forEach = function (object, callback) {
	            var isFunction = getClass.call(object) == functionClass, property, length;
	            var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
	            for (property in object) {
	              // Gecko <= 1.0 enumerates the `prototype` property of functions under
	              // certain conditions; IE does not.
	              if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
	                callback(property);
	              }
	            }
	            // Manually invoke the callback for each non-enumerable property.
	            for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
	          };
	        } else if (size == 2) {
	          // Safari <= 2.0.4 enumerates shadowed properties twice.
	          forEach = function (object, callback) {
	            // Create a set of iterated properties.
	            var members = {}, isFunction = getClass.call(object) == functionClass, property;
	            for (property in object) {
	              // Store each property name to prevent double enumeration. The
	              // `prototype` property of functions is not enumerated due to cross-
	              // environment inconsistencies.
	              if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
	                callback(property);
	              }
	            }
	          };
	        } else {
	          // No bugs detected; use the standard `for...in` algorithm.
	          forEach = function (object, callback) {
	            var isFunction = getClass.call(object) == functionClass, property, isConstructor;
	            for (property in object) {
	              if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
	                callback(property);
	              }
	            }
	            // Manually invoke the callback for the `constructor` property due to
	            // cross-environment inconsistencies.
	            if (isConstructor || isProperty.call(object, (property = "constructor"))) {
	              callback(property);
	            }
	          };
	        }
	        return forEach(object, callback);
	      };

	      // Public: Serializes a JavaScript `value` as a JSON string. The optional
	      // `filter` argument may specify either a function that alters how object and
	      // array members are serialized, or an array of strings and numbers that
	      // indicates which properties should be serialized. The optional `width`
	      // argument may be either a string or number that specifies the indentation
	      // level of the output.
	      if (!has("json-stringify")) {
	        // Internal: A map of control characters and their escaped equivalents.
	        var Escapes = {
	          92: "\\\\",
	          34: '\\"',
	          8: "\\b",
	          12: "\\f",
	          10: "\\n",
	          13: "\\r",
	          9: "\\t"
	        };

	        // Internal: Converts `value` into a zero-padded string such that its
	        // length is at least equal to `width`. The `width` must be <= 6.
	        var leadingZeroes = "000000";
	        var toPaddedString = function (width, value) {
	          // The `|| 0` expression is necessary to work around a bug in
	          // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
	          return (leadingZeroes + (value || 0)).slice(-width);
	        };

	        // Internal: Double-quotes a string `value`, replacing all ASCII control
	        // characters (characters with code unit values between 0 and 31) with
	        // their escaped equivalents. This is an implementation of the
	        // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
	        var unicodePrefix = "\\u00";
	        var quote = function (value) {
	          var result = '"', index = 0, length = value.length, useCharIndex = !charIndexBuggy || length > 10;
	          var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
	          for (; index < length; index++) {
	            var charCode = value.charCodeAt(index);
	            // If the character is a control character, append its Unicode or
	            // shorthand escape sequence; otherwise, append the character as-is.
	            switch (charCode) {
	              case 8: case 9: case 10: case 12: case 13: case 34: case 92:
	                result += Escapes[charCode];
	                break;
	              default:
	                if (charCode < 32) {
	                  result += unicodePrefix + toPaddedString(2, charCode.toString(16));
	                  break;
	                }
	                result += useCharIndex ? symbols[index] : value.charAt(index);
	            }
	          }
	          return result + '"';
	        };

	        // Internal: Recursively serializes an object. Implements the
	        // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
	        var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
	          var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
	          try {
	            // Necessary for host object support.
	            value = object[property];
	          } catch (exception) {}
	          if (typeof value == "object" && value) {
	            className = getClass.call(value);
	            if (className == dateClass && !isProperty.call(value, "toJSON")) {
	              if (value > -1 / 0 && value < 1 / 0) {
	                // Dates are serialized according to the `Date#toJSON` method
	                // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
	                // for the ISO 8601 date time string format.
	                if (getDay) {
	                  // Manually compute the year, month, date, hours, minutes,
	                  // seconds, and milliseconds if the `getUTC*` methods are
	                  // buggy. Adapted from @Yaffle's `date-shim` project.
	                  date = floor(value / 864e5);
	                  for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
	                  for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
	                  date = 1 + date - getDay(year, month);
	                  // The `time` value specifies the time within the day (see ES
	                  // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
	                  // to compute `A modulo B`, as the `%` operator does not
	                  // correspond to the `modulo` operation for negative numbers.
	                  time = (value % 864e5 + 864e5) % 864e5;
	                  // The hours, minutes, seconds, and milliseconds are obtained by
	                  // decomposing the time within the day. See section 15.9.1.10.
	                  hours = floor(time / 36e5) % 24;
	                  minutes = floor(time / 6e4) % 60;
	                  seconds = floor(time / 1e3) % 60;
	                  milliseconds = time % 1e3;
	                } else {
	                  year = value.getUTCFullYear();
	                  month = value.getUTCMonth();
	                  date = value.getUTCDate();
	                  hours = value.getUTCHours();
	                  minutes = value.getUTCMinutes();
	                  seconds = value.getUTCSeconds();
	                  milliseconds = value.getUTCMilliseconds();
	                }
	                // Serialize extended years correctly.
	                value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
	                  "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
	                  // Months, dates, hours, minutes, and seconds should have two
	                  // digits; milliseconds should have three.
	                  "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
	                  // Milliseconds are optional in ES 5.0, but required in 5.1.
	                  "." + toPaddedString(3, milliseconds) + "Z";
	              } else {
	                value = null;
	              }
	            } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
	              // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
	              // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
	              // ignores all `toJSON` methods on these objects unless they are
	              // defined directly on an instance.
	              value = value.toJSON(property);
	            }
	          }
	          if (callback) {
	            // If a replacement function was provided, call it to obtain the value
	            // for serialization.
	            value = callback.call(object, property, value);
	          }
	          if (value === null) {
	            return "null";
	          }
	          className = getClass.call(value);
	          if (className == booleanClass) {
	            // Booleans are represented literally.
	            return "" + value;
	          } else if (className == numberClass) {
	            // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
	            // `"null"`.
	            return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
	          } else if (className == stringClass) {
	            // Strings are double-quoted and escaped.
	            return quote("" + value);
	          }
	          // Recursively serialize objects and arrays.
	          if (typeof value == "object") {
	            // Check for cyclic structures. This is a linear search; performance
	            // is inversely proportional to the number of unique nested objects.
	            for (length = stack.length; length--;) {
	              if (stack[length] === value) {
	                // Cyclic structures cannot be serialized by `JSON.stringify`.
	                throw TypeError();
	              }
	            }
	            // Add the object to the stack of traversed objects.
	            stack.push(value);
	            results = [];
	            // Save the current indentation level and indent one additional level.
	            prefix = indentation;
	            indentation += whitespace;
	            if (className == arrayClass) {
	              // Recursively serialize array elements.
	              for (index = 0, length = value.length; index < length; index++) {
	                element = serialize(index, value, callback, properties, whitespace, indentation, stack);
	                results.push(element === undef ? "null" : element);
	              }
	              result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
	            } else {
	              // Recursively serialize object members. Members are selected from
	              // either a user-specified list of property names, or the object
	              // itself.
	              forEach(properties || value, function (property) {
	                var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
	                if (element !== undef) {
	                  // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
	                  // is not the empty string, let `member` {quote(property) + ":"}
	                  // be the concatenation of `member` and the `space` character."
	                  // The "`space` character" refers to the literal space
	                  // character, not the `space` {width} argument provided to
	                  // `JSON.stringify`.
	                  results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
	                }
	              });
	              result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
	            }
	            // Remove the object from the traversed object stack.
	            stack.pop();
	            return result;
	          }
	        };

	        // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
	        exports.stringify = function (source, filter, width) {
	          var whitespace, callback, properties, className;
	          if (objectTypes[typeof filter] && filter) {
	            if ((className = getClass.call(filter)) == functionClass) {
	              callback = filter;
	            } else if (className == arrayClass) {
	              // Convert the property names array into a makeshift set.
	              properties = {};
	              for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
	            }
	          }
	          if (width) {
	            if ((className = getClass.call(width)) == numberClass) {
	              // Convert the `width` to an integer and create a string containing
	              // `width` number of space characters.
	              if ((width -= width % 1) > 0) {
	                for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
	              }
	            } else if (className == stringClass) {
	              whitespace = width.length <= 10 ? width : width.slice(0, 10);
	            }
	          }
	          // Opera <= 7.54u2 discards the values associated with empty string keys
	          // (`""`) only if they are used directly within an object member list
	          // (e.g., `!("" in { "": 1})`).
	          return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
	        };
	      }

	      // Public: Parses a JSON source string.
	      if (!has("json-parse")) {
	        var fromCharCode = String.fromCharCode;

	        // Internal: A map of escaped control characters and their unescaped
	        // equivalents.
	        var Unescapes = {
	          92: "\\",
	          34: '"',
	          47: "/",
	          98: "\b",
	          116: "\t",
	          110: "\n",
	          102: "\f",
	          114: "\r"
	        };

	        // Internal: Stores the parser state.
	        var Index, Source;

	        // Internal: Resets the parser state and throws a `SyntaxError`.
	        var abort = function () {
	          Index = Source = null;
	          throw SyntaxError();
	        };

	        // Internal: Returns the next token, or `"$"` if the parser has reached
	        // the end of the source string. A token may be a string, number, `null`
	        // literal, or Boolean literal.
	        var lex = function () {
	          var source = Source, length = source.length, value, begin, position, isSigned, charCode;
	          while (Index < length) {
	            charCode = source.charCodeAt(Index);
	            switch (charCode) {
	              case 9: case 10: case 13: case 32:
	                // Skip whitespace tokens, including tabs, carriage returns, line
	                // feeds, and space characters.
	                Index++;
	                break;
	              case 123: case 125: case 91: case 93: case 58: case 44:
	                // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
	                // the current position.
	                value = charIndexBuggy ? source.charAt(Index) : source[Index];
	                Index++;
	                return value;
	              case 34:
	                // `"` delimits a JSON string; advance to the next character and
	                // begin parsing the string. String tokens are prefixed with the
	                // sentinel `@` character to distinguish them from punctuators and
	                // end-of-string tokens.
	                for (value = "@", Index++; Index < length;) {
	                  charCode = source.charCodeAt(Index);
	                  if (charCode < 32) {
	                    // Unescaped ASCII control characters (those with a code unit
	                    // less than the space character) are not permitted.
	                    abort();
	                  } else if (charCode == 92) {
	                    // A reverse solidus (`\`) marks the beginning of an escaped
	                    // control character (including `"`, `\`, and `/`) or Unicode
	                    // escape sequence.
	                    charCode = source.charCodeAt(++Index);
	                    switch (charCode) {
	                      case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
	                        // Revive escaped control characters.
	                        value += Unescapes[charCode];
	                        Index++;
	                        break;
	                      case 117:
	                        // `\u` marks the beginning of a Unicode escape sequence.
	                        // Advance to the first character and validate the
	                        // four-digit code point.
	                        begin = ++Index;
	                        for (position = Index + 4; Index < position; Index++) {
	                          charCode = source.charCodeAt(Index);
	                          // A valid sequence comprises four hexdigits (case-
	                          // insensitive) that form a single hexadecimal value.
	                          if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
	                            // Invalid Unicode escape sequence.
	                            abort();
	                          }
	                        }
	                        // Revive the escaped character.
	                        value += fromCharCode("0x" + source.slice(begin, Index));
	                        break;
	                      default:
	                        // Invalid escape sequence.
	                        abort();
	                    }
	                  } else {
	                    if (charCode == 34) {
	                      // An unescaped double-quote character marks the end of the
	                      // string.
	                      break;
	                    }
	                    charCode = source.charCodeAt(Index);
	                    begin = Index;
	                    // Optimize for the common case where a string is valid.
	                    while (charCode >= 32 && charCode != 92 && charCode != 34) {
	                      charCode = source.charCodeAt(++Index);
	                    }
	                    // Append the string as-is.
	                    value += source.slice(begin, Index);
	                  }
	                }
	                if (source.charCodeAt(Index) == 34) {
	                  // Advance to the next character and return the revived string.
	                  Index++;
	                  return value;
	                }
	                // Unterminated string.
	                abort();
	              default:
	                // Parse numbers and literals.
	                begin = Index;
	                // Advance past the negative sign, if one is specified.
	                if (charCode == 45) {
	                  isSigned = true;
	                  charCode = source.charCodeAt(++Index);
	                }
	                // Parse an integer or floating-point value.
	                if (charCode >= 48 && charCode <= 57) {
	                  // Leading zeroes are interpreted as octal literals.
	                  if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
	                    // Illegal octal literal.
	                    abort();
	                  }
	                  isSigned = false;
	                  // Parse the integer component.
	                  for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
	                  // Floats cannot contain a leading decimal point; however, this
	                  // case is already accounted for by the parser.
	                  if (source.charCodeAt(Index) == 46) {
	                    position = ++Index;
	                    // Parse the decimal component.
	                    for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
	                    if (position == Index) {
	                      // Illegal trailing decimal.
	                      abort();
	                    }
	                    Index = position;
	                  }
	                  // Parse exponents. The `e` denoting the exponent is
	                  // case-insensitive.
	                  charCode = source.charCodeAt(Index);
	                  if (charCode == 101 || charCode == 69) {
	                    charCode = source.charCodeAt(++Index);
	                    // Skip past the sign following the exponent, if one is
	                    // specified.
	                    if (charCode == 43 || charCode == 45) {
	                      Index++;
	                    }
	                    // Parse the exponential component.
	                    for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
	                    if (position == Index) {
	                      // Illegal empty exponent.
	                      abort();
	                    }
	                    Index = position;
	                  }
	                  // Coerce the parsed value to a JavaScript number.
	                  return +source.slice(begin, Index);
	                }
	                // A negative sign may only precede numbers.
	                if (isSigned) {
	                  abort();
	                }
	                // `true`, `false`, and `null` literals.
	                if (source.slice(Index, Index + 4) == "true") {
	                  Index += 4;
	                  return true;
	                } else if (source.slice(Index, Index + 5) == "false") {
	                  Index += 5;
	                  return false;
	                } else if (source.slice(Index, Index + 4) == "null") {
	                  Index += 4;
	                  return null;
	                }
	                // Unrecognized token.
	                abort();
	            }
	          }
	          // Return the sentinel `$` character if the parser has reached the end
	          // of the source string.
	          return "$";
	        };

	        // Internal: Parses a JSON `value` token.
	        var get = function (value) {
	          var results, hasMembers;
	          if (value == "$") {
	            // Unexpected end of input.
	            abort();
	          }
	          if (typeof value == "string") {
	            if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
	              // Remove the sentinel `@` character.
	              return value.slice(1);
	            }
	            // Parse object and array literals.
	            if (value == "[") {
	              // Parses a JSON array, returning a new JavaScript array.
	              results = [];
	              for (;; hasMembers || (hasMembers = true)) {
	                value = lex();
	                // A closing square bracket marks the end of the array literal.
	                if (value == "]") {
	                  break;
	                }
	                // If the array literal contains elements, the current token
	                // should be a comma separating the previous element from the
	                // next.
	                if (hasMembers) {
	                  if (value == ",") {
	                    value = lex();
	                    if (value == "]") {
	                      // Unexpected trailing `,` in array literal.
	                      abort();
	                    }
	                  } else {
	                    // A `,` must separate each array element.
	                    abort();
	                  }
	                }
	                // Elisions and leading commas are not permitted.
	                if (value == ",") {
	                  abort();
	                }
	                results.push(get(value));
	              }
	              return results;
	            } else if (value == "{") {
	              // Parses a JSON object, returning a new JavaScript object.
	              results = {};
	              for (;; hasMembers || (hasMembers = true)) {
	                value = lex();
	                // A closing curly brace marks the end of the object literal.
	                if (value == "}") {
	                  break;
	                }
	                // If the object literal contains members, the current token
	                // should be a comma separator.
	                if (hasMembers) {
	                  if (value == ",") {
	                    value = lex();
	                    if (value == "}") {
	                      // Unexpected trailing `,` in object literal.
	                      abort();
	                    }
	                  } else {
	                    // A `,` must separate each object member.
	                    abort();
	                  }
	                }
	                // Leading commas are not permitted, object property names must be
	                // double-quoted strings, and a `:` must separate each property
	                // name and value.
	                if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
	                  abort();
	                }
	                results[value.slice(1)] = get(lex());
	              }
	              return results;
	            }
	            // Unexpected token encountered.
	            abort();
	          }
	          return value;
	        };

	        // Internal: Updates a traversed object member.
	        var update = function (source, property, callback) {
	          var element = walk(source, property, callback);
	          if (element === undef) {
	            delete source[property];
	          } else {
	            source[property] = element;
	          }
	        };

	        // Internal: Recursively traverses a parsed JSON object, invoking the
	        // `callback` function for each value. This is an implementation of the
	        // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
	        var walk = function (source, property, callback) {
	          var value = source[property], length;
	          if (typeof value == "object" && value) {
	            // `forEach` can't be used to traverse an array in Opera <= 8.54
	            // because its `Object#hasOwnProperty` implementation returns `false`
	            // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
	            if (getClass.call(value) == arrayClass) {
	              for (length = value.length; length--;) {
	                update(value, length, callback);
	              }
	            } else {
	              forEach(value, function (property) {
	                update(value, property, callback);
	              });
	            }
	          }
	          return callback.call(source, property, value);
	        };

	        // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
	        exports.parse = function (source, callback) {
	          var result, value;
	          Index = 0;
	          Source = "" + source;
	          result = get(lex());
	          // If a JSON string contains multiple tokens, it is invalid.
	          if (lex() != "$") {
	            abort();
	          }
	          // Reset the parser state.
	          Index = Source = null;
	          return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
	        };
	      }
	    }

	    exports["runInContext"] = runInContext;
	    return exports;
	  }

	  if (freeExports && !isLoader) {
	    // Export for CommonJS environments.
	    runInContext(root, freeExports);
	  } else {
	    // Export for web browsers and JavaScript engines.
	    var nativeJSON = root.JSON,
	        previousJSON = root["JSON3"],
	        isRestored = false;

	    var JSON3 = runInContext(root, (root["JSON3"] = {
	      // Public: Restores the original value of the global `JSON` object and
	      // returns a reference to the `JSON3` object.
	      "noConflict": function () {
	        if (!isRestored) {
	          isRestored = true;
	          root.JSON = nativeJSON;
	          root["JSON3"] = previousJSON;
	          nativeJSON = previousJSON = null;
	        }
	        return JSON3;
	      }
	    }));

	    root.JSON = {
	      "parse": JSON3.parse,
	      "stringify": JSON3.stringify
	    };
	  }

	  // Export for asynchronous module loaders.
	  if (isLoader) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	      return JSON3;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.e = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module), (function() { return this; }())))

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	module.e = toArray

	function toArray(list, index) {
	    var array = []

	    index = index || 0

	    for (var i = index || 0; i < list.length; i++) {
	        array[i - index] = list[i]
	    }

	    return array
	}


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/utf8js v2.0.0 by @mathias */
	;(function(root) {

		// Detect free variables `exports`
		var freeExports = typeof exports == 'object' && exports;

		// Detect free variable `module`
		var freeModule = typeof module == 'object' && module &&
			module.e == freeExports && module;

		// Detect free variable `global`, from Node.js or Browserified code,
		// and use it as `root`
		var freeGlobal = typeof global == 'object' && global;
		if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
			root = freeGlobal;
		}

		/*--------------------------------------------------------------------------*/

		var stringFromCharCode = String.fromCharCode;

		// Taken from https://mths.be/punycode
		function ucs2decode(string) {
			var output = [];
			var counter = 0;
			var length = string.length;
			var value;
			var extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}

		// Taken from https://mths.be/punycode
		function ucs2encode(array) {
			var length = array.length;
			var index = -1;
			var value;
			var output = '';
			while (++index < length) {
				value = array[index];
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
			}
			return output;
		}

		function checkScalarValue(codePoint) {
			if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
				throw Error(
					'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
					' is not a scalar value'
				);
			}
		}
		/*--------------------------------------------------------------------------*/

		function createByte(codePoint, shift) {
			return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
		}

		function encodeCodePoint(codePoint) {
			if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
				return stringFromCharCode(codePoint);
			}
			var symbol = '';
			if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
				symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
			}
			else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
				checkScalarValue(codePoint);
				symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
				symbol += createByte(codePoint, 6);
			}
			else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
				symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
				symbol += createByte(codePoint, 12);
				symbol += createByte(codePoint, 6);
			}
			symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
			return symbol;
		}

		function utf8encode(string) {
			var codePoints = ucs2decode(string);
			var length = codePoints.length;
			var index = -1;
			var codePoint;
			var byteString = '';
			while (++index < length) {
				codePoint = codePoints[index];
				byteString += encodeCodePoint(codePoint);
			}
			return byteString;
		}

		/*--------------------------------------------------------------------------*/

		function readContinuationByte() {
			if (byteIndex >= byteCount) {
				throw Error('Invalid byte index');
			}

			var continuationByte = byteArray[byteIndex] & 0xFF;
			byteIndex++;

			if ((continuationByte & 0xC0) == 0x80) {
				return continuationByte & 0x3F;
			}

			// If we end up here, it’s not a continuation byte
			throw Error('Invalid continuation byte');
		}

		function decodeSymbol() {
			var byte1;
			var byte2;
			var byte3;
			var byte4;
			var codePoint;

			if (byteIndex > byteCount) {
				throw Error('Invalid byte index');
			}

			if (byteIndex == byteCount) {
				return false;
			}

			// Read first byte
			byte1 = byteArray[byteIndex] & 0xFF;
			byteIndex++;

			// 1-byte sequence (no continuation bytes)
			if ((byte1 & 0x80) == 0) {
				return byte1;
			}

			// 2-byte sequence
			if ((byte1 & 0xE0) == 0xC0) {
				var byte2 = readContinuationByte();
				codePoint = ((byte1 & 0x1F) << 6) | byte2;
				if (codePoint >= 0x80) {
					return codePoint;
				} else {
					throw Error('Invalid continuation byte');
				}
			}

			// 3-byte sequence (may include unpaired surrogates)
			if ((byte1 & 0xF0) == 0xE0) {
				byte2 = readContinuationByte();
				byte3 = readContinuationByte();
				codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
				if (codePoint >= 0x0800) {
					checkScalarValue(codePoint);
					return codePoint;
				} else {
					throw Error('Invalid continuation byte');
				}
			}

			// 4-byte sequence
			if ((byte1 & 0xF8) == 0xF0) {
				byte2 = readContinuationByte();
				byte3 = readContinuationByte();
				byte4 = readContinuationByte();
				codePoint = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
					(byte3 << 0x06) | byte4;
				if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
					return codePoint;
				}
			}

			throw Error('Invalid UTF-8 detected');
		}

		var byteArray;
		var byteCount;
		var byteIndex;
		function utf8decode(byteString) {
			byteArray = ucs2decode(byteString);
			byteCount = byteArray.length;
			byteIndex = 0;
			var codePoints = [];
			var tmp;
			while ((tmp = decodeSymbol()) !== false) {
				codePoints.push(tmp);
			}
			return ucs2encode(codePoints);
		}

		/*--------------------------------------------------------------------------*/

		var utf8 = {
			'version': '2.0.0',
			'encode': utf8encode,
			'decode': utf8decode
		};

		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return utf8;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.e = __WEBPACK_AMD_DEFINE_RESULT__));
		}	else if (freeExports && !freeExports.nodeType) {
			if (freeModule) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = utf8;
			} else { // in Narwhal or RingoJS v0.7.0-
				var object = {};
				var hasOwnProperty = object.hasOwnProperty;
				for (var key in utf8) {
					hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.utf8 = utf8;
		}

	}(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module), (function() { return this; }())))

/***/ },
/* 62 */,
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.e = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 64 */,
/* 65 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ }
/******/ ]);
