import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";

ReactDOM.render(<App />, document.getElementById("root"));

//Triangle Code

import "./css/styles.css";
import "./css/svg_styles.css";

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
const boxHeight =
  Math.round(triangleSide * Math.sqrt(3) * 0.5) + 2 * (radius + buffer);
const draw = SVG()
  .addTo("#svg-wrapper")
  .size(boxWidth, boxHeight);

draw.viewbox(0, 0, boxWidth, boxHeight);

// Determine points of the equilateral triangle.
const points = [
  {
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
for (const [pt1, pt2] of pointsPath) {
  const line1 = draw.line(pt1.x, pt1.y, pt2.x, pt2.y).addClass("line");
}

// Create Circles
const circles = [];

for (const [pt1, pt2] of pointsPath) {
  circles.push(new Circle({ x: pt1.x, y: pt1.y, radius: radius }));
  for (const pt of pointsBetween(pt1, pt2, order - 2)) {
    circles.push(new Circle({ x: pt.x, y: pt.y, radius: radius }));
  }
}

// Add text
for (let i = 0; i < numbers.length; i++) {
  circles[i].text = numbers[i];
}

// Draw Circles
for (const circle of circles) {
  circle.draw();
}

// Optional sum text in center.

if (sum) {
  const textOptions = {
    x: Math.round((points[0].x + points[1].x + points[2].x) / 3),
    y: Math.round((points[0].y + points[1].y + points[2].y) / 3),
    class: "text",
    "font-size": radius + "px"
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
    y: 0, // Math.round(this.radius / 4),
    scale: 1
  };

  this.draw = function() {
    // Draw circle
    const options = {
      cx: this.x,
      cy: this.y,
      r: this.radius,
      class: "circle"
    };
    draw.circle(options);

    // Draw inner text
    if (this.text) {
      const textOptions = {
        x: this.x + this.textOffset.x,
        y: this.y + this.textOffset.y,
        class: "text",
        "font-size": this.radius * this.textOffset.scale + "px"
      };
      const text = draw.text("" + this.text).attr(textOptions);
    }
  };
}

function pointsBetween(pt1, pt2, numPts) {
  const dx = (pt2.x - pt1.x) / (numPts + 1);
  const dy = (pt2.y - pt1.y) / (numPts + 1);
  const result = [];

  for (let i = 1; i <= numPts; i++) {
    result.push({
      x: Math.round(pt1.x + i * dx),
      y: Math.round(pt1.y + i * dy)
    });
  }
  return result;
}

function downloadSVGAsText() {
  function cssToString(styleSheet) {
    return [...styleSheet.cssRules].map(rule => rule.cssText).join("");
  }

  function getStyleSheet(unique_href) {
    for (const sheet of document.styleSheets) {
      if (sheet.href.endsWith(unique_href)) {
        return sheet;
      }
    }
  }

  // Get the element of type "svg", and create an unattached clone.
  const svgElement = document.querySelector("svg").cloneNode(true);

  // Append a new style block containing style rules taken from "css/svg_styles.css".
  const cssElement = document.createElement("style");
  const svgCSSText = cssToString(getStyleSheet("css/svg_styles.css"));
  cssElement.appendChild(document.createTextNode(svgCSSText));
  svgElement.appendChild(cssElement);

  // Render the svg xml text as base64.
  const base64doc = btoa(unescape(encodeURIComponent(svgElement.outerHTML)));

  // Create a new, unattached anchor tag.
  const a = document.createElement("a");

  // Set anchor tag's "download" attribute, with default name. (downloads instead of redirects)
  a.download = "download.svg";

  // Set anchor tag's href to the base64 svg data.
  a.href = "data:image/svg+xml;base64," + base64doc;

  // Manually click the anchor tag element.
  a.click();
}

const downloadSVG = document.querySelector("#downloadSVG");
downloadSVG.addEventListener("click", downloadSVGAsText);
