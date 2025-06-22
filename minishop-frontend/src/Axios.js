import axios from 'axios'

// Create instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5002',
});



axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('minishop_token'); 
        if (token){
            config.headers['Authorization'] = 'Token ' + token
        }
        return config
    }
);

axiosInstance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.response && error.response.status === 401) {
        logOut();
        return Promise.reject(error);
    } else {
        return Promise.reject(error);
    }
});

export default axiosInstance;