import './style.css';

const API_KEY = import.meta.env.VITE_NASA_API_KEY;
const app = document.querySelector('#app');
const datePicker = document.querySelector('#datepicker');

// Set default date to today in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];
datePicker.value = today;
datePicker.max = today; // Prevent selecting future dates

async function fetchAPOD(selectedDate = '') {
  app.innerHTML = `<h1>Loading Astronomy Picture...</h1>`;

  try {
    const url = selectedDate
      ? `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${selectedDate}`
      : `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    app.innerHTML = `
      <div class="apod-container">
        <h1>${data.title}</h1>
        <p class="date">${data.date}</p>
        ${data.media_type === 'image'
        ? `<img src="${data.url}" alt="${data.title}" />`
        : `<iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>`
      }
        <p class="explanation">${data.explanation}</p>
      </div>
    `;
  } catch (error) {
    console.error('Error fetching NASA APOD:', error);
    app.innerHTML = `<h1>Failed to load NASA APOD</h1><p>${error.message}</p>`;
  }
}

// Event listener for date change
datePicker.addEventListener('change', (e) => {
  fetchAPOD(e.target.value);
});

// Initial load with default date
fetchAPOD(datePicker.value);