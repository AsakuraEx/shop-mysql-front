import axios from 'axios';

const backendURL = 'http://localhost:3000/api/v1/'

const api = axios.create({
    baseURL: backendURL
});


export default api;