
// function setup() {
//   createCanvas(500, 500, WEBGL);
// }


// import * as THREE from "three";

// const width = 960;
// const height = 540;

// // レンダラーを作成
// const renderer = new THREE.WebGLRenderer({
//   canvas: document.querySelector('#myCanvas')
// });
// renderer.setSize(width, height);
// renderer.setPixelRatio(devicePixelRatio);

// // シーンを作成
// const scene = new THREE.Scene();

// // カメラを作成
// const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
// // カメラの初期座標を設定（X座標:0, Y座標:0, Z座標:0）
// camera.position.set(0, 0, 1000);

// // 箱を作成
// const geometry = new THREE.BoxGeometry(500, 500, 500);
// const material = new THREE.MeshStandardMaterial({color: 0x0000FF});
// const box = new THREE.Mesh(geometry, material);
// scene.add(box);

// // 平行光源
// const light = new THREE.DirectionalLight(0xFFFFFF);
// light.intensity = 2; // 光の強さを倍に
// light.position.set(1, 1, 1); // ライトの方向
// // シーンに追加
// scene.add(light);

// // 初回実行
// tick();

// function tick() {
//   requestAnimationFrame(tick);

//   // 箱を回転させる
//   box.rotation.x += 0.01;
//   box.rotation.y += 0.01;

//   // レンダリング
//   renderer.render(scene, camera);
// }


// Three.js の初期設定
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 原子核を3D円形に配置
const nucleus = new THREE.Group();
const nucleusMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const nucleusParticleCount = 10; // 粒子の数
const nucleusRadius = 1.5; // 円の半径

for (let i = 0; i < nucleusParticleCount; i++) {
  // 3Dの円形配置（球面状）
  const angle = (i / nucleusParticleCount) * Math.PI * 2; // 360度を分割
  const y = Math.sin(angle) * nucleusRadius; // 高さ方向
  const x = Math.cos(angle) * nucleusRadius; // 円周上のX座標
  const z = Math.sin(angle * 2) * nucleusRadius; // 奥行き方向

  const proton = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), nucleusMaterial);
  proton.position.set(x, y, z); // 3D円形配置
  nucleus.add(proton);
}

scene.add(nucleus);

// 電子軌道1の作成
const orbitGroup1 = new THREE.Group();

const curve1 = new THREE.EllipseCurve(
  0, 0, // ax, aY
  2, 2, // xRadius, yRadius
  0, 2 * Math.PI, // StartAngle, EndAngle
  false // clockwise
);

const points1 = curve1.getPoints(100);
const geometry1 = new THREE.BufferGeometry().setFromPoints(points1);
const material1 = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const ellipse1 = new THREE.Line(geometry1, material1);

orbitGroup1.add(ellipse1);

const electron1 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), new THREE.MeshBasicMaterial({ color: 0x0000ff }));
electron1.position.set(2, 0, 0);
orbitGroup1.add(electron1);

scene.add(orbitGroup1);

// 電子軌道2の作成
const orbitGroup2 = new THREE.Group();

const curve2 = new THREE.EllipseCurve(
  0, 0, // ax, aY
  3, 3, // xRadius, yRadius
  0, 2 * Math.PI, // StartAngle, EndAngle
  false // clockwise
);

const points2 = curve2.getPoints(100);
const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
const material2 = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const ellipse2 = new THREE.Line(geometry2, material2);

orbitGroup2.add(ellipse2);

const electron2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), new THREE.MeshBasicMaterial({ color: 0x0000ff }));
electron2.position.set(3, 0, 0);
orbitGroup2.add(electron2);

scene.add(orbitGroup2);

// カメラの位置
camera.position.z = 10;

// アニメーション
function animate() {
  requestAnimationFrame(animate);

  // 原子核の回転
  nucleus.rotation.y += 0.01;

  // 電子軌道1の回転
  orbitGroup1.rotation.z += 0.01;
  orbitGroup1.rotation.x += 0.005;

  // 電子軌道2の回転（異なる速度・方向）
  orbitGroup2.rotation.z -= 0.008;
  orbitGroup2.rotation.y += 0.004;

  renderer.render(scene, camera);
}

animate();
