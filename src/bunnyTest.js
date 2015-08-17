var mat4     = require('gl-mat4')
var fs    = require('fs')
var createOrbitCamera = require("orbit-camera")
var glBuffer = require('gl-buffer')
var glShader = require('gl-shader')
var Geometry = require('gl-geometry')
var bunny    = require('bunny')
var normals  = require('normals')
var box = require('geo-3d-box/es5')({ size: 5 , segments: 2 })

import {makeShader} from './shaderUtils'

export default function test(gl, width, height){

  var projection = mat4.create()
  var model      = mat4.create()
  var view       = mat4.create()

  var camera = createOrbitCamera([0, 0, 1] , [10, 10, 0] , [0, 1, 0])
  //this combo works [0, 0, 1] , [0, 0, 0] , [0, 1, 0]

  var geometry = Geometry(gl)
  geometry.attr('aPosition', box.positions)
  geometry.attr('aNormal', normals.vertexNormals(
      box.cells
    , box.positions
  ))
  geometry.faces(box.cells)


  function setMatrixUniforms(program, projection, model, view) {
    //console.log("setMatrixUniforms",program.uProjection,projection)
    shader.bind()
    shader.uniforms.uProjection = projection
    shader.uniforms.uView  = view
  }

  //program = makeProgram()
  var shader = glShader(gl,
      fs.readFileSync('./shaders/bunny.vert', 'utf8') 
    , fs.readFileSync('./shaders/bunny.frag', 'utf8') 
  )

  function update(timeIdx){
    camera.view(view)

    //camera.rotate([(timeIdx-1)*10,(timeIdx-1)*10], [timeIdx*100,timeIdx*100])//[timeIdx*0.01,timeIdx*0.01])
    camera.pan([timeIdx*0.1,0,0])

    // Calculate projection matrix
    mat4.perspective(projection, Math.PI / 4, width / height, 0.1, 100)


    // Calculate triangle's modelView matrix
    mat4.identity(model, model)
    mat4.translate(model, model, [-1.5, 0, -7])
  }

  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // Sets the viewport, i.e. tells WebGL to draw the
    // scene across the full canvas.
    gl.viewport(0, 0, width, height)

    // Enables depth testing, which prevents triangles
    // from overlapping.
    //gl.enable(gl.DEPTH_TEST)

    // Enables face culling, which prevents triangles
    // being visible from behind.
    //gl.enable(gl.CULL_FACE)


    // Updates our model/view/projection matrices, sending them
    // to the GPU as uniform variables that we can use in
    // `shaders/bunny.vert` and `shaders/bunny.frag`.
    setMatrixUniforms(shader, projection, model, view)
  

    console.log("shader uniforms  done")

    // draw
    geometry.bind(shader)

    // Updates our model/view/projection matrices, sending them
    // to the GPU as uniform variables that we can use in
    // `shaders/bunny.vert` and `shaders/bunny.frag`.
    shader.uniforms.uProjection = projection
    shader.uniforms.uView = view
    shader.uniforms.uModel = model

    // Finally: draws the bunny to the screen! The rest is
    // handled in our shaders.
    geometry.draw(gl.LINES)

  }

  return {render,update}

}
