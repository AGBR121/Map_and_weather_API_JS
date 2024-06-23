let map;
let autocomplete;
let condicion;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 35.45, lng: 139.625 },
        zoom: 8
    });

    const input = document.getElementById('autocomplete');
    const options = {
        types: ['geocode']
    };

    autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener('place_changed', onPlaceChanged);
}

async function onPlaceChanged() {
    const place = autocomplete.getPlace();
    map.setCenter(place.geometry.location);
    map.setZoom(14);
    const lat = place.geometry.location.lat();
    const long = place.geometry.location.lng();
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
    if(weather.weathercode < 3){
        condicion='☀️'
    }else if (weather.weathercode < 48){
        condicion = '☁️';
    }else{
        condicion = '🌧️';
    }
    weatherDiv.innerHTML = `
        <h3>Clima Actual ${condicion}</h3>
        <p>Temperatura: ${weather.temperature} °C</p>
        <p>Velocidad del viento: ${weather.windspeed} km/h</p>
    `;
}
