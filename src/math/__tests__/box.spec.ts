import { boxCollide, intervalCollide } from "../box";

const samples = [
  //
  [[0, 1], [2, 3], false],
  [[0, 1], [1, 3], true],
  [[1, 2], [0, 1], true],
  [[0, 3], [1, 2], true],
  [[0, 2], [1, 3], true],
] as const;

// @ts-ignore
samples.push(...samples.map(([a, b, expected]) => [b, a, expected]));

samples.forEach(([a, b, expected]) =>
  it(`${a} and ${b} should ${expected ? "collided" : "not collide"}`, () => {
    expect(intervalCollide(a[0], a[1], b[0], b[1])).toBe(expected);
  })
);
