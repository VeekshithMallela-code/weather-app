document.getElementById('weatherForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const city = document.getElementById('cityInput').value;
    getWeather(city);
});

async function getWeather(city) {
    const apiKey = '0eea81d2e69e0074896e72ebde3c02ac'; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather ', error.response ? error.response.data : error.message);
        document.getElementById('weatherResult').innerText = `Error fetching weather  ${error.response ? error.response.data.message : error.message}. Please try again.`;
    }
}

function displayWeather(data) {
    const weatherResult = document.getElementById('weatherResult');

    
    weatherResult.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
        <p><strong>Weather:</strong> ${data.weather[0].description}</p>
        <p><strong>Humidity:</strong> ${data.main.humidity} %</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
        <p><strong>Latitude:</strong> ${data.coord.lat}</p>
        <p><strong>Longitude:</strong> ${data.coord.lon}</p>
        <p><strong>Feels like:</strong> ${data.main.feels_like}</p>
        


    `;
}