import codeFrag from "./shader.frag";
import codeVert from "./shader.vert";
import { gl } from "../../canvas";
import { createProgram } from "./utils";
import { state } from "../../state";
import { dMin, tau, threshold } from "../../math/gauss";
import { textures } from "../blob/textures";
import { getBoundingBoxes } from "../../math/boundingBox";
import { getProjection } from "./getProjection";
import { vec2 } from "gl-matrix";

const program = createProgram(gl, codeVert, codeFrag);
gl.useProgram(program);

const maxBoxes = 16;
const maxK = state.particlesPositions.length;
const maxPoint = 128;

const pointTextureWidth = maxBoxes * maxK;
const pointTextureHeight = maxPoint;

const pointTexture = gl.createTexture();
const pointTextureData = new Uint16Array(
  pointTextureWidth * pointTextureHeight * 2
);
const pointTextureLocation = gl.getUniformLocation(program, "pointTexture");
gl.activeTexture(gl.TEXTURE1);
gl.bindTexture(gl.TEXTURE_2D, pointTexture);
gl.uniform1i(pointTextureLocation, 1);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

//
// bind banner atlas

const bannerTexture = gl.createTexture();
const bannerTextureLocation = gl.getUniformLocation(program, "bannerTexture");
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, bannerTexture);
gl.uniform1i(bannerTextureLocation, 0);
const bannerAtlas = document.createElement("canvas");
bannerAtlas.width = state.particlesPositions.length * textures[0].width;
bannerAtlas.height = textures[0].height;
const bannerAtlasCtx = bannerAtlas.getContext("2d")!;
state.particlesPositions.forEach((_, i) => {
  const canvas = textures[i % textures.length];
  bannerAtlasCtx.drawImage(canvas, i * canvas.width, 0);
});
gl.texImage2D(
  gl.TEXTURE_2D,
  0,
  gl.RGBA,
  bannerAtlas.width,
  bannerAtlas.height,
  0,
  gl.RGBA,
  gl.UNSIGNED_BYTE,
  bannerAtlas
);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.generateMipmap(gl.TEXTURE_2D);

//
// bind uniform
{
  gl.uniform1f(gl.getUniformLocation(program, "tauSquare"), tau * tau);
  gl.uniform1f(gl.getUniformLocation(program, "threshold"), threshold);
  gl.uniform1i(
    gl.getUniformLocation(program, "nK"),
    state.particlesPositions.length
  );
}
const nPointLocation = gl.getUniformLocation(program, "nPoint");

//
// worldMatrix
const worldMatrixLocation = gl.getUniformLocation(program, "worldMatrix");
const worldMatrixData = new Float32Array(9);

// buffer
const positionBuffer = gl.createBuffer();
const positionBufferData = new Float32Array(maxBoxes * 6 * 2);
const positionLocation = gl.getAttribLocation(program, "position");
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
gl.bufferData(gl.ARRAY_BUFFER, positionBufferData, gl.STATIC_DRAW);
gl.bindAttribLocation(program, positionLocation, "position");

const iBoxBuffer = gl.createBuffer();
const iBoxBufferData = new Float32Array(maxBoxes * 6);
for (let i = maxBoxes; i--; ) iBoxBufferData.fill(i, i * 6, (i + 1) * 6);
const iBoxLocation = gl.getAttribLocation(program, "iBox");
gl.bindBuffer(gl.ARRAY_BUFFER, iBoxBuffer);
gl.enableVertexAttribArray(iBoxLocation);
gl.vertexAttribPointer(iBoxLocation, 1, gl.FLOAT, false, 0, 0);
gl.bufferData(gl.ARRAY_BUFFER, iBoxBufferData, gl.STATIC_DRAW);
gl.bindAttribLocation(program, iBoxLocation, "iBox");

export const draw = () => {
  const boxes = getBoundingBoxes(state.particlesPositions, dMin * 1.6);

  pointTextureData.fill(0);

  boxes.forEach(({ box, indexes }, i) => {
    positionBufferData[i * 12 + 0] = box[0][0];
    positionBufferData[i * 12 + 1] = box[0][1];

    positionBufferData[i * 12 + 2] = box[1][0];
    positionBufferData[i * 12 + 3] = box[0][1];

    positionBufferData[i * 12 + 4] = box[1][0];
    positionBufferData[i * 12 + 5] = box[1][1];
    //
    positionBufferData[i * 12 + 6] = box[1][0];
    positionBufferData[i * 12 + 7] = box[1][1];

    positionBufferData[i * 12 + 8] = box[0][0];
    positionBufferData[i * 12 + 9] = box[1][1];

    positionBufferData[i * 12 + 10] = box[0][0];
    positionBufferData[i * 12 + 11] = box[0][1];

    indexes.forEach((is, k) =>
      is.forEach((index, j) => {
        const [x, y] = state.particlesPositions[k][index];

        if (j < maxPoint) {
          const ux = i * maxK + k;
          const uy = j;
          const u = (uy * pointTextureWidth + ux) * 2;

          pointTextureData[u + 0] = x;
          pointTextureData[u + 1] = y;
        }
      })
    );
  });

  const nPoint = Math.max(
    ...boxes.map(({ indexes }) => indexes.map(({ length }) => length)).flat()
  );

  gl.useProgram(program);

  gl.uniform1i(nPointLocation, nPoint);

  getProjection(
    worldMatrixData,
    state.viewportDimensions[0] / state.viewportDimensions[1],
    1 / state.camera.a,
    state.camera.offset
  );

  gl.uniformMatrix3fv(worldMatrixLocation, false, worldMatrixData);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positionBufferData, gl.DYNAMIC_DRAW);

  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, pointTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RG16UI,
    pointTextureWidth,
    pointTextureHeight,
    0,
    gl.RG_INTEGER,
    gl.UNSIGNED_SHORT,
    pointTextureData
  );

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, bannerTexture);

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 6 * boxes.length);
};
