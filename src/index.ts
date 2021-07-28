import "./mock-random";
import "./stats";

import { draw } from "./renderer/blob/blob";
import { Vec2 } from "./types";

const canvas = document.getElementsByTagName("canvas")[0];
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const ctx = canvas.getContext("2d")!;

const particles: Vec2[][] = [
  Array.from({ length: 8 }, () => [
    Math.random() * 60 + 60,
    Math.random() * 80 + 100,
  ]),

  Array.from({ length: 8 }, () => [
    Math.random() * 60 + 10,
    Math.random() * 80 + 30,
  ]),

  Array.from({ length: 8 }, () => [
    Math.random() * 50 + 80,
    Math.random() * 80 + 30,
  ]),
];

draw(ctx, particles);

const loop = () => {
  draw(ctx, particles);
  requestAnimationFrame(loop);
};
loop();
