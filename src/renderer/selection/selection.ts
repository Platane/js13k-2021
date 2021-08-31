import { state } from "../../state";

export const draw = (ctx: CanvasRenderingContext2D) => {
  ctx.lineWidth = 0.5 / state.camera.a;
  ctx.strokeStyle = "#000";

  if (state.selection.rect) {
    const [[ax, ay], [bx, by]] = state.selection.rect;

    ctx.strokeRect(ax, ay, bx - ax, by - ay);
  }
};
