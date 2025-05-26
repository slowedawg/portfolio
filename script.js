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
  if (themeSel) {
    themeSel.addEventListener('change', () => {
      document.body.className = themeSel.value;
      if (themeSel.value === 'theme-custom') {
        colorPanel.style.display = 'block';
        updateCustomColors();
      } else {
        colorPanel.style.display = 'none';
      }
    });
  }

  // 3) Custom-color inputs
  const colorInputs = [
    'primaryColor','secondaryColor','accentColor','bgColor','textColor','cardBg',
    'profileGradientStart','profileGradientEnd','highlightGradientStart','highlightGradientEnd',
    'industryGradientStart','industryGradientEnd','timelineGradientStart','timelineGradientEnd',
    'sectionHeaderBg'
  ];
  colorInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) input.addEventListener('input', updateCustomColors);
  });

  function updateCustomColors() {
    if (!themeSel || themeSel.value !== 'theme-custom') return;
    const root = document.documentElement;
    colorInputs.forEach(name => {
      const input = document.getElementById(name);
      if (input) {
        const val = input.value;
        root.style.setProperty(`--${name.replace(/([A-Z])/g, '-$1').toLowerCase()}`, val);
      }
    });
  }

  // 4) Image upload preview
  const imageInput = document.getElementById('inputCreativityImage');
  if (imageInput) {
    imageInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      const img = document.getElementById('previewCreativityImage');
      if (img) {
        img.src = url; 
        img.style.display = 'block';
      }
    });
  }

  // 5) Parsing helpers (skills, jobs, timeline, etc.)
  function createSkillBars(rating) {
    let bars = '';
    for (let i = 1; i <= 5; i++) {
      bars += `<span class="skill-bar ${i <= rating ? 'filled' : ''}"></span>`;
    }
    return `<div class="skill-bars">${bars}</div>`;
  }

  function parseSkillsEvidence(text, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    if (!text) return;
    
    text.split('\n').filter(l => l.trim()).forEach(line => {
      const m = line.match(/^(.+?)\s*\((\d)\/5\):\s*(.+)$/);
      if (!m) return;
      const [, skill, rating] = m;
      const div = document.createElement('div');
      div.className = 'skill-item';
      div.innerHTML = `<span>${skill}</span>${createSkillBars(parseInt(rating))}`;
      container.appendChild(div);
    });
  }

  function parseAllEvidence(c, r, p) {
    const list = document.getElementById('previewAllEvidence');
    if (!list) return;
    
    list.innerHTML = '';
    const allLines = [c, r, p].flatMap(txt => txt ? txt.split('\n') : []).filter(l => l.trim());
    
    allLines.forEach((line, i) => {
      const m = line.match(/^(.+?)\s*\((\d)\/5\):\s*(.+)$/);
      if (m) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${i + 1}. ${m[1]} (${m[2]}/5):</strong> ${m[3]}`;
        list.appendChild(li);
      }
    });
  }

  function parseKeySkills(text) {
    const container = document.getElementById('previewKeySkills');
    if (!container || !text) return;
    
    const skills = text.split(',').map(s => s.trim()).filter(s => s);
    container.innerHTML = skills.map(s => `<div class="industry-skill">${s}</div>`).join('');
  }

  function parseJobOpportunities(text) {
    const container = document.getElementById('previewJobOpportunities');
    if (!container || !text) return;
    
    const jobs = text.split('\n\n').filter(j => j.trim());
    container.innerHTML = jobs.map(job => {
      const lines = job.split('\n');
      const title = lines[0];
      const content = lines.slice(1).join('<br>');
      return `<div class="job-opportunity">
        <h5>${title}</h5>
        <div>${content}</div>
      </div>`;
    }).join('');
  }

  function parseTimeline(text) {
    const container = document.getElementById('previewTimeline');
    if (!container || !text) return;
    
    const steps = text.split('\n').filter(l => l.includes(':')).map(step => {
      const colonIndex = step.indexOf(':');
      const period = step.substring(0, colonIndex).trim();
      const content = step.substring(colonIndex + 1).trim();
      
      const dashIndex = period.indexOf(' - ');
      const year = dashIndex > -1 ? period.substring(0, dashIndex) : period;
      const phase = dashIndex > -1 ? period.substring(dashIndex + 3) : '';
      
      const items = content.split(',').map(item => item.trim()).filter(item => item);
      
      return `<div class="timeline-step">
        <h4>${year}</h4>
        <h5>${phase}</h5>
        <ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>
      </div>`;
    });
    
    container.innerHTML = steps.join('');
  }

  // 6) Main update function
  function update() {
    // Basic text fields
    const nameInput = document.getElementById('inputName');
    const name = nameInput ? nameInput.value : '';
    
    const previewName = document.getElementById('previewName');
    const previewTitle = document.getElementById('previewTitle');
    if (previewName) previewName.textContent = name;
    if (previewTitle) previewTitle.textContent = name;
    
    // Simple text mappings
    const simpleFields = ['Subtitle', 'StudentYear', 'School', 'PortfolioYear', 'Profile', 'Goals'];
    simpleFields.forEach(id => {
      const input = document.getElementById('input' + id);
      const preview = document.getElementById('preview' + id);
      if (input && preview) {
        preview.textContent = input.value;
      }
    });
    
    // Emojis
    const emojiInput = document.getElementById('inputEmojis');
    const emojiRow = document.querySelector('.emoji-row');
    if (emojiInput && emojiRow) {
      const emojis = emojiInput.value.split(',').map(e => e.trim()).filter(e => e);
      emojiRow.innerHTML = emojis.map(e => `<span>${e}</span>`).join('');
    }
    
    // Lists (strengths & areas to grow)
    ['Strengths', 'AreasToGrow'].forEach(section => {
      const input = document.getElementById('input' + section);
      const list = document.getElementById('preview' + section);
      if (input && list) {
        list.innerHTML = '';
        const items = input.value.split('\n').filter(l => l.trim());
        items.forEach(item => {
          const li = document.createElement('li');
          li.textContent = item;
          list.appendChild(li);
        });
      }
    });
    
    // Skills evidence
    const commEvidence = document.getElementById('inputCommunicationEvidence');
    const creativeEvidence = document.getElementById('inputCreativeEvidence');
    const personalEvidence = document.getElementById('inputPersonalEvidence');
    
    if (commEvidence) parseSkillsEvidence(commEvidence.value, 'communicationSkills');
    if (creativeEvidence) parseSkillsEvidence(creativeEvidence.value, 'creativeSkills');
    if (personalEvidence) parseSkillsEvidence(personalEvidence.value, 'personalSkills');
    
    parseAllEvidence(
      commEvidence ? commEvidence.value : '',
      creativeEvidence ? creativeEvidence.value : '',
      personalEvidence ? personalEvidence.value : ''
    );
    
    // Portfolio highlights
    const highlightsInput = document.getElementById('inputPortfolioHighlights');
    const highlightsPreview = document.getElementById('previewPortfolioHighlights');
    if (highlightsInput && highlightsPreview) {
      const lines = highlightsInput.value.split('\n').filter(l => l.trim());
      highlightsPreview.textContent = lines[0] || '';
    }
    
    // Industry fields
    const industryFields = ['Industry', 'IndustryAppeal', 'FutureOutlook'];
    industryFields.forEach(id => {
      const input = document.getElementById('input' + id);
      const preview = document.getElementById('preview' + id);
      if (input && preview) {
        preview.textContent = input.value;
      }
    });
    
    // Key skills
    const keySkillsInput = document.getElementById('inputKeySkills');
    if (keySkillsInput) parseKeySkills(keySkillsInput.value);
    
    // Career fields with HTML formatting
    const primaryCareerInput = document.getElementById('inputPrimaryCareer');
    const primaryCareerPreview = document.getElementById('previewPrimaryCareer');
    if (primaryCareerInput && primaryCareerPreview) {
      primaryCareerPreview.innerHTML = primaryCareerInput.value.replace(/\n/g, '<br>');
    }
    
    ['Career1', 'Career2'].forEach(id => {
      const input = document.getElementById('input' + id);
      const preview = document.getElementById('preview' + id);
      if (input && preview) {
        preview.textContent = input.value;
      }
    });
    
    // Job opportunities
    const jobOppsInput = document.getElementById('inputJobOpportunities');
    if (jobOppsInput) parseJobOpportunities(jobOppsInput.value);
    
    // Education and course details with HTML formatting
    const educationInput = document.getElementById('inputEducation');
    const educationPreview = document.getElementById('previewEducation');
    if (educationInput && educationPreview) {
      educationPreview.innerHTML = educationInput.value.replace(/\n/g, '<br>');
    }
    
    const courseInput = document.getElementById('inputCourseDetails');
    const coursePreview = document.getElementById('previewCourseDetails');
    if (courseInput && coursePreview) {
      coursePreview.innerHTML = courseInput.value.replace(/\n/g, '<br>');
    }
    
    // Timeline
    const timelineInput = document.getElementById('inputTimeline');
    if (timelineInput) parseTimeline(timelineInput.value);
  }
  
  update(); // Initial render

  // 7) PDF-ready download with improved print styles
  const downloadBtn = document.getElementById('downloadPdfBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      // Get all CSS content
      let cssContent = '';
      try {
        for (let sheet of document.styleSheets) {
          try {
            const rules = Array.from(sheet.cssRules || sheet.rules || []);
            cssContent += rules.map(rule => rule.cssText || '').join('\n');
          } catch (e) {
            console.warn('Could not access stylesheet:', e);
          }
        }
      } catch (e) {
        console.warn('Error accessing stylesheets:', e);
      }

      // Custom color variables if using custom theme
      let customStyles = '';
      if (themeSel && document.body.className === 'theme-custom') {
        const customVars = colorInputs.map(name => {
          const input = document.getElementById(name);
          if (input) {
            const cssVar = name.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `--${cssVar}: ${input.value};`;
          }
          return '';
        }).filter(v => v).join('');
        
        if (customVars) {
          customStyles = `:root { ${customVars} }`;
        }
      }

      // Enhanced print styles
      const printStyles = `
        @media print {
          /* Hide all interactive elements */
          #generator, aside, button, input, select, textarea, 
          [contenteditable], .no-print {
            display: none !important;
          }

          /* Reset page layout */
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: white !important;
            font-size: 12pt !important;
            line-height: 1.4 !important;
          }

          .portfolio {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            background: white !important;
          }

          /* Page breaks */
          .cover-page {
            page-break-after: always !important;
            page-break-inside: avoid !important;
          }

          .section-header {
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }

          .section {
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
            margin-top: 0 !important;
          }

          /* Preserve colors and backgrounds */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          /* Improve text readability */
          h1, h2, h3, h4, h5, h6 {
            color: inherit !important;
            page-break-after: avoid !important;
          }

          p, li, div {
            orphans: 3 !important;
            widows: 3 !important;
          }

          /* Fix image sizing */
          img {
            max-width: 100% !important;
            height: auto !important;
          }

          /* Ensure proper spacing */
          .section {
            padding: 1.5rem !important;
          }

          .cover-page {
            padding: 2rem !important;
          }
        }

        @page {
          margin: 1.5cm;
          size: A4;
        }
      `;

      // Get the current portfolio HTML
      const portfolioElement = document.querySelector('.portfolio');
      const portfolioHTML = portfolioElement ? portfolioElement.outerHTML : '<div>Error: Portfolio not found</div>';

      // Assemble the complete HTML document
      const nameInput = document.getElementById('inputName');
      const portfolioTitle = nameInput ? nameInput.value : 'Portfolio';
      
      const completeHTML = `<!DOCTYPE html>
+ const html = `<!DOCTYPE html>
+ <html lang="en">
+ <head>
+   <meta charset="UTF-8">
+   <meta name="viewport" content="width=device-width,initial-scale=1.0">
+   <title>${document.getElementById('inputName').value}'s Portfolio</title>
+
+   <!-- pull in Tailwind & FontAwesome so the page is styled offline -->
+   <script src="https://cdn.tailwindcss.com"></script>
+   <link
+     rel="stylesheet"
+     href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
+     integrity="sha512-…(your-integrity-hash)…"
+     crossorigin="anonymous"
+     referrerpolicy="no-referrer"
+   />
+
+   <!-- your inline styles + print rules -->
+   <style>${cssContent}\n${customStyles}\n${printStyles}</style>
+ </head>
+ <body class="${document.body.className}">
+   ${document.querySelector('.portfolio').outerHTML}
+   <script>
+     // auto-open print dialog
+     window.onload = () => setTimeout(() => window.print(), 500);
+   </script>
+ </body>
+ </html>`;

      // Create and download the file
      const blob = new Blob([completeHTML], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${portfolioTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Portfolio.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }
});
