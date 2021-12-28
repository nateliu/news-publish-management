import axios from "axios";
import { store } from '../redux/store';

// axios.defaults.baseURL="http://localhost:4000"
axios.defaults.baseURL = "https://news-publish-management.herokuapp.com"

// axios.defaults.headers
// axios.interceptors.request.use
// axios.interceptors.response.use

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    // Show Spin
    store.dispatch({
        type: 'change_loading',
        payload: true,
    });
    return config;
}, function (error) {
    // Do something with request error
    // Hide Spin
    store.dispatch({
        type: 'change_loading',
        payload: false,
    });
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // Hide Spin
    store.dispatch({
        type: 'change_loading',
        payload: false,
    });
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // Hide Spin
    store.dispatch({
        type: 'change_loading',
        payload: false,
    });
    return Promise.reject(error);
});