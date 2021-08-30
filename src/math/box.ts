import { Box, Vec2 } from "./types";

export const enlargeBoxByPoint = (box: Box, p: Vec2) => {
  box[0][0] = Math.min(box[0][0], p[0]);
  box[0][1] = Math.min(box[0][1], p[1]);
  box[1][0] = Math.max(box[1][0], p[0]);
  box[1][1] = Math.max(box[1][1], p[1]);
};

export const enlargeBoxByPoints = (box: Box, ps: Vec2[]) =>
  ps.forEach((p) => enlargeBoxByPoint(box, p));

export const enlargeBoxByBox: (box: Box, a: Box) => void = enlargeBoxByPoints;

export const intervalCollide = (
  aMin: number,
  aMax: number,
  bMin: number,
  bMax: number
) => (aMin <= bMax && bMin <= aMax) || (bMin <= aMax && aMin <= bMax);

export const boxCollide = (a: Box, b: Box) =>
  intervalCollide(a[0][0], a[1][0], b[0][0], b[1][0]) &&
  intervalCollide(a[0][1], a[1][1], b[0][1], b[1][1]);
