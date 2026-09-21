import './style.css';

const API_KEY = import.meta.env.VITE_NASA_API_KEY;
const app = document.querySelector('#app');
const datePicker = document.querySelector('#datepicker');

// Set maximum allowed date to today in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];
datePicker.value = today;
datePicker.max = today;

function fetchAPOD(selectedDate = '') {
  app.innerHTML = `<p class="loading">Loading APOD...</p>`;

  const url = selectedDate
    ? `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${selectedDate}`
    : `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      let media;

      if (data.media_type === 'image') {
        media = `<img src="${data.url}" alt="${data.title}" />`;
      } else if (data.url.includes('youtube.com') || data.url.includes('youtu.be')) {
        media = `<iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>`;
      } else {
        media = `<video src="${data.url}" controls></video>`;
      }

      app.innerHTML = `
        <div class="apod-card">
          <h1>${data.title}</h1>
          <p class="date">${data.date}</p>
          <div class="media-wrapper">
            ${media}
          </div>
          <p class="explanation">${data.explanation}</p>
        </div>
      `;
    })
    .catch((err) => {
      console.error('Fetch error:', err);
      app.innerHTML = `
        <div class="error-card">
          <h2>Failed to load NASA APOD</h2>
          <p>Error: ${err.message}</p>
        </div>
      `;
    });
}

// Fetch new APOD when a date is selected from the calendar picker
datePicker.addEventListener('change', (e) => {
  fetchAPOD(e.target.value);
});

// Initial load
fetchAPOD(datePicker.value);