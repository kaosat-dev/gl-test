var mat4     = require('gl-mat4')
var fs    = require('fs')

import {makeShader} from './shaderUtils'

export default function test(gl, width, height){

  function update(timeIdx){
  }

  function render() {
    gl.clearColor(1.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Sets the viewport, i.e. tells WebGL to draw the
    // scene across the full canvas.
    gl.viewport(0, 0, width, height)
  }

  return {render,update}

}
