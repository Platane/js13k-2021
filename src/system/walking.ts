import { vec2 } from "gl-matrix";
import { Vec2 } from "../math/types";
import { state } from "../state";

const aPool = Array.from({ length: 3 }, () =>
  Array.from({ length: 300 }, () => [0, 0] as Vec2)
);

const dt = 1 / 60;

export const onUpdate = () => {
  // reset and static forces
  state.particlesPositions.forEach((positions, k) =>
    positions.forEach((p, i) => {
      const a = aPool[k][i];

      // reset
      a[0] = 0;
      a[1] = 0;

      // target attraction
      const order = state.particlesMoveOrders[k].find((o) =>
        o.indexes.includes(i)
      );

      if (order) {
        const t = order.targets[0];

        vec2.sub(v, t, p);
        vec2.normalize(v, v);
        vec2.scaleAndAdd(a, a, v, 20);
      }
    })
  );

  // repulsion forces
  //

  // apply acceleration
  state.particlesPositions.forEach((positions, k) =>
    positions.forEach((p, i) => {
      const a = aPool[k][i];

      p[0] += a[0] * dt;
      p[1] += a[1] * dt;
    })
  );

  // step move orders
  state.particlesMoveOrders.forEach((orders, k) =>
    orders.forEach((order, i) => {
      const t = order.targets[0];

      if (
        order.indexes.some(
          (i) => vec2.distance(state.particlesPositions[k][i], t) < 10
        )
      ) {
        order.targets.shift();

        if (order.targets.length === 0)
          state.particlesMoveOrders[k].splice(i, 1);
      }
    })
  );
};

const v: Vec2 = [0, 0];
