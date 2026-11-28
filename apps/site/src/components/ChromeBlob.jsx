'use client';

// This file runs only in the browser. The site's ESLint config has no browser globals
// on purpose, so they are declared here instead of being enabled project-wide.
/* global window, document, requestAnimationFrame, cancelAnimationFrame, IntersectionObserver, ResizeObserver */

import { useEffect, useRef, useState } from 'react';

/**
 * ChromeBlob
 *
 * A raymarched blob of liquid chrome, drawn by a single fragment shader.
 * The canvas is transparent and fills its parent, so the parent decides the
 * size and the background.
 *
 * Built to be cheap on a page:
 *  - WebGL is only set up once the element is on screen and the browser is idle
 *  - the render loop stops when the element scrolls out of view or the tab hides
 *  - resolution drops automatically when frames get slow
 *  - with prefers-reduced-motion it draws one still frame and no loop
 *  - no drag handling, so it never blocks scrolling on touch screens
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').CSSProperties} [props.style]
 * @param {boolean} [props.interactive=true] Follow the mouse and burst on click or tap.
 * @param {number} [props.maxFps=60] Use 30 to roughly halve the GPU cost.
 * @param {number} [props.maxDpr=2] Upper limit for the device pixel ratio.
 * @param {string} [props.accent='#6cc4ff'] Six-digit hex colour of the light strip and glow the chrome reflects.
 * @param {string} [props.base='#0d1729'] Six-digit hex colour of the dark room the chrome reflects.
 */
export default function ChromeBlob({
  className,
  style,
  interactive = true,
  maxFps = 60,
  maxDpr = 2,
  accent = '#6cc4ff',
  base = '#0d1729',
}) {
  const canvasRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minInterval = 1000 / Math.max(1, maxFps);

    let gl = null;
    let program = null;
    let buffer = null;
    let uniforms = null;

    let raf = 0;
    let idleHandle = 0;
    let started = false;
    let visible = false;
    let lost = false;

    // Render scale: starts below native and climbs until a frame budget is missed.
    let scale = 0.75;
    let ceiling = 1;
    let slowTime = 0;
    let slowFrames = 0;

    let clock = 0;
    let lastDraw = 0;
    let lastTick = 0;

    let burst = calm ? 0 : 1.1; // starts scattered, then gathers
    let burstVel = 0;
    let spin = 0.4;
    let rotX = 0.4;
    let rotY = -0.15;
    let aimX = 0;
    let aimY = 0;

    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const setup = () => {
      try {
        gl = canvas.getContext('webgl', {
          alpha: true,
          premultipliedAlpha: true,
          antialias: false,
          powerPreference: 'low-power',
        });
      } catch {
        gl = null;
      }
      if (!gl) return false;

      const vs = compile(gl.VERTEX_SHADER, VERT);
      const fs = compile(gl.FRAGMENT_SHADER, FRAG);
      if (!vs || !fs) return false;

      program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;

      gl.useProgram(program);

      // One oversized triangle covers the whole canvas.
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'a');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      uniforms = {
        res: gl.getUniformLocation(program, 'uRes'),
        time: gl.getUniformLocation(program, 'uTime'),
        rot: gl.getUniformLocation(program, 'uRot'),
        burst: gl.getUniformLocation(program, 'uBurst'),
      };
      gl.uniform3f(gl.getUniformLocation(program, 'uAccent'), ...hexToRgb(accent));
      gl.uniform3f(gl.getUniformLocation(program, 'uBase'), ...hexToRgb(base));
      gl.clearColor(0, 0, 0, 0);
      return true;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const width = Math.max(2, Math.round(canvas.clientWidth * dpr * scale));
      const height = Math.max(2, Math.round(canvas.clientHeight * dpr * scale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const draw = () => {
      if (!gl || lost) return;
      resize();
      gl.uniform2f(uniforms.res, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, clock);
      gl.uniform2f(uniforms.rot, rotX, rotY);
      gl.uniform1f(uniforms.burst, burst);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now) => {
      raf = requestAnimationFrame(frame);

      // How long the browser really takes between frames tells us if the GPU is struggling.
      if (lastTick) {
        slowTime += now - lastTick;
        slowFrames += 1;
        if (slowFrames >= 30) {
          const average = slowTime / slowFrames;
          if (average > 24 && scale > 0.35) {
            scale = Math.max(0.35, scale * 0.85);
            ceiling = scale; // do not climb back to a size that already failed
          } else if (average < 20 && scale < ceiling) {
            scale = Math.min(ceiling, scale * 1.08);
          }
          slowTime = 0;
          slowFrames = 0;
        }
      }
      lastTick = now;

      if (now - lastDraw < minInterval - 2) return;
      const dt = Math.min(0.05, lastDraw ? (now - lastDraw) / 1000 : 0.016);
      lastDraw = now;

      clock += dt;
      spin += dt * 0.12;
      rotX += (spin + aimX * 0.7 - rotX) * Math.min(1, dt * 3);
      rotY += (-0.15 + aimY * 0.5 - rotY) * Math.min(1, dt * 3);

      // Spring that pulls the droplets back together after a burst.
      const steps = 4;
      const h = dt / steps;
      for (let i = 0; i < steps; i += 1) {
        burstVel += (-38 * burst - 5.2 * burstVel) * h;
        burst += burstVel * h;
      }
      burst = Math.max(-0.45, Math.min(1.5, burst));

      draw();
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      lastDraw = 0;
      lastTick = 0;
    };

    const update = () => {
      if (!gl || lost) return;
      const shouldRun = visible && !document.hidden && !calm;
      if (shouldRun && !raf) raf = requestAnimationFrame(frame);
      if (!shouldRun && raf) stop();
      if (calm && visible) draw();
    };

    const start = () => {
      idleHandle = 0;
      if (!setup()) {
        setFailed(true);
        return;
      }
      update();
    };

    const whenIdle = window.requestIdleCallback
      ? (fn) => window.requestIdleCallback(fn, { timeout: 1500 })
      : (fn) => window.setTimeout(fn, 200);
    const cancelIdle = window.cancelIdleCallback || window.clearTimeout;

    const viewObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !started) {
          started = true;
          idleHandle = whenIdle(start);
        } else {
          update();
        }
      },
      { rootMargin: '100px' },
    );
    viewObserver.observe(canvas);

    const sizeObserver = new ResizeObserver(() => {
      if (calm) update();
    });
    sizeObserver.observe(canvas);

    const onVisibility = () => update();
    const onLost = (event) => {
      event.preventDefault();
      lost = true;
      stop();
    };
    const onRestored = () => {
      lost = false;
      if (setup()) update();
    };
    const onMove = (event) => {
      if (event.pointerType !== 'mouse') return;
      aimX = event.clientX / window.innerWidth - 0.5;
      aimY = event.clientY / window.innerHeight - 0.5;
    };
    const onPress = () => {
      if (!calm) burstVel += 7;
    };

    document.addEventListener('visibilitychange', onVisibility);
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);
    if (interactive) {
      window.addEventListener('pointermove', onMove, { passive: true });
      canvas.addEventListener('pointerdown', onPress);
    }

    return () => {
      stop();
      if (idleHandle) cancelIdle(idleHandle);
      viewObserver.disconnect();
      sizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      window.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerdown', onPress);
      if (gl && !lost) {
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
      }
    };
  }, [interactive, maxFps, maxDpr, accent, base]);

  if (failed) {
    // No WebGL: a still, metallic-looking shape stands in for the blob.
    return (
      <div
        aria-hidden="true"
        className={className}
        style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', ...style }}
      >
        <div
          style={{
            width: '45%',
            aspectRatio: '1',
            borderRadius: '46% 54% 58% 42% / 50% 44% 56% 50%',
            background: `radial-gradient(circle at 35% 28%, #ffffff 0%, #9aa3b5 22%, ${base} 55%, ${accent} 100%)`,
            filter: 'blur(2px)',
          }}
        />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
    />
  );
}

/**
 * @param {string} hex Six-digit hex colour, with or without the leading #.
 * @returns {[number, number, number]} Channels in the 0 to 1 range.
 */
function hexToRgb(hex) {
  const value = parseInt(hex.replace('#', ''), 16);
  if (Number.isNaN(value)) return [0.94, 0.28, 0.44];
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uRot;
uniform float uBurst;
uniform vec3 uAccent;
uniform vec3 uBase;

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

// Smooth minimum: melts two shapes into each other.
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// Distance to the blob: a core with four droplets orbiting it.
float map(vec3 p) {
  float t = uTime;
  float d = length(p) - 0.6;
  for (int i = 0; i < 4; i++) {
    float f = float(i);
    vec3 c = vec3(sin(t * 0.7 + f * 2.1), cos(t * 0.53 + f * 1.7), sin(t * 0.41 + f * 3.3));
    c *= 0.55 + 0.9 * uBurst;
    d = smin(d, length(p - c) - (0.34 - 0.03 * f), 0.45);
  }
  d += 0.035 * sin(p.x * 6.0 + t * 1.3) * sin(p.y * 6.0 - t) * sin(p.z * 6.0 + t * 0.7);
  return d;
}

vec3 normalAt(vec3 p) {
  vec2 e = vec2(0.0025, -0.0025);
  return normalize(
    e.xyy * map(p + e.xyy) + e.yyx * map(p + e.yyx) +
    e.yxy * map(p + e.yxy) + e.xxx * map(p + e.xxx)
  );
}

// A small studio for the chrome to reflect: dark floor, brighter ceiling,
// a white key light, a cool rim light and one accent-coloured light strip.
vec3 env(vec3 d) {
  vec3 c = mix(uBase * 0.8 + 0.03, uBase + vec3(0.52, 0.54, 0.6), smoothstep(-0.7, 0.9, d.y));
  float key = smoothstep(0.55, 0.95, dot(d, normalize(vec3(0.5, 0.8, 0.4))));
  float rim = smoothstep(0.7, 1.0, dot(d, normalize(vec3(-0.8, -0.2, -0.5))));
  float strip = smoothstep(0.06, 0.0, abs(d.y - 0.15 + 0.2 * d.x)) * smoothstep(-0.2, 0.6, d.z);
  c += vec3(1.0, 0.97, 0.95) * key * 2.4;
  c += vec3(0.55, 0.7, 1.0) * rim * 1.2;
  c += uAccent * strip * 1.6;
  return c;
}

vec3 shade(vec3 p, vec3 rd) {
  vec3 n = normalAt(p);
  float ndv = clamp(dot(n, -rd), 0.0, 1.0);
  float fres = pow(1.0 - ndv, 4.0);
  vec3 e = env(reflect(rd, n));

  // Thin-film colour shift, like heat-tinted metal. It fades out at grazing angles,
  // where real chrome turns into a plain mirror.
  // The film is pulled towards the accent so it matches the page instead of a full rainbow.
  vec3 film = 0.5 + 0.5 * cos(6.2831 * (ndv * 1.2 + 0.2 * n.y + 0.03 * uTime + vec3(0.0, 0.33, 0.67)));
  film = mix(film, uAccent, 0.35);
  vec3 tint = mix(mix(vec3(1.0), film, 0.45), vec3(1.0), fres);

  // Cheap ambient occlusion: darker where droplets meet.
  float ao = 0.4 + 0.6 * clamp(map(p + n * 0.25) / 0.25, 0.0, 1.0);

  vec3 col = e * tint * ao + fres * 0.25;

  // Soft knee so highlights roll off instead of clipping.
  vec3 x = max(col - 0.8, 0.0);
  return min(col, vec3(0.8)) + 0.2 * x / (0.2 + x);
}

void main() {
  float m = min(uRes.x, uRes.y);
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / m;

  vec3 ro = vec3(0.0, 0.0, 3.1);
  vec3 rd = normalize(vec3(uv, -1.9));
  ro.yz *= rot(uRot.y); rd.yz *= rot(uRot.y);
  ro.xz *= rot(uRot.x); rd.xz *= rot(uRot.x);

  float t = 0.0;
  float minD = 1e3;
  float tMin = 0.0;
  bool hit = false;
  for (int i = 0; i < 56; i++) {
    float d = map(ro + rd * t);
    if (d < minD) { minD = d; tMin = t; }
    if (d < 0.002) { hit = true; break; }
    t += d * 0.85;
    if (t > 7.0) break;
  }

  // Rays that just miss still get partial coverage, which smooths the outline.
  float px = tMin * 2.0 / (1.9 * m);
  float cov = hit ? 1.0 : clamp(1.0 - minD / (px * 1.5), 0.0, 1.0);

  vec3 col = vec3(0.0);
  if (cov > 0.0) col = shade(ro + rd * (hit ? t : tMin), rd);

  float glow = exp(-max(minD, 0.0) * 4.0) * 0.28 * (1.0 - cov);
  glow *= smoothstep(1.0, 0.55, length(uv)); // fade out before the canvas edge
  vec3 halo = mix(uAccent, uBase * 3.0, 0.45);

  // Premultiplied alpha, so the page behind shows through.
  gl_FragColor = vec4(col * cov + halo * glow, cov + glow * 0.6);
}
`;
