import { state } from "../state";

export const unProjX = (screenX: number) =>
  screenX / state.camera.a - state.camera.offset[0];
export const unProjY = (screenY: number) =>
  screenY / state.camera.a - state.camera.offset[1];

export const projX = (x: number) =>
  (x + state.camera.offset[0]) * state.camera.a;
export const projY = (y: number) =>
  (y + state.camera.offset[1]) * state.camera.a;
