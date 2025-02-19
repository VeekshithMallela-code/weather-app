document.getElementById('weatherForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const city = document.getElementById('cityInput').value;
    weatherApp.getWeather(city);
});

class WeatherApp {
    #apiKey = '0eea81d2e69e0074896e72ebde3c02ac'; // Private variable
    #baseUrl = 'https://api.openweathermap.org/data/2.5/weather'; // Private variable

    async #fetchWeather(city) { // Private function
        const url = `${this.#baseUrl}?q=${city}&units=metric&appid=${this.#apiKey}`;

        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching weather', error.response ? error.response.data : error.message);
            document.getElementById('weatherResult').innerText = 
                `Error fetching weather: ${error.response ? error.response.data.message : error.message}. Please try again.`;
            return null;
        }
    }

    async getWeather(city) { // Public method
        const data = await this.#fetchWeather(city);
        if (data) {
            this.#displayWeather(data);
        }
    }

    #displayWeather(data) { // Private function
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
            <p><strong>Pressure:</strong> ${data.main.pressure}</p>
            <p><strong>Visibility:</strong> ${data.visibility}</p>
            <p><strong>Cloud Cover:</strong> ${data.clouds.all}%</p>
        `;
    }
}

const weatherApp = new WeatherApp(); // Create an instance of the class
