const q = Object.fromEntries(
  Array.from(
    (new URLSearchParams(window.location.search) as any).entries()
  ).map(([name, value]: any) => [name, value !== "0"])
);

export const debug = {
  meshes: !false,
  particles: !false,
  boundingBoxes: !false,
};
Object.assign(debug, q);
