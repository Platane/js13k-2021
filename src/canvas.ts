import { state } from "./state";

export const canvas = document.getElementsByTagName("canvas")[0];
export const ctx = canvas.getContext("2d")!;

const resize = () => {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  state.camera.a = Math.min(
    canvas.clientWidth / state.worldDimensions[0],
    canvas.clientHeight / state.worldDimensions[1]
  );
};
resize();
window.addEventListener("resize", resize);
