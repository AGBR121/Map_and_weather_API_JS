let map;
let marker;
let condicion;
let debounceTimer;

const input = document.getElementById('autocomplete');
const suggestionsList = document.getElementById('suggestions');

initMap();

function initMap() {
    map = L.map('map').setView([35.45, 139.625], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const query = input.value.trim();

    if (query.length < 3) {
        suggestionsList.innerHTML = '';
        return;
    }

    debounceTimer = setTimeout(() => fetchSuggestions(query), 400);
});

async function fetchSuggestions(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
    try {
        const response = await fetch(url);
        const results = await response.json();
        renderSuggestions(results);
    } catch (error) {
        console.error('Error al buscar la ubicación:', error);
    }
}

function renderSuggestions(results) {
    suggestionsList.innerHTML = '';
    results.forEach(place => {
        const li = document.createElement('li');
        li.textContent = place.display_name;
        li.addEventListener('click', () => onPlaceSelected(place));
        suggestionsList.appendChild(li);
    });
}

function onPlaceSelected(place) {
    const lat = parseFloat(place.lat);
    const long = parseFloat(place.lon);

    input.value = place.display_name;
    suggestionsList.innerHTML = '';

    map.setView([lat, long], 14);

    if (marker) {
        marker.setLatLng([lat, long]);
    } else {
        marker = L.marker([lat, long]).addTo(map);
    }

    fetchWeather(lat, long);
}

async function fetchWeather(lat, long) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        Weather(data.current_weather);
    } catch (error) {
        console.error('Error al obtener el clima:', error);
    }
}

function Weather(weather) {
    const weatherDiv = document.getElementById('weather');
    if (weather.weathercode < 3) {
        condicion = '☀️';
    } else if (weather.weathercode < 48) {
        condicion = '☁️';
    } else {
        condicion = '🌧️';
    }
    weatherDiv.innerHTML = `
        <h3>Clima Actual ${condicion}</h3>
        <p>Temperatura: ${weather.temperature} °C</p>
        <p>Velocidad del viento: ${weather.windspeed} km/h</p>
    `;
}