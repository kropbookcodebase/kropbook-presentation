/**
 * KROPBOOK — Minimal GLB Viewer
 * Parses binary GLTF (GLB) files and renders the first mesh using WebGL 1.0.
 * No external dependencies — pure browser JavaScript.
 */

(function () {
  'use strict';

  /* ── mat4 utilities (column-major, Float32Array) ──────────── */
  function mat4Create() {
    var m = new Float32Array(16);
    m[0] = m[5] = m[10] = m[15] = 1;
    return m;
  }

  function mat4Multiply(out, a, b) {
    var a00=a[0],a01=a[1],a02=a[2],a03=a[3];
    var a10=a[4],a11=a[5],a12=a[6],a13=a[7];
    var a20=a[8],a21=a[9],a22=a[10],a23=a[11];
    var a30=a[12],a31=a[13],a32=a[14],a33=a[15];
    for (var i=0;i<4;i++) {
      var b0=b[i*4],b1=b[i*4+1],b2=b[i*4+2],b3=b[i*4+3];
      out[i*4]   = a00*b0+a10*b1+a20*b2+a30*b3;
      out[i*4+1] = a01*b0+a11*b1+a21*b2+a31*b3;
      out[i*4+2] = a02*b0+a12*b1+a22*b2+a32*b3;
      out[i*4+3] = a03*b0+a13*b1+a23*b2+a33*b3;
    }
    return out;
  }

  function mat4Perspective(out, fovY, aspect, near, far) {
    var f = 1.0 / Math.tan(fovY / 2);
    out[0]=f/aspect; out[1]=0; out[2]=0; out[3]=0;
    out[4]=0; out[5]=f; out[6]=0; out[7]=0;
    out[8]=0; out[9]=0; out[10]=(far+near)/(near-far); out[11]=-1;
    out[12]=0; out[13]=0; out[14]=(2*far*near)/(near-far); out[15]=0;
    return out;
  }

  function mat4LookAt(out, eye, center, up) {
    var fx=center[0]-eye[0], fy=center[1]-eye[1], fz=center[2]-eye[2];
    var fl=Math.sqrt(fx*fx+fy*fy+fz*fz);
    fx/=fl; fy/=fl; fz/=fl;
    var rx=fy*up[2]-fz*up[1], ry=fz*up[0]-fx*up[2], rz=fx*up[1]-fy*up[0];
    var rl=Math.sqrt(rx*rx+ry*ry+rz*rz);
    rx/=rl; ry/=rl; rz/=rl;
    var ux=ry*fz-rz*fy, uy=rz*fx-rx*fz, uz=rx*fy-ry*fx;
    out[0]=rx; out[1]=ux; out[2]=-fx; out[3]=0;
    out[4]=ry; out[5]=uy; out[6]=-fy; out[7]=0;
    out[8]=rz; out[9]=uz; out[10]=-fz; out[11]=0;
    out[12]=-(rx*eye[0]+ry*eye[1]+rz*eye[2]);
    out[13]=-(ux*eye[0]+uy*eye[1]+uz*eye[2]);
    out[14]= (fx*eye[0]+fy*eye[1]+fz*eye[2]);
    out[15]=1;
    return out;
  }

  function mat4RotateY(out, rad) {
    var c=Math.cos(rad), s=Math.sin(rad);
    out[0]=c;  out[1]=0; out[2]=-s; out[3]=0;
    out[4]=0;  out[5]=1; out[6]=0;  out[7]=0;
    out[8]=s;  out[9]=0; out[10]=c; out[11]=0;
    out[12]=0; out[13]=0; out[14]=0; out[15]=1;
    return out;
  }

  function mat4RotateX(out, rad) {
    var c=Math.cos(rad), s=Math.sin(rad);
    out[0]=1; out[1]=0;  out[2]=0;  out[3]=0;
    out[4]=0; out[5]=c;  out[6]=s;  out[7]=0;
    out[8]=0; out[9]=-s; out[10]=c; out[11]=0;
    out[12]=0;out[13]=0; out[14]=0; out[15]=1;
    return out;
  }

  /* ── GLTF accessor helper ─────────────────────────────────── */
  var COMP_COUNT = { SCALAR:1, VEC2:2, VEC3:3, VEC4:4, MAT2:4, MAT3:9, MAT4:16 };
  var COMP_BYTES = { 5120:1,5121:1,5122:2,5123:2,5125:4,5126:4 };

  function getAccessorData(json, bin, accessorIdx) {
    var acc = json.accessors[accessorIdx];
    var bv  = json.bufferViews[acc.bufferView];
    var byteOffset = (bv.byteOffset || 0) + (acc.byteOffset || 0);
    var compCount  = COMP_COUNT[acc.type] || 1;
    var compBytes  = COMP_BYTES[acc.componentType] || 4;
    var stride     = bv.byteStride || (compCount * compBytes);
    var count      = acc.count;

    if (acc.componentType === 5126) {
      if (stride === compCount * 4) {
        return new Float32Array(bin, byteOffset, count * compCount);
      }
      var out = new Float32Array(count * compCount);
      for (var i = 0; i < count; i++) {
        var base = byteOffset + i * stride;
        for (var c = 0; c < compCount; c++) {
          out[i * compCount + c] = new DataView(bin, base + c * 4, 4).getFloat32(0, true);
        }
      }
      return out;
    }
    if (acc.componentType === 5123) {
      if (stride === compCount * 2) {
        return new Uint16Array(bin, byteOffset, count * compCount);
      }
    }
    if (acc.componentType === 5125) {
      if (stride === compCount * 4) {
        return new Uint32Array(bin, byteOffset, count * compCount);
      }
    }
    if (acc.componentType === 5121) {
      return new Uint8Array(bin, byteOffset, count * compCount);
    }
    return new Uint16Array(bin, byteOffset, count * compCount);
  }

  /* ── Shader source ────────────────────────────────────────── */
  var VS = [
    'attribute vec3 aPos;',
    'attribute vec3 aNrm;',
    'uniform mat4 uMVP;',
    'uniform mat4 uMod;',
    'varying vec3 vN;',
    'varying vec3 vW;',
    'void main(){',
    '  gl_Position = uMVP * vec4(aPos,1.0);',
    '  vN = normalize(mat3(uMod[0].xyz,uMod[1].xyz,uMod[2].xyz)*aNrm);',
    '  vW = (uMod * vec4(aPos,1.0)).xyz;',
    '}'
  ].join('\n');

  var FS = [
    'precision mediump float;',
    'varying vec3 vN;',
    'varying vec3 vW;',
    'uniform vec3 uLight;',
    'uniform vec3 uColor;',
    'void main(){',
    '  vec3 n = normalize(vN);',
    '  vec3 l = normalize(uLight);',
    '  float d = max(dot(n,l),0.0);',
    '  vec3 v = normalize(-vW);',
    '  vec3 h = normalize(l+v);',
    '  float s = pow(max(dot(n,h),0.0),64.0);',
    '  vec3 col = uColor*(0.18+0.72*d) + vec3(0.4)*s;',
    '  gl_FragColor = vec4(col,1.0);',
    '}'
  ].join('\n');

  function compileShader(gl, src, type) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  }

  /* ── Compute bounding box for auto-fit ───────────────────── */
  function boundingBox(positions) {
    var mn = [Infinity,Infinity,Infinity], mx = [-Infinity,-Infinity,-Infinity];
    for (var i = 0; i < positions.length; i += 3) {
      mn[0]=Math.min(mn[0],positions[i]);   mx[0]=Math.max(mx[0],positions[i]);
      mn[1]=Math.min(mn[1],positions[i+1]); mx[1]=Math.max(mx[1],positions[i+1]);
      mn[2]=Math.min(mn[2],positions[i+2]); mx[2]=Math.max(mx[2],positions[i+2]);
    }
    return { min:mn, max:mx,
      cx:(mn[0]+mx[0])/2, cy:(mn[1]+mx[1])/2, cz:(mn[2]+mx[2])/2,
      size:Math.max(mx[0]-mn[0], mx[1]-mn[1], mx[2]-mn[2]) };
  }

  /* ── Main init function ──────────────────────────────────── */
  function initGLBViewer(canvasId, glbPath, opts) {
    opts = opts || {};
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;

    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      canvas.parentElement.innerHTML = '<p style="color:#888;text-align:center;padding:2rem">WebGL not supported in this browser</p>';
      return;
    }

    var dpr = window.devicePixelRatio || 1;
    var W = canvas.clientWidth  || 480;
    var H = canvas.clientHeight || 360;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;

    /* Compile program */
    var vs = compileShader(gl, VS, gl.VERTEX_SHADER);
    var fs = compileShader(gl, FS, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(prog));
      return;
    }

    var aPos  = gl.getAttribLocation(prog, 'aPos');
    var aNrm  = gl.getAttribLocation(prog, 'aNrm');
    var uMVP  = gl.getUniformLocation(prog, 'uMVP');
    var uMod  = gl.getUniformLocation(prog, 'uMod');
    var uLgt  = gl.getUniformLocation(prog, 'uLight');
    var uCol  = gl.getUniformLocation(prog, 'uColor');

    /* Load GLB */
    fetch(glbPath)
      .then(function (r) { return r.arrayBuffer(); })
      .then(function (buf) {
        var dv = new DataView(buf);
        /* GLB header */
        var magic = dv.getUint32(0, true);
        if (magic !== 0x46546C67) { console.error('Not a GLB file'); return; }
        /* JSON chunk */
        var jsonLen  = dv.getUint32(12, true);
        var jsonData = new TextDecoder().decode(new Uint8Array(buf, 20, jsonLen));
        var json     = JSON.parse(jsonData);
        /* Binary chunk */
        var binStart = 20 + jsonLen + 8;
        var bin      = buf.slice(binStart);

        /* Collect all primitives from all meshes */
        var allPos = [], allNrm = [], allIdx = [];
        var offset = 0;

        (json.meshes || []).forEach(function (mesh) {
          (mesh.primitives || []).forEach(function (prim) {
            var posData = getAccessorData(json, bin, prim.attributes.POSITION);
            var nrmData = prim.attributes.NORMAL !== undefined
              ? getAccessorData(json, bin, prim.attributes.NORMAL)
              : null;
            var idxData = prim.indices !== undefined
              ? getAccessorData(json, bin, prim.indices)
              : null;

            /* Generate flat normals if missing */
            if (!nrmData) {
              nrmData = new Float32Array(posData.length);
              if (idxData) {
                for (var i = 0; i < idxData.length; i += 3) {
                  var i0=idxData[i]*3, i1=idxData[i+1]*3, i2=idxData[i+2]*3;
                  var ax=posData[i1]-posData[i0], ay=posData[i1+1]-posData[i0+1], az=posData[i1+2]-posData[i0+2];
                  var bx=posData[i2]-posData[i0], by=posData[i2+1]-posData[i0+1], bz=posData[i2+2]-posData[i0+2];
                  var nx=ay*bz-az*by, ny=az*bx-ax*bz, nz=ax*by-ay*bx;
                  var nl=Math.sqrt(nx*nx+ny*ny+nz*nz)||1;
                  nrmData[i0]=nx/nl; nrmData[i0+1]=ny/nl; nrmData[i0+2]=nz/nl;
                  nrmData[i1]=nx/nl; nrmData[i1+1]=ny/nl; nrmData[i1+2]=nz/nl;
                  nrmData[i2]=nx/nl; nrmData[i2+1]=ny/nl; nrmData[i2+2]=nz/nl;
                }
              }
            }

            for (var p = 0; p < posData.length; p++) allPos.push(posData[p]);
            for (var n = 0; n < nrmData.length; n++) allNrm.push(nrmData[n]);
            if (idxData) {
              for (var ix = 0; ix < idxData.length; ix++) allIdx.push(idxData[ix] + offset);
              offset += posData.length / 3;
            } else {
              /* Non-indexed: generate sequential indices */
              var vc = posData.length / 3;
              for (var v = 0; v < vc; v++) allIdx.push(v + offset);
              offset += vc;
            }
          });
        });

        var positions = new Float32Array(allPos);
        var normals   = new Float32Array(allNrm);
        var indices   = new Uint32Array(allIdx);

        /* Auto-fit camera */
        var bb = boundingBox(positions);
        var camDist = bb.size * (opts.camDistFactor || 1.8);

        /* Upload buffers */
        var posBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        var nrmBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, nrmBuf);
        gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

        /* Use Uint16 if possible, else keep Uint32 */
        var idxType, idxBuf = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
        if (indices.length > 0 && Math.max.apply(null, indices) < 65536) {
          var idx16 = new Uint16Array(indices);
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx16, gl.STATIC_DRAW);
          idxType = gl.UNSIGNED_SHORT;
        } else {
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
          idxType = gl.UNSIGNED_INT; /* requires OES_element_index_uint */
          gl.getExtension('OES_element_index_uint');
        }

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        var proj = mat4Create(), view = mat4Create(), model = mat4Create();
        var mvp  = mat4Create(), tmp  = mat4Create(), rotX = mat4Create();
        var aspect = W / H;
        mat4Perspective(proj, 0.6, aspect, 0.1, camDist * 20);
        mat4LookAt(view,
          [bb.cx, bb.cy + bb.size * 0.1, bb.cz + camDist],
          [bb.cx, bb.cy, bb.cz],
          [0, 1, 0]);
        mat4RotateX(rotX, -0.3);

        var color = opts.color || [0.55, 0.72, 0.62];
        var light = opts.light || [1.4, 2.0, 1.8];

        var angle = 0;
        var paused = false;

        function render() {
          requestAnimationFrame(render);
          if (paused) return;
          angle += 0.006;

          gl.viewport(0, 0, canvas.width, canvas.height);
          var bg = opts.bg || [0.06, 0.12, 0.09, 1.0];
          gl.clearColor(bg[0], bg[1], bg[2], bg[3]);
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

          mat4RotateY(model, angle);
          mat4Multiply(tmp, rotX, model);
          mat4Multiply(mvp, view, tmp);
          mat4Multiply(mvp, proj, mvp);

          gl.useProgram(prog);
          gl.uniformMatrix4fv(uMVP, false, mvp);
          gl.uniformMatrix4fv(uMod, false, tmp);
          gl.uniform3fv(uLgt, light);
          gl.uniform3fv(uCol, color);

          gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
          gl.enableVertexAttribArray(aPos);
          gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

          gl.bindBuffer(gl.ARRAY_BUFFER, nrmBuf);
          gl.enableVertexAttribArray(aNrm);
          gl.vertexAttribPointer(aNrm, 3, gl.FLOAT, false, 0, 0);

          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
          gl.drawElements(gl.TRIANGLES, indices.length, idxType, 0);
        }

        /* Pause when out of view */
        if ('IntersectionObserver' in window) {
          var io = new IntersectionObserver(function (entries) {
            paused = !entries[0].isIntersecting;
          }, { threshold: 0.1 });
          io.observe(canvas);
        }

        render();
      })
      .catch(function (err) {
        console.error('GLB load failed:', err);
      });
  }

  /* Expose globally */
  window.initGLBViewer = initGLBViewer;

})();
