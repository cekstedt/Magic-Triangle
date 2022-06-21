// initialize SVG.js
const width = 500;
const height = 500;
const draw = SVG().addTo("#svg-wrapper").size(width, height);

const options = {
  cx: "150",
  cy: "150",
  r: "50",
  stroke: "black",
  "stroke-width": "3px",
  fill: "white"
}
const circle = draw.circle(options);





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