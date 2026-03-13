import axios from "axios";

export const geoUtils = {
async getPlacemarkCoordinates(placemarkName) {

let coords = null;

const properName = placemarkName.trim().toLowerCase();
const key=process.env.geoapify_key;  

try{
const url = `https://api.geoapify.com/v1/geocode/search?text=${properName}&limit=1&apiKey=${key}&country=ireland`
const result = await axios.get(url);

if(result.status === 200){
    const geoData = result.data;

    if(geoData.features && geoData.features.length > 0){
        const [lon, lat] = geoData.features[0].geometry.coordinates;
        coords = {lat, lon};

       
    }
   
}

   } catch (error) {
     console.error("Authentication error:", error);
     const viewData = {
       error: "Invalid Placemark Entered. Please Try Again",
     };

    }
return coords;


},

async getWeatherFromCoordinates(coords) {

let weather = null;
const key = process.env.open_weather_key;
const {lat} = coords;
const {lon} = coords;

console.log(lat);
console.log(lon);

const url =`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`
const result = await axios.get(url);

if(result.status === 200){
  const currentWeather = result.data;

  weather = {
  temperature: currentWeather.main.temp,
  windSpeed: currentWeather.wind.speed  
  }
}
return weather;


}}