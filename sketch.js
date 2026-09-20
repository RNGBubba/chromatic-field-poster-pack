// Chromatic Field — four original deterministic poster systems.
// Every mark is drawn from primitives; no external image assets are used.
let mode = 'lattice';
const fieldNames = ['Lattice Bloom', 'Signal Orchard', 'Tidal Glyph', 'Night Geometry'];
let seedValue = 1427;
let poster;
const palettes = {
  lattice: ['#f5eee2', '#173f5f', '#20639b', '#3caea3', '#f6d55c'],
  orchard: ['#101820', '#f2aa4c', '#d1495b', '#00798c', '#edae49'],
  glyph: ['#f7f3e9', '#5e2b97', '#d90368', '#04a777', '#f4c95d'],
  geometry: ['#080b17', '#4263eb', '#5c7cfa', '#9775fa', '#ff922b']
};

function setup() {
  poster = createCanvas(720, 960);
  poster.parent('canvas-holder');
  pixelDensity(1);
  noLoop();
  bindControls();
  drawPoster();
}

function bindControls() {
  const select = document.getElementById('modeSelect');
  const seed = document.getElementById('seedInput');
  select.addEventListener('change', () => { mode = select.value; drawPoster(); });
  seed.addEventListener('change', () => { seedValue = Math.max(1, Number(seed.value) || 1); drawPoster(); });
  document.getElementById('rerollButton').addEventListener('click', () => {
    seedValue = Math.floor(random(1, 999999));
    seed.value = seedValue;
    drawPoster();
  });
  document.getElementById('saveButton').addEventListener('click', () => {
    saveCanvas(`chromatic-field-${mode}-${seedValue}`, 'png');
  });
}

function drawPoster() {
  randomSeed(seedValue);
  noiseSeed(seedValue);
  const p = palettes[mode];
  background(p[0]);
  if (mode === 'lattice') drawLattice(p);
  if (mode === 'orchard') drawOrchard(p);
  if (mode === 'glyph') drawGlyph(p);
  if (mode === 'geometry') drawGeometry(p);
  drawFrame(p);
}

function drawLattice(p) {
  const step = 36;
  strokeWeight(1);
  for (let y = 70; y < height - 70; y += step) {
    for (let x = 60; x < width - 60; x += step) {
      const n = noise(x * .012, y * .012);
      const angle = map(n, 0, 1, -PI, PI);
      const length = map(n, 0, 1, 8, 34);
      stroke(p[1 + (floor(n * 3) % 3)]);
      push(); translate(x, y); rotate(angle);
      line(-length / 2, 0, length / 2, 0);
      pop();
      if (n > .62) { noStroke(); fill(p[4]); circle(x, y, 5 + n * 9); }
    }
  }
}

function drawOrchard(p) {
  noStroke();
  for (let i = 0; i < 145; i++) {
    const x = random(70, width - 70);
    const y = random(80, height - 80);
    const r = random(5, 55) * (1 + noise(x * .01, y * .01));
    fill(p[1 + (i % 4)] + (i % 3 === 0 ? 'cc' : '99'));
    circle(x, y, r);
    stroke(p[0] + '99'); strokeWeight(1);
    line(x, y, x + random(-35, 35), y + random(-35, 35));
    noStroke();
  }
  fill(p[0] + '66');
  rect(50, height * .52, width - 100, 2);
}

function drawGlyph(p) {
  noFill(); strokeWeight(4);
  for (let ring = 0; ring < 11; ring++) {
    stroke(p[1 + ring % 4] + 'dd');
    beginShape();
    for (let a = 0; a <= TWO_PI + .1; a += .12) {
      const radius = 38 + ring * 27 + 20 * sin(a * 3 + ring * .8) + 9 * noise(a, ring);
      vertex(width / 2 + cos(a) * radius, height / 2 + sin(a) * radius * .76);
    }
    endShape();
  }
  noStroke(); fill(p[4]); circle(width / 2, height / 2, 34);
}

function drawGeometry(p) {
  blendMode(ADD);
  noFill();
  for (let i = 0; i < 38; i++) {
    stroke(p[1 + i % 4] + 'bb'); strokeWeight(random(1, 4));
    const x = random(width), y = random(height), w = random(40, 380), h = random(40, 320);
    quad(x, y, x + w, y + random(-80, 80), x + w + random(-80, 80), y + h, x + random(-80, 80), y + h);
  }
  blendMode(BLEND);
}

function drawFrame(p) {
  noFill(); stroke(p[mode === 'geometry' ? 4 : 1]); strokeWeight(3);
  rect(28, 28, width - 56, height - 56);
  noStroke(); fill(p[mode === 'geometry' ? 4 : 1]);
  textFont('monospace'); textSize(11); text(`CHROMATIC FIELD / ${mode.toUpperCase()} / ${seedValue}`, 48, height - 43);
}
