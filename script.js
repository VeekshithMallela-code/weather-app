document.getElementById('weatherForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const locationChoice = document.querySelector('input[name="locationChoice"]:checked').value;
    const locationInput = document.getElementById('locationInput').value.trim();

    if (locationChoice === 'city') {
        weatherApp.getWeather(locationInput);
    } else if (locationChoice === 'country') {
        weatherApp.getCountryWeather(locationInput);
    }
});

class WeatherApp {
    constructor() {
        this.weatherApiKey = '0eea81d2e69e0074896e72ebde3c02ac';
        this.weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
        this.locationApiKey = 'Rm9GSmU3VDNCa05mejB0Qk1lWExIdmlBaE1keFdIMGtJNGRwakdMNA==';
        this.locationApiUrl = 'https://api.countrystatecity.in/v1';
        this.imageApiKey = '7mHQlxJplAzWoKKtrHCBkGybpZB4O3dOf9oiyO4kjMcAfnGAwZJBTrWv';
        this.imageApiUrl = 'https://api.pexels.com/v1/search';
        // this.fallbackImageUrl = 'https://source.unsplash.com/1600x900/?';
    }

    async fetchApi(url, headers = {}) {
        try {
            const response = await fetch(url, { headers });
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API error:', error);
            return null;
        }
    }

    async fetchImage(query) {
        const url = `${this.imageApiUrl}?query=${query}`;
        const data = await this.fetchApi(url, { Authorization: this.imageApiKey });

        if (data && data.photos && data.photos.length > 0) {
            return data.photos[0].src.medium;
        }
        return `${this.fallbackImageUrl}${query}`;
    }

    async getWeather(city) {
        const url = `${this.weatherApiUrl}?q=${city}&units=metric&appid=${this.weatherApiKey}`;
        const data = await this.fetchApi(url);

        if (!data) {
            alert('City not found. Please enter a valid city name.');
            return;
        }

        const imageUrl = await this.fetchImage(`${city} city`);
        this.displayCityWeather(data, imageUrl);
    }

    async getCountries() {
        return await this.fetchApi(`${this.locationApiUrl}/countries`, {
            'X-CSCAPI-KEY': this.locationApiKey
        }) || [];
    }

    async getStates(countryCode) {
        return await this.fetchApi(`${this.locationApiUrl}/countries/${countryCode}/states`, {
            'X-CSCAPI-KEY': this.locationApiKey
        }) || [];
    }

    async getCities(countryCode, stateCode) {
        return await this.fetchApi(`${this.locationApiUrl}/countries/${countryCode}/states/${stateCode}/cities`, {
            'X-CSCAPI-KEY': this.locationApiKey
        }) || [];
    }

    async getCountryCode(countryName) {
        const countries = await this.getCountries();
        const country = countries.find(c =>
            c.name.toUpperCase() === countryName.toUpperCase() ||
            c.iso2.toUpperCase() === countryName.toUpperCase()
        );
        return country ? country.iso2 : null;
    }

    displayCityWeather(data, imageUrl) {
        const newWindow = window.open('', '_blank');

        newWindow.document.write(`
            <html>
            <head>
                <title>Weather in ${data.name}</title>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="style.css">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        background: url('${imageUrl}') no-repeat center center/cover;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                    }
                </style>
            </head>
            <body class="city-weather">
                <div class="card">
                    <h2>${data.name}, ${data.sys.country}</h2>
                    <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
                    <p><strong>Weather:</strong> ${data.weather[0].description}</p>
                    <p><strong>Humidity:</strong> ${data.main.humidity} %</p>
                    <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
                    <p><strong>Latitude:</strong> ${data.coord.lat}</p>
                    <p><strong>Longitude:</strong> ${data.coord.lon}</p>
                    <p><strong>Feels like:</strong> ${data.main.feels_like} °C</p>
                    <p><strong>Pressure:</strong> ${data.main.pressure} hPa</p>
                    <p><strong>Visibility:</strong> ${data.visibility} meters</p>
                    <p><strong>Cloud Cover:</strong> ${data.clouds.all} %</p>
                </div>

                <script>
                document.addEventListener('DOMContentLoaded', function() {
                    const img = new Image();
                    img.onload = function() {
                        document.body.style.backgroundImage = "url('" + img.src + "')";
                    };
                    img.onerror = function() {
                        document.body.style.backgroundImage = "url('${this.fallbackImageUrl}${data.name},city')";
                    };
                    img.src = '${imageUrl}';
                });
                </script>
            </body>
            </html>
        `);
        newWindow.document.close();
    }

    async getCountryWeather(countryName) {
        const countryCode = await this.getCountryCode(countryName);

        if (!countryCode) {
            alert("Invalid country name. Please enter a valid country.");
            return;
        }

        const states = await this.getStates(countryCode);

        if (states.length === 0) {
            alert(`No states found for country: ${countryName}`);
            return;
        }

        const statesToProcess = states.slice(0, Math.min(states.length, 100));
        const totalStates = statesToProcess.length;

        const newWindow = window.open('', '_blank');

        newWindow.document.write(`
            <html class="country-weather-html">
            <head>
                <title>Weather Information for ${countryName}</title>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="style.css">
                <style>
                    html, body {
                        height: 100%;
                        margin: 0;
                        padding: 0;
                        overflow-y: auto;
                    }
                </style>
            </head>
            <body class="country-weather">
                <h1>Weather Information for ${countryName}</h1>
                <div id="stats" class="stats">Showing upto ${totalStates} states (Total states in country: ${states.length})</div>
                <div id="flipInfo">Click on any card to see more details</div>
                <div class="container" id="weatherContainer"></div>
            </body>
            </html>
        `);
        newWindow.document.close();

        const weatherContainer = newWindow.document.getElementById("weatherContainer");
        const self = this;

        async function processStates() {
            const promises = statesToProcess.map(async (state) => {
                try {
                    const cities = await self.getCities(countryCode, state.iso2);

                    if (!cities || cities.length === 0) {
                        return;
                    }

                    const city = cities[0];
                    const url = `${self.weatherApiUrl}?q=${city.name}&units=metric&appid=${self.weatherApiKey}`;
                    const weatherData = await self.fetchApi(url);

                    if (weatherData) {
                        const stateImageUrl = await self.fetchImage(`${state.name} landscape`);

                        const cardElement = newWindow.document.createElement('div');
                        cardElement.className = 'card';
                        cardElement.innerHTML = `
                            <div class="card-inner">
                                <div class="card-front" style="background: url('${stateImageUrl}') no-repeat center center/cover;">
                                    <h2>${state.name} - ${weatherData.sys.country}</h2>
                                    <p><strong>Temperature:</strong> ${weatherData.main.temp} °C</p>
                                    <p><strong>Weather:</strong> ${weatherData.weather[0].description}</p>
                                </div>
                                <div class="card-back" style="background: url('${stateImageUrl}') no-repeat center center/cover;">
                                    <p><strong>Humidity:</strong> ${weatherData.main.humidity} %</p>
                                    <p><strong>Wind Speed:</strong> ${weatherData.wind.speed} m/s</p>
                                    <p><strong>Pressure:</strong> ${weatherData.main.pressure} hPa</p>
                                    <p><strong>Visibility:</strong> ${weatherData.visibility} meters</p>
                                </div>
                            </div>
                        `;

                        cardElement.addEventListener('click', function() {
                            this.classList.toggle('flipped');
                        });

                        weatherContainer.appendChild(cardElement);
                    }
                } catch (error) {
                    console.error(`Error processing state ${state.name}:`, error);
                }
            });

            await Promise.all(promises);

            if (weatherContainer.children.length === 0) {
                weatherContainer.innerHTML = `<h2>No weather data found for any state in ${countryName}</h2>`;
            }
        }

        processStates();
    }
}

const weatherApp = new WeatherApp();