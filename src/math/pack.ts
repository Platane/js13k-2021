import { vec2 } from "gl-matrix";
import { isInsideBlob, tau, threshold } from "./gauss";
import { Vec2 } from "./types";

export const dMin = Math.sqrt(-2 * Math.log(threshold) * (tau * tau));

const step = dMin / 4;

const v: Vec2 = [0, 0];

/**
 * return true if the points are part of the same blob
 */
export const isJoiningSegmentInside = (
  positions: Vec2[],
  i: number,
  j: number,
  onPoint?: (x: number, y: number) => void
) => {
  const a = positions[i];
  const b = positions[j];

  vec2.sub(v, b, a);

  const d = vec2.length(v);

  const s = d - dMin * 2;
  const n = Math.ceil(s / step);
  const m = (s - (n - 1) * step) / 2;

  for (let u = 0; u < n; u++) {
    // start on the middle and expand in each direction
    const t = n / 2 + (u % 2 ? u / 2 : -(u + 1) / 2);

    const x = a[0] + (v[0] / d) * (dMin + m + t * step);
    const y = a[1] + (v[1] / d) * (dMin + m + t * step);

    onPoint?.(x, y);

    if (!isInsideBlob(positions, x, y)) return false;
  }

  return true;
};

export const getPack = (
  positions: Vec2[],
  i: number,
  indexes = positions.map((_, j) => j)
) => {
  const pack = [i];

  for (let h = 0; h < pack.length; h++) {
    const i = pack[h];
    for (let u = indexes.length; u--; ) {
      const j = indexes[u];
      if (isJoiningSegmentInside(positions, i, j)) {
        indexes.splice(u, 1);
        pack.push(j);
      }
    }
  }

  return pack;
};
