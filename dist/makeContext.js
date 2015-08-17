'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.makeMesaContext = makeMesaContext;
exports.makeDefaultContext = makeDefaultContext;

function makeMesaContext() {
  var width = arguments.length <= 0 || arguments[0] === undefined ? 128 : arguments[0];
  var height = arguments.length <= 1 || arguments[1] === undefined ? 128 : arguments[1];
  var bpp = arguments.length <= 2 || arguments[2] === undefined ? 32 : arguments[2];

  var osmesa = require('osmesa-webgl');
  var context = osmesa.CreateContext(width, height);
  var gl = osmesa;

  var buffer = new Uint8Array(width * height * bpp / 8); ///RGBA
  osmesa.MakeCurrent(context, buffer, width, height);

  return { buffer: buffer, context: context, gl: gl };
}

function makeDefaultContext() {
  var width = arguments.length <= 0 || arguments[0] === undefined ? 128 : arguments[0];
  var height = arguments.length <= 1 || arguments[1] === undefined ? 128 : arguments[1];
  var bpp = arguments.length <= 2 || arguments[2] === undefined ? 32 : arguments[2];

  var getContext = require('get-canvas-context');
  var context = getContext('webgl', { width: width, height: height });

  return { context: context };
}