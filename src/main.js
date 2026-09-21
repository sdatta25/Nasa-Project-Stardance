import './style.css';

// DOM Elements
const apiKey = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';
const appContainer = document.getElementById('app');
const datePicker = document.getElementById('datepicker');
const randomButton = document.getElementById('random-btn');

// Set max date limit to today
const today = new Date().toISOString().split('T')[0];
datePicker.max = today;
datePicker.value = today;

// Fetch APOD data from NASA API
async function loadApod(dateString) {
  appContainer.innerHTML = `<div class="status-msg">Fetching space image...</div>`;

  try {
    const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${dateString}`);

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const data = await res.json();
    renderContent(data);
  } catch (err) {
    appContainer.innerHTML = `
      <div class="status-msg error">
        <p>Could not load APOD data.</p>
        <small>${err.message}</small>
      </div>
    `;
  }
}

// Display content cleanly inside the container
function renderContent(data) {
  let mediaElement = '';

  if (data.media_type === 'image') {
    mediaElement = `<img src="${data.url}" alt="${data.title}">`;
  } else if (data.media_type === 'video') {
    mediaElement = `<iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>`;
  } else {
    mediaElement = `<p class="unknown-media">Media type not supported for display.</p>`;
  }

  appContainer.innerHTML = `
    <article class="apod-card">
      <h2>${data.title}</h2>
      <span class="date-badge">${data.date}</span>
      <div class="media-container">${mediaElement}</div>
      <p class="description">${data.explanation || ''}</p>
    </article>
  `;
}

// Pick a random date between APOD launch (June 16, 1995) and today
function handleRandomClick() {
  const minTime = new Date('1995-06-16').getTime();
  const maxTime = new Date().getTime();
  const randomTime = minTime + Math.random() * (maxTime - minTime);

  const randomDateStr = new Date(randomTime).toISOString().split('T')[0];
  datePicker.value = randomDateStr;
  loadApod(randomDateStr);
}

// Listen for interactions
datePicker.addEventListener('change', (e) => loadApod(e.target.value));
randomButton.addEventListener('click', handleRandomClick);

// Load today's picture on initial start
loadApod(today);