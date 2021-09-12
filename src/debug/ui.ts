// import dat from "dat.gui";
import { Pane } from "tweakpane";

export const debug = {
  cheapRenderer: !false,
  hightResolution: false,
  particles: !false,
  boundingBoxes: false,
  pack: false,
};

if (process.env.NODE_ENV !== "production") {
  const pane = new Pane();

  (pane as any).addInput(debug, "cheapRenderer");
  (pane as any).addInput(debug, "hightResolution");
  (pane as any).addInput(debug, "particles");
  (pane as any).addInput(debug, "boundingBoxes");
  (pane as any).addInput(debug, "pack");
}
