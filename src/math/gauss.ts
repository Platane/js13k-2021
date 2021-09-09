import { Vec2 } from "./types";

export const tau = (2.8 / 100) * (1 << 16);

export const threshold = 0.38;

/**
 * radius of minimal zone covered by the blob from a single point
 */
export const dMin = Math.sqrt(-2 * Math.log(threshold) * (tau * tau));

/**
 * gauss function
 */
export const gauss = (x: number) => Math.exp((-0.5 * (x * x)) / (tau * tau));

const getGaussValueAt = (positions: Vec2[], x: number, y: number) =>
  positions.reduce(
    (sum, [px, py]) => sum + gauss(Math.hypot(x - px, y - py)),
    0
  );

/**
 * return true if the point x,y is inside the blob
 */
export const isInsideBlob = (positions: Vec2[], x: number, y: number) =>
  getGaussValueAt(positions, x, y) > threshold;
