import axios from "axios";
import { fetchImages } from "./functions";
axios.defaults.headers.common["key"] = "39292728-1eb1db6d28a9fb64c22d19118";
axios.defaults.headers.common["image_type"] = "photo";
axios.defaults.headers.common["orientation"] = "horizontal";
axios.defaults.headers.common["safesearch"] = "true";

// const ref = {
// }

fetchImages('cat').then(data => console.log(data)).catch((err) => alert(err))