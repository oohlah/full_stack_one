import axios from "axios";
import { Weather } from "../types/object-types.js";

export const geoUtils = {

async getPlacemarkCoordinates(placemarkName: string): Promise<{ lat: number; lon: number } | null> {

let coords = null;


const properName = placemarkName.trim();
const key=process.env.geoapify_key;  

if (!key) {
    console.error("Missing GEOAPIFY API KEY");
    return null;
  }

try{
// const url = `https://api.geoapify.com/v1/geocode/search?text=${properName}&limit=1&apiKey=${key}&country=ireland`

const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(properName)}&limit=1&apiKey=${key}&country=ireland`

console.log("GEO URL:", url);

const result = await axios.get(url);

console.log("GEO RESPONSE:", result.data);

if(result.status === 200){
    const geoData = result.data;
    
    if(geoData.features && geoData.features.length > 0){
        const [lon, lat] = geoData.features[0].geometry.coordinates;
        console.log("Coordinates found:", lat, lon);
        coords = {lat, lon};
   
    } else {
        console.error("No features returned from Geo API");
      }
    } else {
      console.error("Non-200 response:", result.status);
    }

  } catch (error: any) {
    console.error("GEO API ERROR:", error.response?.data || error.message);
  }

   return coords;
  
  
},

async getWeatherFromCoordinates(coords: { lat: number; lon: number }): Promise<Weather | null> {


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