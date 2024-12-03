import axios from 'axios';


const axiosInstance = axios.create({
    baseURL: "https://test-api.nova-techs.com/",
});

export default axiosInstance;
