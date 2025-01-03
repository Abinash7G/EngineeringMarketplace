import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // Replace with your backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
