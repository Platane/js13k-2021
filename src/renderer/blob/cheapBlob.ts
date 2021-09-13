import { ctx } from "../../canvas";
import { dMin, tau, threshold } from "../../math/gauss";
import { state } from "../../state";
import { colors } from "./textures";

export const drawBlobs = () => {
  state.particlesPositions.forEach((particles, k) => {
    // const pattern = ctx.createPattern(textures[k], "repeat")!;
    ctx.fillStyle = colors[k];

    particles.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, dMin, 0, Math.PI * 2);
      ctx.fill();
    });
  });
};
