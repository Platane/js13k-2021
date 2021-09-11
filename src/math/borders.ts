import { dMin } from "../math/gauss";
import { Vec2 } from "../math/types";
import { vec2 } from "gl-matrix";

const lMinSquare = (dMin * 2.3) ** 2;

const getBorderPoint = (O: Vec2, A: vec2, B: vec2): Vec2 =>
  new Uint16Array([
    ((O[0] + A[0]) / 2 + (O[0] + B[0]) / 2) / 2,
    ((O[1] + A[1]) / 2 + (O[1] + B[1]) / 2) / 2,
  ]) as any;

export const getBorders = (
  positions: Vec2[],
  ks: number[],
  triangles: [number, number, number][]
) => {
  const borderPoints: {
    p: Vec2;
    e: number[];
    k1: number;
    k2: number;
  }[] = [];

  triangles.forEach((tr) => {
    if (
      ks[tr[0]] !== ks[tr[1]] &&
      ks[tr[0]] !== ks[tr[2]] &&
      ks[tr[1]] !== ks[tr[2]]
    ) {
      // TODO
    } else if (ks[tr[0]] !== ks[tr[1]] || ks[tr[0]] !== ks[tr[2]]) {
      for (let u = 3; u--; ) {
        const i1 = tr[u];
        const i2 = tr[(u + 1) % 3];
        const i3 = tr[(u + 2) % 3];

        if (ks[i1] === ks[i2]) {
          if (
            vec2.squaredDistance(positions[i3], positions[i1]) < lMinSquare ||
            vec2.squaredDistance(positions[i3], positions[i2]) < lMinSquare
          ) {
            borderPoints.push({
              p: getBorderPoint(positions[i3], positions[i1], positions[i2]),
              k1: Math.min(ks[i1], ks[i3]),
              k2: Math.max(ks[i1], ks[i3]),

              e: [
                Math.min(i1, i3) * positions.length + Math.max(i1, i3),
                Math.min(i2, i3) * positions.length + Math.max(i2, i3),
              ],
            });
          }
        }
      }
    }
  });

  return extractLines(borderPoints);
};

const extractLines = (
  ps: { p: Vec2; k1: number; k2: number; e: number[] }[]
): { line: Vec2[]; k1: number; k2: number }[] => {
  const p = ps.shift();
  if (!p) return [];
  const line = extractLine(ps, p);
  const lines = extractLines(ps);
  if (line.length >= 2) lines.push({ k1: p.k1, k2: p.k2, line });
  return lines;
};

const extractLine = (
  ps: { p: Vec2; e: number[] }[],
  o: { p: Vec2; e: number[] }
) => {
  const line = [o.p];

  let n: { p: Vec2; e: number[] } | null = null;
  n = o;
  while ((n = getNext(ps, n))) line.push(n.p);

  n = o;
  while ((n = getNext(ps, n))) line.unshift(n.p);

  return line;
};

const getNext = (
  ps: { p: Vec2; e: number[] }[],
  p: { p: Vec2; e: number[] }
) => {
  for (let i = ps.length; i--; ) {
    const u = ps[i];

    for (let ip = p.e.length; ip--; )
      for (let iu = u.e.length; iu--; )
        if (p.e[ip] === u.e[iu]) {
          p.e.splice(ip, 1);
          u.e.splice(iu, 1);

          ps.splice(i, 1);

          return u;
        }
  }

  return null;
};
