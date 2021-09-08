import { boxContainsPoint } from "../../math/box";
import { gauss, threshold } from "../../math/gauss";
import { isJoiningSegmentInside, getPack } from "../../math/pack";
import type { Vec2 } from "../../math/types";
import { state } from "../../state";
import { projX, projY, unProjX, unProjY } from "../../system/camera";
import { colors, s, texturesData } from "./textures";

export const drawPack = (
  ctx: CanvasRenderingContext2D,
  k: number,
  i: number
) => {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(
    state.particlesPositions[k][i][0],
    state.particlesPositions[k][i][1],
    2.4 / state.camera.a,
    0,
    Math.PI * 2
  );
  ctx.fill();

  getPack(state.particlesPositions[k], i).forEach((i) => {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(
      state.particlesPositions[k][i][0],
      state.particlesPositions[k][i][1],
      1.4 / state.camera.a,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });
};
