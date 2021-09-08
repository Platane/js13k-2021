import { linesIntersection } from "../lineIntersection";
import { Vec2 } from "../types";

const samples: {
  A: Vec2;
  vA: Vec2;
  B: Vec2;
  vB: Vec2;
  out: Vec2 | null;
  label?: string;
}[] = [
  //
  {
    label: "simple orthogonal lines",
    A: [1, 0.5],
    vA: [0, 1],
    B: [1, 2],
    vB: [1, 0],
    out: [1, 2],
  },
  {
    label: "parallel lines",
    A: [1, 0.5],
    vA: [1, 0],
    B: [1, 2],
    vB: [2, 0],
    out: null,
  },
  {
    label: "same lines",
    A: [1, 0.5],
    vA: [1, 0],
    B: [1, 0.5],
    vB: [2, 0],
    out: [1, 0.5],
  },
];

samples.push(
  ...samples.map((s) => ({
    ...s,
    label: s.label && s.label + "(reversed)",
    A: s.B,
    B: s.A,
    vA: s.vB,
    vB: s.vA,
  }))
);

samples.forEach(({ A, vA, B, vB, out, label }, i) =>
  it(label || `sample ${i}`, () => {
    expect(linesIntersection([0, 0], A, vA, B, vB)).toEqual(out);
  })
);
