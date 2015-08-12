attribute vec3 aPosition;
 
uniform mat4 uProjection;
uniform mat4 uModel;
uniform mat4 uView;

 
void main() {
    // - `uProjection` will apply our perspective matrix, and
  // - `uView` will apply our camera transforms.
  // - `uModel` is unused here, but is traditionally used to
  //   move the object around the scene.
  gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
}