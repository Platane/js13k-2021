import { vec2 } from "gl-matrix";
import { Vec2 } from "../math/types";
import { state } from "../state";

const aPool = Array.from({ length: 3 }, () =>
  Array.from({ length: 300 }, () => [0, 0] as Vec2)
);

const dt = 1 / 60;

const neighborForce = (d: number) => {
  if (d < 1000) d = 1000;

  const repulsion = 16000;
  const friendliness = 0.1;
  const d0 = 4000;
  const bump = 10;

  const u = repulsion / d;

  return (
    u * u * u - friendliness * Math.exp((-(d - d0) * (d - d0)) / (bump * bump))
  );
};
const repulsionForce = (d: number) => {
  return 0;
};

const targetForce = 12000;

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
        vec2.scaleAndAdd(a, a, v, targetForce);
      }
    })
  );

  // repulsion forces
  state.particlesPositions.forEach((positions, k1) =>
    positions.forEach((p1, i1) => {
      const a1 = aPool[k1][i1];

      for (let k2 = 0; k2 <= k1; k2++)
        for (
          let i2 = 0;
          i2 < (k1 === k2 ? i1 : state.particlesPositions[k2].length);
          i2++
        ) {
          const p2 = state.particlesPositions[k2][i2];
          const a2 = aPool[k2][i2];

          vec2.sub(v, p2, p1);
          const l = vec2.length(v);
          const f = k1 === k2 ? neighborForce(l) : repulsionForce(l);

          vec2.scaleAndAdd(a1, a1, v, -f / l);
          vec2.scaleAndAdd(a2, a2, v, f / l);
        }
    })
  );

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
          (i) => vec2.distance(state.particlesPositions[k][i], t) < 1000
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
