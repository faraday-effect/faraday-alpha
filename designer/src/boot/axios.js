import axios from "axios";

// Create instance with our base URL.
const axiosInstance = axios.create({
  // baseURL: "http://localhost:3000"
});

// Default export for use within Vue proper.
export default ({ Vue }) => {
  Vue.prototype.$axios = axiosInstance;
};

// Named export for use within arbitrary JS files.
export { axiosInstance };
