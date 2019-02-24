/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
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
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
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
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "38302b8849e2ca4183ec"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
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
/******/ 			_main: hotCurrentChildModule !== moduleId,
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
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
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
/******/ 		hotCurrentChildModule = undefined;
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
/******/ 	var hotAvailableFilesMap = {};
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
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
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
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
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
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
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
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
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
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
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
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
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
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
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
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
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
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
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
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
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
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
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
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
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
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(3)(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(undefined);
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Inconsolata|Playfair+Display|Raleway);", ""]);

// module
exports.push([module.i, "body {\n  font-family: \"Inconsolata\", mono;\n  font-size: 15px;\n  /*! background-image: url(\"https://images.pexels.com/photos/459319/pexels-photo-459319.jpeg\"); */\n  background-size: cover;\n  background-color: #E0D5B7;\n  padding: 30px 30px;\n  margin: 30px;\n  border: 5px solid #474547;\n  color: #474547;\n}\n\nselect, textarea, input[type=\"text\"], input[type=\"password\"], input[type=\"datetime\"], input[type=\"datetime-local\"], input[type=\"date\"], input[type=\"month\"], input[type=\"time\"], input[type=\"week\"], input[type=\"number\"], input[type=\"email\"], input[type=\"url\"], input[type=\"search\"], input[type=\"tel\"], input[type=\"color\"], .uneditable-input {\n  font-family: \"Raleway\", sans-serif;\n  border-radius: 0;\n  color: #474547;\n  background: #B0AA92;\n  border: none;\n  \n}\n\nh1 {\n  text-align: center;\n  font-family: \"Playfair Display\", serif;\n  font-weight: normal;\n  font-style: italic;\n  font-size: 60px;\n  margin: 60px 0px 30px;\n  padding: 0px 0px;\n  line-height: 1em;\n}\n\nh2, h3, h4, h5 {\n  letter-spacing: 1.5px;\n  text-align: center;\n  text-transform: uppercase;\n  font-family: \"Playfair Display\", sans-serif;\n  font-weight: normal;\n}\n\nh2 {\n  margin: 30px 0 15px;\n  font-size: 40px;\n}\n\nh3 {\n  margin: 30px 0 15px;\n  font-size: 30px;\n}\n\na {\n  color: inherit;\n  border-bottom: 1px dotted #474547;\n}\n\na:hover {\n  color: #ad5e39;\n  text-decoration: none;\n  border-bottom: 1px dotted #ad5e39;\n}\n\ndiv#body {\n  margin: 0 80px;\n}\n\npre {\n  padding: 10px 10px;\n  color: #474547;\n  font-family: \"Inconsolata\", mono;\n  border-radius: 0;\n  border: none;\n  border-top: 2px solid #474547;\n  border-bottom: 2px solid #474547;\n  background: none;\n}\n\n.input-append .active {\n  border: 1px solid #ccc;\n}\n\n#time-converter-form {\n  margin: 0 auto;\n  display: flex;\n  flex-flow: row wrap;\n  align-items: baseline;\n  align-content: stretch;\n  justify-content: center;\n}\n\n#rl-time-body, #z-time-body {\n  text-align: center;\n  margin: 10px 0 10px 0;\n  flex-grow: 1;\n}\n\n#zalanthan-time-form {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-flow: column wrap;\n}\n\n#zalanthan-time-form > div {\n  margin: 0 10px 0 10px;\n}\n\n#zalanthan-time {\n  text-align: center;\n  margin: 20px auto;\n  max-width: 500px;\n}\n\n#rl-time {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-evenly;\n  flex-direction: column;\n}\n\n#local-time-container {\n  margin: 5px 0;\n}\n\n#local-time-time {\n  font-size: 30px;\n  line-height: 1.5em;\n}\n\n#local-time-date {\n  font-size: 20px;\n}\n\n#edt-time {\n  font-style: italic;\n}\n\n#datetimepicker-input {\n  width: 40%;\n  border: none;\n  border-radius: 0;\n  background: none;\n  box-shadow: none;\n  border-bottom: 1px solid #474547;\n  color: #474547;\n}\n\n.input-append .add-on, .input-prepend .add-on {\n  height: 1.5em;\n  background: #474547;\n  color: #E0D5B7;\n  border: none;\n}\n\n.add-on .icon-th {\n  background-image: url(\"https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.2/img/glyphicons-halflings-white.png\")\n}\n\n#today-btn {\n  text-transform: uppercase;\n  border-radius: 0px;\n  margin-left: 5px;\n}\n\nbutton.btn {\n  font-family: \"Inconsolata\", serif;\n  height: 2.1em;\n  color: #E0D5B7;\n  background: #474547;\n  border: none;\n  border-radius: 0;\n  text-shadow: none;\n  box-shadow: none;\n}\n\nbutton.btn:hover {\n  background: #ad5e39;\n  color: #E0D5B7;\n}\n\n.btn-group > .btn:focus, .btn:focus, .btn-group > .btn:active, .btn:active, .btn-group > .btn.active, .btn.active {\n  height: 2.1em;\n  background: #B0AA92;\n  color: #E0D5B7;\n  box-shadow: none;\n  border: none;\n  text-shadow: none;\n  box-shadow: none;\n}\n\n.timezone-picker > #local-btn {\n  -moz-border-radius: 0px;\n  -webkit-border-radius: 0px;\n  border-radius: 0px 0px 0px 0px;\n}\n\n.timezone-picker .fa {\n  margin-bottom: -5px;\n}\n\n.alert, .alert-info {\n  background: #ad5e39;\n  color: #e0d5b7;\n  text-shadow: none;\n  border-radius: 0;\n  border: 1px solid #AD8B72;\n  margin: 0;\n}\n\n.alert > a, .alert-info > a {\n border-bottom: 1px dotted #e0d5b7;\n}\n\n.alert > a:hover, .alert-info > a:hover {\n  color: #474547;\n  border-bottom: 1px dotted #474547;\n}\n\n.nav-pills {\n  margin-bottom: 0;\n  margin-top: 5px;\n  display: inline-block;\n}\n\n.nav-tabs > li > a,\n.nav-pills > li > a {\n  padding: 5px;\n  margin: 0;\n  margin: 5px 12px;\n  box-shadow: none;\n  border-radius: 0;\n}\n\n.nav-pills > .active > a, .nav-pills > .active > a:hover, .nav-pills > .active > a:focus {\n  color:#474547;\n  background: #B0AA92;\n}\n\n#conversion {\n  text-align: initial;\n}\n\n@media screen and (max-width: 500px) {\n  h1 {\n    font-size: 50px;\n  }\n  \n  body {\n    padding: 5px;\n    margin: 5px;\n  }\n\n  div#body {\n    margin: 0 5px;\n  }\n}\n", ""]);

// exports


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = "<!DOCTYPE html>\n<html>\n<head>\n    <meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\" />\n    <meta name=\"viewport\" content=\"width=device-width\" /> \n    <title>Armageddon Time Converter</title>\n    <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.2/css/bootstrap.min.css\" type=\"text/css\">\n    <link rel=\"stylesheet\" type=\"text/css\" media=\"screen\" href=\"https://cdnjs.cloudflare.com/ajax/libs/smalot-bootstrap-datetimepicker/2.4.4/css/bootstrap-datetimepicker.min.css\">\n    <link rel=\"stylesheet\" type=\"text/css\" href=\"https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css\">\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js\" type=\"text/javascript\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.2/js/bootstrap.min.js\" type=\"text/javascript\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js\" type=\"text/javascript\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone-with-data.min.js\" type=\"text/javascript\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/smalot-bootstrap-datetimepicker/2.4.4/js/bootstrap-datetimepicker.min.js\" type=\"text/javascript\"></script>\n</head>\n<body>\n    <h1>Armageddon Time Converter</h1>\n    <div id=\"body\">\n    <div id=\"zalanthan-time\">\n        It is currently <span id=\"zalanthan-hour\"></span> on the day of <span id=\"zalanthan-day-name\"></span>, the <span id=\"zalanthan-day\"></span> day of the <span id=\"zalanthan-month\"></span>, in the year of <span id=\"zalanthan-year-name\"></span>, year <span id=\"zalanthan-year\"></span> of the <span id=\"zalanthan-age\"></span> age.\n        <div id=\"rl-time\">\n            <div id=\"local-time-container\" title=\"Local time\">\n                <div id=\"local-time-time\"></div>\n                <div id=\"local-time-date\"></div>\n            </div>\n            <div>\n                <a id=\"edt-time\" title=\"Server time (Eastern Time)\"></a>\n            </div>\n        </div>\n    </div>\n    <div id=\"time-converter-form\">\n        <div id=\"rl-time-body\">\n            <h3>RL Time</h3>\n            <div class=\"input-append date\" id=\"datetimepicker\">\n                <input size=\"16\" type=\"text\" id=\"datetimepicker-input\">\n                <span class=\"add-on\"><i class=\"icon-th\"></i></span>\n                <div class=\"btn-group timezone-picker\" data-toggle=\"buttons-radio\">\n                    <button type=\"button\" class=\"btn\" id=\"local-btn\" type=\"button\" title=\"Local\"><i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i></button>\n                    <button type=\"button\" class=\"btn active\" id=\"server-btn\" title=\"Server\"><i class=\"fa fa-globe\" aria-hidden=\"true\"></i></button>\n                </div>\n                <button id=\"today-btn\" type=\"button\" class=\"btn\">Today</button>\n            </div>\n        </div>\n        <div id=\"z-time-body\">\n            <h3>Zalanthan Time</h3>\n            <form id=\"zalanthan-time-form\">\n                <div>\n                    <select id=\"hour-selector\">\n                        <option disabled selected value=\"\">-- select hour --</option>\n                        <option value=\"1\">before dawn</option>\n                        <option value=\"2\">dawn</option>\n                        <option value=\"3\">early morning</option>\n                        <option value=\"4\">late morning</option>\n                        <option value=\"5\">high sun</option>\n                        <option value=\"6\">early afternoon</option>\n                        <option value=\"7\">late afternoon</option>\n                        <option value=\"8\">dusk</option>\n                        <option value=\"9\">late at night</option>\n                    </select>\n                </div>\n                <div>\n                    <input id=\"day-selector\" type=\"number\" min=\"1\" max=\"231\" size=\"20\" placeholder=\"day of month\">\n                </div>\n                <div>\n                    <select id=\"month-selector\">\n                        <option disabled selected value>-- select month --</option>\n                        <option value=\"1\">Descending Sun</option>\n                        <option value=\"2\">Low Sun</option>\n                        <option value=\"3\">Ascending Sun</option>\n                    </select>\n                </div>\n                <div>\n                    <input id=\"year-selector\" type=\"number\" min=\"1\" max=\"77\" size =\"30\" placeholder=\"year\">\n                </div>\n                <div>\n                    <input id=\"age-selector\" type=\"number\" placeholder=\"age\">\n                </div>\n        </ul>\n            </form>\n        </div>\n    </div>\n    <h2>Help: Time</h2>\n    <div class=\"alert alert-info\">\n        Refer to Armageddon's <a href=\"http://armageddon.org/help/view/time\">Time</a> help file for more information.\n    </div>\n    <ul class=\"nav nav-pills\">\n    <li class=\"nav-item\">\n        <a class=\"nav-link\" data-toggle=\"tab\" href=\"#days\" role=\"tab\">Days</a>\n    </li>\n    <li class=\"nav-item\">\n        <a class=\"nav-link\" data-toggle=\"tab\" href=\"#hours\" role=\"tab\">Hours</a>\n    </li>\n    <li class=\"nav-item\">\n        <a class=\"nav-link\" data-toggle=\"tab\" href=\"#months\" role=\"tab\">Months</a>\n    </li>\n    <li class=\"nav-item\">\n        <a class=\"nav-link\" data-toggle=\"tab\" href=\"#conversion\" role=\"tab\">Conversion</a>\n    </li>\n    </ul>\n    \n    <div class=\"tab-content\">\n        <div class=\"tab-pane\" id=\"days\" role=\"tabpanel\">\n            <pre><code>Days of the Week (11)\nOcandra\nTerrin\nAbid\nCingel\nNekrete\nWaleuk\nYochem\nHuegel\nDzeda\nBarani\nDetal</code></pre>\n        </div>\n        <div class=\"tab-pane\" id=\"hours\" role=\"tabpanel\">\n            <pre><code>Hours in the Day (9)\nbefore dawn\ndawn\nearly morning\nlate morning\nhigh sun\nearly afternoon\nlate afternoon\ndusk\nlate at night</code></pre>\n        </div>\n        <div class=\"tab-pane\" id=\"months\" role=\"tabpanel\">\n            <pre><code>Months in the Year (3)  \nDescending Sun \nLow Sun \nAscending Sun</code></pre>\n        </div>\n        <div class=\"tab-pane\" id=\"conversion\" role=\"tabpanel\">\n            <pre><code>Real Time -> Zalanthan Time  \n     10 RL mins      = 1 ZT hour \n     1 RL day        = 16 ZT days \n     1 RL week       = ~0.5 ZT month \n     1 RL month      = ~2 ZT months \n     1 RL year       = ~8.5 ZT years\n          \nZalanthan Time -> Real Time  \n     1 ZT hour       = 10 RL mins \n     1 ZT day        = 90 RL mins \n     1 ZT week       = 16.5 RL hours \n     1 ZT month      = ~2 RL weeks \n     1 ZT year       = ~43 RL days</code></pre>\n        </div>\n    </div>\n    </div>\n</body>\n</html>\n"

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(0);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(6)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(0, function() {
			var newContent = __webpack_require__(0);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(4);
__webpack_require__(1);
module.exports = __webpack_require__(2);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_styles_css__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_styles_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__css_styles_css__);
__webpack_require__(1);


(function () {
  const rLMinutesPerZTHour = 10;
  const zTHoursPerZTDay = 9;
  const zTDaysPerZTWeek = 11;
  const zTWeeksPerZTMonth = 21;
  const zTDaysPerZTMonth = 231;
  const zTMonthsPerZTYear = 3;
  const zTYearsPerZTAge = 77;
  const momentFormat = "YYYY-MM-DD HH:mm";
  let realTimeInterval;

  const hoursInDay = ["before dawn", "dawn", "early morning", "late morning", "high sun", "early afternoon", "late afternoon", "dusk", "late at night"];
  const daysInWeek = ["Ocandra", "Terrin", "Abid", "Cingel", "Nekrete", "Waleuk", "Yochem", "Huegel", "Dzeda", "Barani", "Detal"];
  const monthsInYear = ["Descending Sun", "Low Sun", "Ascending Sun"];
  const yearEntitySymbols = ["Jihae's", "Drov's", "Desert's", "Ruk's", "Whira's", "Dragon's", "Vivadu's", "King's", "Silt's", "Suk-krath's", "Lirathu's"];
  const yearMoodSymbols = ["Anger", "Peace", "Vengeance", "Slumber", "Defiance", "Reverence", "Agitation"];

  const baseTime = new Date("6/14/2012 21:00:00 UTC");
  const baseZTHourOfDay = 1;
  const baseZTDay = 1;
  const baseZTMonth = 1;
  const baseZTYear = 1;
  const baseZTAge = 22;
  const baseTimeInHours = baseZTAge * (77 * 3 * 231 * 9) + (baseZTYear - 1) * (3 * 231 * 9) + (baseZTMonth - 1) * (231 * 9) + (baseZTDay - 1) * 9 + (baseZTHourOfDay - 1);
  const baseTimeInDays = baseTimeInHours / 9;
  const baseTimeInMonths = baseTimeInDays / 231;
  const baseTimeInYears = baseTimeInMonths / 3;
  const baseTimeInAges = baseTimeInYears / 77;

  Number.prototype.mod = function (n) {
    return (this % n + n) % n;
  };

  Number.prototype.nth = function () {
    const n = this % 10;
    const n2 = this % 100;
    const numString = String(this);

    if (n == 2 && n2 != 12) return numString + "nd";else if (n == 2 && n2 == 12) return numString + "th";
    if (n == 3 && n2 != 13) return numString + "rd";else if (n == 3 && n2 == 13) return numString + "th";
    if (n == 1 && n2 != 11) return numString + "st";else if (n == 1 && n2 == 11) return numString + "th";
    return numString + "th";
  };

  const getZTTime = function (time) {
    const timeOffset = time.getTime() - baseTime.getTime();
    const timeOffsetInMins = timeOffset / 1000 / 60;
    const timeOffsetInZTHours = timeOffsetInMins / 10;
    const timeOffsetInZTDays = timeOffsetInZTHours / 9;
    const timeOffsetInZTMonths = timeOffsetInZTDays / 231;
    const timeOffsetInZTYears = timeOffsetInZTMonths / 3;
    const timeOffsetInZTAges = timeOffsetInZTYears / 77;

    const timeInZTHours = timeOffsetInZTHours + baseTimeInHours;
    const timeInZTDays = timeOffsetInZTDays + baseTimeInDays;
    const timeInZTMonths = timeOffsetInZTMonths + baseTimeInMonths;
    const timeInZTYears = timeOffsetInZTYears + baseTimeInYears;
    const timeInZTAges = timeOffsetInZTAges + baseTimeInAges;

    const zTHour = Math.floor(timeInZTHours).mod(9) + 1;
    const zTDay = Math.floor(timeInZTDays).mod(231) + 1;
    const zTDayOfWeek = Math.floor(timeInZTDays).mod(11) + 1;
    const zTMonth = Math.floor(timeInZTMonths).mod(3) + 1;
    const zTYear = Math.floor(timeInZTYears).mod(77) + 1;
    const zTAge = Math.floor(timeInZTAges);

    return {
      hourNum: zTHour,
      hour: hoursInDay[zTHour - 1],
      day: daysInWeek[zTDayOfWeek - 1],
      dayOfMonth: zTDay,
      month: zTMonth,
      monthName: monthsInYear[zTMonth - 1],
      year: zTYear,
      yearName: yearEntitySymbols[(zTYear - 1).mod(11)] + " " + yearMoodSymbols[(zTYear - 1).mod(7)],
      age: zTAge.valueOf()
    };
  };

  const calculateRLTime = function (time) {
    // should be passed objects with the properties hour, day, month, year, and age.
    const timeInZTHours = time.age * 77 * 3 * 231 * 9 + (time.year - 1) * 3 * 231 * 9 + (time.month - 1) * 231 * 9 + (time.day - 1) * 9 + (time.hour - 1);

    const offsetInZTHours = timeInZTHours - baseTimeInHours;
    const offsetInRLMinutes = offsetInZTHours * 10;
    const offsetInRLSeconds = offsetInRLMinutes * 60;
    const offsetInRLMilliseconds = offsetInRLSeconds * 1000;

    const unixTime = baseTime.getTime() + offsetInRLMilliseconds;
    const dateObj = new Date(unixTime);
    console.log(dateObj);
    return dateObj;
  };

  const setTimeHTML = function (dateObj, ignoreSelector, keepIntervalRunning) {
    if (!keepIntervalRunning) {
      clearInterval(realTimeInterval);
      realTimeInterval = false;
    } else if (!realTimeInterval) {
      startTimeInterval();
    }

    const currTime = getZTTime(dateObj);

    const serverTime = moment.tz(dateObj, "America/New_York");
    const localTime = moment(dateObj);

    $("#local-time-time").text(localTime.format("h:mm:ss A"));
    $("#local-time-date").text(localTime.format("dddd, MMMM D, YYYY"));
    $("#edt-time").text(serverTime.format("h:mm A dddd, MMMM D, YYYY z"));
    $("#edt-time").attr("href", serverTime.format("#YYYY-MM-DD HH:mm"));
    $("#zalanthan-hour").text(currTime.hour);
    $("#zalanthan-day-name").text(currTime.day);
    $("#zalanthan-day").text(currTime.dayOfMonth.nth());
    $("#zalanthan-month").text(currTime.monthName);
    $("#zalanthan-year-name").text(currTime.yearName);
    $("#zalanthan-year").text(currTime.year);
    $("#zalanthan-age").text(currTime.age.nth());

    if (!ignoreSelector) {
      $("#hour-selector").val(currTime.hourNum);
      $("#day-selector").val(currTime.dayOfMonth);
      $("#month-selector").val(currTime.month);
      $("#year-selector").val(currTime.year);
      $("#age-selector").val(currTime.age);
    } else {
      $("#hour-selector").val('');
      $("#day-selector").val('');
      $("#month-selector").val('');
      $("#year-selector").val('');
      $("#age-selector").val('');
    }
  };

  const startTimeInterval = function () {
    realTimeInterval = window.setInterval(() => {
      setTimeHTML(moment().toDate(), true, true);
    }, 100);
  };

  $(window).on("load", function () {
    const pickerEl = $("#datetimepicker");
    const pickerInput = $("#datetimepicker-input");
    const todayBtn = $("#today-btn");
    const formats = [momentFormat, "YYYY-MM-DD hh:mm A", "YYYY-MM-DD hh:mm a"];
    let current = moment();

    pickerEl.datetimepicker({
      format: "yyyy-mm-dd hh:ii",
      timezone: "ET"
    });

    if (document.URL.indexOf("#") + 1 > 0) {
      let hashVal = decodeURI(document.URL.slice(document.URL.indexOf("#") + 1));
      current = moment.tz(hashVal, "America/New_York");
    }

    if (location.search) {
      let queries = location.search.substr(1).split("&");

      queries = queries.map(function (query) {
        return query.split("=");
      });

      let matchQuery = queries.find(function (query) {
        if (query.indexOf("t") != -1) return true;
        return false;
      });

      current = moment.tz(decodeURI(matchQuery[1]), "America/New_York");
    }

    pickerInput.val(current.tz("America/New_York").format(momentFormat));
    setTimeHTML(current.toDate(), true);

    todayBtn.click(function () {
      let val = moment();

      if ($("#local-btn").hasClass("active")) {
        pickerInput.val(val.format(momentFormat));
      } else {
        pickerInput.val(val.tz("America/New_York").format(momentFormat));
      }

      setTimeHTML(val.toDate(), true, true);
      console.log("Date changed:", val);

      // clear hash value
      history.pushState("", document.title, window.location.pathname + window.location.search);
    });

    pickerEl.on("changeDate", function () {
      let val = $("#datetimepicker-input").val();
      if (!moment(val, momentFormat, true).isValid()) return false;

      console.log("Date changed:", val);
      // If set to local time, convert value to New York time and set hash to that value
      if ($("#local-btn").hasClass("active")) {
        let time = moment(val, momentFormat);
        window.location.hash = "#" + time.tz("America/New_York").format(momentFormat);
        setTimeHTML(time.toDate());
      } else {
        window.location.hash = "#" + val;
        setTimeHTML(moment.tz(val, momentFormat, "America/New_York").toDate());
      }
    });

    $("#zalanthan-time-form").change(function (e) {
      let hour = parseInt($("#hour-selector").val()),
          day = parseInt($("#day-selector").val()),
          month = parseInt($("#month-selector").val()),
          year = parseInt($("#year-selector").val()),
          age = parseInt($("#age-selector").val());

      if (isNaN(hour) || isNaN(day) || isNaN(month) || isNaN(year) || isNaN(age)) return false;

      let zalanthanTime = {
        hour: hour,
        day: day,
        month: month,
        year: year,
        age: age
      },
          dateObj = calculateRLTime(zalanthanTime);

      window.location.hash = "#" + encodeURI(moment(dateObj).tz("America/New_York").format(momentFormat));

      setTimeHTML(dateObj, true);
    });

    startTimeInterval();
  });
})();

/***/ }),
/* 5 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(7);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 7 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map