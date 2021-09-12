#version 300 es

precision highp float;
uniform highp usampler2D pointTexture;
uniform highp float tauSquare;
uniform highp float threshold;
uniform int nPoint;
uniform int nK;

in vec2 pixelCoordinate;
out vec4 color;

float gauss(float x) { return exp(-0.5 * (x * x) / (tauSquare)); }

void main() {

  float u = 0.0;

  float best = 0.0;

  color = vec4(0.94, 0.97, 0.96, 1.0);

  for (int k = 0; k < nK; k++) {
    float sum = 0.0;
    for (int i = 0; i < nPoint; i++) {

      uvec2 uPointPosition = texelFetch(pointTexture, ivec2(k, i), 0).xy;
      vec2 pointPosition = vec2(uPointPosition.xy);

      if (pointPosition.x != 0.0 || pointPosition.y != 0.0) {

        float d = distance(pointPosition, pixelCoordinate * 65535.0);

        sum += gauss(d);
      }
    }
    if (sum > threshold && sum > best) {
      best = sum;

      if (k == 0)
        color = vec4(1.0, 0.0, 1.0, 1.0);
      if (k == 1)
        color = vec4(0.0, 1.0, 1.0, 1.0);
      if (k == 2)
        color = vec4(0.0, 1.0, 0.0, 1.0);
    }
  }
}
