attribute vec3 aPosition;
 
uniform mat4 uProjection;
uniform mat4 uModelView;
 
void main() {
  // Multiply the position by the matrix.
  gl_Position = uProjection * uModelView * vec4(aPosition, 1.0);
}