function Point(x, y) {
  return {
    get x() { return x;},
    get y() { return y;},
  };
}

function Rectangle(x, y, w, h) {
  return {
    get x() { return x;},
    get y() { return y;},
    get w() { return w;},
    get h() { return h;},
    contains(point) {
      return (point.x >= x - w &&
        point.x <= x + w &&
        point.y >= y - h &&
        point.y <= y + h);
    },
    intersects(range) {
      if (range.x <= x && range.y <= y &&
        range.x + range.w >= x + w &&
        range.y + range.h >= y + h) {
        return 'contains';
      }
      if (!(
        range.x - range.w > x + w ||
        range.x + range.w < x - w ||
        range.y - range.h > y + h ||
        range.y + range.h < y - h
      )) {
        return 'intersects';
      }
      return false;
    },
  };
}

function QuadTree(capacity, boundary = Rectangle(width / 2, height / 2, width / 2, height / 2)) {
  let points = [];
  let northeast, northwest, southeast, southwest;

  function subdivide() {
    const { x, y, w, h } = boundary;

    let ne = Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
    northeast = new QuadTree(capacity, ne);
    let nw = Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
    northwest = new QuadTree(capacity, nw);
    let se = Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
    southeast = new QuadTree(capacity, se);
    let sw = Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);
    southwest = new QuadTree(capacity, sw);

    points = points
      .filter(point => !(
        northeast.insert(point) ||
        northwest.insert(point) ||
        southeast.insert(point) ||
        southwest.insert(point))
      );
  }

  return {
    get points() { return points; },
    getAllPoints() {
      return northeast
        ? northeast.getAllPoints()
          .concat(northwest.getAllPoints())
          .concat(southeast.getAllPoints())
          .concat(southwest.getAllPoints())
        : points;
    },
    insert(point) {
      if (!boundary.contains(point)) {
        return false;
      }
      if (points.length < capacity) {
        points.push(point);
        return true;
      } else {
        if (!northwest) {
          subdivide();
        }
        if (northeast.insert(point) || northwest.insert(point) || southeast.insert(point) || southwest.insert(point)) {
          return true;
        }
      }
    },
    query(range) {
      let found;
      const intersectionType = boundary.intersects(range);
      switch (intersectionType) {
        case 'contains':
          found = this.getAllPoints();
          break;
        case 'intersects': {
          if (northeast) {
            found = northeast.query(range)
              .concat(northwest.query(range))
              .concat(southeast.query(range))
              .concat(southwest.query(range));
          } else {
            found = points.filter(point => range.contains(point));
          }
          break;
        }
        default:
          found = [];
          break;
      }
      return found;
    },
    show() {
      stroke(255);
      noFill();
      strokeWeight(1);
      rectMode(CENTER);
      rect(boundary.x, boundary.y, boundary.w * 2, boundary.h * 2);

      if (northwest) {
        northeast.show();
        northwest.show();
        southeast.show();
        southwest.show();
      } else {
        points.forEach(p => {
          strokeWeight(2);
          point(p.x, p.y);
        });
      }
    }
  };
}
