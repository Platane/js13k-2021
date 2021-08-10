import { Vec2 } from "../math/types";
import { state } from "../state";

const getCollisionFunction = ([[ax, ay], [bx, by]]: [Vec2, Vec2]) => {
  const xMin = Math.min(ax, bx);
  const xMax = Math.max(ax, bx);
  const yMin = Math.min(ay, by);
  const yMax = Math.max(ay, by);

  return ([x, y]: Vec2) => xMin <= x && x <= xMax && yMin <= y && y <= yMax;
};

const onMouseDown = ({ pageX, pageY }: MouseEvent) => {
  state.selection.rect = [
    [pageX, pageY],
    [pageX, pageY],
  ];
};
const onMouseMove = ({ pageX, pageY }: MouseEvent) => {
  if (!state.selection.rect) return;
  state.selection.rect[1][0] = pageX;
  state.selection.rect[1][1] = pageY;
};
const onMouseUp = ({ pageX, pageY }: MouseEvent) => {
  state.selection.rect = null;
};
document.addEventListener("mousemove", onMouseMove);
document.addEventListener("mousedown", onMouseDown);
document.addEventListener("mouseup", onMouseUp);
