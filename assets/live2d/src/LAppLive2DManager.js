"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = LAppLive2DManager;

var _Live2DFramework = require("./lib/Live2DFramework.js");

var _PlatformManager = require("./PlatformManager");

var _PlatformManager2 = _interopRequireDefault(_PlatformManager);

var _LAppModel = require("./LAppModel");

var _LAppModel2 = _interopRequireDefault(_LAppModel);

var _LAppDefine = require("./LAppDefine");

var _LAppDefine2 = _interopRequireDefault(_LAppDefine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function LAppLive2DManager() {
  // console.log("--> LAppLive2DManager()");


  this.models = [];

  this.count = -1;
  this.reloadFlg = false;

  Live2D.init();
  _Live2DFramework.Live2DFramework.setPlatformManager(new _PlatformManager2.default());
}

LAppLive2DManager.prototype.createModel = function () {

  var model = new _LAppModel2.default();
  this.models.push(model);

  return model;
};

LAppLive2DManager.prototype.changeModel = function (gl, modelurl) {
  // console.log("--> LAppLive2DManager.update(gl)");

  if (this.reloadFlg) {

    this.reloadFlg = false;

    var thisRef = this;
    this.releaseModel(0, gl);
    this.createModel();
    this.models[0].load(gl, modelurl);
  }
};

LAppLive2DManager.prototype.getModel = function (no) {
  // console.log("--> LAppLive2DManager.getModel(" + no + ")");

  if (no >= this.models.length) return null;

  return this.models[no];
};

LAppLive2DManager.prototype.releaseModel = function (no, gl) {
  // console.log("--> LAppLive2DManager.releaseModel(" + no + ")");

  if (this.models.length <= no) return;

  this.models[no].release(gl);

  delete this.models[no];
  this.models.splice(no, 1);
};

LAppLive2DManager.prototype.numModels = function () {
  return this.models.length;
};

LAppLive2DManager.prototype.setDrag = function (x, y) {
  for (var i = 0; i < this.models.length; i++) {
    this.models[i].setDrag(x, y);
  }
};

LAppLive2DManager.prototype.maxScaleEvent = function () {
  if (_LAppDefine2.default.DEBUG_LOG) console.log("Max scale event.");
  for (var i = 0; i < this.models.length; i++) {
    this.models[i].startRandomMotion(_LAppDefine2.default.MOTION_GROUP_PINCH_IN, _LAppDefine2.default.PRIORITY_NORMAL);
  }
};

LAppLive2DManager.prototype.minScaleEvent = function () {
  if (_LAppDefine2.default.DEBUG_LOG) console.log("Min scale event.");
  for (var i = 0; i < this.models.length; i++) {
    this.models[i].startRandomMotion(_LAppDefine2.default.MOTION_GROUP_PINCH_OUT, _LAppDefine2.default.PRIORITY_NORMAL);
  }
};

LAppLive2DManager.prototype.tapEvent = function (x, y) {
  if (_LAppDefine2.default.DEBUG_LOG) console.log("tapEvent view x:" + x + " y:" + y);

  for (var i = 0; i < this.models.length; i++) {

    if (this.models[i].hitTest(_LAppDefine2.default.HIT_AREA_HEAD, x, y)) {

      if (_LAppDefine2.default.DEBUG_LOG) console.log("Tap face.");

      this.models[i].setRandomExpression();
    } else if (this.models[i].hitTest(_LAppDefine2.default.HIT_AREA_BODY, x, y)) {

      if (_LAppDefine2.default.DEBUG_LOG) console.log("Tap body." + " models[" + i + "]");

      this.models[i].startRandomMotion(_LAppDefine2.default.MOTION_GROUP_TAP_BODY, _LAppDefine2.default.PRIORITY_NORMAL);
    } else if (this.models[i].hitTestCustom('head', x, y)) {

      if (_LAppDefine2.default.DEBUG_LOG) console.log("Tap face.");

      this.models[i].startRandomMotion(_LAppDefine2.default.MOTION_GROUP_FLICK_HEAD, _LAppDefine2.default.PRIORITY_NORMAL);
    } else if (this.models[i].hitTestCustom('body', x, y)) {

      if (_LAppDefine2.default.DEBUG_LOG) console.log("Tap body." + " models[" + i + "]");

      this.models[i].startRandomMotion(_LAppDefine2.default.MOTION_GROUP_TAP_BODY, _LAppDefine2.default.PRIORITY_NORMAL);
    }
  }

  return true;
};