import { mat3, vec2, vec3 } from "gl-matrix";
import { getProjection } from "../getProjection";

const a: vec2 = [0, 0];

const fl = (x: number) => Math.round(x * 1000) / 1000;

it("should project with a=1", () => {
  const m = getProjection(mat3.create(), 1, 1, [0, 0]);

  expect(vec2.transformMat3(a, [0, 0], m).map(fl)).toEqual([-1, 1]);
  expect(vec2.transformMat3(a, [1, 1], m).map(fl)).toEqual([1, -1]);
  expect(vec2.transformMat3(a, [0, 1], m).map(fl)).toEqual([-1, -1]);
});

it("should project with a=10", () => {
  const m = getProjection(mat3.create(), 1, 10, [0, 0]);

  expect(vec2.transformMat3(a, [0, 0], m).map(fl)).toEqual([-1, 1]);
  expect(vec2.transformMat3(a, [10, 10], m).map(fl)).toEqual([1, -1]);
});

it("should project with ratio=2", () => {
  const m = getProjection(mat3.create(), 2, 1, [0, 0]);

  expect(vec2.transformMat3(a, [0, 0], m).map(fl)).toEqual([-1, 1]);
  expect(vec2.transformMat3(a, [1, 1], m).map(fl)).toEqual([1, -3]);
});
