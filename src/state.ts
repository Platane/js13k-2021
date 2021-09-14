import { Vec2 } from "./math/types";

const s = 1 << 16;

const particlesPositions = [
  Array.from(
    { length: 26 },
    () =>
      new Uint16Array([
        (Math.random() * 0.2 + 0.5) * s,
        (Math.random() * 0.16 + 0.6) * s,
      ]) as any as Vec2
  ),

  Array.from(
    { length: 14 },
    () =>
      new Uint16Array([
        (Math.random() * 0.12 + 0.4) * s,
        (Math.random() * 0.14 + 0.15) * s,
      ]) as any as Vec2
  ),

  Array.from(
    { length: 16 },
    () =>
      new Uint16Array([
        (Math.random() * 0.2 + 0.3) * s,
        (Math.random() * 0.14 + 0.32) * s,
      ]) as any as Vec2
  ),
];
particlesPositions.forEach((pos) =>
  pos.forEach((a) => {
    a[0] = (a[0] - s / 2) / 4 + s / 2;
    a[1] = (a[1] - s / 2) / 4 + s / 2;
  })
);

const particlesPositions2 = Array.from({ length: 3 }).map(
  (_, i, { length }) => {
    const a = (i / length) * Math.PI * 2;

    const h = 0.1;

    const cx = 0.5 + h * Math.sin(a);
    const cy = 0.5 + h * Math.cos(a);
    const l = 0.08;

    return Array.from(
      { length: Math.floor(Math.random() * 12 + 10) },
      () =>
        new Uint16Array([
          (Math.random() * l - l / 2 + cx) * s,
          (Math.random() * l - l / 2 + cy) * s,
        ]) as any as Vec2
    );
  }
);

export type MoveTargetPoint = { point: Vec2 };
export type MoveTargetEnemy = { indexes: number[]; k: number; point: Vec2 };
export type MoveTarget = MoveTargetPoint | MoveTargetEnemy;
export type MoveOrder = { target: MoveTarget; indexes: number[] };

export const state = {
  // camera
  // point_in_square_unit = ( particle_position + offset  ) * a
  // point_in_screen = ( particle_position + offset  ) * a * viewportDimensions
  camera: { a: 1 / s, offset: [0, 0] as Vec2 },

  worldDimensions: [s, s] as Vec2,
  viewportDimensions: [1, 1] as Vec2,

  particlesPositions,
  particlesMoveOrders: particlesPositions.map(() => [] as MoveOrder[]),

  selection: {
    k: 0,
    rect: null as null | [Vec2, Vec2],
    particlesIndexes: null as null | number[],
  },
};

export type State = typeof state;
