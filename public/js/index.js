// Numbers to alter to change the output of the svg.
const order = 4;
const radius = 60;
const lineBetween = 40;
const buffer = 20;
const numbers = [0, 4, 0, 0, 2, 0, 0, 5, 0];
let sum;

// Determine box size.
const triangleSide = (order - 1) * (radius * 2 + lineBetween);
const boxWidth = triangleSide + 2 * (radius + buffer);
const boxHeight = Math.round(triangleSide * Math.sqrt(3) * 0.5) + 2 * (radius + buffer);
const draw = SVG().addTo("#svg-wrapper")
  .size(boxWidth, boxHeight);

draw.viewbox(0, 0, boxWidth, boxHeight)
  .attr("style", "height: 200px; width: auto");

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
    .stroke({ width: 5, color: "grey" });
}

// Create Circles
const circles = [];

for ([pt1, pt2] of pointsPath) {
  circles.push(new Circle({ x: pt1.x, y: pt1.y, radius: radius }));
  for (pt of pointsBetween(pt1, pt2, order - 2)) {
    circles.push(new Circle({ x: pt.x, y: pt.y, radius: radius }));
  }
}

// Add text
for (let i = 0; i < numbers.length; i++) {
  circles[i].text = numbers[i];
}

// Draw Circles
for (circle of circles) {
  circle.draw();
}

// Optional sum text in center.

if (sum) {
  const textOptions = {
    x: Math.round((points[0].x + points[1].x + points[2].x) / 3),
    y: Math.round((points[0].y + points[1].y + points[2].y) / 3),
    "dominant-baseline": "middle",
    "text-anchor": "middle",
    "font-size": radius + "px",
    "font-family": "sans-serif",
    "font-weight": "bold"
  };
  draw.text("" + sum).attr(textOptions);
}


// Helper Functions.

function Circle({ x, y, radius, text }) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.text = text || 0;
  this.textOffset = {
    x: 0,
    y: Math.round(this.radius / 4),
    scale: 1
  };

  this.draw = function() {
    // Draw circle
    const options = {
      cx: this.x,
      cy: this.y,
      r: this.radius,
      stroke: "grey",
      "stroke-width": "5px",
      fill: "LightGray"
    }
    draw.circle(options);

    // Draw inner text
    if (this.text) {
      const textOptions = {
        x: this.x + this.textOffset.x,
        y: this.y + this.textOffset.y,
        "dominant-baseline": "middle",
        "text-anchor": "middle",
        "font-size": (this.radius * this.textOffset.scale) + "px",
        "font-family": "sans-serif",
        "font-weight": "bold"
      };
      const text = draw.text("" + circle.text).attr(textOptions);
    }
  }
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