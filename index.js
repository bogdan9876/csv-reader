var fileList = document.getElementById('file-list');
var currentFile = "";

function addEntry(entryName) {
  var li = document.createElement('li');
  var link = document.createElement('a');
  link.innerHTML = entryName;
  link.className = 'edit-file';
  li.appendChild(link);

  var delLink = document.createElement('a');
  delLink.innerHTML = '<span class="delete">&times;</span>';
  delLink.className = 'delete-file';
  li.appendChild(delLink);
  fileList.insertBefore(li, fileList.firstChild);

  link.addEventListener('click', function (e) {
    e.preventDefault();
    loadFile(entryName);
    currentFile = entryName;
  });

  delLink.addEventListener('click', function (e) {
    e.preventDefault();
    deleteFile(entryName);
  });
}

function setupScrollButtons() {
  const csvTableContainer = document.querySelector('#table-1 .table-scroll-wrapper');
  if (!csvTableContainer) return;

  const scrollAmount = 50;

  document.getElementById('scroll-up').addEventListener('click', () => {
    csvTableContainer.scrollTop -= scrollAmount;
  });

  document.getElementById('scroll-down').addEventListener('click', () => {
    csvTableContainer.scrollTop += scrollAmount;
  });

  document.getElementById('scroll-left').addEventListener('click', () => {
    csvTableContainer.scrollLeft -= scrollAmount;
  });

  document.getElementById('scroll-right').addEventListener('click', () => {
    csvTableContainer.scrollLeft += scrollAmount;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('csv-file');

  fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;

    filename = file.name;

    const reader = new FileReader();
    reader.onload = function (e) {
      const csv = e.target.result;
      populate(csv);
      drawChartFromCSV(csv);
      // Setup scroll buttons after table is created
      setupScrollButtons();
    };
    reader.readAsText(file);
  });
});

document.getElementById('file-upload')?.addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file) {
    uploadFile(file);
  }
});

document.getElementById('download-csv').addEventListener('click', function () {
  downloadTable(1);
});

document.getElementById('save-csv').addEventListener('click', function () {
  downloadTable(1, true);
});

document.getElementById('load-list').addEventListener('click', function () {
  listFiles();
});

listFiles();

function drawChartFromCSV(csv) {
  const lines = csv.split('\n').map(line => line.split(','));
  const rawXData = [], rawYData = [], rawZData = [];
  const pt1XData = [], pt1YData = [], pt1ZData = [];
  const pt2XData = [], pt2YData = [], pt2ZData = [];
  const xData = [], yData = [], zData = [], gData = [];

  lines.slice(1).forEach(line => {
    const [, time, raw_x, raw_y, raw_z, pt1_x, pt1_y, pt1_z, pt2_x, pt2_y, pt2_z, x, y, z, G] = line;
    if (time && raw_x && raw_y && raw_z && pt1_x && pt1_y && pt1_z && pt2_x && pt2_y && pt2_z && x && y && z && G) {
      rawXData.push({ x: parseFloat(time), y: parseFloat(raw_x) });
      rawYData.push({ x: parseFloat(time), y: parseFloat(raw_y) });
      rawZData.push({ x: parseFloat(time), y: parseFloat(raw_z) });

      pt1XData.push({ x: parseFloat(time), y: parseFloat(pt1_x) });
      pt1YData.push({ x: parseFloat(time), y: parseFloat(pt1_y) });
      pt1ZData.push({ x: parseFloat(time), y: parseFloat(pt1_z) });

      pt2XData.push({ x: parseFloat(time), y: parseFloat(pt2_x) });
      pt2YData.push({ x: parseFloat(time), y: parseFloat(pt2_y) });
      pt2ZData.push({ x: parseFloat(time), y: parseFloat(pt2_z) });

      xData.push({ x: parseFloat(time), y: parseFloat(x) });
      yData.push({ x: parseFloat(time), y: parseFloat(y) });
      zData.push({ x: parseFloat(time), y: parseFloat(z) });
      gData.push({ x: parseFloat(time), y: parseFloat(G) });
    }
  });

  const chartContainer = document.getElementById('chart-container');
  if (chartContainer.chart) chartContainer.chart.destroy();

  chartContainer.chart = new Chart(chartContainer, {
    type: 'line',
    data: {
      datasets: [
        { label: 'raw X', data: rawXData, borderColor: 'rgb(0, 238, 255)', fill: false, tension: 0.1, borderDash: [5, 5] },
        { label: 'raw Y', data: rawYData, borderColor: 'rgb(105, 255, 89)', fill: false, tension: 0.1, borderDash: [5, 5] },
        { label: 'raw Z', data: rawZData, borderColor: 'rgb(255, 41, 166)', fill: false, tension: 0.1, borderDash: [5, 5] },
        { label: 'pt1 X', data: pt1XData, borderColor: 'rgb(0, 102, 255)', fill: false, tension: 0.1, borderDash: [5, 5] },
        { label: 'pt1 Y', data: pt1YData, borderColor: 'rgb(27, 158, 12)', fill: false, tension: 0.1, borderDash: [5, 5] },
        { label: 'pt1 Z', data: pt1ZData, borderColor: 'rgb(255, 145, 0)', fill: false, tension: 0.1, borderDash: [5, 5] },
        { label: 'pt2 X', data: pt2XData, borderColor: 'rgb(100, 102, 255)', fill: false, tension: 0.1, borderDash: [5, 5] },
        { label: 'pt2 Y', data: pt2YData, borderColor: 'rgb(200, 158, 12)', fill: false, tension: 0.1, borderDash: [5, 5] },
        { label: 'pt2 Z', data: pt2ZData, borderColor: 'rgb(255, 145, 129)', fill: false, tension: 0.1, borderDash: [5, 5] },
        { label: 'X', data: xData, borderColor: 'rgb(0, 4, 255)', fill: false, tension: 0.1 },
        { label: 'Y', data: yData, borderColor: 'rgb(10, 51, 5)', fill: false, tension: 0.1 },
        { label: 'Z', data: zData, borderColor: 'rgb(73, 0, 43)', fill: false, tension: 0.1 },
        { label: 'G', data: gData, borderColor: 'rgb(250, 0, 0)', fill: false, tension: 0.1 },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { type: 'linear', title: { display: true, text: 'Timestamp' } },
        y: { title: { display: true, text: 'Values' } },
      },
      plugins: {
        tooltip: { mode: 'nearest', intersect: false },
      },
    },
  });
}

