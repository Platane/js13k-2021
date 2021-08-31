import { state } from "../state";

export const draw = (ctx: CanvasRenderingContext2D) => {
  ctx.lineWidth = 0.5 / state.camera.a;
  ctx.strokeStyle = "purple";

  state.particlesBoundingBoxes.forEach((bb) =>
    bb.forEach(({ box: [[ax, ay], [bx, by]] }) => {
      ctx.beginPath();
      ctx.strokeRect(ax, ay, bx - ax, by - ay);
    })
  );
};
