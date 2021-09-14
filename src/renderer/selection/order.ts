import { vec2 } from "gl-matrix";
import { ctx } from "../../canvas";
import { Vec2 } from "../../math/types";
import { state } from "../../state";

export const drawOrder = () => {
  (state.selection.particlesIndexes || []).forEach((i) => {
    const [x, y] = state.particlesPositions[state.selection.k][i];

    ctx.fillStyle = "#aaa";
    ctx.beginPath();
    ctx.arc(x, y, 3.2 * (ctx as any).pixelSize, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.lineWidth = 1 * (ctx as any).pixelSize;

  state.particlesMoveOrders.forEach((orders, k) =>
    orders.forEach((order) => {
      order.indexes.forEach((i) => {
        const p = state.particlesPositions[k][i];

        vec2.subtract(v, order.target.point, p);
        vec2.normalize(v, v);
        vec2.scaleAndAdd(v, p, v, 20 * (ctx as any).pixelSize);

        ctx.beginPath();
        ctx.moveTo(p[0], p[1]);
        ctx.lineTo(v[0], v[1]);
        ctx.stroke();
      });
    })
  );
};

const v: Vec2 = [0, 0];
