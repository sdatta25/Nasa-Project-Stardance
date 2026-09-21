import './style.css';

// Config & Element Selectors
const API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';
const appContainer = document.getElementById('app');
const dateInput = document.getElementById('datepicker');
const randomButton = document.getElementById('random-btn');

// Set max date allowed to today (YYYY-MM-DD)
const todayString = new Date().toISOString().split('T')[0];
dateInput.max = todayString;
dateInput.value = todayString;

// Fetch APOD telemetry using standard async/await
async function loadSpacePicture(targetDate) {
  appContainer.innerHTML = `<p class="loading">> LOADING TELEMETRY...</p>`;

  const endpoint = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${targetDate}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Status: ${response.status}`);
    }

    const apodData = await response.json();
    renderScreen(apodData);
  } catch (error) {
    appContainer.innerHTML = `
      <div class="error-card">
        <p>> TRANSMISSION ERROR</p>
        <p>${error.message}</p>
      </div>
    `;
  }
}

// Build media frame and text layout
function renderScreen(data) {
  let mediaHtml = '';

  if (data.media_type === 'image') {
    mediaHtml = `<img src="${data.url}" alt="${data.title}" />`;
  } else if (data.media_type === 'video') {
    if (data.url.includes('youtube') || data.url.includes('vimeo') || data.url.includes('embed')) {
      mediaHtml = `<iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>`;
    } else {
      mediaHtml = `<video src="${data.url}" controls></video>`;
    }
  } else {
    mediaHtml = `<p>> MEDIA UNREADABLE</p>`;
  }

  appContainer.innerHTML = `
    <div class="apod-card">
      <h1>${data.title}</h1>
      <p class="date">[ DATE: ${data.date} ]</p>
      <div class="media-wrapper">
        ${mediaHtml}
      </div>
      <p class="explanation">${data.explanation || ''}</p>
    </div>
  `;
}

// Feature: Select a random date between June 16, 1995 (APOD Launch) and today
function pickRandomDate() {
  const startDate = new Date('1995-06-16').getTime();
  const endDate = new Date().getTime();
  const randomTime = startDate + Math.random() * (endDate - startDate);

  const randomDateStr = new Date(randomTime).toISOString().split('T')[0];
  dateInput.value = randomDateStr;
  loadSpacePicture(randomDateStr);
}

// Event Listeners
dateInput.addEventListener('change', (e) => loadSpacePicture(e.target.value));
randomButton.addEventListener('click', pickRandomDate);

// Initial Load
loadSpacePicture(todayString);