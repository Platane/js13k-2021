import { boxContainsPoint } from "../../math/box";
import { gauss, threshold } from "../../math/gauss";
import type { Vec2 } from "../../math/types";
import { state } from "../../state";
import { projX, projY, unProjX, unProjY } from "../../system/camera";
import { colors, s, texturesData } from "./textures";

export const drawParticles = (ctx: CanvasRenderingContext2D) => {
  state.particlesPositions.forEach((particles, i) => {
    for (const [x, y] of particles) {
      ctx.fillStyle = "#333";
      ctx.beginPath();
      ctx.arc(x, y, 5 / state.camera.a, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = colors[i];
      ctx.beginPath();
      ctx.arc(x, y, 3 / state.camera.a, 0, Math.PI * 2);
      ctx.fill();
    }
  });
};

export const drawBlobs = (ctx: CanvasRenderingContext2D) => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const resolution = Math.floor(Math.sqrt(width * height) / 120) + 1;

  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;

  for (let sx = 0; sx < width; sx += resolution)
    for (let sy = 0; sy < height; sy += resolution) {
      let bestI = 0;
      let bestSum = 0;

      c[0] = unProjX(sx + resolution / 2);
      c[1] = unProjY(sy + resolution / 2);

      state.particlesBoundingBoxes.forEach((bb, k) =>
        bb.forEach(({ box, indexes }) => {
          if (boxContainsPoint(box, c)) {
            const sum = indexes.reduce((sum, i) => {
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
        })
      );

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
