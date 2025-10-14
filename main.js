(function () {
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // Reveal-on-scroll
  var root = document.querySelector('.splash-scroll');
  var io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        entries[i].target.classList.add('reveal-in');
      }
    }
  }, { root: root, threshold: 0.6 });
  var reveals = document.querySelectorAll('.reveal');
  for (var r = 0; r < reveals.length; r++) io.observe(reveals[r]);

  // Load comparison CSV and render table
  var rows = [];
  function toCells(line) {
    var parts = [];
    var current = '';
    var insideQuotes = false;
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      if (ch === '"') {
        insideQuotes = !insideQuotes;
      } else if (ch === ',' && !insideQuotes) {
        parts.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    parts.push(current);
    return parts;
  }

  function render(filtered) {
    var body = document.getElementById('matrixBody');
    if (!body) return;
    body.innerHTML = '';
    var data = filtered || rows;
    for (var i = 0; i < data.length; i++) {
      var tr = document.createElement('tr');
      var row = data[i];
      for (var j = 0; j < row.length; j++) {
        var td = document.createElement('td');
        td.textContent = row[j];
        tr.appendChild(td);
      }
      body.appendChild(tr);
    }
  }

  function loadCsv() {
    fetch('/data/comparison.csv', { cache: 'no-store' })
      .then(function (res) { return res.text(); })
      .then(function (txt) {
        var lines = txt.split('\n').filter(function (l) { return l.trim().length > 0; });
        // skip header for body rows
        var start = 1;
        rows = [];
        for (var i = start; i < lines.length; i++) {
          rows.push(toCells(lines[i]));
        }
        render();
      })
      .catch(function () { /* silently ignore for first load */ });
  }

  function downloadCsv() {
    fetch('/data/comparison.csv', { cache: 'no-store' })
      .then(function (res) { return res.blob(); })
      .then(function (blob) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'lumiledger-comparison.csv';
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
          URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 0);
      });
  }

  function sortByProduct() {
    var copy = rows.slice();
    copy.sort(function (a, b) {
      var pa = a[0].toLowerCase();
      var pb = b[0].toLowerCase();
      if (pa < pb) return -1;
      if (pa > pb) return 1;
      return 0;
    });
    render(copy);
  }

  function filterRows(q) {
    var query = q.toLowerCase();
    if (!query) { render(); return; }
    var filtered = rows.filter(function (r) {
      for (var i = 0; i < r.length; i++) {
        var cell = (r[i] || '').toLowerCase();
        if (cell.indexOf(query) !== -1) return true;
      }
      return false;
    });
    render(filtered);
  }

  var filterInput = document.getElementById('filterInput');
  if (filterInput) {
    filterInput.addEventListener('input', function (e) { filterRows(e.target.value); });
  }
  var sortBtn = document.getElementById('sortProduct');
  if (sortBtn) sortBtn.addEventListener('click', sortByProduct);
  var dlBtn = document.getElementById('downloadCsv');
  if (dlBtn) dlBtn.addEventListener('click', downloadCsv);

  loadCsv();
})();
