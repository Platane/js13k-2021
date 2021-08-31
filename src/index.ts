import "./debug/mock-random";
// import "./debug/stats";
import { debug } from "./debug/ui";

import { state } from "./state";

import { onUpdate as onUpdateWalking } from "./system/walking";
import { onUpdate as onUpdateBoundingBox } from "./system/boundingBox";
import "./system/controls";

import "./system/boundingBox";

import { drawBlobs, drawParticles } from "./renderer/blob/blob";
import { drawBlobs as drawCheapBlobs } from "./renderer/blob/cheapBlob";
import { draw as drawSelection } from "./renderer/selection/selection";
import { draw as drawSelectionOrder } from "./renderer/selection/order";
import { draw as drawBoundingBox } from "./renderer/boundingBox";

const canvas = document.getElementsByTagName("canvas")[0];
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const ctx = canvas.getContext("2d")!;

const updateRate = 1 / 60;
const t0 = Date.now() / 1000;
let k = 0;

const loop = () => {
  const now = Date.now() / 1000;

  // update
  for (; t0 + k * updateRate <= now; k++) {
    onUpdateWalking();
    onUpdateBoundingBox();
  }

  // draw
  ctx.clearRect(0, 0, 9999, 9999);
  if (debug.boundingBoxes) drawBoundingBox(ctx, state);
  if (debug.cheapRenderer) drawCheapBlobs(ctx);
  else drawBlobs(ctx);
  if (debug.particles) {
    drawParticles(ctx);
    drawSelectionOrder(ctx, state);
  }
  drawSelection(ctx, state.selection);

  // loop
  requestAnimationFrame(loop);
};

loop();
