
const fields = [
  'Name', 'Subtitle', 'StudentYear', 'School', 'PortfolioYear', 'Emojis',
  'Profile', 'Strengths', 'AreasToGrow', 'Goals', 'CommunicationEvidence', 
  'CreativeEvidence', 'PersonalEvidence', 'PortfolioHighlights',
  'Industry', 'IndustryAppeal', 'KeySkills', 'FutureOutlook', 
  'PrimaryCareer', 'Career1', 'Career2', 'JobOpportunities',
  'Education', 'CourseDetails', 'Timeline'
];

fields.forEach(id => {
  const input = document.getElementById('input' + id);
  if (input) {
    input.addEventListener('input', update);
  }
});

// theme selector
document.getElementById('themeSelector').addEventListener('change', function() {
  document.body.className = this.value;
  const colorCustomization = document.getElementById('colorCustomization');
  if (this.value === 'theme-custom') {
    colorCustomization.style.display = 'block';
    updateCustomColors();
  } else {
    colorCustomization.style.display = 'none';
  }
});

// color customization
const colorInputs = ['primaryColor', 'secondaryColor', 'accentColor', 'bgColor', 'textColor', 'cardBg', 
                    'profileGradientStart', 'profileGradientEnd', 'highlightGradientStart', 'highlightGradientEnd',
                    'industryGradientStart', 'industryGradientEnd', 'timelineGradientStart', 'timelineGradientEnd', 'sectionHeaderBg'];
colorInputs.forEach(id => {
  document.getElementById(id).addEventListener('input', updateCustomColors);
});

function updateCustomColors() {
  if (document.getElementById('themeSelector').value === 'theme-custom') {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', document.getElementById('primaryColor').value);
    root.style.setProperty('--secondary-color', document.getElementById('secondaryColor').value);
    root.style.setProperty('--accent-color', document.getElementById('accentColor').value);
    root.style.setProperty('--bg-color', document.getElementById('bgColor').value);
    root.style.setProperty('--text-color', document.getElementById('textColor').value);
    root.style.setProperty('--card-bg', document.getElementById('cardBg').value);
    root.style.setProperty('--gradient-start', document.getElementById('primaryColor').value);
    root.style.setProperty('--gradient-mid', document.getElementById('secondaryColor').value);
    root.style.setProperty('--gradient-end', document.getElementById('accentColor').value);
    root.style.setProperty('--input-focus', document.getElementById('primaryColor').value);
    root.style.setProperty('--button-hover', document.getElementById('secondaryColor').value);
    
    // Custom gradient colors
    root.style.setProperty('--profile-gradient-start', document.getElementById('profileGradientStart').value);
    root.style.setProperty('--profile-gradient-end', document.getElementById('profileGradientEnd').value);
    root.style.setProperty('--highlight-gradient-start', document.getElementById('highlightGradientStart').value);
    root.style.setProperty('--highlight-gradient-end', document.getElementById('highlightGradientEnd').value);
    root.style.setProperty('--industry-gradient-start', document.getElementById('industryGradientStart').value);
    root.style.setProperty('--industry-gradient-end', document.getElementById('industryGradientEnd').value);
    root.style.setProperty('--timeline-gradient-start', document.getElementById('timelineGradientStart').value);
    root.style.setProperty('--timeline-gradient-end', document.getElementById('timelineGradientEnd').value);
    root.style.setProperty('--section-header-bg', document.getElementById('sectionHeaderBg').value);
  }
}

document.getElementById('inputCreativityImage').addEventListener('change', function(e) {
  const preview = document.getElementById('previewCreativityImage');
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    preview.src = url;
    preview.style.display = 'block';
  }
});

function createSkillBars(rating) {
  const bars = [];
  for (let i = 1; i <= 5; i++) {
    bars.push(`<span class="skill-bar ${i <= rating ? 'filled' : ''}"></span>`);
  }
  return `<div class="skill-bars">${bars.join('')}</div>`;
}

function parseSkillsEvidence(text, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  
  const lines = text.split('\n').filter(line => line.trim());
  lines.forEach(line => {
    const match = line.match(/^(.+?)\s*\((\d)\/5\):\s*(.+)$/);
    if (match) {
      const [, skill, rating, description] = match;
      const skillItem = document.createElement('div');
      skillItem.className = 'skill-item';
      skillItem.innerHTML = `
        <span>${skill.trim()}</span>
        ${createSkillBars(parseInt(rating))}
      `;
      container.appendChild(skillItem);
    }
  });
}

function parseAllEvidence(communicationText, creativeText, personalText) {
  const evidenceList = document.getElementById('previewAllEvidence');
  evidenceList.innerHTML = '';
  
  const allEvidence = [
    ...communicationText.split('\n').filter(line => line.trim()),
    ...creativeText.split('\n').filter(line => line.trim()),
    ...personalText.split('\n').filter(line => line.trim())
  ];
  
  allEvidence.forEach((line, index) => {
    const match = line.match(/^(.+?)\s*\((\d)\/5\):\s*(.+)$/);
    if (match) {
      const [, skill, rating, description] = match;
      const li = document.createElement('li');
      li.innerHTML = `<strong>${index + 1}. ${skill} (${rating}/5):</strong> ${description}`;
      evidenceList.appendChild(li);
    }
  });
}

function parseKeySkills(text) {
  const container = document.getElementById('previewKeySkills');
  const skills = text.split(',').map(skill => skill.trim()).filter(skill => skill);
  container.innerHTML = skills.map(skill => 
    `<div class="industry-skill">${skill}</div>`
  ).join('');
}

function parseJobOpportunities(text) {
  const container = document.getElementById('previewJobOpportunities');
  const jobs = text.split('\n\n').filter(job => job.trim());
  
  container.innerHTML = jobs.map(job => {
    const lines = job.split('\n');
    const title = lines[0];
    const details = lines.slice(1).join('<br>');
    return `
      <div class="job-opportunity">
        <h5>${title}</h5>
        <div>${details}</div>
      </div>
    `;
  }).join('');
}

function parseTimeline(text) {
  const container = document.getElementById('previewTimeline');
  const steps = text.split('\n').filter(line => line.trim() && line.includes(':'));
  
  container.innerHTML = steps.map(step => {
    const [period, ...details] = step.split(':');
    const [year, phase] = period.trim().split(' - ');
    return `
      <div class="timeline-step">
        <h4>${year}</h4>
        <h5>${phase || ''}</h5>
        <ul>
          ${details.join(':').split(',').map(detail => 
            `<li>${detail.trim()}</li>`
          ).join('')}
        </ul>
      </div>
    `;
  }).join('');
}

function update() {
  // Basic fields
  document.getElementById('previewName').textContent = document.getElementById('inputName').value;
  document.getElementById('previewTitle').textContent = document.getElementById('inputName').value;
  document.getElementById('previewSubtitle').textContent = document.getElementById('inputSubtitle').value;
  document.getElementById('previewStudentYear').textContent = document.getElementById('inputStudentYear').value;
  document.getElementById('previewSchool').textContent = document.getElementById('inputSchool').value;
  document.getElementById('previewPortfolioYear').textContent = document.getElementById('inputPortfolioYear').value;
  document.getElementById('previewProfile').textContent = document.getElementById('inputProfile').value;
  document.getElementById('previewGoals').textContent = document.getElementById('inputGoals').value;

  // Update emojis
  const emojiRow = document.querySelector('.emoji-row');
  const emojis = document.getElementById('inputEmojis').value.split(',').map(e => e.trim()).filter(e => e);
  emojiRow.innerHTML = emojis.map(emoji => `<span>${emoji}</span>`).join('');

  // Strengths and areas to grow
  const strengthsList = document.getElementById('previewStrengths');
  strengthsList.innerHTML = '';
  document.getElementById('inputStrengths').value.split('\n').forEach(s => {
    if (s.trim()) {
      const li = document.createElement('li');
      li.textContent = s;
      strengthsList.appendChild(li);
    }
  });

  const areasToGrowList = document.getElementById('previewAreasToGrow');
  areasToGrowList.innerHTML = '';
  document.getElementById('inputAreasToGrow').value.split('\n').forEach(s => {
    if (s.trim()) {
      const li = document.createElement('li');
      li.textContent = s;
      areasToGrowList.appendChild(li);
    }
  });

  // Skills evidence
  parseSkillsEvidence(document.getElementById('inputCommunicationEvidence').value, 'communicationSkills');
  parseSkillsEvidence(document.getElementById('inputCreativeEvidence').value, 'creativeSkills');
  parseSkillsEvidence(document.getElementById('inputPersonalEvidence').value, 'personalSkills');
  
  // All evidence combined
  parseAllEvidence(
    document.getElementById('inputCommunicationEvidence').value,
    document.getElementById('inputCreativeEvidence').value,
    document.getElementById('inputPersonalEvidence').value
  );

  // Portfolio highlights
  document.getElementById('previewPortfolioHighlights').textContent = document.getElementById('inputPortfolioHighlights').value.split('\n')[0] || '';

  // Industry section
  document.getElementById('previewIndustry').textContent = document.getElementById('inputIndustry').value;
  document.getElementById('previewIndustryAppeal').textContent = document.getElementById('inputIndustryAppeal').value;
  document.getElementById('previewFutureOutlook').textContent = document.getElementById('inputFutureOutlook').value;
  parseKeySkills(document.getElementById('inputKeySkills').value);

  // Career options
  document.getElementById('previewPrimaryCareer').innerHTML = document.getElementById('inputPrimaryCareer').value.replace(/\n/g, '<br>');
  document.getElementById('previewCareer1').textContent = document.getElementById('inputCareer1').value;
  document.getElementById('previewCareer2').textContent = document.getElementById('inputCareer2').value;
  
  // Job opportunities
  parseJobOpportunities(document.getElementById('inputJobOpportunities').value);

  // Education and timeline
  document.getElementById('previewEducation').innerHTML = document.getElementById('inputEducation').value.replace(/\n/g, '<br>');
  document.getElementById('previewCourseDetails').innerHTML = document.getElementById('inputCourseDetails').value.replace(/\n/g, '<br>');
  parseTimeline(document.getElementById('inputTimeline').value);
}

// initial update
update();

// PDF-ready download function
document.getElementById('downloadPdfBtn').addEventListener('click', function() {
  // Get current CSS styles
  const cssContent = Array.from(document.styleSheets)
    .map(sheet => {
      try {
        return Array.from(sheet.cssRules || sheet.rules)
          .map(rule => rule.cssText)
          .join('\n');
      } catch (e) {
        return '';
      }
    })
    .join('\n');

  // Get inline custom CSS variables if custom theme is selected
  let customStyles = '';
  if (document.body.className === 'theme-custom') {
    customStyles = `
      :root {
        --primary-color: ${document.getElementById('primaryColor').value};
        --secondary-color: ${document.getElementById('secondaryColor').value};
        --accent-color: ${document.getElementById('accentColor').value};
        --bg-color: ${document.getElementById('bgColor').value};
        --text-color: ${document.getElementById('textColor').value};
        --card-bg: ${document.getElementById('cardBg').value};
        --profile-gradient-start: ${document.getElementById('profileGradientStart').value};
        --profile-gradient-end: ${document.getElementById('profileGradientEnd').value};
        --highlight-gradient-start: ${document.getElementById('highlightGradientStart').value};
        --highlight-gradient-end: ${document.getElementById('highlightGradientEnd').value};
        --industry-gradient-start: ${document.getElementById('industryGradientStart').value};
        --industry-gradient-end: ${document.getElementById('industryGradientEnd').value};
        --timeline-gradient-start: ${document.getElementById('timelineGradientStart').value};
        --timeline-gradient-end: ${document.getElementById('timelineGradientEnd').value};
        --section-header-bg: ${document.getElementById('sectionHeaderBg').value};
      }
    `;
  }

  // Add print-specific CSS for better PDF conversion
  const printStyles = `
    @media print {
      body { margin: 0; padding: 0; }
      .portfolio { box-shadow: none; max-width: none; }
      .section { page-break-inside: avoid; }
      .cover-page { page-break-after: always; }
      .section-header { page-break-after: avoid; }
    }
    @page {
      margin: 1cm;
      size: A4;
    }
  `;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${document.getElementById('inputName').value}'s Portfolio - PDF Ready</title>
    <style>
${cssContent}
${customStyles}
${printStyles}
    </style>
</head>
<body class="${document.body.className}">
${document.querySelector('.portfolio').outerHTML}
<script>
  // Auto-open print dialog when page loads
  window.onload = function() {
    setTimeout(() => {
      window.print();
    }, 1000);
  };
</script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${document.getElementById('inputName').value}_Portfolio_PDF_Ready.html`;
  link.click();
});
