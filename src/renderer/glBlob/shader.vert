#version 300 es

uniform highp vec2 camera_a;
uniform highp vec2 camera_offset;

in vec2 position;
in float iBox;

out vec2 pos;
flat out int iB;

// out int iBox2;

void main() {
  gl_Position = vec4(position.xy * camera_a * 2.0 - 1.0, 0.0, 1.0);
  pos = position.xy;
  iB = int(iBox);
}