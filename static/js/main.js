let cubes = [];
let gridSize;
let cubeSize;
let time = 0;
let frameRateP;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1); // Reduce pixel density for better performance

  // Create frame rate display
  frameRateP = createP();
  frameRateP.position(10, 10);
  frameRateP.style('color', 'white');
  frameRateP.style('font-family', 'monospace');
  frameRateP.style('z-index', '100');

  // Calculate grid size based on screen dimensions
  let screenDiagonal = sqrt(sq(width) + sq(height));
  cubeSize = screenDiagonal / 50; // Smaller cubes for better performance
  gridSize = ceil(screenDiagonal / (cubeSize * 3)); // Fewer cubes for better performance

  // Create a grid of cubes
  for (let x = -gridSize; x <= gridSize; x += 2) {
    for (let z = -gridSize; z <= gridSize; z += 2) {
      cubes.push({
        x: x * cubeSize,
        z: z * cubeSize,
        size: cubeSize,
        heightOffset: 0,
        phase: random(TWO_PI) // Random phase for varied animation
      });
    }
  }

  console.log(`Created ${cubes.length} cubes with size ${cubeSize} and grid size ${gridSize}`);
}

function draw() {
  background(0);

  // Update frame rate display
  frameRateP.html(`FPS: ${round(frameRate())}`);

  // Update time
  time += 0.02;

  // Calculate normalized mouse position (-1 to 1)
  let mouseXNorm = map(mouseX, 0, width, -1, 1);
  let mouseYNorm = map(mouseY, 0, height, -1, 1);

  // Set up camera
  let camX = sin(time * 0.1) * 100;
  let camY = -200 + sin(time * 0.05) * 50;
  let camZ = 500 + cos(time * 0.1) * 100;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Add ambient light
  ambientLight(50);

  // Add directional light
  directionalLight(255, 255, 255, 0.5, 0.5, -1);

  // Draw radio wave circles
  push();
  rotateX(HALF_PI);
  noFill();
  stroke(255, 50);
  strokeWeight(1);
  for (let i = 0; i < 10; i++) {
    let radius = (time * 100 + i * 100) % 2000;
    ellipse(0, 0, radius, radius);
  }
  pop();

  // Update and draw all cubes
  for (let cube of cubes) {
    // Calculate distance from mouse in normalized space
    let dx = cube.x / (gridSize * cubeSize * 2);
    let dz = cube.z / (gridSize * cubeSize * 2);
    let distFromMouse = sqrt(sq(dx - mouseXNorm) + sq(dz - mouseYNorm));

    // Calculate height offset based on time, position, and mouse
    let baseWave = sin(time + cube.phase + dx * 5 + dz * 5) * 20;
    let mouseWave = 0;

    // Add extreme mouse interaction
    if (distFromMouse < 0.3) {
      let influence = map(distFromMouse, 0, 0.3, 1, 0);
      influence = pow(influence, 3); // Make the falloff more dramatic
      mouseWave = influence * 200 * sin(time * 3 + cube.phase);
    }

    // Add audio-visualization inspired pulsing
    let audioPulse = sin(time * 2 + dx * 10) * cos(time * 1.5 + dz * 10) * 30;

    // Combine all effects
    cube.heightOffset = baseWave + mouseWave + audioPulse;

    // Draw the cube
    drawCube(cube);
  }

  // Draw mouse interaction visualization
  push();
  translate(mouseXNorm * gridSize * cubeSize, -50, mouseYNorm * gridSize * cubeSize);
  noFill();
  stroke(255, 100);
  strokeWeight(1);
  for (let i = 0; i < 5; i++) {
    let pulseSize = (sin(time * 3 + i * 0.5) * 0.5 + 0.5) * 200;
    sphere(pulseSize, 8, 8);
  }
  pop();
}

function drawCube(cube) {
  push();
  translate(cube.x, -cube.heightOffset / 2, cube.z);

  // Scale the cube height based on height offset
  let heightScale = 1 + abs(cube.heightOffset) / 100;
  scale(1, heightScale, 1);

  // Calculate opacity based on height
  let opacity = map(abs(cube.heightOffset), 0, 100, 100, 255);

  // Draw the cube with lines only
  noFill();
  stroke(255, opacity);
  strokeWeight(map(abs(cube.heightOffset), 0, 200, 0.5, 2));

  // Draw box with lines
  box(cube.size);

  // Add cross lines for more detail
  let s = cube.size / 2;
  beginShape(LINES);
  // Diagonal on top face
  vertex(-s, -s, -s);
  vertex(s, -s, s);
  vertex(-s, -s, s);
  vertex(s, -s, -s);

  // Diagonal on bottom face
  vertex(-s, s, -s);
  vertex(s, s, s);
  vertex(-s, s, s);
  vertex(s, s, -s);
  endShape();

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Recalculate grid and cubes when window is resized
  cubes = [];

  let screenDiagonal = sqrt(sq(width) + sq(height));
  cubeSize = screenDiagonal / 50;
  gridSize = ceil(screenDiagonal / (cubeSize * 3));

  for (let x = -gridSize; x <= gridSize; x += 2) {
    for (let z = -gridSize; z <= gridSize; z += 2) {
      cubes.push({
        x: x * cubeSize,
        z: z * cubeSize,
        size: cubeSize,
        heightOffset: 0,
        phase: random(TWO_PI)
      });
    }
  }
}

// Add audio-reactive elements (simulated for now)
function mousePressed() {
  // Simulate an audio beat when mouse is pressed
  for (let cube of cubes) {
    cube.phase += PI / 4;
  }
}
