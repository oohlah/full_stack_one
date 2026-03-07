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


return coords;


}
}}