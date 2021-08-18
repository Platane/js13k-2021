import { vec2 } from "gl-matrix";
import { Vec2 } from "../../math/types";
import { State } from "../../state";

export const draw = (ctx: CanvasRenderingContext2D, state: State) => {
  (state.selection.particlesIndexes || []).forEach((i) => {
    const [x, y] = state.particlesPositions[0][i];

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.lineWidth = 0.5;

  state.particlesMoveOrders.forEach((orders, k) =>
    orders.forEach((order) => {
      const t = order.targets[0];

      order.indexes.forEach((i) => {
        const p = state.particlesPositions[k][i];

        vec2.subtract(v, t, p);
        vec2.normalize(v, v);
        vec2.scaleAndAdd(v, p, v, 10);

        ctx.beginPath();
        ctx.moveTo(p[0], p[1]);
        ctx.lineTo(v[0], v[1]);
        ctx.stroke();
      });
    })
  );
};

const v: Vec2 = [0, 0];
