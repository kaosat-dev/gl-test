var mat4     = require('gl-mat4')
var fs    = require('fs')
var createOrbitCamera = require("orbit-camera")

import {makeShader} from './shaderUtils'

export default function test(gl, width, height){

  var projection = mat4.create()
  var model      = mat4.create()
  var view       = mat4.create()

  var camera = createOrbitCamera( [0, 0, 1] , [0, 0, 0] , [0, 1, 0])
  //this combo works [0, 0, 1] , [0, 0, 0] , [0, 1, 0]

  var triangleVertexPositionBuffer
  var program


  function makeProgram(){
    let basicFrag = fs.readFileSync('./shaders/basic.frag', 'utf8') 
    let basicVert2 = fs.readFileSync('./shaders/test2.5.vert', 'utf8')

    program = makeShader(gl, basicVert2, basicFrag)
    gl.useProgram(program)
    program.vertexPositionAttribute = gl.getAttribLocation(program, "aPosition")
    gl.enableVertexAttribArray(program.vertexPositionAttribute)

    program.uProjection = gl.getUniformLocation(program, "uProjection")
    program.uModel= gl.getUniformLocation(program, "uModel")
    program.uView = gl.getUniformLocation(program, "uView")

    return program
  }


  function initBuffers(geomBuffer) {
    geomBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, geomBuffer)
    var vertices = [
         0.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
         1.0, -1.0,  0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    geomBuffer.itemSize = 3;
    geomBuffer.numItems = 3;

    /*squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer)
    vertices = [
         1.0,  1.0,  0.0,
        -1.0,  1.0,  0.0,
         1.0, -1.0,  0.0,
        -1.0, -1.0,  0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    squareVertexPositionBuffer.itemSize = 3;
    squareVertexPositionBuffer.numItems = 4;*/
    return geomBuffer
  }


  function setMatrixUniforms(program, projection, model, view) {
    //console.log("setMatrixUniforms",program.uProjection,projection)
    gl.uniformMatrix4fv(program.uProjection, false, projection)
    gl.uniformMatrix4fv(program.uModel, false, model)
    gl.uniformMatrix4fv(program.uView, false, view)
  }

  program = makeProgram()
  triangleVertexPositionBuffer = initBuffers()


  function update(timeIdx){
    camera.view(view)

    mat4.perspective(45, width / height, 0.1, 100.0, projection)
    
    camera.rotate([(timeIdx-1)*10,(timeIdx-1)*10], [timeIdx*100,timeIdx*100])//[timeIdx*0.01,timeIdx*0.01])
    camera.pan([timeIdx*0.1,0,0])
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

    // Binds the geometry and sets up the shader's attribute
    // locations accordingly.
    //geometry.bind(shader)

    // Updates our model/view/projection matrices, sending them
    // to the GPU as uniform variables that we can use in
    // `shaders/bunny.vert` and `shaders/bunny.frag`.
    setMatrixUniforms(program, projection, model, view)
    console.log("shader uniforms  done")

    // draw
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer)
    gl.vertexAttribPointer(program.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems)

  }

  return {render,update}

}
