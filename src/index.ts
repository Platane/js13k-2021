import "./debug/mock-random";
import "./debug/stats";

import { state } from "./state";

import { onUpdate as onUpdateWalking } from "./system/walking";
import "./system/controls";

import { draw as drawBlob } from "./renderer/blob/blob";
import { draw as drawSelection } from "./renderer/selection/selection";

const canvas = document.getElementsByTagName("canvas")[0];
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const ctx = canvas.getContext("2d")!;

let previousDate = Date.now();
const loop = () => {
  const now = Date.now();
  const dt = now - previousDate;
  previousDate = now;

  // update
  onUpdateWalking(dt);

  // draw
  ctx.clearRect(0, 0, 9999, 9999);
  drawBlob(ctx, state.particles);
  drawSelection(ctx, state.selection);

  // loop
  requestAnimationFrame(loop);
};

loop();
