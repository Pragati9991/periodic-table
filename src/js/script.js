import * as THREE from 'three';

// Loading JSON Data
async function fetchElementData(element) {
  try {
    const response = await fetch('/src/json/elements.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch JSON: ${response.status}`);
    }
    const data = await response.json();
    return data[element];
  } catch (error) {
    console.error("Error loading element data:", error);
  }
}

// Three.js scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(800, 600);
document.getElementById("canvaBox").appendChild(renderer.domElement);

// Save all orbital groups
const orbitGroups = [];

// Initialization Function
async function init(element) {
  const elementData = await fetchElementData(element);
  if (!elementData) {
    console.error("Element data not found!");
    return;
  }

  // Creation of atomic nuclei (only one fixed)
  const nucleusMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), nucleusMaterial);
  scene.add(nucleus);

  // Creating electron orbitals
  elementData.orbits.forEach((orbit, index) => {
    const orbitGroup = new THREE.Group();

    // Trajectory drawing
    const curve = new THREE.EllipseCurve(0, 0, orbit.radius, orbit.radius, 0, 2 * Math.PI, false);
    const points = curve.getPoints(100);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const ellipse = new THREE.Line(geometry, material);

    orbitGroup.add(ellipse);

    // Electron configuration
    for (let i = 0; i < orbit.particles; i++) {
      const angle = (i / orbit.particles) * Math.PI * 2;
      const x = Math.cos(angle) * orbit.radius;
      const y = Math.sin(angle) * orbit.radius;

      const electron = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x0000ff })
      );
      electron.position.set(x, y, 0);
      orbitGroup.add(electron);
    }

    // Adding a Trajectory Group to a Scene
    scene.add(orbitGroup);
    orbitGroups.push({ group: orbitGroup, speed: 0.01 + 0.005 * index });
  });

  // Adjusting the camera position and viewing angle
  const maxRadius = Math.max(...elementData.orbits.map(orbit => orbit.radius));
  camera.position.z = maxRadius * 2;
  camera.fov = Math.atan((maxRadius + 2) / camera.position.z) * (180 / Math.PI) * 2;
  camera.updateProjectionMatrix();
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate all orbits
  orbitGroups.forEach((orbit, index) => {
    if (orbit.group) {
      const direction = index % 2 === 0 ? 1 : -1; // Even orbitals rotate clockwise, odd orbitals rotate counterclockwise

      // Electron Speed
      orbit.group.rotation.z += direction * orbit.speed * 0.5; // Z-axis rotation speed
      orbit.group.rotation.x += 0.0025 * direction * Math.cos(Date.now() * 0.00005 + index); // X-axis rotation speed
      orbit.group.rotation.y += 0.001 * direction * Math.sin(Date.now() * 0.00005 + index); // Y-axis rotation speed
    }
  });

  renderer.render(scene, camera);
}

// Get an element from a URL
const urlParams = new URLSearchParams(window.location.search);
const element = urlParams.get('element') || 'H';

// Initialization and animation start
init(element).then(() => {
  animate();
});






//* VER1 (only He)
//============================================ */
// // Three.js の初期設定
// import * as THREE from 'three';

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer({antialias: true}); // Display the outer circle smoothly

// renderer.setSize(800, 600);
// const container = document.getElementById("canvaBox");
// container.appendChild(renderer.domElement);

// // 原子核を3D円形に配置
// const nucleus = new THREE.Group();
// const nucleusMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const nucleusParticleCount = 1; // 粒子の数 // particle
// const nucleusRadius = 0; // 円の半径

// for (let i = 0; i < nucleusParticleCount; i++) {
//   // 3Dの円形配置（球面状）
//   const angle = (i / nucleusParticleCount) * Math.PI * 2; // 360度を分割
//   const y = Math.sin(angle) * nucleusRadius; // 高さ方向
//   const x = Math.cos(angle) * nucleusRadius; // 円周上のX座標
//   const z = Math.sin(angle * 2) * nucleusRadius; // 奥行き方向

//   const proton = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), nucleusMaterial);
//   proton.position.set(x, y, z); // 3D円形配置
//   nucleus.add(proton);
// }

// scene.add(nucleus);

// // 電子軌道1の作成
// const orbitGroup1 = new THREE.Group();

// const curve1 = new THREE.EllipseCurve(
//   0, 0, // ax, aY
//   2, 2, // xRadius, yRadius
//   0, 2 * Math.PI, // StartAngle, EndAngle
//   false // clockwise
// );

// const points1 = curve1.getPoints(100);
// const geometry1 = new THREE.BufferGeometry().setFromPoints(points1);
// const material1 = new THREE.LineBasicMaterial({ color: 0x00ff00 });
// const ellipse1 = new THREE.Line(geometry1, material1);

// orbitGroup1.add(ellipse1);

// const electron1 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), new THREE.MeshBasicMaterial({ color: 0x0000ff }));
// electron1.position.set(2, 0, 0);
// orbitGroup1.add(electron1);

// scene.add(orbitGroup1);

// // 電子軌道2の作成
// const orbitGroup2 = new THREE.Group();

// const curve2 = new THREE.EllipseCurve(
//   0, 0, // ax, aY
//   3, 3, // xRadius, yRadius
//   0, 2 * Math.PI, // StartAngle, EndAngle
//   false // clockwise
// );

// const points2 = curve2.getPoints(100);
// const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
// const material2 = new THREE.LineBasicMaterial({ color: 0x00ff00 });
// const ellipse2 = new THREE.Line(geometry2, material2);

// orbitGroup2.add(ellipse2);

// const electron2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), new THREE.MeshBasicMaterial({ color: 0x0000ff }));
// electron2.position.set(3, 0, 0);
// orbitGroup2.add(electron2);

// scene.add(orbitGroup2);

// // カメラの位置
// camera.position.z = 10;

// // アニメーション
// function animate() {
//   requestAnimationFrame(animate);

//   // 原子核の回転
//   // nucleus.rotation.y += 0.01;

//   // 電子軌道1の回転
//   orbitGroup1.rotation.z += 0.01;
//   orbitGroup1.rotation.x += 0.005;

//   // 電子軌道2の回転（異なる速度・方向）
//   orbitGroup2.rotation.z -= 0.008;
//   orbitGroup2.rotation.y += 0.004;

//   renderer.render(scene, camera);
// }

// animate();


//* VER2 (Before animation completed)
//============================================ */
// import * as THREE from 'three';

// // JSON データの読み込み
// async function fetchElementData(element) {
//   try {
//     const response = await fetch('/src/json/elements.json'); // JSON ファイルへの相対パス
//     if (!response.ok) {
//       throw new Error(`Failed to fetch JSON: ${response.status}`);
//     }
//     const data = await response.json();
//     return data[element]; // 指定された要素のデータを返す
//   } catch (error) {
//     console.error("Error loading element data:", error);
//   }
// }

// // Three.js のシーン設定
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer({ antialias: true });

// // renderer.setSize(700, 500);
// renderer.setSize(800, 600);
// document.getElementById("canvaBox").appendChild(renderer.domElement);

// // 全ての軌道グループを保存
// const orbitGroups = [];

// // 初期化関数
// async function init(element) {
//   const elementData = await fetchElementData(element);
//   if (!elementData) {
//     console.error("Element data not found!");
//     return;
//   }

//   // 原子核の作成（1つだけ固定）
//   const nucleusMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
//   const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), nucleusMaterial);
//   scene.add(nucleus); // 原子核をシーンの中心に配置

//   // 電子軌道の作成
//   elementData.orbits.forEach((orbit, index) => {
//     const orbitGroup = new THREE.Group();

//     // 軌道描画
//     const curve = new THREE.EllipseCurve(0, 0, orbit.radius, orbit.radius, 0, 2 * Math.PI, false);
//     const points = curve.getPoints(100);
//     const geometry = new THREE.BufferGeometry().setFromPoints(points);
//     const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
//     const ellipse = new THREE.Line(geometry, material);

//     orbitGroup.add(ellipse);

//     // 電子配置
//     for (let i = 0; i < orbit.particles; i++) {
//       const angle = (i / orbit.particles) * Math.PI * 2;
//       const x = Math.cos(angle) * orbit.radius;
//       const y = Math.sin(angle) * orbit.radius;

//       const electron = new THREE.Mesh(
//         new THREE.SphereGeometry(0.1, 32, 32),
//         new THREE.MeshBasicMaterial({ color: 0x0000ff })
//       );
//       electron.position.set(x, y, 0);
//       orbitGroup.add(electron);
//     }

//     // 軌道グループをシーンに追加
//     scene.add(orbitGroup);
//     orbitGroups.push({ group: orbitGroup, speed: 0.01 + 0.005 * index }); // 回転速度を保存
//   });

//   // カメラ位置と視野角の調整
//   const maxRadius = Math.max(...elementData.orbits.map(orbit => orbit.radius)); // 軌道の最大半径
//   camera.position.z = maxRadius * 2; // カメラを最大半径に応じて遠ざける
//   camera.fov = Math.atan((maxRadius + 2) / camera.position.z) * (180 / Math.PI) * 2; // 視野角を調整
//   camera.updateProjectionMatrix(); // 投影行列を更新
// }


// // アニメーションループ
// function animate() {
//   requestAnimationFrame(animate);

//   // 軌道1の回転（例: 時計回り）
//   if (orbitGroups[0]) {
//     orbitGroups[0].group.rotation.z += 0.01; // Z軸の回転
//     orbitGroups[0].group.rotation.x += 0.005; // X軸の回転
//   }

//   // 軌道2の回転（例: 反時計回り）
//   if (orbitGroups[1]) {
//     orbitGroups[1].group.rotation.z -= 0.008; // Z軸の逆回転
//     orbitGroups[1].group.rotation.y += 0.004; // Y軸の回転
//   }

//   renderer.render(scene, camera);
// }

// // URL から要素を取得
// const urlParams = new URLSearchParams(window.location.search);
// const element = urlParams.get('element') || 'H'; // デフォルトは 'H'

// // 初期化とアニメーション開始
// init(element).then(() => {
//   animate(); // アニメーションを開始
// });
