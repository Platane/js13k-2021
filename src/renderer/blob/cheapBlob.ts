import { tau, threshold } from "../../math/gauss";
import { state } from "../../state";
import { colors, textures } from "./textures";

export const e = Math.sqrt(-2 * Math.log(threshold) * (tau * tau));

export const drawBlobs = (ctx: CanvasRenderingContext2D) => {
  state.particlesPositions.forEach((particles, k) => {
    // const pattern = ctx.createPattern(textures[k], "repeat")!;
    ctx.fillStyle = colors[k];

    particles.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, e, 0, Math.PI * 2);
      ctx.fill();
    });
  });
};
