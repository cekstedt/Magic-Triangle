// // initialize SVG.js
// const width = 500;
// const height = 500;
// const draw = SVG().addTo("#svg-wrapper").size(width, height);
//
// const options = {
//   cx: "150",
//   cy: "150",
//   r: "30",
//   stroke: "black",
//   "stroke-width": "3px",
//   fill: "white"
// }
// const circle = draw.circle(options);

// Determine box size (buffer, circles, lines, height of eq triangle)
const order = 4;
const radius = 60;
const lineBetween = 40;
const buffer = 20;
const numbers = [0, 4, 0, 0, 2, 0, 0, 5, 0];

const triangleSide = (order - 1) * (radius * 2 + lineBetween);
const boxWidth = triangleSide + 2 * (radius + buffer);
const boxHeight = Math.round(triangleSide * Math.sqrt(3) * 0.5) + 2 * (radius + buffer);

const draw = SVG().addTo("#svg-wrapper").size(boxWidth, boxHeight);
const points = [{
    x: Math.round(boxWidth / 2),
    y: buffer + radius
  },
  {
    x: boxWidth - buffer - radius,
    y: boxHeight - buffer - radius
  },
  {
    x: buffer + radius,
    y: boxHeight - buffer - radius
  }
];

// Draw lines
const line1 = draw.line(points[0].x, points[0].y, points[1].x, points[1].y)
  .stroke({ width: 3, color: "black" });
const line2 = draw.line(points[1].x, points[1].y, points[2].x, points[2].y)
  .stroke({ width: 3, color: "black" });
const line3 = draw.line(points[2].x, points[2].y, points[0].x, points[0].y)
  .stroke({ width: 3, color: "black" });

// Draw Circles
const circles = [];

circles.push(new Circle(points[0].x, points[0].y, radius));
for (pt of pointsBetween(points[0], points[1], order - 2)) {
  circles.push(new Circle(pt.x, pt.y, radius));
}
circles.push(new Circle(points[1].x, points[1].y, radius));
for (pt of pointsBetween(points[1], points[2], order - 2)) {
  circles.push(new Circle(pt.x, pt.y, radius));
}
circles.push(new Circle(points[2].x, points[2].y, radius));
for (pt of pointsBetween(points[2], points[0], order - 2)) {
  circles.push(new Circle(pt.x, pt.y, radius));
}

for (circle of circles) {
  const options = {
    cx: circle.x,
    cy: circle.y,
    r: circle.radius,
    stroke: "black",
    "stroke-width": "3px",
    fill: "#DEDEDE"
  }
  circle.draw = draw.circle(options);
}

// Draw Text
for (let i = 0; i < numbers.length; i++) {
  circles[i].text = numbers[i];
}

for (circle of circles) {
  if (circle.text) {
    let text = draw.text("" + circle.text);
    text.attr({
      x: circle.x,
      y: circle.y,
      "dominant-baseline": "middle",
      "text-anchor": "middle",
      "font-size": circle.radius + "px",
      "font-family": "sans-serif"
    });
  }
}

// Helper Functions.

function Circle(x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
}

function pointsBetween(pt1, pt2, numPts) {
  const dx = (pt2.x - pt1.x) / (numPts + 1);
  const dy = (pt2.y - pt1.y) / (numPts + 1);
  const result = [];

  for (let i = 1; i <= numPts; i++) {
    result.push({
      x: Math.round(pt1.x + (i * dx)),
      y: Math.round(pt1.y + (i * dy))
    });
  }
  return result;
}


function downloadSVGAsText() {
  // Get the element of type "svg".
  const svg = document.querySelector('svg');

  // Render the svg xml text as base64.
  const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));

  // Create a new, unattached anchor tag.
  const a = document.createElement('a');

  // Set anchor tag's "download" attribute, with default name. (downloads instead of redirects)
  a.download = 'download.svg';

  // Set anchor tag's href to the base64 svg data.
  a.href = 'data:image/svg+xml;base64,' + base64doc;

  // Manually click the anchor tag element.
  a.click();
}

const downloadSVG = document.querySelector('#downloadSVG');
downloadSVG.addEventListener('click', downloadSVGAsText);