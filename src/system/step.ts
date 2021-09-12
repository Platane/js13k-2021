import { state } from "../state";
import { getBoundingBoxes } from "../math/boundingBox";
import { dMin } from "../math/gauss";
import { ctx } from "../canvas";
import { Vec2 } from "../math/types";
import { getTriangulation } from "../math/delaunay";
import { vec2 } from "gl-matrix";
import { getBorders } from "../math/borders";
import { onUpdate as step } from "./walking";
import { inheritLeadingComments } from ".pnpm/@babel+types@7.15.4/node_modules/@babel/types";
import { ortho } from "../math/vec2";

export const onUpdate = () => {
  // compute boundingBoxes
  const boxes = getBoundingBoxes(state.particlesPositions, dMin * 1.5);

  // {
  //   ctx.lineWidth = 0.5 / state.camera.a;

  //   boxes.forEach(({ box: [[ax, ay], [bx, by]], indexes }) => {
  //     ctx.strokeStyle =
  //       indexes.reduce((s, is) => s + +!!is.length, 0) >= 2
  //         ? "purple"
  //         : "orange";
  //     ctx.beginPath();
  //     ctx.strokeRect(ax, ay, bx - ax, by - ay);
  //   });
  // }

  // compute the mesh for each box
  // + compute the border
  boxes.forEach((b) => {
    const positions: Vec2[] = [];
    const ks: number[] = [];

    b.indexes.forEach((is, k) =>
      is.forEach((i) => {
        positions.push(state.particlesPositions[k][i]);
        ks.push(k);
      })
    );

    const triangles = getTriangulation(positions);

    // {
    //   ctx.lineWidth = 0.3 / state.camera.a;

    //   triangles.forEach((tr) => {
    //     ctx.strokeStyle =
    //       ks[tr[0]] != ks[tr[1]] || ks[tr[0]] != ks[tr[2]] ? "green" : "blue";
    //     ctx.beginPath();
    //     ctx.moveTo(positions[tr[0]][0], positions[tr[0]][1]);
    //     for (let i = 3; i--; )
    //       ctx.lineTo(positions[tr[i]][0], positions[tr[i]][1]);
    //     ctx.stroke();
    //   });
    // }

    const lines =
      b.indexes.reduce((s, is) => s + +!!is.length, 0) >= 2
        ? getBorders(positions, ks, triangles)
        : [];

    // {
    //   ctx.lineWidth = 2.6 / state.camera.a;
    //   ctx.strokeStyle = "blue";
    //   lines.forEach(({ line }) => {
    //     ctx.beginPath();
    //     ctx.moveTo(line[0][0], line[0][1]);
    //     for (let i = 0; i < line.length; i++)
    //       ctx.lineTo(line[i][0], line[i][1]);
    //     ctx.stroke();
    //   });
    // }

    //
    // step

    positions.forEach((p, i) => {
      const k = ks[i];

      // reset
      const a = as[i];
      a[0] = 0;
      a[1] = 0;

      // get order
      const order = state.particlesMoveOrders[k].find((o) =>
        o.indexes.includes(b.indexes[k][i])
      );

      // repulsion force from allies
      b.indexes[k].forEach((jj) => {
        const p2 = state.particlesPositions[k][jj];

        if (p2 === p) return;

        vec2.sub(v, p2, p);
        const d = vec2.length(v);

        const f = allyRepulsionForce(d) * (order ? 1 : 0.8);

        vec2.scaleAndAdd(a, a, v, -f / d);
      });

      // follow order
      if (order) {
        const { point: t } = order.targets[0];

        vec2.sub(v, t, p);
        vec2.normalize(v, v);

        vec2.scaleAndAdd(a, a, v, 8000);
      }

      // get repulsed by the borders
      if (order) {
        lines.forEach(({ line }) => {
          for (let i = line.length - 1; i--; ) {
            const A = line[i];
            const B = line[i + 1];

            vec2.sub(n, B, A);
            const l = vec2.length(n);
            vec2.scale(n, n, 1 / l);
            ortho(v, n);

            vec2.sub(m, p, A);

            const u = vec2.dot(n, m);
            const h = vec2.dot(v, m);

            if (h < 0) vec2.negate(v, v);

            const d = Math.max(1400, Math.abs(h));

            if (
              -dMin / 10 < u &&
              u < l + dMin / 10 &&
              Math.abs(h) < dMin * 1.4
            ) {
              const f = (10 * 1000 * 1000) / d;

              vec2.scaleAndAdd(a, a, v, f);

              // vec2.scaleAndAdd(H, A, n, u / l);

              // {
              //   ctx.lineWidth = 3 / state.camera.a;
              //   ctx.strokeStyle = "purple";
              //   ctx.beginPath();
              //   ctx.moveTo(p[0], p[1]);
              //   ctx.lineTo(p[0] + v[0] * 3000, p[1] + v[1] * 3000);
              //   ctx.stroke();
              // }
            }
          }
        });

        // vec2.sub(v, t, p);
        // vec2.normalize(v, v);

        // vec2.scaleAndAdd(a, a, v, 8000);
      }
    });

    // apply acceleration
    positions.forEach((p, i) => {
      const a = as[i];
      p[0] += a[0] * dt;
      p[1] += a[1] * dt;
    });
  });

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

const m: Vec2 = [0, 0];
const v: Vec2 = [0, 0];
const n: Vec2 = [0, 0];
const as = Array.from({ length: 300 }, () => [0, 0] as Vec2);

const dt = 1 / 60;

export const allyRepulsionForce = (d: number) => {
  if (d < 600) d = 600;

  const d0 = dMin * 0.9;

  let f = (1000 * 2000 * 2000) / (d * d);

  if (d > d0) f = f / (1 + (d - d0) / (dMin * 0.5)) ** 4;
  if (d > d0 * 1.3) f = 0;

  return f;
};
