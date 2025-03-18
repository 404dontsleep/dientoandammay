import axios from "axios";

const axiosInstance = axios.create({
  baseURL: window.origin + "/api/books",
});

export default axiosInstance;
