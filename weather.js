const apiKey = "YOUR_API_KEY_HERE"; // Replace with your WeatherAPI key

// Elements
const popup = document.getElementById("popup");
const weatherOverlay = document.getElementById("weatherOverlay");
const leavePopup = document.getElementById("leavePopup");
const goodbyeMsg = document.getElementById("goodbyeMsg");

const cityInput = document.getElementById("cityInput");
const cityNameEl = document.getElementById("cityName");
const tempEl = document.getElementById("temp");
const conditionEl = document.getElementById("condition");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const feelslikeEl = document.getElementById("feelslike");

const getWeatherBtn = document.getElementById("getWeatherBtn");
const backBtn = document.getElementById("backBtn");

const leaveBtnDashboard = document.getElementById("leaveBtnDashboard");
const leaveBtnWeather = document.getElementById("leaveBtnWeather");

const confirmLeaveBtn = document.getElementById("confirmLeaveBtn");
const cancelLeaveBtn = document.getElementById("cancelLeaveBtn");

// Event Listeners
getWeatherBtn.addEventListener("click", getWeather);
backBtn.addEventListener("click", backToDashboard);

leaveBtnDashboard.addEventListener("click", () => showLeavePopup());
leaveBtnWeather.addEventListener("click", () => showLeavePopup());

confirmLeaveBtn.addEventListener("click", goodbye);
cancelLeaveBtn.addEventListener("click", hideLeavePopup);

// Functions
function getWeather() {
  const city = cityInput.value.trim();
  if (!city) return alert("Please enter a city!");

  fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=yes`)
    .then((res) => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then((data) => {
      hidePopup(popup);
      showPopup(weatherOverlay);

      cityNameEl.textContent = data.location.name;
      tempEl.textContent = data.current.temp_c;
      conditionEl.textContent = data.current.condition.text;
      humidityEl.textContent = data.current.humidity;
      windEl.textContent = data.current.wind_kph;
      feelslikeEl.textContent = data.current.feelslike_c;

      updateBackground(data.current.condition.text);
    })
    .catch((err) => {
      alert("City not found! Please try again.");
      console.error(err);
    });
}

function backToDashboard() {
  hidePopup(weatherOverlay);
  showPopup(popup);
  cityInput.value = "";
  updateBackground("default");
}

function showLeavePopup() {
  showPopup(leavePopup);
}

function hideLeavePopup() {
  hidePopup(leavePopup);
}

function goodbye() {
  hidePopup(leavePopup);
  hidePopup(weatherOverlay);
  hidePopup(popup);
  showPopup(goodbyeMsg);

  setTimeout(() => {
    window.close();

    // fallback if window.close is blocked
    hidePopup(goodbyeMsg);
    showPopup(popup);
    cityInput.value = "";
    updateBackground("default");
  }, 2500);
}

// Utility functions for animations:
function showPopup(el) {
  el.classList.remove("hidden");
  el.classList.add("active");
}

function hidePopup(el) {
  el.classList.add("hidden");
  el.classList.remove("active");
}

function updateBackground(condition) {
  const body = document.body;
  body.className = "";

  condition = condition.toLowerCase();

  if (condition.includes("sun")) body.classList.add("sunny-bg");
  else if (condition.includes("cloud")) body.classList.add("cloudy-bg");
  else if (condition.includes("rain")) body.classList.add("rainy-bg");
  else if (condition.includes("snow")) body.classList.add("snowy-bg");
  else body.classList.add("default-bg");
}
