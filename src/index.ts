import "./debug/mock-random";
// import "./debug/stats";
import { debug } from "./debug/ui";

import { state } from "./state";

import "./system/controls";

import { draw as drawSelection } from "./renderer/selection/selection";
import { draw as drawGlBlob } from "./renderer/glBlob/glBlob";
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

  // update
  for (; t0 + k * updateRate <= now; k++) {}
  onUpdate();

  drawGlBlob();
  drawSelection(ctx);
  ctx.restore();

  // loop
  requestAnimationFrame(loop);
};

loop();
