#version 300 es

precision highp float;
uniform highp usampler2D pointTexture;
uniform highp sampler2D bannerTexture;
uniform highp float tauSquare;
uniform highp float threshold;
uniform int nPoint;
uniform int nK;

in vec2 pos;
flat in int iB;

out vec4 color;

float gauss(float x) { return exp(-0.5 * (x * x) / (tauSquare)); }

void main() {

  // color = vec4(0.0, 0.0, 0.0, 0.05);

  float bestSum = 0.0;
  int bestK = -1;

  for (int k = 0; k < nK; k++) {
    float sum = 0.0;
    for (int i = 0; i < nPoint; i++) {

      uvec2 uPointPosition =
          texelFetch(pointTexture, ivec2(iB * nK + k, i), 0).xy;
      vec2 pointPosition = vec2(uPointPosition.xy);

      if (pointPosition.x != 0.0 || pointPosition.y != 0.0) {

        float d = distance(pointPosition, pos);

        sum += gauss(d);
      }
    }
    if (sum > threshold && sum > bestSum) {
      bestSum = sum;
      bestK = k;
    }
  }

  if (bestK >= 0) {

    float m = 0.0006;

    float w = 1.0 / float(nK);

    float y = floor(pos.y * m);

    vec2 u = vec2(

        //
        (mod((pos.x) * m + 0.5 * mod(y, 2.0), 1.0) * 0.96 + 0.02) * w +
            w * float(bestK),

        //
        mod(pos.y * m, 1.0) * 0.96 + 0.02);

    color = texture(bannerTexture, u);
    color.w = (bestSum - threshold) / (threshold * 0.1);
  }
}
