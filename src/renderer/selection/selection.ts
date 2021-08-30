import { State } from "../../state";

export const draw = (
  ctx: CanvasRenderingContext2D,
  selection: State["selection"]
) => {
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = "#000";

  if (selection.rect) {
    const [[ax, ay], [bx, by]] = selection.rect;

    ctx.strokeRect(ax, ay, bx - ax, by - ay);
  }
};
