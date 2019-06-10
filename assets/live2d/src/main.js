"use strict";

require("./lib/live2d.min");

var _Live2DFramework = require("./lib/Live2DFramework");

var _LAppLive2DManager = require("./LAppLive2DManager");

var _LAppLive2DManager2 = _interopRequireDefault(_LAppLive2DManager);

var _LAppDefine = require("./LAppDefine");

var _LAppDefine2 = _interopRequireDefault(_LAppDefine);

var _MatrixStack = require("./lib/MatrixStack");

var _MatrixStack2 = _interopRequireDefault(_MatrixStack);

var _webglcontext = require("./webglcontext");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// window.onerror = function (msg, url, line, col, error) {
//   let errmsg = "file:" + url + "<br>line:" + line + " " + msg;
//   console.error(errmsg);
// }

var platform = window.navigator.platform.toLowerCase();

var live2DMgr = new _LAppLive2DManager2.default();

var isDrawStart = false;

var gl = null;

var canvas = null;

var dragMgr = null;

var viewMatrix = null;

var projMatrix = null;

var deviceToScreen = null;

var drag = false;

var oldLen = 0;

var lastMouseX = 0;

var lastMouseY = 0;

var isModelShown = 0;

var modelurl = "";

var head_pos = 0.5;

function initL2dCanvas(canvasId) {
    canvas = document.getElementById(canvasId);
    if (canvas.addEventListener) {
        //canvas.addEventListener("mousewheel", mouseEvent);
        window.addEventListener("click", mouseEvent);
        window.addEventListener("mousedown", mouseEvent);
        window.addEventListener("mousemove", mouseEvent);
        window.addEventListener("mouseup", mouseEvent);
        document.addEventListener("mouseout", mouseEvent);
        //canvas.addEventListener("contextmenu", mouseEvent);
        window.addEventListener("touchstart", touchEvent);
        window.addEventListener("touchend", touchEvent);
        window.addEventListener("touchmove", touchEvent);
    }
}

function init(modelurl) {
    var width = canvas.width;
    var height = canvas.height;

    dragMgr = new _Live2DFramework.L2DTargetPoint();

    var ratio = height / width;
    var left = _LAppDefine2.default.VIEW_LOGICAL_LEFT;
    var right = _LAppDefine2.default.VIEW_LOGICAL_RIGHT;
    var bottom = -ratio;
    var top = ratio;

    window.Live2D.captureFrame = false;

    viewMatrix = new _Live2DFramework.L2DViewMatrix();

    viewMatrix.setScreenRect(left, right, bottom, top);

    viewMatrix.setMaxScreenRect(_LAppDefine2.default.VIEW_LOGICAL_MAX_LEFT, _LAppDefine2.default.VIEW_LOGICAL_MAX_RIGHT, _LAppDefine2.default.VIEW_LOGICAL_MAX_BOTTOM, _LAppDefine2.default.VIEW_LOGICAL_MAX_TOP);

    viewMatrix.setMaxScale(_LAppDefine2.default.VIEW_MAX_SCALE);
    viewMatrix.setMinScale(_LAppDefine2.default.VIEW_MIN_SCALE);

    projMatrix = new _Live2DFramework.L2DMatrix44();
    projMatrix.multScale(1, width / height);

    deviceToScreen = new _Live2DFramework.L2DMatrix44();
    deviceToScreen.multTranslate(-width / 2.0, -height / 2.0);
    deviceToScreen.multScale(2 / width, -2 / width);

    gl = getWebGLContext();
    (0, _webglcontext.setContext)(gl);
    if (!gl) {
        console.error("Failed to create WebGL context.");
        if (!!window.WebGLRenderingContext) {
            console.error("Your browser don't support WebGL, check https://get.webgl.org/ for futher information.");
        }
        return;
    }
    window.Live2D.setGL(gl);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    changeModel(modelurl);
    startDraw();
}

function startDraw() {
    if (!isDrawStart) {
        isDrawStart = true;
        (function tick() {
            draw();
            var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

            if (window.Live2D.captureFrame) {
                window.Live2D.captureFrame = false;
                var link = document.createElement('a');
                document.body.appendChild(link);
                link.setAttribute("type", "hidden");
                link.href = canvas.toDataURL();
                link.download = window.Live2D.captureName || 'live2d.png';
                link.click();
            }

            requestAnimationFrame(tick, canvas);
        })();
    }
}

function draw() {
    _MatrixStack2.default.reset();
    _MatrixStack2.default.loadIdentity();
    dragMgr.update();
    live2DMgr.setDrag(dragMgr.getX(), dragMgr.getY());

    gl.clear(gl.COLOR_BUFFER_BIT);

    _MatrixStack2.default.multMatrix(projMatrix.getArray());
    _MatrixStack2.default.multMatrix(viewMatrix.getArray());
    _MatrixStack2.default.push();

    for (var i = 0; i < live2DMgr.numModels(); i++) {
        var model = live2DMgr.getModel(i);

        if (model == null) return;

        if (model.initialized && !model.updating) {
            model.update();
            model.draw(gl);
        }
    }
    _MatrixStack2.default.pop();
}

function changeModel(modelurl) {
    live2DMgr.reloadFlg = true;
    live2DMgr.count++;
    live2DMgr.changeModel(gl, modelurl);
}

function modelScaling(scale) {
    var isMaxScale = viewMatrix.isMaxScale();
    var isMinScale = viewMatrix.isMinScale();

    viewMatrix.adjustScale(0, 0, scale);

    if (!isMaxScale) {
        if (viewMatrix.isMaxScale()) {
            live2DMgr.maxScaleEvent();
        }
    }

    if (!isMinScale) {
        if (viewMatrix.isMinScale()) {
            live2DMgr.minScaleEvent();
        }
    }
}

function transformRange(center, transform, range) {
    var a = {
        x: transform.x - center.x,
        y: transform.y - center.y
    };
    var r = Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2));
    if (r > range) {
        a = {
            x: a.x / r * range + center.x,
            y: a.y / r * range + center.y
        };
        return a;
    } else {
        return transform;
    }
}

function dot(A, B) {
    return A.x * B.x + A.y * B.y;
}

function normalize(x, y) {
    var length = Math.sqrt(x * x + y * y);
    return {
        x: x / length,
        y: y / length
    };
}

function transformRect(center, transform, rect) {
    if (transform.x < rect.left + rect.width && transform.y < rect.top + rect.height && transform.x > rect.left && transform.y > rect.top) return transform;
    var Len_X = center.x - transform.x;
    var Len_Y = center.y - transform.y;

    function angle(Len_X, Len_Y) {
        return Math.acos(dot({
            x: 0,
            y: 1
        }, normalize(Len_X, Len_Y))) * 180 / Math.PI;
    }

    var angleTarget = angle(Len_X, Len_Y);
    if (transform.x < center.x) angleTarget = 360 - angleTarget;
    var angleLeftTop = 360 - angle(rect.left - center.x, (rect.top - center.y) * -1);
    var angleLeftBottom = 360 - angle(rect.left - center.x, (rect.top + rect.height - center.y) * -1);
    var angleRightTop = angle(rect.left + rect.width - center.x, (rect.top - center.y) * -1);
    var angleRightBottom = angle(rect.left + rect.width - center.x, (rect.top + rect.height - center.y) * -1);
    var scale = Len_Y / Len_X;
    var res = {};

    if (angleTarget < angleRightTop) {
        var y3 = rect.top - center.y;
        var x3 = y3 / scale;
        res = {
            y: center.y + y3,
            x: center.x + x3
        };
    } else if (angleTarget < angleRightBottom) {
        var _x = rect.left + rect.width - center.x;
        var _y = _x * scale;
        res = {
            y: center.y + _y,
            x: center.x + _x
        };
    } else if (angleTarget < angleLeftBottom) {
        var _y2 = rect.top + rect.height - center.y;
        var _x2 = _y2 / scale;
        res = {
            y: center.y + _y2,
            x: center.x + _x2
        };
    } else if (angleTarget < angleLeftTop) {
        var _x3 = center.x - rect.left;
        var _y3 = _x3 * scale;
        res = {
            y: center.y - _y3,
            x: center.x - _x3
        };
    } else {
        var _y4 = rect.top - center.y;
        var _x4 = _y4 / scale;
        res = {
            y: center.y + _y4,
            x: center.x + _x4
        };
    }

    return res;
}

function modelTurnHead(event) {
    drag = true;

    var rect = canvas.getBoundingClientRect();

    var sx = transformScreenX(event.clientX - rect.left);
    var sy = transformScreenY(event.clientY - rect.top);
    var target = transformRect({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height * head_pos
    }, {
        x: event.clientX,
        y: event.clientY
    }, rect);
    var vx = transformViewX(target.x - rect.left);
    var vy = transformViewY(target.y - rect.top);

    if (_LAppDefine2.default.DEBUG_MOUSE_LOG) console.log("onMouseMove device( x:" + event.clientX + " y:" + event.clientY + " ) view( x:" + vx + " y:" + vy + ")");

    lastMouseX = sx;
    lastMouseY = sy;

    dragMgr.setPoint(vx, vy);

    //live2DMgr.tapEvent(vx, vy);
}

function modelTapEvent(event) {
    drag = true;

    var rect = canvas.getBoundingClientRect();

    var sx = transformScreenX(event.clientX - rect.left);
    var sy = transformScreenY(event.clientY - rect.top);
    var target = transformRect({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height * head_pos
    }, {
        x: event.clientX,
        y: event.clientY
    }, rect);
    var vx = transformViewX(target.x - rect.left);
    var vy = transformViewY(target.y - rect.top);

    if (_LAppDefine2.default.DEBUG_MOUSE_LOG) console.log("onMouseDown device( x:" + event.clientX + " y:" + event.clientY + " ) view( x:" + vx + " y:" + vy + ")");

    lastMouseX = sx;
    lastMouseY = sy;

    //dragMgr.setPoint(vx, vy); 

    live2DMgr.tapEvent(vx, vy);
}

function followPointer(event) {
    var rect = canvas.getBoundingClientRect();

    var sx = transformScreenX(event.clientX - rect.left);
    var sy = transformScreenY(event.clientY - rect.top);
    var target = transformRect({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height * head_pos
    }, {
        x: event.clientX,
        y: event.clientY
    }, rect);
    var vx = transformViewX(target.x - rect.left);
    var vy = transformViewY(target.y - rect.top);

    if (_LAppDefine2.default.DEBUG_MOUSE_LOG) console.log("onMouseMove device( x:" + event.clientX + " y:" + event.clientY + " ) view( x:" + vx + " y:" + vy + ")");

    if (drag) {
        lastMouseX = sx;
        lastMouseY = sy;
        dragMgr.setPoint(vx, vy);
    }
}

function lookFront() {
    if (drag) {
        drag = false;
    }
    dragMgr.setPoint(0, 0);
}

function sleepy() {
    if (_LAppDefine2.default.DEBUG_LOG) console.log("Set Session Storage.");

    sessionStorage.setItem('Sleepy', '1');
}

function mouseEvent(e) {
    //e.preventDefault();
    if (e.type == "mousewheel") {
        // if (e.clientX < 0 || canvas.clientWidth < e.clientX || 
        // e.clientY < 0 || canvas.clientHeight < e.clientY)
        // {
        //     return;
        // }
        // if (e.wheelDelta > 0) modelScaling(1.1); 
        // else modelScaling(0.9); 
    } else if (e.type == "mousedown") {
        //if("button" in e && e.button != 0) return;
        // modelTurnHead(e);
        modelTapEvent(e);
    } else if (e.type == "mousemove") {
        var Sleepy = sessionStorage.getItem('Sleepy');
        if (Sleepy === '1') {
            sessionStorage.setItem('Sleepy', '0');
        }
        modelTurnHead(e);
    } else if (e.type == "mouseup") {
        if ("button" in e && e.button != 0) return;
        // lookFront();
    } else if (e.type == "mouseout") {
        if (_LAppDefine2.default.DEBUG_LOG) console.log("Mouse out Window.");
        lookFront();
        var SleepyTimer = sessionStorage.getItem('SleepyTimer');
        window.clearTimeout(SleepyTimer);

        SleepyTimer = window.setTimeout(sleepy, 50000);
        sessionStorage.setItem('SleepyTimer', SleepyTimer);
    }
}

function touchEvent(e) {
    var touch = e.touches[0];
    if (e.type == "touchstart") {
        if (e.touches.length == 1) modelTurnHead(touch);
        // onClick(touch);
    } else if (e.type == "touchmove") {
        followPointer(touch);
    } else if (e.type == "touchend") {
        lookFront();
    }
}

function transformViewX(deviceX) {
    var screenX = deviceToScreen.transformX(deviceX);
    return viewMatrix.invertTransformX(screenX);
}

function transformViewY(deviceY) {
    var screenY = deviceToScreen.transformY(deviceY);
    return viewMatrix.invertTransformY(screenY);
}

function transformScreenX(deviceX) {
    return deviceToScreen.transformX(deviceX);
}

function transformScreenY(deviceY) {
    return deviceToScreen.transformY(deviceY);
}

function getWebGLContext() {
    var NAMES = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    for (var i = 0; i < NAMES.length; i++) {
        try {
            var ctx = canvas.getContext(NAMES[i], { premultipliedAlpha: true });
            if (ctx) return ctx;
        } catch (e) {}
    }
    return null;
};

function loadlive2d(id, modelurl, headPos) {
    head_pos = typeof headPos === 'undefined' ? 0.5 : headPos;
    initL2dCanvas(id);
    init(modelurl);
}

window.loadlive2d = loadlive2d;