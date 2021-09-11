import { state } from "../state";
import { getBoundingBoxes } from "../math/boundingBox";
import { dMin } from "../math/gauss";
import { ctx } from "../canvas";
import { Vec2 } from "../math/types";
import { getTriangulation } from "../math/delaunay";
import { vec2 } from "gl-matrix";
import { getBorders } from "../math/borders";

export const onUpdate = () => {
  // compute boundingBoxes
  const boxes = getBoundingBoxes(state.particlesPositions, dMin * 1.4);

  {
    ctx.lineWidth = 0.5 / state.camera.a;

    boxes.forEach(({ box: [[ax, ay], [bx, by]], particles: { length } }) => {
      ctx.strokeStyle = length > 1 ? "purple" : "orange";
      ctx.beginPath();
      ctx.strokeRect(ax, ay, bx - ax, by - ay);
    });
  }

  // compute the mesh for each box
  // + compute the border
  const meshes = boxes.map((b) => {
    const positions: Vec2[] = [];
    const ks: number[] = [];

    b.indexes.forEach((is, k) =>
      is.forEach((i) => {
        positions.push(state.particlesPositions[k][i]);
        ks.push(k);
      })
    );

    const triangles = getTriangulation(positions);

    {
      ctx.lineWidth = 0.3 / state.camera.a;

      triangles.forEach((tr) => {
        ctx.strokeStyle =
          ks[tr[0]] != ks[tr[1]] || ks[tr[0]] != ks[tr[2]] ? "green" : "blue";
        ctx.beginPath();
        ctx.moveTo(positions[tr[0]][0], positions[tr[0]][1]);
        for (let i = 3; i--; )
          ctx.lineTo(positions[tr[i]][0], positions[tr[i]][1]);
        ctx.stroke();
      });
    }

    if (b.indexes.reduce((s, is) => s + +!!is.length, 0) >= 2) {
      const lines = getBorders(positions, ks, triangles);

      {
        ctx.lineWidth = 2 / state.camera.a;
        ctx.strokeStyle = "#eee";
        lines.forEach(({ line }) => {
          ctx.beginPath();
          ctx.moveTo(line[0][0], line[0][1]);
          for (let i = 0; i < line.length; i++)
            ctx.lineTo(line[i][0], line[i][1]);
          ctx.stroke();
        });
      }
    }

    return { positions, ks, triangles };
  });
};
