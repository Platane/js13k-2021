import { Vec2 } from "../math/types";
import { state } from "../state";

const getCollisionFunction = ([[ax, ay], [bx, by]]: [Vec2, Vec2]) => {
  const xMin = Math.min(ax, bx);
  const xMax = Math.max(ax, bx);
  const yMin = Math.min(ay, by);
  const yMax = Math.max(ay, by);

  return ([x, y]: Vec2) => xMin <= x && x <= xMax && yMin <= y && y <= yMax;
};

const selectAction = Symbol();
const moveAction = Symbol();
let action = null as null | typeof selectAction | typeof moveAction;

const onMouseDown = ({ pageX, pageY, button, ctrlKey }: MouseEvent) => {
  switch (button) {
    case 0: {
      action = selectAction;

      state.selection.rect = [
        [pageX, pageY],
        [pageX, pageY],
      ];
      state.selection.particlesIndexes = null;
    }
    case 2: {
      action = selectAction;

      const indexes = state.selection.particlesIndexes;

      if (!indexes) return;

      // remove particles from older orders
      state.particlesMoveOrders[0].forEach((order, i) => {
        order.indexes = order.indexes.filter((j) => !indexes.includes(j));

        if (order.indexes.length === 0)
          state.particlesMoveOrders[0].splice(i, 1);
      });

      // place order
      state.particlesMoveOrders[0].push({ indexes, targets: [[pageX, pageY]] });
    }
  }
};

const onMouseMove = ({ pageX, pageY }: MouseEvent) => {
  if (!state.selection.rect || action !== selectAction) return;

  state.selection.rect[1][0] = pageX;
  state.selection.rect[1][1] = pageY;

  const isHit = getCollisionFunction(state.selection.rect);

  state.selection.particlesIndexes = state.particlesPositions[0].reduce(
    (arr, p, i) => (isHit(p) ? [...arr, i] : arr),
    [] as number[]
  );
};

const onMouseUp = ({ pageX, pageY }: MouseEvent) => {
  state.selection.rect = null;
};
document.addEventListener("mousemove", onMouseMove);
document.addEventListener("mousedown", onMouseDown);
document.addEventListener("mouseup", onMouseUp);
document.addEventListener("contextmenu", (e) => e.preventDefault());
