import { ctx } from "../../canvas";
import { getBoundingBoxes } from "../../math/boundingBox";
import { boxContainsPoint } from "../../math/box";
import { dMin, gauss, threshold } from "../../math/gauss";
import type { Vec2 } from "../../math/types";
import { state } from "../../state";
import { unProj } from "../../system/camera";
import { s, texturesData } from "./textures";

export const drawBlobs = () => {
  const [width, height] = state.viewportDimensions;

  const resolution = Math.floor(Math.sqrt(width * height) / 120) + 1;

  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;

  const boxes = getBoundingBoxes(state.particlesPositions, dMin * 1.5);

  for (let sx = 0; sx < width; sx += resolution)
    for (let sy = 0; sy < height; sy += resolution) {
      let bestI = 0;
      let bestSum = 0;

      unProj(c, sx + resolution / 2, sy + resolution / 2);

      boxes.forEach(({ box, indexes }) => {
        if (boxContainsPoint(box, c)) {
          for (let k = indexes.length; k--; ) {
            const sum = indexes[k].reduce((sum, i) => {
              const [x, y] = state.particlesPositions[k][i];
              const d = Math.hypot(x - c[0], y - c[1]);
              const g = gauss(d);
              return sum + g;
            }, 0);

            if (sum > bestSum) {
              bestSum = sum;
              bestI = k;
            }
          }
        }
      });

      if (bestSum > threshold) {
        const texture = texturesData[bestI];

        for (let dx = 0; dx < resolution; dx++)
          for (let dy = 0; dy < resolution; dy++) {
            const ty = (sy + dy) % s;
            const tx = (sx + dx + (Math.floor(sy / s) % 2) * s * 0.5) % s;

            const i = ((sy + dy) * width + (sx + dx)) * 4;
            const j = (ty * s + tx) * 4;

            for (let k = 4; k--; ) data[i + k] = texture[j + k];
          }
      }
    }

  ctx.putImageData(imageData, 0, 0);
};

const c: Vec2 = [0, 0];
