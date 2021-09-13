import { Box, Vec2 } from "./math/types";

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
    { length: 4 },
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

export type MoveTargetPoint = { point: Vec2 };
export type MoveTargetEnemy = { indexes: number[]; k: number; point: Vec2 };
export type MoveTarget = MoveTargetPoint | MoveTargetEnemy;
export type MoveOrder = { targets: MoveTarget[]; indexes: number[] };

export const state = {
  camera: { a: 1, offset: [0, 0] as Vec2 },

  worldDimensions: [s, s] as Vec2,

  particlesPositions,
  particlesMoveOrders: particlesPositions.map(() => [] as MoveOrder[]),

  selection: {
    rect: null as null | [Vec2, Vec2],
    particlesIndexes: null as null | number[],
  },
};

export type State = typeof state;
