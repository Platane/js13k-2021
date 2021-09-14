import { Vec2 } from "../math/types";
import { state } from "../state";

export const a = () =>
  state.camera.a *
  Math.min(state.viewportDimensions[0], state.viewportDimensions[0]);

export const unProjX = (screenX: number) =>
  Math.floor(screenX / a() - state.camera.offset[0]);
export const unProjY = (screenY: number) =>
  Math.floor(screenY / a() - state.camera.offset[1]);

export const unProj = (out: Vec2, screenX: number, screenY: number) => {
  out[0] = unProjX(screenX);
  out[1] = unProjY(screenY);
  return out;
};
