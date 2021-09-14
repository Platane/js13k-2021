import { ctx } from "../../canvas";
import { getBoundingBoxes } from "../../math/boundingBox";
import { getTriangulation } from "../../math/delaunay";
import { dMin } from "../../math/gauss";
import { Vec2 } from "../../math/types";
import { state } from "../../state";

export const drawMesh = () => {
  ctx.lineWidth = 0.8 * (ctx as any).pixelSize;

  getBoundingBoxes(state.particlesPositions, dMin * 1.6).forEach(
    ({ indexes }) => {
      const positions: Vec2[] = [];
      const ks: number[] = [];

      indexes.forEach((is, k) =>
        is.forEach((i) => {
          positions.push(state.particlesPositions[k][i]);
          ks.push(k);
        })
      );

      const triangles = getTriangulation(positions);

      const graph = positions.map(() => [] as number[]);
      triangles.forEach((tr) => {
        for (let i = 3; i--; ) {
          const j = (i + 1) % 3;

          const a = Math.min(tr[i], tr[j]);
          const b = Math.max(tr[i], tr[j]);

          graph[a] = graph[a] || [];
          if (!graph[a].includes(b)) graph[a].push(b);
        }
      });

      graph.forEach((edges, a) =>
        edges.forEach((b) => {
          ctx.strokeStyle = ks[a] != ks[b] ? "purple" : "blue";
          ctx.beginPath();
          ctx.moveTo(positions[a][0], positions[a][1]);
          ctx.lineTo(positions[b][0], positions[b][1]);
          ctx.stroke();
        })
      );
    }
  );
};
