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
import { draw as drawGizmo } from "./renderer/gizmo";
import { draw as drawGlBlob } from "./renderer/glBlob/glBlob";
import { drawLink } from "./renderer/blob/link";
import { drawPack } from "./renderer/blob/pack";
import { ctx } from "./canvas";
import { onUpdate } from "./system/step";

const updateRate = 1 / 60;
const t0 = Date.now() / 1000;
let k = 0;

const loop = () => {
  const now = Date.now() / 1000;

  // draw
  ctx.clearRect(0, 0, 9999, 9999);
  ctx.save();
  ctx.scale(state.camera.a, state.camera.a);
  ctx.translate(state.camera.offset[0], state.camera.offset[1]);

  onUpdateBoundingBox();
  // if (debug.cheapRenderer) drawCheapBlobs(ctx);
  // else drawBlobs(ctx);

  drawGlBlob();

  // update
  for (; t0 + k * updateRate <= now; k++) {
    // onUpdateWalking();
  }
  onUpdate();

  // if (debug.boundingBoxes) drawBoundingBox(ctx);

  if (debug.particles) {
    // drawParticles(ctx);
    // drawSelectionOrder(ctx);
  }
  // if (debug.pack) {
  //   // drawLink(ctx, 0, 0, 2);
  //   drawPack(ctx, 0, 0);
  // }
  drawSelection(ctx);
  // drawGizmo(ctx);

  ctx.restore();

  // loop
  requestAnimationFrame(loop);
};

loop();
