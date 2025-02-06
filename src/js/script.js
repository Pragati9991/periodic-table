import * as THREE from 'three';

// 1) Fetch JSON data
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

// 2) Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(800, 600);
document.getElementById("canvaBox").appendChild(renderer.domElement);

// Store orbit groups for animation
const orbitGroups = [];

// 3) Initialization
async function init(element) {
  // Load element data from JSON
  const elementData = await fetchElementData(element);
  if (!elementData) {
    console.error("Element data not found!");
    return;
  }

  // Create nucleus (center sphere)
  const textureLoader = new THREE.TextureLoader();
  const nucleusTexture = textureLoader.load('/src/img/matcap2.png');
  const nucleusMaterial = new THREE.MeshMatcapMaterial({ matcap: nucleusTexture });

  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    nucleusMaterial
  );
  scene.add(nucleus);

  // Base speed (adjust as desired)
  const baseSpeed = 0.02;

  // Create each orbit
  elementData.orbits.forEach((orbit, index) => {
    const orbitGroup = new THREE.Group();

    // ---- (A) Orbit line with rainbow color ----
    // 1) Generate ellipse points
    const curve = new THREE.EllipseCurve(
      0, 0,
      orbit.radius, orbit.radius,
      0, 2 * Math.PI,
      false
    );
    const points = curve.getPoints(100);

    // 2) Create geometry
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);

    // 3) Build per-vertex color array (rainbow)
    const colorArray = new Float32Array(points.length * 3);
    for (let i = 0; i < points.length; i++) {
      const t = i / (points.length - 1); // 0..1
      const color = new THREE.Color();
      color.setHSL(t, 0.8, 0.5); // "rainbow" approach
      // If you prefer a simpler two-color gradient:
      // color.lerpColors(new THREE.Color('#ff0000'), new THREE.Color('#00ffff'), t);

      colorArray[i * 3 + 0] = color.r;
      colorArray[i * 3 + 1] = color.g;
      colorArray[i * 3 + 2] = color.b;
    }
    orbitGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    // 4) LineBasicMaterial with vertexColors enabled
    const orbitMaterial = new THREE.LineBasicMaterial({ vertexColors: true });

    // 5) Create line & add to orbitGroup
    const ellipse = new THREE.Line(orbitGeometry, orbitMaterial);
    orbitGroup.add(ellipse);

    // ---- (B) Electrons on this orbit ----
    const electronTexture = textureLoader.load('/src/img/matcap3.png');
    const electronMaterial = new THREE.MeshMatcapMaterial({ matcap: electronTexture });

    for (let i = 0; i < orbit.particles; i++) {
      const angle = (i / orbit.particles) * Math.PI * 2;
      const x = Math.cos(angle) * orbit.radius;
      const y = Math.sin(angle) * orbit.radius;

      const electron = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 32, 32),
        electronMaterial
      );
      electron.position.set(x, y, 0);
      orbitGroup.add(electron);
    }

    // ---- (C) Optional one-time tilt for a mild 3D look ----
    const tiltAngle = 0.1;
    orbitGroup.rotation.x = (index % 2 === 0) ? tiltAngle : -tiltAngle;

    // Add to scene
    scene.add(orbitGroup);

    // Bohr-like speed: outer orbits revolve more slowly
    // speed ~ baseSpeed / sqrt(radius)
    const orbitSpeed = baseSpeed / Math.sqrt(orbit.radius);

    // Alternate direction for even vs. odd orbits
    const direction = (index % 2 === 0) ? 1 : -1;

    // Save for animation
    orbitGroups.push({
      group: orbitGroup,
      speed: orbitSpeed,
      direction: direction
    });
  });

  // ---- (D) Camera positioning & FOV ----
  const maxRadius = Math.max(...elementData.orbits.map(o => o.radius));
  camera.position.z = maxRadius * 3;
  camera.lookAt(0, 0, 0);

  // Adjust field of view so it all fits
  camera.fov = Math.atan((maxRadius + 2) / camera.position.z) * (180 / Math.PI) * 2;
  camera.updateProjectionMatrix();
}

// 4) Animation Loop
function animate() {
  requestAnimationFrame(animate);

  orbitGroups.forEach((orbitData, index) => {
    // Rotate around Z axis (existing rotation)
    orbitData.group.rotation.z += orbitData.direction * orbitData.speed;

    // Add new rotations for more dynamic orbit movement
    if (index % 2 === 0) {
      orbitData.group.rotation.x += orbitData.direction * orbitData.speed * 0.5; // Slower rotation on X axis
    } else {
      orbitData.group.rotation.y += orbitData.direction * orbitData.speed * 0.5; // Slower rotation on Y axis
    }
  });

  renderer.render(scene, camera);
}


// 5) Grab element from URL or default to 'H'
const urlParams = new URLSearchParams(window.location.search);
const element = urlParams.get('element') || 'H';

// 6) Initialize & Start
init(element).then(() => {
  animate();
});






// 7) Display element information dynamically
async function displayElementInfo() {
  try {
    // Fetch the JSON data for all elements
    const response = await fetch('/src/json/elements.json'); // JSONファイルのパスを指定
    if (!response.ok) {
      throw new Error(`Failed to fetch JSON: ${response.status}`);
    }
    const data = await response.json();

    // Get the selected element's data
    const elementData = data[element];
    if (!elementData) {
      console.error("Element not found in JSON");
      return;
    }

    // Display the info in the HTML
    document.querySelector('.num').textContent = elementData.info.num;
    document.querySelector('.element').textContent = elementData.info.element;
    document.querySelector('.name').textContent = elementData.info.name;
  } catch (error) {
    console.error("Error displaying element info:", error);
  }
}

// Call the display function
displayElementInfo();
