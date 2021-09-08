import dat from "dat.gui";

export const debug = {
  cheapRenderer: false,
  particles: !false,
  boundingBoxes: false,
  pack: false,
};

if (process.env.NODE_ENV !== "production") {
  const gui = new dat.GUI();

  gui.useLocalStorage = true;

  gui.add(debug, "cheapRenderer");
  gui.add(debug, "particles");
  gui.add(debug, "boundingBoxes");
  gui.add(debug, "pack");
}
