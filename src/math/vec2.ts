import { Vec2 } from "./types";

export const ortho = (out: Vec2, v: Vec2) => {
  out[0] = v[1];
  out[1] = -v[0];
  return out;
};
