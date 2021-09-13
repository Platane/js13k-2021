import { ctx } from "../../canvas";
import { getPack } from "../../math/pack";
import { getBlobEdge } from "../../math/blob";
import { state } from "../../state";
import { dMin } from "../../math/gauss";

export const drawSelectionHightLight = () => {
  if (state.selection.particlesIndexes) {
    const k = state.selection.k;

    const indexes = state.selection.particlesIndexes.slice();

    ctx.lineWidth = 3 / state.camera.a;
    ctx.strokeStyle = "#666";

    while (indexes.length) {
      const pack = getPack(state.particlesPositions[k], indexes[0], indexes);

      const edge = getBlobEdge(
        pack.map((i) => state.particlesPositions[k][i]),
        dMin / 3
      );

      if (edge) {
        ctx.beginPath();
        ctx.moveTo(edge[0][0], edge[0][1]);
        for (let i = edge.length; i--; ) ctx.lineTo(edge[i][0], edge[i][1]);
        ctx.stroke();
      }
    }
  }
};
