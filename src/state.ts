import { Box, Vec2 } from "./math/types";

const particlesPositions = [
  Array.from(
    { length: 8 },
    () => [Math.random() * 60 + 60, Math.random() * 80 + 100] as Vec2
  ),

  // Array.from(
  //   { length: 8 },
  //   () => [Math.random() * 60 + 10, Math.random() * 80 + 30] as Vec2
  // ),

  Array.from(
    { length: 8 },
    () => [Math.random() * 50 + 80, Math.random() * 80 + 30] as Vec2
  ),
];

type MoveOrder = { targets: Vec2[]; indexes: number[] };

export const state = {
  particlesPositions,
  particlesMoveOrders: particlesPositions.map(() => [] as MoveOrder[]),

  selection: {
    rect: null as null | [Vec2, Vec2],
    particlesIndexes: null as null | number[],
  },

  particlesBoundingBoxes: particlesPositions.map(
    () => [] as { box: Box; indexes: number[] }[]
  ),
};

export type State = typeof state;
