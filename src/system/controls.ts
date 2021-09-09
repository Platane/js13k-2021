import { vec2 } from "gl-matrix";
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
let action = null as null | typeof selectAction | typeof moveAction;
let downTimestamp = 0;

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

  switch (button) {
    case 0: {
      const p = unProj([0, 0], pageX, pageY);

      action = selectAction;
      state.selection.rect = [p, p.slice() as Vec2];
      state.selection.particlesIndexes = null;

      break;
    }
    case 2: {
      const indexes = state.selection.particlesIndexes;

      if (!indexes) return;

      // remove particles from older orders
      state.particlesMoveOrders[0].forEach((order, i) => {
        order.indexes = order.indexes.filter((j) => !indexes.includes(j));

        if (order.indexes.length === 0)
          state.particlesMoveOrders[0].splice(i, 1);
      });

      // place order
      state.particlesMoveOrders[0].push({
        indexes,
        targets: [{ point: unProj([0, 0], pageX, pageY) }],
      });

      break;
    }
  }
};

const onMouseMove = ({ pageX, pageY }: MouseEvent) => {
  if (!state.selection.rect || action !== selectAction) return;

  state.selection.rect[1][0] = unProjX(pageX);
  state.selection.rect[1][1] = unProjY(pageY);

  const isHit = getBoxCollisionFunction(state.selection.rect);

  state.selection.particlesIndexes = state.particlesPositions[0].reduce(
    (arr, p, i) => (isHit(p) ? [...arr, i] : arr),
    [] as number[]
  );
};

const onMouseUp = ({ pageX, pageY, timeStamp }: MouseEvent) => {
  if (
    action === selectAction &&
    timeStamp - downTimestamp < 240 &&
    (!state.selection.rect ||
      vec2.distance(state.selection.rect[0], state.selection.rect[1]) <
        20 / state.camera.a)
  ) {
    const p = unProj([0, 0], pageX, pageY);

    const pack = blobHit(p, state.particlesPositions[0]);

    state.selection.particlesIndexes = pack;
  }

  state.selection.rect = null;
  action = null;
};
document.addEventListener("mousemove", onMouseMove);
document.addEventListener("mousedown", onMouseDown);
document.addEventListener("mouseup", onMouseUp);
document.addEventListener("contextmenu", (e) => e.preventDefault());
