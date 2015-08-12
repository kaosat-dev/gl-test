//works
function shaderTest2d (gl) {
  var program = makeShader(gl, basicVert, basicFrag)
  gl.useProgram(program)

  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  gl.uniform2f(resolutionLocation, width, height);

  var positionLocation = gl.getAttribLocation(program, "a_position")
  var buffer2 = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer2)
  // setup a rectangle from 10,20 to 80,30 in pixels
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      10, 20,
      80, 20,
      10, 30,
      10, 30,
      80, 20,
      80, 30]), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(positionLocation)
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
}
