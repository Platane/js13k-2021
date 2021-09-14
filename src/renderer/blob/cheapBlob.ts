import { ctx } from "../../canvas";
import { dMin } from "../../math/gauss";
import { state } from "../../state";
import { colors } from "./textures";

export const drawBlobs = () => {
  state.particlesPositions.forEach((particles, k) => {
    ctx.fillStyle = colors[k];

    particles.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, dMin, 0, Math.PI * 2);
      ctx.fill();
    });
  });
};
