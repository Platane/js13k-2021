import { ctx } from "../../canvas";
import { state } from "../../state";
import { colors } from "./textures";

export const drawParticles = () => {
  state.particlesPositions.forEach((particles, i) => {
    for (const [x, y] of particles) {
      ctx.fillStyle = "#333";
      ctx.beginPath();
      ctx.arc(x, y, 5 * (ctx as any).pixelSize, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = colors[i];
      ctx.beginPath();
      ctx.arc(x, y, 3 * (ctx as any).pixelSize, 0, Math.PI * 2);
      ctx.fill();
    }
  });
};
