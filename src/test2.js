var mat4     = require('gl-mat4')
var fs    = require('fs')

import {makeShader} from './shaderUtils'

export function test2(gl, width, height){

  var projection = mat4.create()
  var modelView  = mat4.create()

  var triangleVertexPositionBuffer
  var program


  function makeProgram(){
    let basicFrag = fs.readFileSync('./shaders/basic.frag', 'utf8') 
    let basicVert2 = fs.readFileSync('./shaders/basic2.vert', 'utf8')

    program = makeShader(gl, basicVert2, basicFrag)
    gl.useProgram(program)
    program.vertexPositionAttribute = gl.getAttribLocation(program, "aPosition")
    gl.enableVertexAttribArray(program.vertexPositionAttribute)

    program.uProjection = gl.getUniformLocation(program, "uProjection")
    program.uModelView = gl.getUniformLocation(program, "uModelView")
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


  function setMatrixUniforms(program, projection, modelView) {
    //console.log("setMatrixUniforms",program.uProjection,projection)
    gl.uniformMatrix4fv(program.uProjection, false, projection)
    gl.uniformMatrix4fv(program.uModelView, false, modelView)
  }

  program = makeProgram()
  triangleVertexPositionBuffer = initBuffers()


  function update(timeIdx){
    mat4.perspective(45, width / height, 0.1, 100.0, projection)
    //mat4.identity(view)
    mat4.translate(modelView, modelView, [0.01*timeIdx, 0.0, 0.0])
  }

  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // Sets the viewport, i.e. tells WebGL to draw the
    // scene across the full canvas.
    gl.viewport(0, 0, width, height)
    console.log("viewport done")

    // Enables depth testing, which prevents triangles
    // from overlapping.
    gl.enable(gl.DEPTH_TEST)
    console.log("DEPTH_TEST done")

    // Enables face culling, which prevents triangles
    // being visible from behind.
    gl.enable(gl.CULL_FACE)
    console.log("CULL_FACE done")

    // Binds the geometry and sets up the shader's attribute
    // locations accordingly.
    //geometry.bind(shader)
    console.log("bind shader done")

    // Updates our model/view/projection matrices, sending them
    // to the GPU as uniform variables that we can use in
    // `shaders/bunny.vert` and `shaders/bunny.frag`.
    
    //shader.uniforms.uProjection = projection
    //shader.uniforms.uView = view
    //shader.uniforms.uModel = model
    setMatrixUniforms(program, projection, modelView)
    console.log("shader uniforms  done")

    // draw
    //gl.drawArrays(gl.TRIANGLES, 0, 6)

    // Finally: draws the bunny to the screen! The rest is
    // handled in our shaders.
    //geometry.draw(gl.TRIANGLES)

    //draw stuff
    
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer)
    gl.vertexAttribPointer(program.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)
    setMatrixUniforms(program, projection, modelView)
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems)

  }

  return {render,update}

}
