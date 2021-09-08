import { Vec2 } from "../math/types";
import { state } from "../state";

export const unProjX = (screenX: number) =>
  Math.floor(screenX / state.camera.a - state.camera.offset[0]);
export const unProjY = (screenY: number) =>
  Math.floor(screenY / state.camera.a - state.camera.offset[1]);

export const unProj = (out: Vec2, screenX: number, screenY: number) => {
  out[0] = unProjX(screenX);
  out[1] = unProjY(screenY);
  return out;
};

export const projX = (x: number) =>
  (x + state.camera.offset[0]) * state.camera.a;
export const projY = (y: number) =>
  (y + state.camera.offset[1]) * state.camera.a;
export const proj = (out: Vec2, x: number, y: number) => {
  out[0] = projX(x);
  out[1] = projY(y);
  return out;
};
