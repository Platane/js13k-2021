// @ts-ignore
import Stats from "stats.js";

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

stats.begin();
const animate = () => {
  // monitored code goes here

  requestAnimationFrame(animate);
  stats.end();
  stats.begin();
};

requestAnimationFrame(animate);
