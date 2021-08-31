import { Box, Vec2 } from "./math/types";

const s = 1 << 16;

const particlesPositions = [
  Array.from(
    { length: 8 },
    () =>
      new Uint16Array([
        (Math.random() * 0.2 + 0.6) * s,
        (Math.random() * 0.3 + 0.5) * s,
      ]) as any as Vec2
  ),

  // Array.from(
  //   { length: 8 },
  //   () => [Math.random() * 60 + 10, Math.random() * 80 + 30] as Vec2
  // ),

  Array.from(
    { length: 10 },
    () =>
      new Uint16Array([
        (Math.random() * 0.2 + 0.1) * s,
        (Math.random() * 0.3 + 0.2) * s,
      ]) as any as Vec2
  ),
];

type MoveOrder = { targets: Vec2[]; indexes: number[] };

type Collision = {
  aI: number;
  bI: number;

  aIndexes: number[];
  bIndexes: number[];

  aBoundingBox: number;
  bBoundingBox: number;
};

export const state = {
  camera: { a: 1, offset: [0, 0] as Vec2 },

  worldDimensions: [s, s] as Vec2,

  particlesPositions,
  particlesMoveOrders: particlesPositions.map(() => [] as MoveOrder[]),

  selection: {
    rect: null as null | [Vec2, Vec2],
    particlesIndexes: null as null | number[],
  },

  particlesBoundingBoxes: particlesPositions.map(
    () => [] as { box: Box; indexes: number[] }[]
  ),

  collisions: [] as Collision[],
};

export type State = typeof state;
