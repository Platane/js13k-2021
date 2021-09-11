import { vec2 } from "gl-matrix";
import { dMin, isInsideBlob, tau, threshold } from "./gauss";
import { Vec2 } from "./types";
import { ortho } from "./vec2";

/**
 * use dichotomy to find the point on the edge
 *
 * o + a*v  is inside
 * o + b*v  is outside
 */
const getEdgeIntersectionBetween = (
  out: Vec2,
  positions: Vec2[],
  o: Vec2,
  v: Vec2,
  a: number,
  b: number
) => {
  const epsilon = dMin / 100;

  while (Math.abs(a - b) > epsilon) {
    const e = (a + b) / 2;

    if (isInsideBlob(positions, o[0] + e * v[0], o[1] + e * v[1])) a = e;
    else b = e;
  }

  const e = (a + b) / 2;
  out[0] = o[0] + e * v[0];
  out[1] = o[1] + e * v[1];

  return out;
};

const x: Vec2 = [1, 0];
const getPointOnBlobEdge = (out: Vec2, positions: Vec2[]): Vec2 => {
  vec2.copy(
    out,
    positions.reduce((m, p) => (m[0] > p[0] ? m : p))
  );

  const step = dMin / 1.2;

  out[0] += dMin * 0.9;

  for (let k = 100; k--; ) {
    out[0] += step;
    if (!isInsideBlob(positions, out[0], out[1]))
      return getEdgeIntersectionBetween(out, positions, out, x, -step, 0);
  }

  return null as any;
};

const n: Vec2 = [1, 0];
const a: Vec2 = [0, 0];
const b: Vec2 = [0, 0];
const getNextPointOnBlobEdge = (
  out: Vec2,
  positions: Vec2[],
  o: Vec2,
  v: Vec2,
  s: number
) => {
  let l = s;

  ortho(n, v);

  for (let k = 3; k--; ) {
    vec2.scaleAndAdd(a, o, v, l);
    vec2.scaleAndAdd(a, a, n, -s / 2);
    vec2.scaleAndAdd(b, a, n, s);

    if (
      isInsideBlob(positions, a[0], a[1]) &&
      !isInsideBlob(positions, b[0], b[1])
    )
      return getEdgeIntersectionBetween(out, positions, a, n, 0, s);

    l /= 2;
  }

  return null;
};

const v: Vec2 = [0, 0];
const nn: Vec2 = [1, 0];
export const getBlobEdge = (positions: Vec2[], s = dMin / 0.8) => {
  let h: Vec2 = getPointOnBlobEdge([0, 0], positions);
  let h_: Vec2 = [h[0], h[1] - 1];

  const edge = [h];

  for (let i = 200; i--; ) {
    vec2.sub(v, h, h_);
    vec2.normalize(v, v);

    let next: Vec2 | null;
    next = getNextPointOnBlobEdge([0, 0], positions, h, v, s);

    // likely in a hole, retry shooting a bit toward the outside
    if (!next) {
      ortho(nn, v);
      for (let j = 5; !next && j--; ) {
        vec2.lerp(v, v, nn, 0.5);
        vec2.normalize(v, v);
        next = getNextPointOnBlobEdge([0, 0], positions, h, v, s);
      }
    }

    if (!next) return null;

    h_ = h;
    h = next;

    if (edge.length > 4 && vec2.distance(edge[0], h) < s * 1.6) {
      const v_ = vec2.sub([0, 0], edge[0], h);

      if (vec2.dot(v_, v) > 0) edge.push(h);

      return edge;
    }

    edge.push(h);
  }

  return edge;
};
