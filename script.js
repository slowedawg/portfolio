// Wrap everything after the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // 1) Wire up all fields to the update() function
  const fields = [
    'Name','Subtitle','StudentYear','School','PortfolioYear','Emojis',
    'Profile','Strengths','AreasToGrow','Goals','CommunicationEvidence',
    'CreativeEvidence','PersonalEvidence','PortfolioHighlights',
    'Industry','IndustryAppeal','KeySkills','FutureOutlook',
    'PrimaryCareer','Career1','Career2','JobOpportunities',
    'Education','CourseDetails','Timeline'
  ];
  fields.forEach(id => {
    const el = document.getElementById('input' + id);
    if (el) el.addEventListener('input', update);
  });

  // 2) Theme selector & custom-color panel
  const themeSel = document.getElementById('themeSelector');
  const colorPanel = document.getElementById('colorCustomization');
  themeSel.addEventListener('change', () => {
    document.body.className = themeSel.value;
    if (themeSel.value === 'theme-custom') {
      colorPanel.style.display = 'block';
      updateCustomColors();
    } else {
      colorPanel.style.display = 'none';
    }
  });

  // 3) Custom-color inputs
  const colorInputs = [
    'primaryColor','secondaryColor','accentColor','bgColor','textColor','cardBg',
    'profileGradientStart','profileGradientEnd','highlightGradientStart','highlightGradientEnd',
    'industryGradientStart','industryGradientEnd','timelineGradientStart','timelineGradientEnd',
    'sectionHeaderBg'
  ];
  colorInputs.forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateCustomColors);
  });

  function updateCustomColors() {
    if (themeSel.value !== 'theme-custom') return;
    const root = document.documentElement;
    colorInputs.forEach(name => {
      const val = document.getElementById(name).value;
      // map your CSS vars here
      root.style.setProperty(`--${name}`, val);
    });
  }

  // 4) Image upload preview
  document.getElementById('inputCreativityImage')?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = document.getElementById('previewCreativityImage');
    img.src = url; img.style.display = 'block';
  });

  // 5) Parsing helpers (skills, jobs, timeline, etc.)
  function createSkillBars(rating) {
    let bars = '';
    for (let i=1; i<=5; i++) bars += `<span class="skill-bar ${i<=rating?'filled':''}"></span>`;
    return `<div class="skill-bars">${bars}</div>`;
  }
  function parseSkillsEvidence(text, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    text.split('\n').filter(l=>l.trim()).forEach(line => {
      const m = line.match(/^(.+?)\s*\((\d)\/5\):\s*(.+)$/);
      if (!m) return;
      const [, skill, rating] = m;
      const div = document.createElement('div');
      div.className = 'skill-item';
      div.innerHTML = `<span>${skill}</span>${createSkillBars(+rating)}`;
      container.appendChild(div);
    });
  }
  function parseAllEvidence(c, r, p) {
    const list = document.getElementById('previewAllEvidence');
    list.innerHTML = '';
    [c,r,p].flatMap(txt=>txt.split('\n')).filter(l=>l.trim()).forEach((line,i) => {
      const m = line.match(/^(.+?)\s*\((\d)\/5\):\s*(.+)$/);
      if (m) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${i+1}. ${m[1]} (${m[2]}/5):</strong> ${m[3]}`;
        list.appendChild(li);
      }
    });
  }
  function parseKeySkills(text) {
    const out = text.split(',').map(s=>s.trim()).filter(s=>s);
    document.getElementById('previewKeySkills').innerHTML =
      out.map(s=>`<div class="industry-skill">${s}</div>`).join('');
  }
  function parseJobOpportunities(text) {
    const jobs = text.split('\n\n').filter(j=>j.trim());
    document.getElementById('previewJobOpportunities').innerHTML =
      jobs.map(job=>{
        const [title, ...lines] = job.split('\n');
        return `<div class="job-opportunity">
          <h5>${title}</h5><div>${lines.join('<br>')}</div>
        </div>`;
      }).join('');
  }
  function parseTimeline(text) {
    document.getElementById('previewTimeline').innerHTML =
      text.split('\n').filter(l=>l.includes(':')).map(step=>{
        const [period, ...rest] = step.split(':');
        const [year, phase] = period.split(' - ');
        return `<div class="timeline-step">
          <h4>${year}</h4><h5>${phase||''}</h5>
          <ul>${rest.join(':').split(',').map(d=>`<li>${d.trim()}</li>`).join('')}</ul>
        </div>`;
      }).join('');
  }

  // 6) Main update function
  function update() {
    // copy inputs into preview...
    document.getElementById('previewName').textContent = document.getElementById('inputName').value;
    document.getElementById('previewTitle').textContent = document.getElementById('inputName').value;
    document.getElementById('previewSubtitle').textContent = document.getElementById('inputSubtitle').value;
    ['StudentYear','School','PortfolioYear','Profile','Goals'].forEach(id=>{
      document.getElementById('preview'+id).textContent =
        document.getElementById('input'+id).value;
    });
    // emojis
    document.querySelector('.emoji-row').innerHTML =
      document.getElementById('inputEmojis').value.split(',')
        .map(e=>e.trim()).filter(e=>e).map(e=>`<span>${e}</span>`).join('');
    // strengths & grow
    ['Strengths','AreasToGrow'].forEach(section=>{
      const list = document.getElementById('preview'+section);
      list.innerHTML = '';
      document.getElementById('input'+section).value.split('\n')
        .filter(l=>l.trim()).forEach(l=>{
          const li = document.createElement('li');
          li.textContent = l; list.appendChild(li);
        });
    });
    // evidence
    parseSkillsEvidence(document.getElementById('inputCommunicationEvidence').value, 'communicationSkills');
    parseSkillsEvidence(document.getElementById('inputCreativeEvidence').value, 'creativeSkills');
    parseSkillsEvidence(document.getElementById('inputPersonalEvidence').value, 'personalSkills');
    parseAllEvidence(
      document.getElementById('inputCommunicationEvidence').value,
      document.getElementById('inputCreativeEvidence').value,
      document.getElementById('inputPersonalEvidence').value
    );
    // highlights
    document.getElementById('previewPortfolioHighlights').textContent =
      document.getElementById('inputPortfolioHighlights').value.split('\n')[0]||'';
    // industry
    ['Industry','IndustryAppeal','FutureOutlook'].forEach(id=>{
      document.getElementById('preview'+id).textContent =
        document.getElementById('input'+id).value;
    });
    parseKeySkills(document.getElementById('inputKeySkills').value);
    // careers & jobs
    document.getElementById('previewPrimaryCareer').innerHTML =
      document.getElementById('inputPrimaryCareer').value.replace(/\n/g,'<br>');
    ['Career1','Career2'].forEach(id=>{
      document.getElementById('preview'+id).textContent = document.getElementById('input'+id).value;
    });
    parseJobOpportunities(document.getElementById('inputJobOpportunities').value);
    // education & timeline
    document.getElementById('previewEducation').innerHTML =
      document.getElementById('inputEducation').value.replace(/\n/g,'<br>');
    document.getElementById('previewCourseDetails').innerHTML =
      document.getElementById('inputCourseDetails').value.replace(/\n/g,'<br>');
    parseTimeline(document.getElementById('inputTimeline').value);
  }
  update(); // initial render

  // 7) PDF-ready download
  document.getElementById('downloadPdfBtn').addEventListener('click', () => {
    // inline all CSS
    const cssContent = Array.from(document.styleSheets).map(sheet => {
      try { return Array.from(sheet.cssRules).map(r=>r.cssText).join('\n'); }
      catch(e){ return ''; }
    }).join('\n');

    // custom vars if any
    let customStyles = '';
    if (document.body.className==='theme-custom') {
      customStyles = ':root{' +
        colorInputs.map(name=>`--${name}:${document.getElementById(name).value};`).join('') +
      '}';
    }

    // print rules
    const printStyles = `
      @media print {
        body * { visibility: hidden !important; }
        .portfolio, .portfolio * { visibility: visible !important; }
        .portfolio { position: absolute; top:0; left:0; width:100% !important; }
        .cover-page { page-break-after: always; }
        .section-header, .section { page-break-inside: avoid !important; page-break-after: always; }
      }
      @page { margin:1cm; size:A4; }
    `;

    // assemble HTML
    const html = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${document.getElementById('inputName').value}'s Portfolio</title>
<style>${cssContent}\n${customStyles}\n${printStyles}</style>
</head><body class="${document.body.className}">
${document.querySelector('.portfolio').outerHTML}
<script>window.onload=()=>setTimeout(window.print,500);</script>
</body></html>`;

    // download
    const blob = new Blob([html], {type:'text/html'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${document.getElementById('inputName').value}_Portfolio.html`;
    a.click();
  });
});
