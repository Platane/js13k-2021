export const textures: HTMLCanvasElement[] = [];
export const texturesData: Uint8ClampedArray[] = [];

export const s = 30;

{
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = s;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(s / 100, s / 100);

  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.fillRect(0, 0, 100, 100);

  ctx.fillStyle = "#f5ce88";
  ctx.beginPath();
  ctx.moveTo(50, 14);
  ctx.lineTo(10, 55);
  ctx.lineTo(90, 55);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(50, 60, 28, 0, Math.PI);
  ctx.fill();

  const { data } = ctx.getImageData(0, 0, s, s);
  texturesData.push(data);

  textures.push(canvas);
}

{
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = s;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(s / 100, s / 100);

  ctx.fillStyle = "seagreen";
  ctx.beginPath();
  ctx.fillRect(0, 0, 100, 100);

  ctx.fillStyle = "#3fb774";
  ctx.beginPath();
  ctx.moveTo(50, 14);
  ctx.lineTo(10, 55);
  ctx.lineTo(50, 80);
  ctx.lineTo(90, 55);
  ctx.fill();

  const { data } = ctx.getImageData(0, 0, s, s);
  texturesData.push(data);

  textures.push(canvas);
}

{
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = s;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(s / 100, s / 100);

  ctx.fillStyle = "#b73f2b";
  ctx.beginPath();
  ctx.fillRect(0, 0, 100, 100);

  ctx.fillStyle = "#bf5d4d";
  ctx.beginPath();
  ctx.arc(50, 60, 28, 0, Math.PI);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(50, 40, 28, -Math.PI, 0);
  ctx.fill();

  const { data } = ctx.getImageData(0, 0, s, s);
  texturesData.push(data);

  textures.push(canvas);
}

export const colors = texturesData.map(
  (data) => `rgb(${data[0]},${data[1]},${data[2]})`
);
