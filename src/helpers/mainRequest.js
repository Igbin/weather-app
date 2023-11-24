export const getApiWeatherData = (lat, lng, lang) => {
  const url = process.env.VUE_APP_BASE_URL;
  const appId = process.env.VUE_APP_OPEN_WEATHER_API_KEY;

  return fetch(`${url}?lat=${lat}&lon=${lng}&exclude=minutely&units=metric&lang=${lang}&appid=${appId}`);
};
