import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/geometries/RoundedBoxGeometry.js';

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
document.addEventListener('DOMContentLoaded', () => {
  initProduct3D();
});