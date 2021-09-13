import { vec2 } from "gl-matrix";
import { emptyBox, enlargeBoxByPoint, enlargeBoxByPoints } from "../math/box";
import { isInsideBlob } from "../math/gauss";
import { getPack } from "../math/pack";
import { Vec2 } from "../math/types";
import { state } from "../state";
import { unProj, unProjX, unProjY } from "./camera";

const getBoxCollisionFunction = ([[ax, ay], [bx, by]]: [Vec2, Vec2]) => {
  const xMin = Math.min(ax, bx);
  const xMax = Math.max(ax, bx);
  const yMin = Math.min(ay, by);
  const yMax = Math.max(ay, by);

  return ([x, y]: Vec2) => xMin <= x && x <= xMax && yMin <= y && y <= yMax;
};

const selectAction = Symbol();
const moveAction = Symbol();
const splitAction = Symbol();
let action = null as
  | null
  | typeof selectAction
  | typeof moveAction
  | typeof splitAction;

let tap = false;
let downTimestamp = 0;
const downScreenPosition: Vec2 = [0, 0];

const blobHit = (p: Vec2, positions: Vec2[]) => {
  if (!isInsideBlob(positions, p[0], p[1])) return null;

  let minD = Infinity;
  let minI = 0;

  positions.forEach((o, i) => {
    const d = vec2.distance(o, p);

    if (d < minD) {
      minD = d;
      minI = i;
    }
  });

  return getPack(positions, minI);
};

const onMouseDown = ({
  pageX,
  pageY,
  button,
  ctrlKey,
  timeStamp,
}: MouseEvent) => {
  action = null;
  downTimestamp = timeStamp;
  tap = true;
  downScreenPosition[0] = pageX;
  downScreenPosition[1] = pageY;

  switch (button) {
    case 0: {
      const p = unProj([0, 0], pageX, pageY);

      if (ctrlKey) {
        action = selectAction;
        state.selection.rect = [p, p.slice() as Vec2];
        state.selection.particlesIndexes = null;
      } else {
        // check if the pointer is inside the currently selected blob
        if (
          !state.selection.particlesIndexes ||
          !isInsideBlob(
            (state.selection.particlesIndexes ?? []).map(
              (i) => state.particlesPositions[state.selection.k][i]
            ),
            p[0],
            p[1]
          )
        ) {
          state.selection.particlesIndexes = null;

          for (let k = state.particlesPositions.length; k--; ) {
            const pack = blobHit(p, state.particlesPositions[k]);
            if (pack) {
              state.selection.particlesIndexes = pack;
              state.selection.k = k;
            }
          }
        }

        if (
          state.selection.particlesIndexes &&
          state.selection.particlesIndexes.length >= 4
        )
          action = splitAction;
      }
      break;
    }
    case 2: {
      const indexes = state.selection.particlesIndexes;

      if (!indexes) return;

      const k = state.selection.k;

      // remove particles from older orders
      state.particlesMoveOrders[k].forEach((order, i) => {
        order.indexes = order.indexes.filter((j) => !indexes.includes(j));

        if (order.indexes.length === 0)
          state.particlesMoveOrders[k].splice(i, 1);
      });

      // place order
      state.particlesMoveOrders[k].push({
        indexes: indexes.slice(),
        target: { point: unProj([0, 0], pageX, pageY) },
      });

      break;
    }
  }
};

const onMouseMove = ({ pageX, pageY }: MouseEvent) => {
  tap = tap && vec2.distance(downScreenPosition, [pageX, pageY]) < 50;

  switch (action) {
    case splitAction: {
      const p: Vec2 = [pageX, pageY];

      const v = vec2.sub([0, 0], downScreenPosition, p);

      if (vec2.length(v) > 100) {
        action = null;
        vec2.normalize(v, v);

        const k = state.selection.k;

        const indexes = state.selection
          .particlesIndexes!.slice()
          .sort(
            (a, b) =>
              vec2.dot(v, state.particlesPositions[k][a]) -
              vec2.dot(v, state.particlesPositions[k][b])
          );

        const n = Math.floor(indexes.length / 2);

        const as = indexes.slice(0, n);
        const bs = indexes.slice(n);

        const aTarget: Vec2 = [0, 0];
        unProj(aTarget, pageX, pageY),
          vec2.scaleAndAdd(aTarget, aTarget, v, 500 + Math.sqrt(n) * 500);

        const bBox = emptyBox([[], []] as any);
        bs.forEach((i) =>
          enlargeBoxByPoint(bBox, state.particlesPositions[k][i])
        );
        const bTarget: Vec2 = [0, 0];
        vec2.lerp(bTarget, ...bBox, 0.5);
        vec2.scaleAndAdd(bTarget, bTarget, v, 500 + Math.sqrt(n) * 500);

        // remove particles from older orders
        state.particlesMoveOrders[k].forEach((order, i) => {
          order.indexes = order.indexes.filter((j) => !indexes.includes(j));

          if (order.indexes.length === 0)
            state.particlesMoveOrders[k].splice(i, 1);
        });

        // place order
        state.particlesMoveOrders[k].push(
          { indexes: as, target: { point: aTarget } },
          { indexes: bs, target: { point: bTarget } }
        );
        state.selection.particlesIndexes = as.slice();
      }

      break;
    }

    case selectAction: {
      const rect = state.selection.rect!;

      rect[1][0] = unProjX(pageX);
      rect[1][1] = unProjY(pageY);

      const isHit = getBoxCollisionFunction(rect);

      state.selection.particlesIndexes = state.particlesPositions[
        state.selection.k
      ].reduce((arr, p, i) => (isHit(p) ? [...arr, i] : arr), [] as number[]);

      break;
    }
  }
};

const onMouseUp = ({ pageX, pageY, timeStamp }: MouseEvent) => {
  if (action && tap && timeStamp - downTimestamp < 240) {
    const p = unProj([0, 0], downScreenPosition[0], downScreenPosition[1]);

    for (let k = state.particlesPositions.length; k--; ) {
      const pack = blobHit(p, state.particlesPositions[k]);
      if (pack) {
        state.selection.particlesIndexes = pack;
        state.selection.k = k;
      }
    }
  }

  state.selection.rect = null;
  action = null;
};
document.addEventListener("mousemove", onMouseMove);
document.addEventListener("mousedown", onMouseDown);
document.addEventListener("mouseup", onMouseUp);
document.addEventListener("contextmenu", (e) => e.preventDefault());
