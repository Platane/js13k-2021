import { vec2 } from "gl-matrix";
import { emptyBox, enlargeBoxByPoints } from "./box";
import { linesIntersection } from "./lineIntersection";
import { Box, Vec2 } from "./types";

type Triangle = [Vec2, Vec2, Vec2];

const nAB: Vec2 = [0, 0];
const nBC: Vec2 = [0, 0];
const mAB: Vec2 = [0, 0];
const mBC: Vec2 = [0, 0];

export const getCircumscribedCircleCenter = (
  out: Vec2,
  A: Vec2,
  B: Vec2,
  C: Vec2
) => {
  // center of circumscribed circle
  // = intersection of the three medians

  mAB[0] = (A[0] + B[0]) / 2;
  mAB[1] = (A[1] + B[1]) / 2;

  mBC[0] = (C[0] + B[0]) / 2;
  mBC[1] = (C[1] + B[1]) / 2;

  nAB[0] = A[1] - B[1];
  nAB[1] = -(A[0] - B[0]);

  nBC[0] = B[1] - C[1];
  nBC[1] = -(B[0] - C[0]);

  return linesIntersection(out, mAB, nAB, mBC, nBC);
};

type Circle = [
  // cx
  number,
  // cy
  number,
  // square radius
  number
];

const getCircumscribedCircle = (A: Vec2, B: Vec2, C: Vec2) => {
  const c = [0, 0, 0];
  getCircumscribedCircleCenter(c as any, A, B, C);

  c[2] = vec2.squaredDistance(A, c as any);
  return c;
};

export const getBoundingTriangle = (box: Box): Triangle => [
  [box[0][0], box[0][1]],
  [box[0][0], box[0][1] + (box[1][1] - box[0][1]) * 2],
  [box[0][0] + (box[1][0] - box[0][0]) * 2, box[0][1]],
];

const boundingBox: Box = [
  [0, 0],
  [0, 0],
];
export const getTriangulation = (positions: Vec2[]) => {
  enlargeBoxByPoints(emptyBox(boundingBox), positions);
  boundingBox[0][0] -= 1000 * 1000;
  boundingBox[0][1] -= 1000 * 1000;
  boundingBox[1][0] += 1000 * 1000;
  boundingBox[1][1] += 1000 * 1000;
  const rootTriangle = getBoundingTriangle(boundingBox);

  const n = positions.length;

  positions.push(...rootTriangle);
  const triangles = [[n, n + 1, n + 2]];
  const circles = [getCircumscribedCircle(...rootTriangle)];

  for (let i = n; i--; ) {
    const p = positions[i];

    //
    // grab all the triangles for which p is contained in the circle

    const edges: [number, number, number][] = [];

    for (let j = circles.length; j--; )
      if (vec2.squaredDistance(p, circles[j] as any) <= circles[j][2]) {
        const tr = triangles[j];

        // remove the triangle
        circles.splice(j, 1);
        triangles.splice(j, 1);

        // add the edges
        for (let k = 3; k--; ) {
          const a = tr[k];
          const b = tr[(k + 1) % 3];

          const l = edges.findIndex(
            ([a0, b0]) => (a0 === a && b0 === b) || (a0 === b && b0 === a)
          );

          if (l > -1) edges.splice(l, 1);
          else edges.push([a, b, 0] as any);
        }
      }

    // recompose triangles from the edges
    for (let j = edges.length; j--; ) {
      // re-use the edge
      const tr = edges[j];
      tr[2] = i;

      circles.push(
        getCircumscribedCircle(positions[tr[0]], positions[tr[1]], p)
      );
      triangles.push(tr);
    }
  }

  // remove the triangles formed with the rootTriangle
  for (let i = triangles.length; i--; )
    if (triangles[i][0] >= n || triangles[i][1] >= n || triangles[i][2] >= n)
      triangles.splice(i, 1);

  // remove root triangle
  positions.splice(n, 3);

  // return tt;
  return triangles as unknown as [number, number, number][];
};
