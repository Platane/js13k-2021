// @ts-ignore
import Stats from "stats.js";

if (process.env.NODE_ENV !== "production") {
  const stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  stats.dom.style.bottom = 0;
  stats.dom.style.top = "auto";

  stats.begin();
  const animate = () => {
    // monitored code goes here

    requestAnimationFrame(animate);
    stats.end();
    stats.begin();
  };

  requestAnimationFrame(animate);
}
