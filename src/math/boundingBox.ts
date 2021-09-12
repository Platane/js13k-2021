import { state } from "../state";
import { boxCollide, enlargeBoxByBox } from "./box";
import { Box, Vec2 } from "./types";

{
  const boxes = Array.from({ length: 400 }, () => ({
    indexes: [0],
    box: [
      [0, 0],
      [0, 0],
    ] as Box,
  }));

  const getBoundingBoxes = (positions: Vec2[][], margin: number) => {
    let n = 0;
    let o = 0;

    return positions.map((ps) => {
      o = n;

      ps.forEach((p, i) => {
        const b = boxes[n++];

        b.box[0][0] = p[0] - margin;
        b.box[0][1] = p[1] - margin;
        b.box[1][0] = p[0] + margin;
        b.box[1][1] = p[1] + margin;
        b.indexes.length = 1;
        b.indexes[0] = i;
      });

      let changed = true;
      while (changed) {
        changed = false;
        for (let i = o; i < n; i++)
          for (let j = i + 1; j < n; j++)
            if (boxCollide(boxes[i].box, boxes[j].box)) {
              enlargeBoxByBox(boxes[i].box, boxes[j].box);

              boxes[i].indexes.push(...boxes[j].indexes);

              boxes.push(...boxes.splice(j, 1));

              n--;

              changed = true;
            }
      }

      return boxes.slice(o, n);
    });
  };
}

const boxes = Array.from({ length: 400 }, () => ({
  indexes: state.particlesPositions.map(() => [] as number[]),
  box: [
    [0, 0],
    [0, 0],
  ] as Box,
}));

export const getBoundingBoxes = (positions: Vec2[][], margin: number) => {
  let n = 0;

  positions.map((ps, k) =>
    ps.forEach((p, i) => {
      const b = boxes[n++];

      b.box[0][0] = p[0] - margin;
      b.box[0][1] = p[1] - margin;
      b.box[1][0] = p[0] + margin;
      b.box[1][1] = p[1] + margin;

      b.indexes.forEach((arr) => (arr.length = 0));
      b.indexes[k].push(i);
    })
  );

  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++)
        if (boxCollide(boxes[i].box, boxes[j].box)) {
          enlargeBoxByBox(boxes[i].box, boxes[j].box);

          boxes[j].indexes.forEach((_, k) => {
            boxes[i].indexes[k].push(...boxes[j].indexes[k]);
          });

          boxes.push(...boxes.splice(j, 1));

          n--;

          changed = true;
        }
  }

  return boxes.slice(0, n);
};
