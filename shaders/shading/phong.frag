#ifdef GL_ES
precision mediump float;
#endif

#pragma glslify: phongSpec = require(glsl-specular-phong) 

varying vec3 vPosition;
varying vec3 vNormal;

uniform vec3 eyePosition;
uniform vec3 lightPosition;
uniform float shininess;
 
void main() {

  vec3 eyeDirection = normalize(eyePosition - vPosition);
  vec3 lightDirection = normalize(lightPosition - vPosition);
  vec3 normal = normalize(vNormal);

  float power = phongSpec(lightDirection, eyeDirection, normal, shininess);

  gl_FragColor = vec4(power,normal.yz, 1.0);
  //gl_FragColor = vec4(power,power,power,1.0);

}