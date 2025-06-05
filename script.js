const apiKey = "ec75b559c1cb962d31bf26716fbc880f";
const recentSearches = [];

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Please enter a city name.");

  const isFahrenheit = document.getElementById("unitToggle").checked;
  const units = isFahrenheit ? "imperial" : "metric";
  const tempUnit = isFahrenheit ? "°F" : "°C";
  const speedUnit = isFahrenheit ? "mph" : "m/s";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  // Show loading
  document.getElementById("loading").style.display = "block";
  document.getElementById("weatherResult").innerHTML = "";

  fetch(url)
    .then(res => res.json())
    .then(data => {
      // Hide loading
      document.getElementById("loading").style.display = "none";

      if (parseInt(data.cod) !== 200) {
        document.getElementById("weatherResult").innerText = "City not found!";
        return;
      }

      // Save to recent searches
      addRecentSearch(city);

      const { name, main, weather, wind, sys } = data;
      const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString();
      const sunset = new Date(sys.sunset * 1000).toLocaleTimeString();

      document.getElementById("weatherResult").innerHTML = `
        <h3>${name}</h3>
        <p>Temperature: ${main.temp}${tempUnit}</p>
        <p>Condition: ${weather[0].description}</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} ${speedUnit}</p>
        <p>Sunrise: ${sunrise}</p>
        <p>Sunset: ${sunset}</p>
      `;
    })
    .catch(err => {
      console.error(err);
      document.getElementById("loading").style.display = "none";
      document.getElementById("weatherResult").innerText = "Error fetching data.";
    });
}

function addRecentSearch(city) {
  if (!recentSearches.includes(city)) {
    recentSearches.unshift(city);
    if (recentSearches.length > 5) recentSearches.pop();
    renderRecentSearches();
  }
}

function renderRecentSearches() {
  const ul = document.getElementById("recentSearches");
  ul.innerHTML = "";
  recentSearches.forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    li.onclick = () => {
      document.getElementById("cityInput").value = city;
      getWeather();
    };
    ul.appendChild(li);
  });
}

