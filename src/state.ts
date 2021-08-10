import { Vec2 } from "./math/types";

const particles: Vec2[][] = [
  Array.from({ length: 8 }, () => [
    Math.random() * 60 + 60,
    Math.random() * 80 + 100,
  ]),

  Array.from({ length: 8 }, () => [
    Math.random() * 60 + 10,
    Math.random() * 80 + 30,
  ]),

  Array.from({ length: 8 }, () => [
    Math.random() * 50 + 80,
    Math.random() * 80 + 30,
  ]),
];

export const state = {
  particles,
  selection: { rect: null as null | [Vec2, Vec2] },
};

export type State = typeof state;
