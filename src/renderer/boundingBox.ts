import { State } from "../state";

export const draw = (ctx: CanvasRenderingContext2D, state: State) => {
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = "purple";

  state.particlesBoundingBoxes.forEach((bb) =>
    bb.forEach(({ box: [[ax, ay], [bx, by]] }) => {
      ctx.beginPath();
      ctx.strokeRect(ax, ay, bx - ax, by - ay);
    })
  );
};
