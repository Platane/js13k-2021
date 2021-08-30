import { gauss, threshold } from "../../math/gauss";
import type { Vec2 } from "../../math/types";
import { s, textures } from "./textures";

export const draw = (ctx: CanvasRenderingContext2D, particleList: Vec2[][]) => {
  drawBlobs(ctx, particleList);
  drawParticles(ctx, particleList);
};

const drawParticles = (
  ctx: CanvasRenderingContext2D,
  particleList: Vec2[][]
) => {
  particleList.forEach((particles, i) => {
    const texture = textures[i];

    const color = `rgb(${texture[0]},${texture[1]},${texture[2]})`;

    for (const [x, y] of particles) {
      ctx.fillStyle = "#333";
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  });
};

const resolution = 4;

const drawBlobs = (ctx: CanvasRenderingContext2D, particleList: Vec2[][]) => {
  const imageData = ctx.getImageData(0, 0, 300, 300);
  const { data, width, height } = imageData;

  for (let sx = 0; sx < width; sx += resolution)
    for (let sy = 0; sy < height; sy += resolution) {
      let bestI = 0;
      let bestSum = 0;

      const cx = sx + resolution / 2;
      const cy = sy + resolution / 2;

      particleList.forEach((particles, i) => {
        const sum = particles.reduce((sum, [x, y]) => {
          const d = Math.hypot(x - cx, y - cy);
          return sum + gauss(d);
        }, 0);

        if (sum > bestSum) {
          bestSum = sum;
          bestI = i;
        }
      });

      if (bestSum > threshold) {
        const texture = textures[bestI];

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
