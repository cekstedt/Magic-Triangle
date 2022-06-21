// Numbers to alter to change the output of the svg.
const order = 4;
const radius = 60;
const lineBetween = 40;
const buffer = 20;
const numbers = [0, 4, 0, 0, 2, 0, 0, 5, 0];
const sum = 23;

// Determine box size.
const triangleSide = (order - 1) * (radius * 2 + lineBetween);
const boxWidth = triangleSide + 2 * (radius + buffer);
const boxHeight = Math.round(triangleSide * Math.sqrt(3) * 0.5) + 2 * (radius + buffer);
const draw = SVG().addTo("#svg-wrapper").size(boxWidth, boxHeight);

// Determine points of the equilateral triangle.
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
const pointsPath = [
  [points[0], points[1]],
  [points[1], points[2]],
  [points[2], points[0]]
];

// Draw lines
for ([pt1, pt2] of pointsPath) {
  const line1 = draw.line(pt1.x, pt1.y, pt2.x, pt2.y)
    .stroke({ width: 3, color: "black" });
}

// Draw Circles
const circles = [];

for ([pt1, pt2] of pointsPath) {
  circles.push(new Circle({ x: pt1.x, y: pt1.y, radius: radius }));
  for (pt of pointsBetween(pt1, pt2, order - 2)) {
    circles.push(new Circle({ x: pt.x, y: pt.y, radius: radius }));
  }
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

// Optional sum text in center.

if (sum) {
  draw.text("" + sum)
    .attr({
      x: Math.round((points[0].x + points[1].x + points[2].x) / 3),
      y: Math.round((points[0].y + points[1].y + points[2].y) / 3),
      "dominant-baseline": "middle",
      "text-anchor": "middle",
      "font-size": radius + "px",
      "font-family": "sans-serif"
    });
}


// Helper Functions.

function Circle({ x, y, radius }) {
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