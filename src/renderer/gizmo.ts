import { ctx } from "../canvas";
import { allyRepulsionForce } from "../system/step";

export const drawGizmo = () => {
  const u = (ctx as any).pixelSize;

  ctx.lineWidth = 0.7 * u;

  ctx.fillStyle = ctx.strokeStyle = "purple";
  ctx.font = `${Math.floor(8 * u)}px sans-serif `;

  {
    const l = 1000;
    ctx.beginPath();
    ctx.moveTo(10 * u, 17 * u);
    ctx.lineTo(10 * u, 20 * u);
    ctx.lineTo(10 * u + l, 20 * u);
    ctx.lineTo(10 * u + l, 17 * u);
    ctx.stroke();
    ctx.beginPath();
    ctx.fillText(Intl.NumberFormat().format(l), 10 * u, 16 * u);
  }

  {
    const l = 10000;
    ctx.beginPath();
    ctx.moveTo(10 * u, 47 * u);
    ctx.lineTo(10 * u, 50 * u);
    ctx.lineTo(10 * u + l, 50 * u);
    ctx.lineTo(10 * u + l, 47 * u);
    ctx.stroke();
    ctx.beginPath();
    ctx.fillText(Intl.NumberFormat().format(l), 10 * u, 46 * u);
  }

  {
    const l = 10000;

    ctx.save();
    ctx.translate(10 * u, 120 * u);
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(l, 0);
    ctx.stroke();

    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let d = 0; d < l; d += 50) {
      const y = allyRepulsionForce(d);
      ctx.lineTo(d, -y * 0.4);
    }
    ctx.stroke();
    ctx.restore();
  }
};
