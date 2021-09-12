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

const canvas2 = document.createElement("canvas");
canvas2.height = canvas2.width = Math.min(
  window.innerWidth,
  window.innerHeight
);
canvas2.style.position = "fixed";
canvas2.style.zIndex = "-1";
canvas2.style.top = "0";
canvas2.style.left = "0";
canvas2.style.transform = "scale(1,-1)";
document.body.appendChild(canvas2);
export const gl = canvas2.getContext("webgl2")!;
