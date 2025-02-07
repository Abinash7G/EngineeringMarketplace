import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/", // Backend URL
  //withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to include the token in requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 Unauthorized errors globally
API.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error); // Re-throw other errors
  }
);

// Function to fetch user profile
export const fetchUserProfile = async () => {
  try {
    const response = await API.get("/api/user-profile/");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error; // Re-throw error for calling component to handle
  }
};

export const fetchCartItems = () => API.get("/api/cart/");
export const fetchWishlistItems = () => API.get("/api/wishlist/");
export const addToCart = (productId) => API.post("/api/cart/add/", { product_id: productId });
export const addToWishlist = (productId) => API.post("/api/wishlist/add/", { product_id: productId });
export const removeFromWishlist = (productId) => API.delete(`/api/wishlist/remove/${productId}/`);
export const removeFromCart = (productId) => API.delete(`/api/cart/remove/${productId}/`);


export default API;
