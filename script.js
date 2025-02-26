document.getElementById('weatherForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const city = document.getElementById('cityInput').value;
    weatherApp.get_weather(city);
});

class WeatherApp {
    #apiKey = '0eea81d2e69e0074896e72ebde3c02ac';
    #baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

    async fetch_weather(city) {
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

    async get_weather(city) {
        const data = await this.fetch_weather(city);
        if (data) {
            this.display_weather(data);
            this.change_background(data.weather[0].description); 
        }
    }

    display_weather(data) {
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

    change_background(weather_condition) {
        let imageUrl = '';

        // (converting to lowercase & replacing spaces with dashes)
        const formatted_condition = weather_condition.toLowerCase().replace(/\s/g, '-');

        switch (formatted_condition) {
            case 'clear-sky':
                imageUrl = 'url("https://c1.wallpaperflare.com/preview/380/28/19/sky-blue-white-cloud-sunny-days.jpg")';
                break;
                
            case 'haze':
                imageUrl = 'url("https://media.istockphoto.com/id/1434013788/photo/the-road-was-thick-with-fog-with-trees-on-both-sides-morning-atmosphere-where-the-sun-is.jpg?s=612x612&w=0&k=20&c=CVxcBTyjncJD3u-orPMs0Oc--C9ydBwuO0ZRYPNO9Rs=")';
                break;

            case 'scattered-clouds':
                imageUrl = 'url("https://c0.wallpaperflare.com/preview/532/447/657/scattered-white-clouds.jpg")';
                break;

            case 'overcast-clouds':
                imageUrl = 'url("https://c1.wallpaperflare.com/preview/58/324/2/sky-blue-cloud-cloudy.jpg")';
                break;

            case 'few-clouds':
                imageUrl = 'url("https://media.istockphoto.com/id/1040911866/photo/many-little-fluffy-clouds-in-blue-sky-in-sunny-day.jpg?s=612x612&w=0&k=20&c=6POksbDFbEkPRs1yE7-77VvBrGK3Za8kT37SZdmVKAY=")';
                break;

            case 'broken-clouds':
                imageUrl = 'url("https://c4.wallpaperflare.com/wallpaper/216/813/37/clouds-blue-sky-weather-wallpaper-preview.jpg")';
                break;

            case 'light-rain':
            case 'moderate-rain':
            case 'heavy-rain':
            case 'heavy-intensity-rain':
                imageUrl = 'url("https://c1.wallpaperflare.com/preview/17/491/685/rain-window-drop-glass.jpg")';
                break;

        }

        document.body.style.backgroundImage = imageUrl;
        
    }
}

const weatherApp = new WeatherApp();
