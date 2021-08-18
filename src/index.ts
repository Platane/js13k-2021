import "./debug/mock-random";
import "./debug/stats";

import { state } from "./state";

import { onUpdate as onUpdateWalking } from "./system/walking";
import "./system/controls";

import { draw as drawBlob } from "./renderer/blob/blob";
import { draw as drawSelection } from "./renderer/selection/selection";
import { draw as drawSelectionOrder } from "./renderer/selection/order";

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
  for (; t0 + k * updateRate <= now; k++) onUpdateWalking();

  // draw
  ctx.clearRect(0, 0, 9999, 9999);
  drawBlob(ctx, state.particlesPositions);
  drawSelection(ctx, state.selection);
  drawSelectionOrder(ctx, state);

  // loop
  requestAnimationFrame(loop);
};

loop();
