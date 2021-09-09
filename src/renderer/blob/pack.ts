import { getBlobEdge } from "../../math/blob";
import { dMin } from "../../math/gauss";
import { getPack } from "../../math/pack";
import { state } from "../../state";

export const drawPack = (
  ctx: CanvasRenderingContext2D,
  k: number,
  i: number
) => {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(
    state.particlesPositions[k][i][0],
    state.particlesPositions[k][i][1],
    2.4 / state.camera.a,
    0,
    Math.PI * 2
  );
  ctx.fill();

  getPack(state.particlesPositions[k], i).forEach((i) => {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(
      state.particlesPositions[k][i][0],
      state.particlesPositions[k][i][1],
      1.4 / state.camera.a,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });

  {
    const edges = getBlobEdge(state.particlesPositions[k], dMin / 2);

    if (edges) {
      edges.forEach((p) => {
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.arc(p[0], p[1], 3 / state.camera.a, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1.4 / state.camera.a;
      ctx.beginPath();
      ctx.moveTo(edges[edges.length - 1][0], edges[edges.length - 1][1]);
      edges.forEach((p) => {
        ctx.lineTo(p[0], p[1]);
      });
      ctx.stroke();
    }
  }
};
