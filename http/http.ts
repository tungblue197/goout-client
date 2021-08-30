import axios from 'axios';


const http = axios.create({
    baseURL: '/api',
    timeout: 20000,
    timeoutErrorMessage: 'Timeout'
});


export default http;