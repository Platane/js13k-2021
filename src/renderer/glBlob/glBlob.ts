import codeFrag from "./shader.frag";
import codeVert from "./shader.vert";
import { gl } from "../../canvas";
import { createProgram } from "./utils";
import { state } from "../../state";
import { tau, threshold } from "../../math/gauss";
import { textures } from "../blob/textures";

const program = createProgram(gl, codeVert, codeFrag);
gl.useProgram(program);

const maxBoxes = 1;
const maxK = state.particlesPositions.length;
const maxPoint = 256;

const pointTextureWidth = maxBoxes * maxK;
const pointTextureHeight = maxPoint;

const pointTexture = gl.createTexture();
const pointTextureData = new Uint16Array(
  pointTextureWidth * pointTextureHeight * 2
);
const pointTextureLocation = gl.getUniformLocation(program, "pointTexture");
gl.activeTexture(gl.TEXTURE1);
gl.bindTexture(gl.TEXTURE_2D, pointTexture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.uniform1i(pointTextureLocation, 1);

//
// bind banner atlas
{
  const bannerTexture = gl.createTexture();
  const bannerTextureLocation = gl.getUniformLocation(program, "bannerTexture");
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, bannerTexture);
  gl.uniform1i(bannerTextureLocation, 0);
  const bannerAtlas = document.createElement("canvas");
  bannerAtlas.width = textures.length * textures[0].width;
  bannerAtlas.height = textures[0].height;
  const bannerAtlasCtx = bannerAtlas.getContext("2d")!;
  textures.forEach((canvas, i) =>
    bannerAtlasCtx.drawImage(canvas, i * canvas.width, 0)
  );
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
}

//
// bind uniform
{
  gl.uniform1f(gl.getUniformLocation(program, "tauSquare"), tau * tau);
  gl.uniform1f(gl.getUniformLocation(program, "threshold"), threshold);
  gl.uniform1i(
    gl.getUniformLocation(program, "nPoint"),
    state.particlesPositions.reduce((a, { length }) => Math.max(a, length), 0)
  );
  gl.uniform1i(
    gl.getUniformLocation(program, "nK"),
    state.particlesPositions.length
  );
}

// buffer
var vertexBuffer = gl.createBuffer();
var vertexBufferData = new Float32Array(
  // prettier-ignore
  [
  -1, -1, 
  1, -1, 
  1, 1, 
  
  1, 1, 
  -1, 1, 
  -1, -1,
]
);
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexBufferData, gl.STATIC_DRAW);
const vertexLocation = gl.getAttribLocation(program, "vertex");
gl.bindAttribLocation(program, vertexLocation, "vertex");

export const draw = () => {
  pointTextureData.fill(0);
  state.particlesPositions.forEach((pos, k) =>
    pos.forEach(([x, y], i) => {
      if (i < maxPoint) {
        const ux = 0 * maxK + k;
        const uy = i;
        const u = (uy * pointTextureWidth + ux) * 2;

        pointTextureData[u + 0] = x;
        pointTextureData[u + 1] = y;
      }
    })
  );

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

  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.enableVertexAttribArray(vertexLocation);
  gl.vertexAttribPointer(vertexLocation, 2, gl.FLOAT, false, 0, 0);

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 6); // execute program
};
