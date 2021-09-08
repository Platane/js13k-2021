import { Vec2 } from "./types";

export const linesIntersection = (
  out: Vec2,
  A: Vec2,
  vA: Vec2,
  B: Vec2,
  vB: Vec2
) => {
  if (Math.abs(vA[0] * vB[1] - vA[1] * vB[0]) < Number.EPSILON) {
    if (
      Math.abs(vA[0] * (A[1] - B[1]) - vA[1] * (A[1] - B[1])) < Number.EPSILON
    ) {
      out[0] = A[0];
      out[1] = A[1];
      return out;
    } else return null;
  }

  let k;
  if (Math.abs(vB[0]) < Number.EPSILON) k = (B[0] - A[0]) / vA[0];
  else if (Math.abs(vB[1]) < Number.EPSILON) k = (B[1] - A[1]) / vA[1];
  else
    k =
      ((A[0] - B[0]) / vB[0] - (A[1] - B[1]) / vB[1]) /
      (vA[1] / vB[1] - vA[0] / vB[0]);

  out[0] = A[0] + vA[0] * k;
  out[1] = A[1] + vA[1] * k;

  return out;
};
