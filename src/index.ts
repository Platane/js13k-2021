import "./debug/mock-random";
// import "./debug/stats";
import { debug } from "./debug/debug";

import { state } from "./state";

import { init as initControls } from "./system/controls";

import { draw as drawSelection } from "./renderer/selection/selection";
import { draw as drawGlBlob } from "./renderer/glBlob/glBlob";
import { drawParticles } from "./renderer/blob/particles";
import { drawBoundingBox } from "./renderer/boundingBox";
import { drawOrder } from "./renderer/selection/order";
import { drawMesh } from "./renderer/blob/mesh";
import { drawSelectionHightLight } from "./renderer/selection/selectionHightLight";

import { ctx } from "./canvas";
import { onUpdate } from "./system/step";
import { drawGizmo } from "./renderer/gizmo";
import { Vec2 } from "./math/types";
import { drawBlobs } from "./renderer/blob/blob";

const updateRate = 1 / 60;
const t0 = Date.now() / 1000;
let epoch = 0;

const loop = () => {
  const now = Date.now() / 1000;

  // update
  for (let k = 0; k < 100 && t0 + epoch * updateRate <= now; epoch++, k++)
    onUpdate();

  // 2d draw
  ctx.clearRect(0, 0, 99999, 99999);
  ctx.save();
  const s =
    Math.min(state.viewportDimensions[0], state.viewportDimensions[0]) *
    state.camera.a;

  (ctx as any).pixelSize = 1 / s;
  ctx.scale(s, s);
  ctx.translate(state.camera.offset[0], state.camera.offset[1]);

  // drawBlobs();
  drawSelection();
  drawSelectionHightLight();

  if (debug.boundingBoxes) drawBoundingBox();
  if (debug.meshes) drawMesh();
  if (debug.particles) {
    drawParticles();
    drawOrder();
  }
  if (debug.gizmo) drawGizmo();

  ctx.restore();

  // gl draw
  drawGlBlob();

  // loop
  requestAnimationFrame(loop);
};

loop();

let demoLoopTimeout: NodeJS.Timeout;
const demoLoop = () => {
  clearTimeout(demoLoopTimeout);

  const indexes = Array.from(
    { length: Math.floor(state.particlesPositions[0].length) },
    (_, i) => i
  );

  state.particlesMoveOrders[0].length = 0;

  state.particlesMoveOrders[0].push({
    indexes,
    target: {
      point: new Uint16Array([
        (Math.random() * 0.2 + 0.4) * state.worldDimensions[0],
        (Math.random() * 0.2 + 0.4) * state.worldDimensions[1],
      ]) as any as Vec2,
    },
  });

  demoLoopTimeout = setTimeout(demoLoop, 3000);
};
demoLoop();

const start = () => {
  clearTimeout(demoLoopTimeout);
  initControls();
  const splash = document.getElementById("splash")!;
  splash.style.opacity = "0";
  splash.style.pointerEvents = "none";
};
if (debug.skipSplash) start();

document.getElementById("splash-dismiss")!.addEventListener("click", start);
document.getElementById("splash-up")!.addEventListener("click", () => {
  const splash = document.getElementById("splash")!;
  splash.style.opacity = "1";
  splash.style.pointerEvents = "auto";
});
