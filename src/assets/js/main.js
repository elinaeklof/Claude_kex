import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/* =========================
   HERO OCEAN
========================= */

function initHeroOcean() {
  const postCanvas = document.getElementById('heroOcean') || document.getElementById('ocean-canvas');
  if (!postCanvas) return;

  const postctx = postCanvas.getContext('2d');
  const renderCanvas = document.createElement('canvas');
  const c = renderCanvas.getContext('2d');
  const vertices = [];

  const vertexCount = 7000;
  const vertexSize = 2.6;
  const oceanWidth = 204;
  const oceanHeight = -80;
  const gridSize = 32;
  const waveSize = 16;
  const perspective = 100;
  const depth = vertexCount / oceanWidth * gridSize;

  const { sin, cos, PI } = Math;

  let frame = 0;
  let oldTimeStamp = performance.now();
  let animationFrame;

  const coral = [224, 106, 80];
  const yellow = [255, 146, 118];
  const navy = [247, 242, 239];

  const mix = (a, b, t) =>
    a.map((v, i) => Math.round(v + (b[i] - v) * t));

  for (let i = 0; i < vertexCount; i++) {
    const x = i % oceanWidth;
    const y = 0;
    const z = i / oceanWidth >> 0;
    const offset = oceanWidth / 2;

    vertices.push([(-offset + x) * gridSize, y * gridSize, z * gridSize]);
  }

  function resize() {
    const rect = postCanvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const width = Math.max(1, Math.floor(rect.width * dpr));
    const height = Math.max(1, Math.floor(rect.height * dpr));

    if (postCanvas.width !== width || postCanvas.height !== height) {
      postCanvas.width = renderCanvas.width = width;
      postCanvas.height = renderCanvas.height = height;

      postctx.setTransform(1, 0, 0, 1, 0, 0);
      c.setTransform(1, 0, 0, 1, 0, 0);
    }
  }

  function loop(timeStamp) {
    resize();

    const rad = sin(frame / 100) * PI / 20;
    const rad2 = sin(frame / 50) * PI / 10;

    const dt = Math.min((timeStamp - oldTimeStamp) / 1000, 0.05);
    oldTimeStamp = timeStamp;
    frame += dt * 50;

    const width = renderCanvas.width;
    const height = renderCanvas.height;

    c.fillStyle = '#eeeeee';;
    c.fillRect(0, 0, width, height);

    c.save();
    c.translate(width / 2, height / 2.08);
    c.scale(Math.max(0.72, width / 1440), Math.max(0.72, width / 1440));

    vertices.forEach((vertex, i) => {
      let x = vertex[0] - frame % (gridSize * 2);
      let z = vertex[2] - frame * 2 % gridSize + (i % 2 === 0 ? gridSize / 2 : 0);

      const wave =
        cos(frame / 45 + x / 50) -
        sin(frame / 20 + z / 50) +
        sin(frame / 30 + z * x / 10000);

      let y = vertex[1] + wave * waveSize;
      const a = Math.max(0, 1 - Math.sqrt(x ** 2 + z ** 2) / depth);

      let tx;
      let ty;
      let tz;

      y -= oceanHeight;

      tx = x * cos(rad) + z * sin(rad);
      tz = -x * sin(rad) + z * cos(rad);
      x = tx;
      z = tz;

      tx = x * cos(rad) - y * sin(rad);
      ty = x * sin(rad) + y * cos(rad);
      x = tx;
      y = ty;

      ty = y * cos(rad2) - z * sin(rad2);
      tz = y * sin(rad2) + z * cos(rad2);
      y = ty;
      z = tz;

      if (a < 0.01 || z < 0) return;

      x /= z / perspective;
      y /= z / perspective;

      c.globalAlpha = Math.min(1, a * 1.8);

      const t = Math.max(0, Math.min(1, (wave + 2.5) / 5));
      const rgb = mix(coral, yellow, t);

      c.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      c.fillRect(
        x - a * vertexSize / 2,
        y - a * vertexSize / 2,
        a * vertexSize,
        a * vertexSize
      );

      c.globalAlpha = 1;
    });

    c.restore();

    postctx.clearRect(0, 0, postCanvas.width, postCanvas.height);
    postctx.drawImage(renderCanvas, 0, 0);

    postctx.globalCompositeOperation = 'multiply';
    postctx.filter = 'blur(8px)';
    postctx.drawImage(renderCanvas, 0, 0);
    postctx.filter = 'blur(0)';
    postctx.globalCompositeOperation = 'source-over';

    animationFrame = requestAnimationFrame(loop);
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!reducedMotion.matches) {
    animationFrame = requestAnimationFrame(loop);
  } else {
    resize();
  }

  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animationFrame);
  });
}


/* =========================
   PRODUCT 3D
========================= */

function initProduct3D() {
  const container = document.querySelector('.product-hero__visual');
  const canvas = document.querySelector('#product-3d');

  if (!container || !canvas) return;

  const palette = [
    0xff9276,
    0xf8b898,
    0xfbdfd1,
    0xe06a50,
    0xf5c842
  ];

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );

  camera.position.set(30, 30, 30);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.35;

  const geometry = new RoundedBoxGeometry(1, 1, 1, 6, 0.15);

  const materials = palette.map(hex =>
    new THREE.MeshStandardMaterial({
      color: hex,
      roughness: 0.25,
      metalness: 0.05
    })
  );

  scene.add(new THREE.AmbientLight(0xffffff, 1.6));

  const dirLight = new THREE.DirectionalLight(0xffffff, 2);
  dirLight.position.set(10, 20, 10);
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(0xffffff, 60);
  pointLight.position.set(-15, 5, 10);
  scene.add(pointLight);

  class SplitNode {
    constructor(depth, axis = 0) {
      this.depth = depth;
      this.axis = axis;
      this.splitPos = 0.5;
      this.phase = Math.random() * Math.PI * 2;
      this.speed = 1 + Math.random() * 0.5;
      this.childA = null;
      this.childB = null;
      this.mesh = null;

      const prob = depth < 1 ? 1 : 0.75;

      if (depth < 6 && Math.random() < prob) {
        const nextAxis = (axis + 1) % 3;
        this.childA = new SplitNode(depth + 1, nextAxis);
        this.childB = new SplitNode(depth + 1, nextAxis);
      } else {
        const mat = materials[Math.floor(Math.random() * materials.length)];
        this.mesh = new THREE.Mesh(geometry, mat);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        scene.add(this.mesh);
      }
    }

    update(time, cx, cy, cz, sx, sy, sz) {
      this.splitPos =
        0.5 + Math.sin(time * 0.001 * this.speed + this.phase) * 0.2;

      if (this.childA && this.childB) {
        if (this.axis === 0) {
          const na = sx * this.splitPos;
          const nb = sx - na;

          this.childA.update(time, cx - sx / 2 + na / 2, cy, cz, na, sy, sz);
          this.childB.update(time, cx + sx / 2 - nb / 2, cy, cz, nb, sy, sz);
        } else if (this.axis === 1) {
          const na = sy * this.splitPos;
          const nb = sy - na;

          this.childA.update(time, cx, cy - sy / 2 + na / 2, cz, sx, na, sz);
          this.childB.update(time, cx, cy + sy / 2 - nb / 2, cz, sx, nb, sz);
        } else {
          const na = sz * this.splitPos;
          const nb = sz - na;

          this.childA.update(time, cx, cy, cz - sz / 2 + na / 2, sx, sy, na);
          this.childB.update(time, cx, cy, cz + sz / 2 - nb / 2, sx, sy, nb);
        }
      } else if (this.mesh) {
        this.mesh.position.set(cx, cy, cz);

        this.mesh.scale.set(
          Math.max(sx - 0.15, 0.1),
          Math.max(sy - 0.15, 0.1),
          Math.max(sz - 0.15, 0.1)
        );
      }
    }
  }

  const rootNode = new SplitNode(0);

  function resizeProduct3D() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  }

  function animate(time) {
    requestAnimationFrame(animate);

    rootNode.update(time, 0, 0, 0, 18, 18, 18);
    controls.update();

    renderer.render(scene, camera);
  }

  window.addEventListener('resize', resizeProduct3D);

  resizeProduct3D();
  animate();
}


/* =========================
   INIT
========================= */

function initDevicePreview() {
  const preview = document.querySelector('.device-preview');
  const sizeLabel = document.getElementById('device-size-label');
  const modelLabel = document.getElementById('device-model');
  const deviceChips = document.querySelectorAll('.device-chip');
  const hardwareChips = document.querySelectorAll('.hardware-chip');

  if (!preview || !sizeLabel || !modelLabel) return;

  const deviceMap = {
    "8": {
      size: "8”",
      model: "Adyen SFO1"
    },
    "10": {
      size: "10”",
      model: "D|2 T2"
    },
    "13.3": {
      size: "13.3”",
      model: "D|2 HDMI"
    },
    "14": {
      size: "14”",
      model: "Wacom One"
    },
    "15.6": {
      size: "15.6”",
      model: "D|2 HDMI"
    }
  };

  function setDevice(size) {
    const device = deviceMap[size];
    if (!device) return;

    preview.dataset.size = size;
    sizeLabel.textContent = device.size;
    modelLabel.textContent = device.model;

    deviceChips.forEach(chip => {
      chip.classList.toggle('is-active', chip.dataset.size === size);
    });

    hardwareChips.forEach(chip => {
      chip.classList.toggle('is-active', chip.dataset.size === size);
    });
  }

  deviceChips.forEach(chip => {
    chip.addEventListener('click', () => {
      setDevice(chip.dataset.size);
    });
  });

  hardwareChips.forEach(chip => {
    chip.addEventListener('click', () => {
      setDevice(chip.dataset.size);
    });
  });

  setDevice("10");
}

document.addEventListener('DOMContentLoaded', () => {
  initDevicePreview();
  initProduct3D();
});