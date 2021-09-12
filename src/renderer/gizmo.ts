import { state } from "../state";
import { allyRepulsionForce } from "../system/step";
import { neighborForce } from "../system/walking";

export const draw = (ctx: CanvasRenderingContext2D) => {
  ctx.lineWidth = 0.7 / state.camera.a;
  ctx.fillStyle = ctx.strokeStyle = "purple";
  ctx.font = `${Math.floor(8 / state.camera.a)}px sans-serif `;

  {
    const l = 1000;
    ctx.beginPath();
    ctx.moveTo(10 / state.camera.a, 17 / state.camera.a);
    ctx.lineTo(10 / state.camera.a, 20 / state.camera.a);
    ctx.lineTo(10 / state.camera.a + l, 20 / state.camera.a);
    ctx.lineTo(10 / state.camera.a + l, 17 / state.camera.a);
    ctx.stroke();
    ctx.beginPath();
    ctx.fillText(
      Intl.NumberFormat().format(l),
      10 / state.camera.a,
      16 / state.camera.a
    );
  }

  {
    const l = 10000;
    ctx.beginPath();
    ctx.moveTo(10 / state.camera.a, 47 / state.camera.a);
    ctx.lineTo(10 / state.camera.a, 50 / state.camera.a);
    ctx.lineTo(10 / state.camera.a + l, 50 / state.camera.a);
    ctx.lineTo(10 / state.camera.a + l, 47 / state.camera.a);
    ctx.stroke();
    ctx.beginPath();
    ctx.fillText(
      Intl.NumberFormat().format(l),
      10 / state.camera.a,
      46 / state.camera.a
    );
  }

  {
    const l = 10000;

    ctx.save();
    ctx.translate(10 / state.camera.a, 120 / state.camera.a);
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
      ctx.lineTo(d, -y * 1);
    }
    ctx.stroke();
    ctx.restore();
  }
};
