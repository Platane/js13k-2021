import { ctx } from "../../canvas";
import { state } from "../../state";

export const draw = () => {
  ctx.lineWidth = 0.25 * (ctx as any).pixelSize;
  ctx.strokeStyle = "#000";

  if (state.selection.rect) {
    const [[ax, ay], [bx, by]] = state.selection.rect;

    ctx.strokeRect(ax, ay, bx - ax, by - ay);
  }
};
