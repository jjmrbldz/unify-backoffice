import axios from 'axios';
import store from '@/store';
// import { this.$GF.customToast } from '@/utils/responseFormatter';

export const API_URL = `${import.meta.env.VITE_API_URL}/`; // Replace with your actual API base URL
export const TOKEN   = 'hr0|5StV10{£&4I>5dEw7]X$]hIq>AKMr0@y)]:£XQaf1cxSUz';

const axiosInstance = axios.create({
  timeout: 15000,
  baseURL: API_URL,
  headers: {
    // 'Content-Type': 'application/json',
    // 'Accept': 'application/json, text/javascript, */*; q=0.01',
    // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8n',
    // 'Authorization': `Bearer ${TOKEN}`,
    // 'Access-Control-Allow-Origin' : '*',
    // Add any other headers as needed
  },
});

// Add an interceptor for handling token or other headers

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add any logic before sending the request
    // For example, you can attach a token to the headers here
    
	return config;
  },
  (error) => {
    this.$GF.customToast(1, `${store.getters.translate(error.message) ? store.getters.translate(error.message) : error.message}`)
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Add any logic for handling the response
    // console.log(response.status)
    if (response.data.ecode && response.data.ecode === 510) {
      store.commit('userStore/logout');
    }
    return response;
  },
  (error) => {
    // Add any logic for handling errors

    if (error.config.url === 'validatetoken') {
      this.$GF.customToast(1, store.getters['languageStore/translate']('Please login again!'))
      store.dispatch('logout');
    } 

    return Promise.reject(error);
  }
);

export const api = {
  // AUTH
  // login           : (data, token)  => axiosInstance.post('login', data, {headers: {Authorization: `Bearer ${token}`}}),
  login           : (data, token) => axiosInstance.post('login', data),
  logout          : (data, token) => axiosInstance.post('logout', data, {headers: {Authorization: `Bearer ${token}`}}),
  register        : (data)        => axiosInstance.post('register', data),
  checkToken      : (data)        => axiosInstance.post('validatetoken', data),
  
  // USER
  agentDetails    : (data)        => axiosInstance.post('agentdetails', data),
  myRevenue       : (data)        => axiosInstance.post('myrevenue', data),
  saveUserDetails : (data)        => axiosInstance.post('updateagent', data),
  
  // AGENTS
  agentList       : (data)        => axiosInstance.post('agentlist', data),
  createAgent     : (data)        => axiosInstance.post('createagent', data),
  
  // USERS
  userList     : (data)        => axiosInstance.post('userlist', data),
  
  
};
