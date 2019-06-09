let qtree;

function setup() {
  createCanvas(600, 600);
  background(255);
  qtree = QuadTree(4);

  for (let i = 0; i < 1000; i++) {
    let x = randomGaussian(width / 2, width / 8);
    let y = randomGaussian(height / 2, height / 8);
    let p = Point(x, y);
    qtree.insert(p);
  }
}

function draw() {
  background(0);
  qtree.show();

  stroke(0, 255, 0);
  rectMode(CENTER);
  let range = Rectangle(mouseX, mouseY, 50, 50);

  if (mouseX < width && mouseY < height) {
    rect(range.x, range.y, range.w * 2, range.h * 2);
    let points = qtree.query(range);
    points.forEach(p => {
      strokeWeight(4);
      point(p.x, p.y);
    });
  }
}

function mousePressed() {
  qtree.insert(Point(mouseX, mouseY));
}
