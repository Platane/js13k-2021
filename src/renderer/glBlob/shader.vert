#version 300 es

uniform highp mat3 worldMatrix;

in vec2 position;
in float iBox;

out vec2 pos;
flat out int iB;

void main() {

  vec3 p = vec3(position, 1.0);

  gl_Position = vec4(worldMatrix * p, 1.0);

  pos = position.xy;
  iB = int(iBox);
}