import { vec2 } from "gl-matrix";
import { dMin } from "../math/gauss";
import { Vec2 } from "../math/types";
import { MoveOrder, state } from "../state";

const aPool = state.particlesPositions.map(() =>
  Array.from({ length: 300 }, () => [0, 0] as Vec2)
);
const orders = state.particlesPositions.map(() =>
  Array.from({ length: 300 }, () => undefined as undefined | MoveOrder)
);

const dt = 1 / 60;

export const neighborForce = (d: number) => {
  if (d < 600) d = 600;

  const repulsionAmplitude = 2000;
  const attractionAmplitude = 2;
  const d0 = dMin;
  const bump = 800;

  const u = repulsionAmplitude / d;

  let f = (1000 * 2000 * 2000) / (d * d);

  // let f =
  //   1000 *
  //   (u * u -
  //     attractionAmplitude * Math.exp((-(d - d0) * (d - d0)) / (bump * bump)));

  if (d > d0) f = f / (u - d0) ** 2;
  if (d > d0 * 1.3) f = 0;
  // if (d > 6000) f = f * f;

  return f;
};
const repulsionForce = (d: number) => {
  return 0;
};

const targetForce = 12000;

export const onUpdateOrder = () => {};

export const onUpdate = (lines: Vec2[][]) => {
  state.particlesPositions.forEach((positions, k) =>
    positions.forEach((p, i) => {
      const a = aPool[k][i];

      // reset
      a[0] = 0;
      a[1] = 0;

      // get order
      const order = state.particlesMoveOrders[k].find((o) =>
        o.indexes.includes(i)
      );
      orders[k][i] = order;

      // if (order) {
      //   const t = order.targets[0];

      //   vec2.sub(v, t, p);
      //   vec2.normalize(v, v);
      //   vec2.scaleAndAdd(a, a, v, targetForce);
      // }

      if (!order) {
        // no order, hold the position, apply neighbor force

        state.particlesPositions[k].forEach((p2, j) => {
          if (i === j) return;

          vec2.sub(v, p2, p);
          const d = vec2.length(v);

          const f = neighborForce(d);

          vec2.scaleAndAdd(a, a, v, -f / d);
        });
      } else {
        const { point: t } = order.targets[0];

        vec2.sub(v, t, p);
        vec2.normalize(v, v);

        vec2.scaleAndAdd(a, a, v, 5000);

        state.particlesPositions.forEach((positions, h) =>
          positions.forEach((p2, j) => {
            vec2.sub(v, p2, p);
            const d = vec2.length(v);

            let f = 0;

            if (h === k && i !== j) {
              f = (500 * 2000 * 2000) / (d * d);
            } else if (h !== k) {
              f = (1000 * 2000 * 2000) / (d * d);
            }

            if (f > Number.EPSILON) vec2.scaleAndAdd(a, a, v, -f / d);
          })
        );
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
      const { point: t } = order.targets[0];

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
