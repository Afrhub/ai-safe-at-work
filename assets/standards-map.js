/* Coverage matrix, clause × module. Data mirrors the detailed tables below.
   cols: '1'..'12' = core modules; 'rt' = covered by a Relevant Role or template. */
(function () {
  'use strict';
  var grid = document.getElementById('cov-grid');
  if (!grid) return;
  var MODS = ['1','2','3','4','5','6','7','8','9','10','11','12'];
  var ALL = MODS.concat(['rt']);
  var STD = [
    { id: 'eu',  name: 'EU AI Act' },
    { id: '42',  name: 'ISO 42001' },
    { id: '27',  name: 'ISO 27001' },
    { id: 'gd',  name: 'GDPR' },
    { id: 'ni',  name: 'NIST AI RMF' }
  ];
  var ROWS = [
    ['eu','Art 4','AI literacy of staff', MODS.concat(['rt'])],
    ['eu','Art 5','Prohibited AI practices', ['7','12']],
    ['eu','Art 14','Human oversight of high-risk AI', ['5','rt']],
    ['eu','Art 26','Deployer obligations', ['4','9','rt']],
    ['eu','Art 27','FRIA for high-risk AI', ['rt']],
    ['eu','Art 50','Transparency / synthetic content', ['6','8']],
    ['eu','Art 73','Serious incident reporting', ['10','rt']],
    ['eu','Annex III','High-risk use cases', ['7','12']],
    ['42','Cl 5.2','AI policy', ['rt']],
    ['42','Cl 6.1','Risks & AI risk assessment', ['3','4','rt']],
    ['42','Cl 7.2','Competence', MODS.concat(['rt'])],
    ['42','Cl 7.3','Awareness', ['1','11']],
    ['42','Cl 7.5','Documented information', ['9']],
    ['42','A.2','Policies for AI use', ['rt']],
  ['42','A.4.5','Resources, staff capability', MODS.concat(['rt'])],
    ['42','A.5.2','AI system impact assessment', ['rt']],
  ['42','A.6.2','AI design, fairness, transparency', ['7']],
    ['42','A.7','Data for AI systems', ['3','7']],
  ['42','A.9','Use of AI, operation, monitoring', ['5','10']],
    ['42','A.10','Third-party AI relationships', ['4','rt']],
    ['27','A.5.10','Acceptable use of assets', ['3','rt']],
    ['27','A.5.13','Labelling of information', ['3']],
    ['27','A.5.23','Security for cloud services', ['2','4','rt']],
    ['27','A.5.24–26','Incident planning & response', ['10']],
    ['27','A.5.34','Privacy & protection of PII', ['3','rt']],
    ['27','A.6.3','Awareness, education & training', MODS.slice()],
    ['27','A.8.5','Secure authentication / MFA', ['6']],
    ['27','A.8.12','Data leakage prevention', ['3']],
    ['27','A.8.15','Logging', ['9']],
    ['gd','Art 5','Processing principles', ['3','12']],
    ['gd','Art 6','Lawful basis', ['3','rt']],
    ['gd','Art 9','Special-category data', ['3','7']],
    ['gd','Art 13–14','Information to data subjects', ['9','rt']],
    ['gd','Art 22','Solely automated decisions', ['9','rt']],
    ['gd','Art 28','Processor contracts (DPAs)', ['2','4','rt']],
    ['gd','Art 30','Records of processing (RoPA)', ['9','rt']],
    ['gd','Art 32','Security of processing', ['2','6']],
    ['gd','Art 33–34','Breach notification', ['10','rt']],
    ['gd','Art 35','DPIA', ['rt']],
    ['gd','Art 39','DPO tasks & competence', ['rt']],
    ['gd','Art 44–50','International transfers', ['2']],
    ['ni','Govern','Workforce capability, policy, accountability', MODS.concat(['rt'])],
    ['ni','Map','Categorise AI use cases & risks', ['4','rt']],
    ['ni','Measure','Assess & benchmark AI risks', ['5','7']],
    ['ni','Manage','Act on risks; incident response', ['9','10']],
    ['ni','GAI Profile','Generative-AI-specific risks', ['5','7','8']]
  ];
  var stdName = {}; STD.forEach(function (s) { stdName[s.id] = s.name; });

  // ---- header ----
  var thead = document.createElement('thead');
  var hr = document.createElement('tr');
  var corner = document.createElement('th');
  corner.className = 'corner'; corner.scope = 'col'; corner.textContent = 'Clause';
  hr.appendChild(corner);
  ALL.forEach(function (c) {
    var th = document.createElement('th'); th.scope = 'col';
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'cov-colbtn';
    b.textContent = c === 'rt' ? 'R/T' : 'M' + c;
    b.setAttribute('aria-label', c === 'rt' ? 'Isolate roles and templates column' : 'Isolate Module ' + c + ' column');
    b.addEventListener('click', function () { toggleCol(c); });
    th.appendChild(b); hr.appendChild(th);
  });
  thead.appendChild(hr); grid.appendChild(thead);

  // ---- body ----
  var tbody = document.createElement('tbody');
  var lastStd = null;
  ROWS.forEach(function (r) {
    var sid = r[0], clause = r[1], desc = r[2], on = r[3];
    if (sid !== lastStd) {
      var gr = document.createElement('tr'); gr.setAttribute('data-grp', sid);
      var gth = document.createElement('th');
      gth.className = 'cov-std'; gth.colSpan = ALL.length + 1; gth.scope = 'colgroup';
      gth.textContent = stdName[sid];
      gr.appendChild(gth); tbody.appendChild(gr); lastStd = sid;
    }
    var tr = document.createElement('tr');
    tr.className = 'cov-row'; tr.setAttribute('data-std', sid);
    var rh = document.createElement('th');
    rh.className = 'cov-clause'; rh.scope = 'row';
    rh.textContent = clause; rh.title = desc;
    tr.appendChild(rh);
    ALL.forEach(function (c) {
      var td = document.createElement('td');
      td.className = 'cov-cell' + (c === 'rt' ? ' rt' : '');
      var hit = on.indexOf(c) > -1;
      if (hit) {
        td.classList.add('on'); td.setAttribute('data-c', c);
        var who = c === 'rt' ? 'a Relevant Role or template' : 'Module ' + c;
    td.setAttribute('aria-label', stdName[sid] + ' ' + clause + ', covered by ' + who);
        td.setAttribute('role', 'img');
    td.title = clause + ', ' + (c === 'rt' ? 'role/template' : 'Module ' + c);
      } else {
        td.setAttribute('aria-hidden', 'true');
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  grid.appendChild(tbody);

  // ---- standard filters ----
  var fwrap = document.getElementById('cov-filters');
  var lab = document.createElement('span'); lab.className = 'cov-lab'; lab.textContent = 'Filter';
  fwrap.appendChild(lab);
  var activeStd = 'all';
  function makeFilter(id, name) {
    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'cov-filter';
    btn.textContent = name; btn.setAttribute('aria-pressed', id === 'all' ? 'true' : 'false');
    btn.addEventListener('click', function () {
      activeStd = id;
      [].forEach.call(fwrap.querySelectorAll('.cov-filter'), function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      [].forEach.call(tbody.querySelectorAll('tr[data-std]'), function (tr) {
        tr.classList.toggle('cov-dim', id !== 'all' && tr.getAttribute('data-std') !== id);
      });
      [].forEach.call(tbody.querySelectorAll('tr[data-grp]'), function (tr) {
        tr.classList.toggle('cov-dim', id !== 'all' && tr.getAttribute('data-grp') !== id);
      });
    });
    return btn;
  }
  fwrap.appendChild(makeFilter('all', 'All'));
  STD.forEach(function (s) { fwrap.appendChild(makeFilter(s.id, s.name)); });

  // ---- column isolate ----
  var activeCol = null;
  function toggleCol(c) {
    activeCol = (activeCol === c) ? null : c;
    if (activeCol) grid.setAttribute('data-col', activeCol);
    else grid.removeAttribute('data-col');
  }
})();
