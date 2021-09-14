import { state } from "./state";

const [canvasGl, canvas2d] = Array.from(
  document.getElementsByTagName("canvas")
);

export const ctx = canvas2d.getContext("2d")!;
export const gl = canvasGl.getContext("webgl2")!;

const dpr = Math.min(window.devicePixelRatio ?? 1, 2);

const resize = () => {
  const w = window.innerWidth * dpr;
  const h = window.innerHeight * dpr;

  canvasGl.width = canvas2d.width = w;
  canvasGl.height = canvas2d.height = h;

  gl.viewport(0, 0, w, h);

  state.viewportDimensions = [w, h];

  centerCamera();
};

const centerCamera = () => {
  const r = Math.min(
    state.viewportDimensions[0] / state.worldDimensions[0],
    state.viewportDimensions[1] / state.worldDimensions[1]
  );

  const m = 3;

  const a = (r / state.viewportDimensions[0]) * m;
  state.camera.a = a;
  state.camera.offset[0] = -state.worldDimensions[0] * ((1 - 1 / m) / 2);
  state.camera.offset[1] = -state.worldDimensions[1] * ((1 - 1 / m) / 2);
};

resize();
window.addEventListener("resize", resize);
