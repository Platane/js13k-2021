#version 300 es

precision highp float;
uniform highp usampler2D pointTexture;
uniform highp sampler2D bannerTexture;
uniform highp float tauSquare;
uniform highp float threshold;
uniform int nPoint;
uniform int nK;

in vec2 pixelCoordinate;
out vec4 color;

float gauss(float x) { return exp(-0.5 * (x * x) / (tauSquare)); }

void main() {

  float bestSum = 0.0;
  int bestK = -1;

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
    if (sum > threshold && sum > bestSum) {
      bestSum = sum;
      bestK = k;
    }
  }

  if (bestK >= 0) {

    float m = 20.0;

    float w = 1.0 / float(nK);

    float y = floor(pixelCoordinate.y * m);

    vec2 u = vec2(

        //
        (mod((pixelCoordinate.x) * m + 0.5 * mod(y, 2.0), 1.0) * 0.96 + 0.02)
        *
                w +
            w * float(bestK),
                  mod(pixelCoordinate.y * m, 1.0));

    color = texture(bannerTexture, u);
  } else
    color = vec4(0.0, 0.0, 0.0, 0.0);

  // if (bestK == 0)
  //   color = vec4(1.0, 0.0, 1.0, 1.0);
  // else if (bestK == 1)
  //   color = vec4(0.0, 1.0, 1.0, 1.0);
  // else if (bestK == 2)
  //   color = vec4(0.0, 1.0, 0.0, 1.0);
  // else
  //   color = c;
}
