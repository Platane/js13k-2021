import { boxContainsPoint } from "../../math/box";
import { gauss, threshold } from "../../math/gauss";
import { isJoiningSegmentInside } from "../../math/pack";
import type { Vec2 } from "../../math/types";
import { state } from "../../state";
import { projX, projY, unProjX, unProjY } from "../../system/camera";
import { colors, s, texturesData } from "./textures";

export const drawLink = (
  ctx: CanvasRenderingContext2D,
  k: number,
  i: number,
  j: number
) => {
  const joined = isJoiningSegmentInside(
    state.particlesPositions[0],
    i,
    j,
    (x, y) => {
      ctx.fillStyle = "blue";
      ctx.beginPath();
      ctx.arc(x, y, 2.4 / state.camera.a, 0, Math.PI * 2);
      ctx.fill();
    }
  );

  ctx.lineWidth = (joined ? 2 : 0.5) / state.camera.a;
  ctx.beginPath();
  ctx.moveTo(
    state.particlesPositions[k][i][0],
    state.particlesPositions[k][i][1]
  );
  ctx.lineTo(
    state.particlesPositions[k][j][0],
    state.particlesPositions[k][j][1]
  );
  ctx.stroke();
};
