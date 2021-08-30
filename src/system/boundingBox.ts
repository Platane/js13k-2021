import { state } from "../state";
import { boxCollide, enlargeBoxByBox } from "../math/box";
import { tau, threshold } from "../math/gauss";
import { Box } from "../math/types";

export const dMin = Math.sqrt(-2 * Math.log(threshold) * (tau * tau)) * 1.5;

export const onUpdate = () => {
  state.particlesBoundingBoxes.forEach((boundingBoxes, k) => {
    while (boundingBoxes[0]) boundingBoxes.shift();

    const boxes = state.particlesPositions[k].map(([x, y], i) => ({
      box: [
        [x - dMin, y - dMin],
        [x + dMin, y + dMin],
      ] as Box,
      indexes: [i],
    }));

    let changed = true;
    while (changed) {
      changed = false;
      for (let i = 0; i < boxes.length; i++)
        for (let j = i + 1; j < boxes.length; j++)
          if (boxCollide(boxes[i].box, boxes[j].box)) {
            boxes[i].indexes.push(...boxes[j].indexes);
            enlargeBoxByBox(boxes[i].box, boxes[j].box);
            boxes.splice(j, 1);
            j--;
            changed = true;
            break;
          }
    }

    boundingBoxes.push(...boxes);
  });
};
