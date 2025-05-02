let tool = 'pen';
let currentColor = '#000000';
let isDrawing = false;
let startX, startY;
let currentCanvas;
let pages = [];
let maxPages = 100;
let canvasContainer = document.getElementById('canvasContainer');

function createCanvasPage() {
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth - 40;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  pages.push({ canvas, ctx });
  canvasContainer.appendChild(canvas);

  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    if (tool === 'pen') {
      ctx.strokeStyle = currentColor;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'pen') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'strokeEraser') {
      ctx.clearRect(x - 5, y - 5, 10, 10);
    }
  });

  canvas.addEventListener('mouseup', (e) => {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'line') {
      ctx.strokeStyle = currentColor;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'rect') {
      ctx.strokeStyle = currentColor;
      ctx.strokeRect(startX, startY, x - startX, y - startY);
    } else if (tool === 'circle') {
      ctx.strokeStyle = currentColor;
      ctx.beginPath();
      let radius = Math.sqrt(Math.pow((x - startX), 2) + Math.pow((y - startY), 2));
      ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
    isDrawing = false;
  });
}

function setTool(t) {
  tool = t;
}

function changeColor(color) {
  currentColor = color;
}

function uploadImage(event) {
  const file = event.target.files[0];
  if (!file) return;
  const img = new Image();
  img.onload = function () {
    const { ctx } = pages[pages.length - 1];
    ctx.drawImage(img, 50, 50, 200, 200);
  };
  img.src = URL.createObjectURL(file);
}

function saveImage() {
  pages.forEach((page, i) => {
    const link = document.createElement('a');
    link.download = `page-${i + 1}.png`;
    link.href = page.canvas.toDataURL();
    link.click();
  });
}

function printPDF() {
  const printWindow = window.open('', '_blank');
  printWindow.document.write('<html><head><title>Print Whiteboard</title></head><body>');
  pages.forEach(page => {
    printWindow.document.write(`<img src="${page.canvas.toDataURL()}" style="width:100%; page-break-after: always;" />`);
  });
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
}

function addMorePages(count = 10) {
  if (pages.length >= maxPages) return;
  for (let i = 0; i < count && pages.length < maxPages; i++) {
    createCanvasPage();
  }
}

// Initialize with 100 pages
addMorePages(100);
