import { mat3, vec2 } from "gl-matrix";

const tmp = mat3.create();

export const getProjection = (
  out: mat3,
  aspect: number, // viewport  width / height.
  a: number,
  offset: vec2
) => {
  mat3.identity(out);
  mat3.multiply(out, mat3.fromTranslation(tmp, offset), out);
  mat3.multiply(out, mat3.fromScaling(tmp, [1 / a, 1 / a]), out);
  mat3.multiply(out, mat3.fromScaling(tmp, [2, 2]), out);
  mat3.multiply(out, mat3.fromScaling(tmp, [1, aspect]), out);
  mat3.multiply(out, mat3.fromTranslation(tmp, [-1, -1]), out);
  mat3.multiply(out, mat3.fromScaling(tmp, [1, -1]), out);

  return out;
};
