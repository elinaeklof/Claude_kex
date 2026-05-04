import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/geometries/RoundedBoxGeometry.js';



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
    "d2-t2": {
      size: "10”",
      model: "D|2 T2",
      previewSize: "10"
    },
    "hp-10": {
      size: "10”",
      model: "HP",
      previewSize: "10"
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

  setDevice("d2-t2");
}

function initHeroTypewriter() {
  const textEl = document.getElementById('typewriter-text');
  const cursor = document.querySelector('.typewriter-cursor');

  if (!textEl || !cursor) return;

  const text = 'A customer touch point has 2 sides.\nFinally, both of them work.';
  let i = 0;

  textEl.innerHTML = '';

  function type() {
    if (i >= text.length) {
      cursor.style.display = 'none';
      return;
    }

    if (text[i] === '\n') {
      textEl.appendChild(document.createElement('br'));
    } else {
      textEl.append(text[i]);
    }

    i++;
    setTimeout(type, 32);
  }

  type();
}

function initKeyboardAnimation() {
  const output = document.getElementById('signatureUseCaseOutput');

  document.querySelectorAll('.screen-button').forEach(function(btn) {
    btn.addEventListener('mousedown', function() {
      btn.classList.add('pressed');
    });
    btn.addEventListener('mouseup', function() {
      btn.classList.remove('pressed');

      if (!output) return;
      const key = btn.getAttribute('data-signature-key');
      if (key === 'BACKSPACE') {
        output.textContent = output.textContent.slice(0, -1);
      } else if (key) {
        output.textContent += key;
      }
    });
    btn.addEventListener('mouseleave', function() {
      btn.classList.remove('pressed');
    });
  });
}

function initDuoInputDemo() {
  const output = document.getElementById('signatureUseCaseOutput');
  const buttons = document.querySelectorAll('.screen-button[data-signature-key]');
  if (!output || !buttons.length) return;

  const sequence = ['D','U','O',' ','I','N','P','U','T'];
  let i = 0;
  let typing = true;

  function pressButton(key) {
    buttons.forEach(function(btn) {
      if (btn.getAttribute('data-signature-key') === key) {
        btn.classList.add('pressed');
        setTimeout(function() { btn.classList.remove('pressed'); }, 200);
      }
    });
  }

  function typeNext() {
    if (typing) {
      if (i < sequence.length) {
        const key = sequence[i];
        pressButton(key);
        output.textContent += key;
        i++;
        setTimeout(typeNext, 320);
      } else {
        // Vänta och börja radera
        setTimeout(deleteNext, 1200);
        typing = false;
      }
    }
  }

  function deleteNext() {
    if (output.textContent.length > 0) {
      pressButton('BACKSPACE');
      output.textContent = output.textContent.slice(0, -1);
      setTimeout(deleteNext, 180);
    } else {
      // Börja om
      i = 0;
      typing = true;
      setTimeout(typeNext, 600);
    }
  }

  setTimeout(typeNext, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
  initDevicePreview();
  initProduct3D();
  initHeroTypewriter();
  initKeyboardAnimation();
  initDuoInputDemo();
});

(function () {
  var words = ['STORES', 'HOTELS', 'BANKS'];
  var textEl = document.getElementById('pg-tw-text');
  if (!textEl) return;

  var i = 0;

  function next() {
    i = (i + 1) % words.length;
    textEl.style.animation = 'none';
    textEl.offsetHeight; // triggar reflow
    textEl.textContent = words[i];
    textEl.style.animation = 'slideUp 0.6s ease forwards';
    setTimeout(next, 2400);
  }

  textEl.textContent = words[0];
  textEl.style.animation = 'slideUp 0.6s ease forwards';
  setTimeout(next, 3200);
}());

