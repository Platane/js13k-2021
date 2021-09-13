import { ctx } from "../canvas";
import { getBoundingBoxes } from "../math/boundingBox";
import { dMin } from "../math/gauss";
import { state } from "../state";

export const drawBoundingBox = () => {
  ctx.lineWidth = 0.5 / state.camera.a;

  getBoundingBoxes(state.particlesPositions, dMin * 1.6).forEach(({ box }) => {
    ctx.strokeStyle = "purple";

    ctx.beginPath();
    ctx.strokeRect(
      box[0][0],
      box[0][1],
      box[1][0] - box[0][0],
      box[1][1] - box[0][1]
    );
  });
};
