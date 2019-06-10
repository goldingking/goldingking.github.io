"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setContext = setContext;
exports.getContext = getContext;

var context = undefined;

function setContext(webglContext) {
  context = webglContext;
}

function getContext() {
  return context;
}